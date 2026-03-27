#include "sipcallmanager.h"
#include <QDebug>
#include <QTimer>

// SipLogWriter implementation
void SipLogWriter::write(const pj::LogEntry &entry)
{
    QString logMsg = QString::fromStdString(entry.msg);
    
    // Filter for SIP messages (TX/RX)
    if (logMsg.contains("TX ") || logMsg.contains("RX ") || 
        logMsg.contains("INVITE") || logMsg.contains("REGISTER") ||
        logMsg.contains("SIP/2.0") || logMsg.contains("Via:") ||
        logMsg.contains("From:") || logMsg.contains("To:") ||
        logMsg.contains("Call-ID:") || logMsg.contains("CSeq:")) {
        
        if (m_manager) {
            SipCallManager *manager = qobject_cast<SipCallManager*>(m_manager);
            if (manager) {
                emit manager->sipPacketLogged(logMsg);
            }
        }
    }
    
    // Also print to console
    qDebug().noquote() << logMsg.trimmed();
}

// SipCall implementation
SipCall::SipCall(pj::Account &acc, int call_id)
    : pj::Call(acc, call_id), m_manager(nullptr)
{
}

SipCall::~SipCall()
{
}

void SipCall::onCallState(pj::OnCallStateParam &prm)
{
    Q_UNUSED(prm);
    pj::CallInfo ci = getInfo();
    
    CallState state = CallState::Idle;
    QString stateStr;
    
    // Log detailed call information
    qDebug() << "========== CALL STATE CHANGE ==========";
    qDebug() << "Call ID:" << ci.id;
    qDebug() << "State:" << ci.state;
    qDebug() << "Last Status:" << ci.lastStatusCode;
    qDebug() << "Last Reason:" << QString::fromStdString(ci.lastReason);
    qDebug() << "Remote URI:" << QString::fromStdString(ci.remoteUri);
    qDebug() << "Remote Contact:" << QString::fromStdString(ci.remoteContact);
    
    if (ci.state == PJSIP_INV_STATE_NULL) {
        state = CallState::Idle;
        stateStr = "Idle";
    } else if (ci.state == PJSIP_INV_STATE_CALLING) {
        state = CallState::Calling;
        stateStr = "Calling...";
        qDebug() << "📤 INVITE sent to" << QString::fromStdString(ci.remoteUri);
    } else if (ci.state == PJSIP_INV_STATE_INCOMING) {
        state = CallState::Incoming;
        stateStr = "Incoming call";
    } else if (ci.state == PJSIP_INV_STATE_EARLY) {
        state = CallState::Early;
        stateStr = QString("Ringing (Status: %1)").arg(ci.lastStatusCode);
        qDebug() << "📥 Received" << ci.lastStatusCode << QString::fromStdString(ci.lastReason);
    } else if (ci.state == PJSIP_INV_STATE_CONNECTING) {
        state = CallState::Connecting;
        stateStr = "Connecting...";
    } else if (ci.state == PJSIP_INV_STATE_CONFIRMED) {
        state = CallState::Confirmed;
        stateStr = QString("Call active (duration: %1s)").arg(ci.connectDuration.sec);
        qDebug() << "✅ Call connected!";
    } else if (ci.state == PJSIP_INV_STATE_DISCONNECTED) {
        state = CallState::Disconnected;
        stateStr = QString("Call ended (Status: %1 - %2)")
                   .arg(ci.lastStatusCode)
                   .arg(QString::fromStdString(ci.lastReason));
        qDebug() << "📴 Call disconnected - Status:" << ci.lastStatusCode << QString::fromStdString(ci.lastReason);
    }
    
    qDebug() << "State String:" << stateStr;
    qDebug() << "=======================================";
    
    if (m_manager) {
        SipCallManager *manager = qobject_cast<SipCallManager*>(m_manager);
        if (manager) {
            manager->onCallStateChanged(state, stateStr);
        }
    }
}

void SipCall::onCallMediaState(pj::OnCallMediaStateParam &prm)
{
    Q_UNUSED(prm);
    
    qDebug() << "🎵 SipCall::onCallMediaState CALLBACK TRIGGERED";
    
    if (m_manager) {
        SipCallManager *manager = qobject_cast<SipCallManager*>(m_manager);
        if (manager) {
            manager->onCallMediaStateChanged();
        }
    } else {
        qDebug() << "❌ No manager set in SipCall!";
    }
}

