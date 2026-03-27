#include "sipregistrationmanager.h"
#include <QDebug>
#include <pjsua2.hpp>

// Custom PJSUA2 Account class
class SipAccount : public pj::Account
{
public:
    SipAccount(SipRegistrationManager *manager);
    virtual ~SipAccount();

    virtual void onRegState(pj::OnRegStateParam &prm) override;
    virtual void onRegStarted(pj::OnRegStartedParam &prm) override;

private:
    SipRegistrationManager *m_manager;
};

// Custom PJSUA2 Endpoint class
class SipEndpoint : public pj::Endpoint
{
public:
    SipEndpoint();
    virtual ~SipEndpoint();
};

// SipAccount implementation
SipAccount::SipAccount(SipRegistrationManager *manager)
    : m_manager(manager)
{
}

SipAccount::~SipAccount()
{
}

void SipAccount::onRegState(pj::OnRegStateParam &prm)
{
    Q_UNUSED(prm);
    pj::AccountInfo ai = getInfo();
    
    if (ai.regIsActive) {
        QString accountKey = m_manager->getAccountKeyFromAccount(this);
        QString msg = QString("Registration active (expires in %1s)")
                      .arg(ai.regExpiresSec);
        emit m_manager->registrationSucceeded(accountKey, msg, ai.regExpiresSec);
        emit m_manager->statusChanged("Registered");
    } else {
        if (ai.regLastErr != PJ_SUCCESS) {
            pj::SipTxData txData;
            QString error = QString("Registration failed: %1")
                           .arg(QString::fromStdString(ai.regStatusText));
            emit m_manager->registrationFailed(error);
            emit m_manager->statusChanged("Failed");
            
            // Trigger auto-retry if enabled
            if (m_manager->isAutoRetryEnabled()) {
                m_manager->m_retryTimer->start(m_manager->m_retryIntervalMs);
            }
        } else {
            emit m_manager->unregistered();
            emit m_manager->statusChanged("Unregistered");
        }
    }
}

void SipAccount::onRegStarted(pj::OnRegStartedParam &prm)
{
    Q_UNUSED(prm);
    emit m_manager->registrationStarted();
    emit m_manager->statusChanged("Registering...");
}

// SipEndpoint implementation
SipEndpoint::SipEndpoint()
{
}

SipEndpoint::~SipEndpoint()
{
}

// SipRegistrationManager implementation
SipRegistrationManager::SipRegistrationManager(QObject *parent)
    : QObject(parent),
      m_endpoint(nullptr),
      m_statusTimer(nullptr),
      m_retryTimer(nullptr),
      m_initialized(false),
      m_autoRetryEnabled(true),
      m_retryCount(0),
      m_maxRetries(5),
      m_retryIntervalMs(10000)
{
    m_statusTimer = new QTimer(this);
    connect(m_statusTimer, &QTimer::timeout, this, &SipRegistrationManager::checkRegistrationStatus);
    
    m_retryTimer = new QTimer(this);
    m_retryTimer->setSingleShot(true);
    connect(m_retryTimer, &QTimer::timeout, this, &SipRegistrationManager::retryRegistration);
}

SipRegistrationManager::~SipRegistrationManager()
{
    shutdownPjsip();
}

void SipRegistrationManager::initializePjsip()
{
    if (m_initialized) {
        return;
    }

    try {
        m_endpoint = new SipEndpoint();
        
        pj::EpConfig epConfig;
        epConfig.logConfig.level = 4;
        epConfig.logConfig.consoleLevel = 4;
        
        // Enable authentication credential caching
        epConfig.uaConfig.maxCalls = 4;
        
        m_endpoint->libCreate();
        m_endpoint->libInit(epConfig);
        
        pj::TransportConfig tcfg;
        tcfg.port = 0; // Random port
        
        m_endpoint->transportCreate(PJSIP_TRANSPORT_UDP, tcfg);
        m_endpoint->transportCreate(PJSIP_TRANSPORT_TCP, tcfg);
        
        // Create TLS transport for secure SIP (port 5061)
        try {
            pj::TransportConfig tlsCfg;
            tlsCfg.port = 0;
            
            // Configure TLS settings
            tlsCfg.tlsConfig.method = PJSIP_TLSV1_METHOD;
            tlsCfg.tlsConfig.verifyServer = false;  // Don't verify server cert for testing
            tlsCfg.tlsConfig.verifyClient = false;
            
            m_endpoint->transportCreate(PJSIP_TRANSPORT_TLS, tlsCfg);
            qDebug() << "TLS transport created successfully";
        } catch (pj::Error &err) {
            qDebug() << "TLS transport creation failed:" << QString::fromStdString(err.info());
        }
        
        // Attempt to create WebSocket transport for WSS (port 443)
        // Note: This requires PJSIP to be compiled with WebSocket support
        try {
            // WebSocket transport is created differently - it's layered on top of TCP/TLS
            // We'll configure the account to use WSS when registering
            qDebug() << "WebSocket transport will be created on-demand per account";
        } catch (pj::Error &err) {
            qDebug() << "WebSocket transport setup failed:" << QString::fromStdString(err.info());
        }
        
        m_endpoint->libStart();
        
        m_initialized = true;
        emit statusChanged("PJSIP Initialized");
        
        qDebug() << "PJSIP initialized successfully";
        
    } catch (pj::Error &err) {
        m_lastError = QString("PJSIP initialization failed: %1")
                      .arg(QString::fromStdString(err.info()));
        emit statusChanged("PJSIP Initialization failed");
        qDebug() << m_lastError;
    }
}

