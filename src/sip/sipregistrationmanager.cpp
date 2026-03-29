#include "sipregistrationmanager.h"
#include <QDebug>
#include <QUuid>
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
        
        // Reset retry count on successful registration
        m_manager->m_retryCounts[accountKey] = 0;
        
        emit m_manager->registrationSucceeded(accountKey, msg, ai.regExpiresSec);
        emit m_manager->statusChanged("Registered");
    } else {
        if (ai.regLastErr != PJ_SUCCESS) {
            pj::SipTxData txData;
            QString statusText = QString::fromStdString(ai.regStatusText);
            QString error = statusText.isEmpty() ? 
                           "Registration failed - No response from server" : 
                           QString("Registration failed: %1").arg(statusText);
            
            QString accountKey = m_manager->getAccountKeyFromAccount(this);
            int retryCount = m_manager->m_retryCounts.value(accountKey, 0);
            
            qDebug() << "SIP Registration attempt failed:" << error;
            qDebug() << "Account:" << accountKey << "Current retry count:" << retryCount << "Max retries:" << m_manager->m_maxRetries;
            qDebug() << "Auto-retry enabled:" << m_manager->isAutoRetryEnabled();
            
            // Check if we should retry or mark as failed
            if (m_manager->isAutoRetryEnabled() && retryCount < m_manager->m_maxRetries) {
                // Still have retries left - increment counter and schedule retry
                m_manager->m_retryCounts[accountKey] = retryCount + 1;
                qDebug() << "Scheduling retry" << (retryCount + 1) << "of" << m_manager->m_maxRetries 
                         << "in" << m_manager->m_retryIntervalMs << "ms for" << accountKey;
                
                emit m_manager->statusChanged(QString("🔄 Retrying registration (attempt %1/%2)...")
                                             .arg(retryCount + 1).arg(m_manager->m_maxRetries));
                
                // Create per-account retry timer
                QTimer *retryTimer = m_manager->m_retryTimers.value(accountKey);
                if (!retryTimer) {
                    retryTimer = new QTimer(m_manager);
                    retryTimer->setSingleShot(true);
                    retryTimer->setProperty("accountKey", accountKey);
                    m_manager->m_retryTimers[accountKey] = retryTimer;
                    QObject::connect(retryTimer, &QTimer::timeout, m_manager, &SipRegistrationManager::onRetryTimerTimeout);
                }
                retryTimer->start(m_manager->m_retryIntervalMs);
            } else {
                // All retries exhausted or auto-retry disabled - mark as failed
                QString finalError = retryCount > 0 ?
                                    QString("Registration failed after %1 attempts: %2")
                                        .arg(retryCount + 1).arg(error) :
                                    error;
                
                qDebug() << "========================================";
                qDebug() << "ALL RETRIES EXHAUSTED - MARKING AS FAILED";
                qDebug() << "Account Key:" << accountKey;
                qDebug() << "Final Error:" << finalError;
                qDebug() << "========================================";
                emit m_manager->registrationFailed(accountKey, finalError);
                emit m_manager->statusChanged("Registration Failed");
                m_manager->m_retryCounts[accountKey] = 0; // Reset for next attempt
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
      m_initialized(false),
      m_autoRetryEnabled(true),
      m_maxRetries(5),
      m_retryIntervalMs(3000)  // 3 seconds for faster testing
{
    m_statusTimer = new QTimer(this);
    connect(m_statusTimer, &QTimer::timeout, this, &SipRegistrationManager::checkRegistrationStatus);
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
        
        // Try to create the library - if it already exists (from SipCallManager),
        // catch the error and use the existing instance
        try {
            m_endpoint->libCreate();
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already created (shared with SipCallManager)";
                // Library already exists, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
        // Try to initialize - if already initialized, catch the error
        try {
            m_endpoint->libInit(epConfig);
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already initialized (shared with SipCallManager)";
                // Library already initialized, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
        pj::TransportConfig tcfg;
        tcfg.port = 0; // Random port
        
        try {
            m_endpoint->transportCreate(PJSIP_TRANSPORT_UDP, tcfg);
        } catch (pj::Error &err) {
            qDebug() << "UDP transport already exists or creation failed:" << QString::fromStdString(err.info());
        }
        
        try {
            m_endpoint->transportCreate(PJSIP_TRANSPORT_TCP, tcfg);
        } catch (pj::Error &err) {
            qDebug() << "TCP transport already exists or creation failed:" << QString::fromStdString(err.info());
        }
        
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
        
        // Try to start the library - if already started, catch the error
        try {
            m_endpoint->libStart();
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already started (shared with SipCallManager)";
                // Library already started, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
        m_initialized = true;
        emit statusChanged("PJSIP Initialized");
        
        qDebug() << "PJSIP initialized successfully";
        
    } catch (pj::Error &err) {
        m_lastError = QString("PJSIP initialization failed: %1 (status=%2)")
                      .arg(QString::fromStdString(err.info()))
                      .arg(err.status);
        qDebug() << "ERROR:" << m_lastError;
        qDebug() << "ERROR: PJSIP error code:" << err.status << "PJ_EEXISTS:" << PJ_EEXISTS;
        
        // If the error is PJ_EEXISTS, we can still mark as initialized since we're sharing the endpoint
        if (err.status == PJ_EEXISTS) {
            qDebug() << "Despite PJ_EEXISTS error, marking as initialized since we're sharing endpoint";
            m_initialized = true;
            emit statusChanged("PJSIP Initialized (shared)");
        } else {
            // For non-PJ_EEXISTS errors, this is a real initialization failure
            emit statusChanged("PJSIP Initialization failed");
            qDebug() << "PJSIP initialization failed - cannot proceed";
        }
    } catch (...) {
        m_lastError = "PJSIP initialization failed: Unknown error";
        emit statusChanged("PJSIP Initialization failed");
        qDebug() << m_lastError;
    }
}

void SipRegistrationManager::shutdownPjsip()
{
    if (m_statusTimer) {
        m_statusTimer->stop();
    }
    
    // Stop all per-account retry timers
    for (QTimer *timer : m_retryTimers.values()) {
        if (timer) {
            timer->stop();
        }
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
            QString accountKey = getAccountKey(credentials.transport, credentials.proxy, credentials.port);
            emit registrationFailed(accountKey, "Failed to initialize PJSIP");
            return;
        }
    }

    QString accountKey = getAccountKey(credentials.transport, credentials.proxy, credentials.port);
    
    // If account already exists for this key, just update it instead of unregister/re-register
    if (m_accounts.contains(accountKey)) {
        qDebug() << "Account already exists for" << accountKey << "- skipping duplicate registration";
        emit statusChanged(QString("Already registered: %1").arg(accountKey));
        return;
    }
    
    // Initialize retry count for new registrations
    if (!m_credentialsMap.contains(accountKey)) {
        qDebug() << "Starting new registration for" << accountKey << "- initializing retry count";
        m_retryCounts[accountKey] = 0;
    } else {
        qDebug() << "Continuing retry for" << accountKey << "- current retry count:" << m_retryCounts.value(accountKey, 0);
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
        
        // Note: First REGISTER will still use challenge-response (2 packets)
        // Packet 1: REGISTER (no auth) -> 401 Unauthorized with nonce
        // Packet 2: REGISTER (with auth) -> 200 OK
        // Subsequent re-registrations should reuse cached credentials if server allows
        
        qDebug() << "Registration timeout requested:" << credentials.registrationTimeout 
                 << "seconds, using:" << accCfg.regConfig.timeoutSec << "seconds";
        
        // Emit status with attempt count before creating account
        int currentAttempt = m_retryCounts.value(accountKey, 0) + 1;
        emit statusChanged(QString("[%1] 🔄 Registering (attempt %2/%3)...")
                         .arg(accountKey).arg(currentAttempt).arg(m_maxRetries + 1));
        
        account->create(accCfg);
        
        // Store the account and credentials
        m_accounts[accountKey] = account;
        m_credentialsMap[accountKey] = credentials;
        m_registrationStartTimes[accountKey] = QDateTime::currentDateTime();
        m_timeoutCounts[accountKey] = 0;
        
        // Don't reset retry count here - it should persist across retry attempts
        // Only reset it when registration succeeds or when starting a completely new registration
        m_statusTimer->start(2000);
        
        qDebug() << "SIP registration initiated for" << sipUri << "- Key:" << accountKey 
                 << "- Active accounts:" << m_accounts.size();
        
    } catch (pj::Error &err) {
        QString errorInfo = QString::fromStdString(err.info());
        m_lastError = errorInfo.isEmpty() ? 
                     "Registration failed - Unable to register account" :
                     QString("Registration failed: %1").arg(errorInfo);
        
        qDebug() << "SIP Registration error:" << m_lastError;
        emit registrationFailed(accountKey, m_lastError);
        emit statusChanged("Registration Failed");
    }
}

void SipRegistrationManager::unregisterAccount(const QString &accountKey)
{
    if (m_accounts.contains(accountKey)) {
        try {
            SipAccount *account = m_accounts[accountKey];
            
            qDebug() << "Sending SIP unregister for account:" << accountKey;
            
            // Send REGISTER with Expires: 0 to properly unregister
            // setRegistration(false) tells PJSIP to send unregister packet
            account->setRegistration(false);
            
            // Give PJSIP time to send the unregister packet and get response
            // The onRegState callback will be triggered when unregistration completes
            // Remove from tracking AFTER the unregister packet has been sent
            QTimer::singleShot(2000, this, [this, accountKey, account]() {
                try {
                    // Now shutdown and delete the account
                    account->shutdown();
                    delete account;
                    
                    // Remove from tracking after shutdown
                    m_accounts.remove(accountKey);
                    m_credentialsMap.remove(accountKey);
                    
                    qDebug() << "Account shutdown complete:" << accountKey 
                             << "- Remaining accounts:" << m_accounts.size();
                    
                    if (m_accounts.isEmpty() && m_statusTimer) {
                        m_statusTimer->stop();
                    }
                    
                    emit unregistered();
                } catch (pj::Error &err) {
                    qDebug() << "Error during account shutdown:" << QString::fromStdString(err.info());
                }
            });
            
            emit statusChanged(QString("Unregistering %1...").arg(accountKey));
        } catch (pj::Error &err) {
            qDebug() << "Error during unregistration:" << QString::fromStdString(err.info());
        }
    }
    
    // Clean up per-account tracking
    m_retryCounts.remove(accountKey);
    m_timeoutCounts.remove(accountKey);
    m_registrationStartTimes.remove(accountKey);
    
    // Clean up per-account retry timer
    if (m_retryTimers.contains(accountKey)) {
        QTimer *timer = m_retryTimers.take(accountKey);
        timer->stop();
        timer->deleteLater();
    }
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
            QString accountKey = it.key();
            pj::AccountInfo ai = it.value()->getInfo();
            
            QString status;
            QString statusText = QString::fromStdString(ai.regStatusText);
            
            if (ai.regIsActive) {
                status = QString("%1: Registered (expires in %2s)")
                        .arg(accountKey)
                        .arg(ai.regExpiresSec);
                // Reset timeout count on successful registration
                m_timeoutCounts[accountKey] = 0;
            } else {
                status = QString("%1: %2")
                        .arg(accountKey)
                        .arg(statusText);
                
                // Detect timeout condition - check both status text and elapsed time
                bool isTimeout = statusText.contains("Timeout", Qt::CaseInsensitive) || 
                                statusText.contains("Request Timeout", Qt::CaseInsensitive);
                
                // Also check if registration has been "In Progress" for too long (>10 seconds)
                if (!isTimeout && statusText.contains("In Progress", Qt::CaseInsensitive)) {
                    if (m_registrationStartTimes.contains(accountKey)) {
                        qint64 elapsedMs = m_registrationStartTimes[accountKey].msecsTo(QDateTime::currentDateTime());
                        if (elapsedMs > 3000) { // 10 seconds
                            isTimeout = true;
                            qDebug() << "Timeout detected for" << accountKey << "- elapsed time:" << elapsedMs << "ms (In Progress too long)";
                        }
                    }
                }
                
                if (isTimeout) {
                    m_timeoutCounts[accountKey]++;
                    qDebug() << "Timeout detected for" << accountKey << "- count:" << m_timeoutCounts[accountKey];
                    
                    // If we've seen timeout 3 times (6 seconds), treat it as a failure
                    if (m_timeoutCounts[accountKey] >= 3) {
                        int retryCount = m_retryCounts.value(accountKey, 0);
                        qDebug() << "Maximum timeout count reached for" << accountKey << "- triggering failure (retry count:" << retryCount << ")";
                        
                        // Trigger the same failure logic as onRegState
                        if (m_autoRetryEnabled && retryCount <= m_maxRetries) {
                            m_retryCounts[accountKey] = retryCount + 1;
                            qDebug() << "Scheduling retry due to timeout" << (retryCount + 1) << "of" << m_maxRetries << "for" << accountKey;
                            
                            emit statusChanged(QString("[%1] 🔄 Retrying registration (attempt %2/%3)...")
                                             .arg(accountKey).arg(retryCount + 1).arg(m_maxRetries + 1));
                            
                            m_timeoutCounts[accountKey] = 0; // Reset for retry
                            
                            // Create per-account retry timer
                            QTimer *retryTimer = m_retryTimers.value(accountKey);
                            if (!retryTimer) {
                                retryTimer = new QTimer(this);
                                retryTimer->setSingleShot(true);
                                retryTimer->setProperty("accountKey", accountKey);
                                m_retryTimers[accountKey] = retryTimer;
                                connect(retryTimer, &QTimer::timeout, this, &SipRegistrationManager::onRetryTimerTimeout);
                            }
                            retryTimer->start(m_retryIntervalMs);
                        } else {
                            // All retries exhausted - mark as failed
                            QString finalError = QString("Registration failed after %1 attempts: Request Timeout")
                                                    .arg(m_maxRetries + 1);
                            
                            qDebug() << "========================================";
                            qDebug() << "ALL RETRIES EXHAUSTED DUE TO TIMEOUT";
                            qDebug() << "Account Key:" << accountKey;
                            qDebug() << "Final Error:" << finalError;
                            qDebug() << "========================================";
                            
                            emit registrationFailed(accountKey, finalError);
                            emit statusChanged("Registration Failed");
                            
                            // DO NOT reset retry count - keep it at max to prevent re-triggering
                            // Remove credentials to prevent any further retry attempts
                            m_credentialsMap.remove(accountKey);
                            m_timeoutCounts.remove(accountKey);
                            
                            // Stop the per-account retry timer
                            if (m_retryTimers.contains(accountKey)) {
                                m_retryTimers[accountKey]->stop();
                            }
                            
                            // Clean up the failed account to stop status checking
                            if (m_accounts.contains(accountKey)) {
                                SipAccount *account = m_accounts.take(accountKey);
                                try {
                                    account->shutdown();
                                    delete account;
                                } catch (...) {
                                    qDebug() << "Error cleaning up failed account";
                                }
                            }
                            
                            // Stop status timer if no more accounts to check
                            if (m_accounts.isEmpty() && m_statusTimer) {
                                m_statusTimer->stop();
                                qDebug() << "Stopped status timer - no more accounts to check";
                            }
                        }
                    }
                }
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

void SipRegistrationManager::onRetryTimerTimeout()
{
    QTimer *timer = qobject_cast<QTimer*>(sender());
    if (timer) {
        QString accountKey = timer->property("accountKey").toString();
        if (!accountKey.isEmpty()) {
            retryRegistration(accountKey);
        }
    }
}

void SipRegistrationManager::retryRegistration(const QString &accountKey)
{
    if (!m_autoRetryEnabled) {
        qDebug() << "Auto-retry disabled, not retrying";
        return;
    }
    
    int retryCount = m_retryCounts.value(accountKey, 0);
    
    if (retryCount > m_maxRetries) {
        QString error = QString("Registration failed after %1 attempts").arg(m_maxRetries + 1);
        m_lastError = error;
        
        qDebug() << "========================================";
        qDebug() << "MAX RETRIES REACHED IN retryRegistration";
        qDebug() << "Account Key:" << accountKey;
        qDebug() << "Error:" << error;
        qDebug() << "========================================";
        
        emit registrationFailed(accountKey, error);
        emit statusChanged("Registration Failed");
        
        // DO NOT reset retry count - keep it at max to prevent re-triggering
        // Remove credentials to prevent any further retry attempts
        m_credentialsMap.remove(accountKey);
        m_timeoutCounts.remove(accountKey);
        
        // Stop the per-account retry timer
        if (m_retryTimers.contains(accountKey)) {
            m_retryTimers[accountKey]->stop();
        }
        
        // Clean up the failed account to stop status checking
        if (m_accounts.contains(accountKey)) {
            SipAccount *account = m_accounts.take(accountKey);
            try {
                account->shutdown();
                delete account;
            } catch (...) {
                qDebug() << "Error cleaning up failed account";
            }
        }
        
        // Stop status timer if no more accounts to check
        if (m_accounts.isEmpty() && m_statusTimer) {
            m_statusTimer->stop();
            qDebug() << "Stopped status timer - no more accounts to check";
        }
        return;
    }
    
    qDebug() << "Retrying registration for" << accountKey << ", attempt" << retryCount << "of" << m_maxRetries;
    
    emit statusChanged(QString("[%1] 🔄 Retrying registration (attempt %2/%3)...")
                      .arg(accountKey).arg(retryCount).arg(m_maxRetries + 1));
    
    // Retry the registration using stored credentials
    if (m_credentialsMap.contains(accountKey)) {
        SipCredentials credentials = m_credentialsMap.value(accountKey);
        
        qDebug() << "Retrying registration for account:" << accountKey;
        
        // Remove the failed account before retrying
        if (m_accounts.contains(accountKey)) {
            SipAccount *account = m_accounts.take(accountKey);
            try {
                account->shutdown();
                delete account;
            } catch (...) {
                qDebug() << "Error cleaning up failed account";
            }
        }
        
        // Try to register again
        registerAccount(credentials);
    } else {
        qDebug() << "No credentials stored for retry";
    }
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