// SipCallAccount implementation
void SipCallAccount::onRegState(pj::OnRegStateParam &prm)
{
    Q_UNUSED(prm);
    pj::AccountInfo ai = getInfo();
    
    if (m_manager) {
        SipCallManager *manager = qobject_cast<SipCallManager*>(m_manager);
        if (manager) {
            if (ai.regIsActive) {
                QString msg = QString("Registered (expires in %1s)").arg(ai.regExpiresSec);
                qDebug() << "SIP Call Registration active:" << msg;
                emit manager->registrationStatusChanged(true, msg);
            } else {
                if (ai.regLastErr != PJ_SUCCESS) {
                    QString error = QString("Registration failed: %1").arg(QString::fromStdString(ai.regStatusText));
                    qDebug() << "SIP Call Registration failed:" << error;
                    emit manager->registrationStatusChanged(false, error);
                } else {
                    qDebug() << "SIP Call Registration inactive";
                    emit manager->registrationStatusChanged(false, "Not registered");
                }
            }
        }
    }
}

// SipCallManager implementation
SipCallManager::SipCallManager(QObject *parent)
    : QObject(parent),
      m_endpoint(nullptr),
      m_account(nullptr),
      m_currentCall(nullptr),
      m_initialized(false),
      m_isRegistered(false),
      m_isMuted(false),
      m_isOnHold(false),
      m_callState(CallState::Idle)
{
}

SipCallManager::~SipCallManager()
{
    if (m_currentCall) {
        try {
            m_currentCall->hangup(pj::CallOpParam());
        } catch (...) {}
        delete m_currentCall;
    }
    
    if (m_account) {
        delete m_account;
    }
    
    cleanupPjsip();
}

bool SipCallManager::initializePjsip()
{
    if (m_initialized) {
        return true;
    }
    
    try {
        m_endpoint = new pj::Endpoint();
        m_endpoint->libCreate();
        
        pj::EpConfig epConfig;
        epConfig.logConfig.level = 5;  // Maximum verbosity
        epConfig.logConfig.consoleLevel = 5;
        epConfig.logConfig.msgLogging = 1;  // Enable SIP message logging
        
        // Enable audio
        epConfig.medConfig.hasIoqueue = true;
        epConfig.medConfig.clockRate = 16000;
        epConfig.medConfig.sndClockRate = 16000;
        epConfig.medConfig.channelCount = 1;
        
        m_endpoint->libInit(epConfig);
        
        // Create transports
        pj::TransportConfig tcfg;
        tcfg.port = 0;
        
        m_endpoint->transportCreate(PJSIP_TRANSPORT_UDP, tcfg);
        m_endpoint->transportCreate(PJSIP_TRANSPORT_TCP, tcfg);
        
        // Try to create TLS transport
        try {
            pj::TransportConfig tlsCfg;
            tlsCfg.port = 0;
            m_endpoint->transportCreate(PJSIP_TRANSPORT_TLS, tlsCfg);
        } catch (pj::Error &err) {
            qDebug() << "TLS transport creation failed:" << QString::fromStdString(err.info());
        }
        
        // Start audio device
        try {
            m_endpoint->audDevManager().setNullDev();
            pj::AudDevManager &aud_mgr = m_endpoint->audDevManager();
            aud_mgr.refreshDevs();
            
            // Try to set capture and playback devices
            int capture_dev = aud_mgr.getCaptureDev();
            int playback_dev = aud_mgr.getPlaybackDev();
            
            qDebug() << "Audio devices - Capture:" << capture_dev << "Playback:" << playback_dev;
            
        } catch (pj::Error &err) {
            qDebug() << "Audio device setup warning:" << QString::fromStdString(err.info());
        }
        
        m_endpoint->libStart();
        
        qDebug() << "PJSIP initialized successfully";
        
        // Log active audio devices
        try {
            pj::AudDevManager &mgr = m_endpoint->audDevManager();
            
            qDebug() << "========== AUDIO DEVICE ENUMERATION ==========";
            
            // Get device count
            int devCount = mgr.getDevCount();
            qDebug() << "Total audio devices found:" << devCount;
            
            // List all available devices
            for (int i = 0; i < devCount; i++) {
                try {
                    pj::AudioDevInfo info = mgr.getDevInfo(i);
                    qDebug() << "Device" << i << ":"
                             << "Name:" << QString::fromStdString(info.name)
                             << "Input channels:" << info.inputCount
                             << "Output channels:" << info.outputCount
                             << "Default sample rate:" << info.defaultSamplesPerSec;
                } catch (pj::Error &e) {
                    qDebug() << "Device" << i << ": Error getting info -" << QString::fromStdString(e.info());
                }
            }
            
            // Get currently active devices
            int capDev = mgr.getCaptureDev();
            int playDev = mgr.getPlaybackDev();
            
            qDebug() << "-------------------------------------------";
            qDebug() << "Active capture device ID:" << capDev;
            qDebug() << "Active playback device ID:" << playDev;
            qDebug() << "==============================================";
            
            // Emit to UI
            if (capDev < 0 || playDev < 0) {
                QString error = QString("Audio device error - Capture: %1, Playback: %2, Total devices: %3")
                    .arg(capDev).arg(playDev).arg(devCount);
                emit errorOccurred(error);
                
                // Try to set to device 0 if available
                if (devCount > 0) {
                    qDebug() << "Attempting to set audio devices to device 0...";
                    try {
                        mgr.setCaptureDev(0);
                        mgr.setPlaybackDev(0);
                        qDebug() << "Successfully set audio devices to device 0";
                        emit errorOccurred("Audio devices manually set to device 0");
                    } catch (pj::Error &e) {
                        QString setError = QString("Failed to set audio devices: %1").arg(QString::fromStdString(e.info()));
                        qDebug() << setError;
                        emit errorOccurred(setError);
                    }
                }
            } else {
                QString info = QString("Audio OK - Capture: %1, Playback: %2").arg(capDev).arg(playDev);
                qDebug() << info;
            }
        } catch (pj::Error &err) {
            QString error = QString("Error getting audio devices: %1").arg(QString::fromStdString(err.info()));
            qDebug() << error;
            emit errorOccurred(error);
        }
        
        m_initialized = true;
        
    } catch (pj::Error &err) {
        QString error = QString("PJSIP initialization failed: %1").arg(QString::fromStdString(err.info()));
        qDebug() << error;
        emit errorOccurred(error);
        return false;
    }
}