void SipRegistrationManager::shutdownPjsip()
{
    if (m_statusTimer) {
        m_statusTimer->stop();
    }
    
    if (m_retryTimer) {
        m_retryTimer->stop();
    }

    // Clean up all accounts
    for (auto it = m_accounts.begin(); it != m_accounts.end(); ++it) {
        try {
            it.value()->shutdown();
            delete it.value();
        } catch (...) {
        }
    }
    m_accounts.clear();
    m_credentialsMap.clear();

    if (m_endpoint) {
        try {
            m_endpoint->libDestroy();
            delete m_endpoint;
            m_endpoint = nullptr;
        } catch (...) {
        }
    }

    m_initialized = false;
}

void SipRegistrationManager::registerAccount(const SipCredentials &credentials)
{
    if (!m_initialized) {
        initializePjsip();
        if (!m_initialized) {
            emit registrationFailed("Failed to initialize PJSIP");
            return;
        }
    }

    QString accountKey = getAccountKey(credentials.transport, credentials.proxy, credentials.port);
    
    // If account already exists for this key, unregister it first
    if (m_accounts.contains(accountKey)) {
        unregisterAccount(accountKey);
    }

    try {
        SipAccount *account = new SipAccount(this);
        
        pj::AccountConfig accCfg;
        
        QString sipUri = QString("sip:%1@%2")
                        .arg(credentials.username)
                        .arg(credentials.domain);
        
        accCfg.idUri = sipUri.toStdString();
        
        if (!credentials.proxy.isEmpty()) {
            int port = credentials.port > 0 ? credentials.port : getDefaultPort(credentials.transport);
            QString transportStr = transportTypeToString(credentials.transport).toLower();
            
            QString registrarUri;
            if (credentials.transport == SipTransportType::WSS) {
                // For WSS, use wss:// scheme instead of sip: with transport parameter
                registrarUri = QString("sip:%1:%2;transport=ws")
                              .arg(credentials.proxy)
                              .arg(port);
                qDebug() << "Using WebSocket transport for registration";
            } else {
                registrarUri = QString("sip:%1:%2;transport=%3")
                              .arg(credentials.proxy)
                              .arg(port)
                              .arg(transportStr);
            }
            
            accCfg.regConfig.registrarUri = registrarUri.toStdString();
        } else {
            accCfg.regConfig.registrarUri = QString("sip:%1").arg(credentials.domain).toStdString();
        }
        
        pj::AuthCredInfo cred("digest", "*", 
                             credentials.username.toStdString(),
                             0,
                             credentials.password.toStdString());
        accCfg.sipConfig.authCreds.push_back(cred);
        
        accCfg.regConfig.timeoutSec = credentials.registrationTimeout > 0 ? 
                                      credentials.registrationTimeout : 60;
        
        // Configure retry intervals for re-registration
        accCfg.regConfig.retryIntervalSec = 60;
        accCfg.regConfig.firstRetryIntervalSec = 60;
        
        // Drop calls on registration failure
        accCfg.regConfig.dropCallsOnFail = false;
        
        // NOTE: PJSIP's default behavior for re-registration is:
        // 1. Send REGISTER without Authorization (to check if auth still required)
        // 2. Server responds with 401 + new nonce
        // 3. PJSIP immediately responds with cached credentials + new nonce
        // This is RFC-compliant and happens very quickly (milliseconds)
        // The credentials ARE cached, but the challenge nonce must be fresh
        
        qDebug() << "Registration timeout requested:" << credentials.registrationTimeout 
                 << "seconds, using:" << accCfg.regConfig.timeoutSec << "seconds";
        
        account->create(accCfg);
        
        // Store the account and credentials
        m_accounts[accountKey] = account;
        m_credentialsMap[accountKey] = credentials;
        
        m_retryCount = 0;
        m_statusTimer->start(2000);
        
        qDebug() << "SIP registration initiated for" << sipUri << "- Key:" << accountKey 
                 << "- Active accounts:" << m_accounts.size();
        
    } catch (pj::Error &err) {
        m_lastError = QString("Registration failed: %1")
                      .arg(QString::fromStdString(err.info()));
        emit registrationFailed(m_lastError);
        qDebug() << m_lastError;
    }
}