void SipCallManager::cleanupPjsip()
{
    if (m_endpoint) {
        try {
            m_endpoint->libDestroy();
        } catch (...) {}
        delete m_endpoint;
        m_endpoint = nullptr;
    }
    m_initialized = false;
}

QString SipCallManager::getTransportString(SipTransportType transport)
{
    switch (transport) {
        case SipTransportType::UDP: return "udp";
        case SipTransportType::TCP: return "tcp";
        case SipTransportType::TLS: return "tls";
        default: return "udp";
    }
}

bool SipCallManager::registerForCalls(const QString &username, const QString &password,
                                     const QString &domain, const QString &proxy,
                                     SipTransportType transport, int port)
{
    if (!initializePjsip()) {
        return false;
    }
    
    m_username = username;
    m_password = password;
    m_domain = domain;
    m_proxy = proxy;
    m_transport = transport;
    m_port = port;
    
    try {
        if (m_account) {
            delete m_account;
            m_account = nullptr;
        }
        
        m_account = new SipCallAccount();
        m_account->setCallManager(this);
        
        pj::AccountConfig accCfg;
        QString sipUri = QString("sip:%1@%2").arg(username).arg(domain);
        accCfg.idUri = sipUri.toStdString();
        
        QString transportStr = getTransportString(transport);
        QString registrarUri = QString("sip:%1:%2;transport=%3")
                              .arg(proxy)
                              .arg(port)
                              .arg(transportStr);
        
        accCfg.regConfig.registrarUri = registrarUri.toStdString();
        accCfg.regConfig.timeoutSec = 300;
        
        // Add proxy as outbound route for calls
        accCfg.sipConfig.proxies.push_back(registrarUri.toStdString());
        
        pj::AuthCredInfo cred("digest", "*", username.toStdString(), 0, password.toStdString());
        accCfg.sipConfig.authCreds.push_back(cred);
        
        m_account->create(accCfg);
        
        qDebug() << "SIP Call registration initiated:" << sipUri << "via" << registrarUri;
        qDebug() << "Waiting for registration callback...";
        
        return true;
        
    } catch (pj::Error &err) {
        QString error = QString("Registration failed: %1").arg(QString::fromStdString(err.info()));
        qDebug() << error;
        emit registrationStatusChanged(false, error);
        emit errorOccurred(error);
        m_isRegistered = false;
        return false;
    }
}

void SipCallManager::unregister()
{
    qDebug() << "Unregistering from SIP service...";
    
    // Hangup any active call first
    if (m_currentCall) {
        hangupCall();
    }
    
    // Delete the account to unregister
    if (m_account) {
        try {
            m_account->shutdown();
            delete m_account;
            m_account = nullptr;
            
            m_isRegistered = false;
            m_callState = CallState::Idle;
            emit registrationStatusChanged(false, "Unregistered");
            qDebug() << "Unregistered successfully";
        } catch (pj::Error &err) {
            QString error = QString("Unregister failed: %1").arg(QString::fromStdString(err.info()));
            emit errorOccurred(error);
            qDebug() << error;
        }
    }
}

bool SipCallManager::makeCall(const QString &destination)
{
    if (!m_account || !m_account->isValid()) {
        emit errorOccurred("Not registered. Please register first.");
        return false;
    }
    
    if (m_currentCall) {
        emit errorOccurred("Call already in progress");
        return false;
    }
    
    try {
        QString destUri = QString("sip:%1@%2").arg(destination).arg(m_domain);
        
        qDebug() << "========================================";
        qDebug() << "Initiating SIP call...";
        qDebug() << "Destination URI:" << destUri;
        qDebug() << "Proxy:" << m_proxy << "Port:" << m_port << "Transport:" << getTransportString(m_transport);
        qDebug() << "Account valid:" << m_account->isValid();
        qDebug() << "Account ID:" << m_account->getId();
        
        // Get account info to verify routing
        pj::AccountInfo ai = m_account->getInfo();
        qDebug() << "Account URI:" << QString::fromStdString(ai.uri);
        qDebug() << "Registration active:" << ai.regIsActive;
        
        m_currentCall = new SipCall(*m_account);
        m_currentCall->setCallManager(this);
        
        pj::CallOpParam prm(true);
        qDebug() << "Sending INVITE to:" << destUri;
        m_currentCall->makeCall(destUri.toStdString(), prm);
        
        m_callState = CallState::Calling;
        emit callStateChanged(m_callState, "Calling " + destination);
        qDebug() << "SIP INVITE sent successfully";
        qDebug() << "========================================";
        
        return true;
        
    } catch (pj::Error &err) {
        QString error = QString("Failed to make call: %1").arg(QString::fromStdString(err.info()));
        qDebug() << error;
        emit errorOccurred(error);
        
        if (m_currentCall) {
            delete m_currentCall;
            m_currentCall = nullptr;
        }
        
        return false;
    }
}

void SipCallManager::hangupCall()
{
    if (!m_currentCall) {
        return;
    }
    
    try {
        pj::CallOpParam prm;
        m_currentCall->hangup(prm);
        
        delete m_currentCall;
        m_currentCall = nullptr;
        
        m_callState = CallState::Disconnected;
        emit callStateChanged(m_callState, "Call ended");
        
    } catch (pj::Error &err) {
        qDebug() << "Hangup error:" << QString::fromStdString(err.info());
    }
}

void SipCallManager::answerCall()
{
    if (!m_currentCall) {
        return;
    }
    
    try {
        pj::CallOpParam prm;
        prm.statusCode = PJSIP_SC_OK;
        m_currentCall->answer(prm);
        
    } catch (pj::Error &err) {
        QString error = QString("Failed to answer call: %1").arg(QString::fromStdString(err.info()));
        qDebug() << error;
        emit errorOccurred(error);
    }
}

void SipCallManager::toggleMute()
{
    if (!m_currentCall) {
        return;
    }
    
    try {
        pj::CallInfo ci = m_currentCall->getInfo();
        
        for (unsigned i = 0; i < ci.media.size(); i++) {
            if (ci.media[i].type == PJMEDIA_TYPE_AUDIO) {
                pj::AudioMedia *aud_med = static_cast<pj::AudioMedia*>(m_currentCall->getMedia(i));
                if (aud_med) {
                    if (m_isMuted) {
                        // Unmute - connect microphone to call
                        pj::AudDevManager &mgr = m_endpoint->audDevManager();
                        pj::AudioMedia &cap_med = mgr.getCaptureDevMedia();
                        cap_med.startTransmit(*aud_med);
                        m_isMuted = false;
                        qDebug() << "Unmuted";
                    } else {
                        // Mute - disconnect microphone from call
                        pj::AudDevManager &mgr = m_endpoint->audDevManager();
                        pj::AudioMedia &cap_med = mgr.getCaptureDevMedia();
                        cap_med.stopTransmit(*aud_med);
                        m_isMuted = true;
                        qDebug() << "Muted";
                    }
                }
            }
        }
    } catch (pj::Error &err) {
        qDebug() << "Mute toggle error:" << QString::fromStdString(err.info());
    }
}