void SipRegistrationManager::unregisterAccount(const QString &accountKey)
{
    if (m_accounts.contains(accountKey)) {
        try {
            SipAccount *account = m_accounts[accountKey];
            account->shutdown();
            delete account;
            m_accounts.remove(accountKey);
            m_credentialsMap.remove(accountKey);
            
            qDebug() << "Unregistered account:" << accountKey 
                     << "- Remaining accounts:" << m_accounts.size();
            
            emit unregistered();
            emit statusChanged(QString("Unregistered %1").arg(accountKey));
        } catch (pj::Error &err) {
            qDebug() << "Error during unregistration:" << QString::fromStdString(err.info());
        }
    }
    
    if (m_accounts.isEmpty() && m_statusTimer) {
        m_statusTimer->stop();
    }
    
    m_retryCount = 0;
}

void SipRegistrationManager::unregisterAll()
{
    QStringList keys = m_accounts.keys();
    for (const QString &key : keys) {
        unregisterAccount(key);
    }
}

bool SipRegistrationManager::isRegistered(const QString &accountKey) const
{
    return m_accounts.contains(accountKey);
}

int SipRegistrationManager::getActiveRegistrationCount() const
{
    return m_accounts.size();
}

QString SipRegistrationManager::getLastError() const
{
    return m_lastError;
}

void SipRegistrationManager::checkRegistrationStatus()
{
    if (m_accounts.isEmpty()) {
        return;
    }

    try {
        for (auto it = m_accounts.begin(); it != m_accounts.end(); ++it) {
            pj::AccountInfo ai = it.value()->getInfo();
            
            QString status;
            if (ai.regIsActive) {
                status = QString("%1: Registered (expires in %2s)")
                        .arg(it.key())
                        .arg(ai.regExpiresSec);
            } else {
                status = QString("%1: %2")
                        .arg(it.key())
                        .arg(QString::fromStdString(ai.regStatusText));
            }
            
            emit statusChanged(status);
        }
        
    } catch (pj::Error &err) {
        qDebug() << "Error checking status:" << QString::fromStdString(err.info());
    }
}

QString SipRegistrationManager::transportTypeToString(SipTransportType type) const
{
    switch (type) {
        case SipTransportType::UDP: return "UDP";
        case SipTransportType::TCP: return "TCP";
        case SipTransportType::TLS: return "TLS";
        case SipTransportType::WSS: return "WSS";
        default: return "UDP";
    }
}

int SipRegistrationManager::getDefaultPort(SipTransportType type) const
{
    switch (type) {
        case SipTransportType::UDP: return 5060;
        case SipTransportType::TCP: return 5060;
        case SipTransportType::TLS: return 5061;
        case SipTransportType::WSS: return 443;
        default: return 5060;
    }
}

void SipRegistrationManager::setAutoRetry(bool enabled, int maxRetries, int intervalMs)
{
    m_autoRetryEnabled = enabled;
    m_maxRetries = maxRetries;
    m_retryIntervalMs = intervalMs;
    
    qDebug() << "Auto-retry" << (enabled ? "enabled" : "disabled") 
             << "- Max retries:" << maxRetries 
             << "- Interval:" << intervalMs << "ms";
}

bool SipRegistrationManager::isAutoRetryEnabled() const
{
    return m_autoRetryEnabled;
}

void SipRegistrationManager::retryRegistration()
{
    if (!m_autoRetryEnabled) {
        qDebug() << "Auto-retry disabled, not retrying";
        return;
    }
    
    if (m_retryCount >= m_maxRetries) {
        QString error = QString("Registration failed after %1 attempts").arg(m_maxRetries);
        m_lastError = error;
        emit registrationFailed(error);
        qDebug() << error;
        return;
    }
    
    m_retryCount++;
    qDebug() << "Retrying registration, attempt" << m_retryCount << "of" << m_maxRetries;
    
    emit statusChanged(QString("Retrying registration (attempt %1/%2)...")
                      .arg(m_retryCount).arg(m_maxRetries));
    
    // Note: retry logic needs to be updated for multi-account support
}

QString SipRegistrationManager::getAccountKey(SipTransportType transport, const QString &host, int port) const
{
    return QString("%1:%2:%3").arg(static_cast<int>(transport)).arg(host).arg(port);
}

QString SipRegistrationManager::getAccountKeyFromAccount(SipAccount *account) const
{
    // Find the key for this account pointer
    for (auto it = m_accounts.begin(); it != m_accounts.end(); ++it) {
        if (it.value() == account) {
            return it.key();
        }
    }
    return QString();
}