void SipCallManager::toggleHold()
{
    if (!m_currentCall) {
        return;
    }
    
    try {
        pj::CallOpParam prm;
        
        if (m_isOnHold) {
            m_currentCall->reinvite(prm);
            m_isOnHold = false;
            qDebug() << "Call resumed";
        } else {
            m_currentCall->setHold(prm);
            m_isOnHold = true;
            qDebug() << "Call on hold";
        }
        
    } catch (pj::Error &err) {
        qDebug() << "Hold toggle error:" << QString::fromStdString(err.info());
    }
}

void SipCallManager::onCallStateChanged(CallState state, const QString &info)
{
    m_callState = state;
    emit callStateChanged(state, info);
    
    if (state == CallState::Disconnected) {
        if (m_currentCall) {
            delete m_currentCall;
            m_currentCall = nullptr;
        }
    }
}

void SipCallManager::onCallMediaStateChanged()
{
    qDebug() << "🎵 SipCallManager::onCallMediaStateChanged CALLED";
    
    if (!m_currentCall) {
        qDebug() << "onCallMediaStateChanged: No current call";
        emit errorOccurred("Media state changed but no active call");
        return;
    }
    
    try {
        pj::CallInfo ci = m_currentCall->getInfo();
        
        qDebug() << "========== MEDIA STATE CHANGE ==========";
        qDebug() << "Media count:" << ci.media.size();
        emit callStateChanged(m_callState, QString("Media state change - %1 media streams").arg(ci.media.size()));
        
        for (unsigned i = 0; i < ci.media.size(); i++) {
            qDebug() << "Media" << i << "- Type:" << ci.media[i].type 
                     << "Status:" << ci.media[i].status;
            
            if (ci.media[i].type == PJMEDIA_TYPE_AUDIO) {
                qDebug() << "Audio media found at index" << i;
                
                if (ci.media[i].status == PJSUA_CALL_MEDIA_ACTIVE) {
                    qDebug() << "Audio media is ACTIVE - connecting devices...";
                    
                    pj::AudioMedia *aud_med = static_cast<pj::AudioMedia*>(m_currentCall->getMedia(i));
                    
                    if (aud_med) {
                        try {
                            pj::AudDevManager &mgr = m_endpoint->audDevManager();
                            
                            qDebug() << "Getting audio devices...";
                            int capId = mgr.getCaptureDev();
                            int playId = mgr.getPlaybackDev();
                            qDebug() << "Using capture device:" << capId << "playback device:" << playId;
                            
                            pj::AudioMedia &playback = mgr.getPlaybackDevMedia();
                            pj::AudioMedia &capture = mgr.getCaptureDevMedia();
                            
                            // Connect call audio to speaker
                            qDebug() << "Connecting call audio to speaker...";
                            aud_med->startTransmit(playback);
                            qDebug() << "✅ Speaker connected";
                            emit callStateChanged(CallState::Confirmed, QString("🔊 Speaker connected (device %1)").arg(playId));
                            
                            // Connect microphone to call
                            qDebug() << "Connecting microphone to call...";
                            capture.startTransmit(*aud_med);
                            qDebug() << "✅ Microphone connected";
                            emit callStateChanged(CallState::Confirmed, QString("🎤 Microphone connected (device %1)").arg(capId));
                            
                            qDebug() << "🔊 Audio media connected - bidirectional audio active";
                            emit callStateChanged(CallState::Confirmed, "Call connected - Audio active");
                        } catch (pj::Error &err) {
                            QString error = QString("Audio connection error: %1").arg(QString::fromStdString(err.info()));
                            qDebug() << "❌" << error;
                            emit errorOccurred(error);
                        }
                    } else {
                        qDebug() << "❌ Failed to get AudioMedia object";
                        emit errorOccurred("Failed to get audio media object");
                    }
                } else if (ci.media[i].status == PJSUA_CALL_MEDIA_NONE) {
                    qDebug() << "Audio media status: NONE";
                    emit errorOccurred("Audio media status: NONE - no media negotiated");
                } else if (ci.media[i].status == PJSUA_CALL_MEDIA_LOCAL_HOLD) {
                    qDebug() << "Audio media status: LOCAL_HOLD";
                } else if (ci.media[i].status == PJSUA_CALL_MEDIA_REMOTE_HOLD) {
                    qDebug() << "Audio media status: REMOTE_HOLD";
                } else if (ci.media[i].status == PJSUA_CALL_MEDIA_ERROR) {
                    qDebug() << "❌ Audio media status: ERROR";
                    emit errorOccurred("Audio media ERROR - codec negotiation or device failure");
                }
            }
        }
        qDebug() << "========================================";
    } catch (pj::Error &err) {
        qDebug() << "❌ Media state error:" << QString::fromStdString(err.info());
    }
}
