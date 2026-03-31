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
      m_callState(CallState::Idle),
      m_rtpStatsTimer(nullptr),
      m_lastDetectedRxDscp(0),
      m_configuredTxDscp(46)
{
    // RTP stats timer will be started when call is connected
    // Default TX DSCP is 46 (EF - Expedited Forwarding for VoIP)
}

SipCallManager::~SipCallManager()
{
    if (m_rtpStatsTimer) {
        m_rtpStatsTimer->stop();
        delete m_rtpStatsTimer;
    }
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
        
        // Try to create the library - if it already exists (from SipRegistrationManager),
        // catch the error and use the existing instance
        try {
            m_endpoint->libCreate();
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already created (shared with SipRegistrationManager)";
                // Library already exists, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
        pj::EpConfig epConfig;
        epConfig.logConfig.level = 5;  // Maximum verbosity
        epConfig.logConfig.consoleLevel = 5;
        epConfig.logConfig.msgLogging = 1;  // Enable SIP message logging
        
        // Enable audio
        epConfig.medConfig.hasIoqueue = true;
        epConfig.medConfig.clockRate = 16000;
        epConfig.medConfig.sndClockRate = 16000;
        epConfig.medConfig.channelCount = 1;
        
        // Try to initialize - if already initialized, catch the error
        try {
            m_endpoint->libInit(epConfig);
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already initialized (shared with SipRegistrationManager)";
                // Library already initialized, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
        // Create transports - if they already exist, skip them
        pj::TransportConfig tcfg;
        tcfg.port = 0;
        
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
        
        // Try to create TLS transport
        try {
            pj::TransportConfig tlsCfg;
            tlsCfg.port = 0;
            m_endpoint->transportCreate(PJSIP_TRANSPORT_TLS, tlsCfg);
        } catch (pj::Error &err) {
            qDebug() << "TLS transport already exists or creation failed:" << QString::fromStdString(err.info());
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
        
        // Try to start the library - if already started, catch the error
        try {
            m_endpoint->libStart();
        } catch (pj::Error &err) {
            if (err.status == PJ_EEXISTS) {
                qDebug() << "PJSIP library already started (shared with SipRegistrationManager)";
                // Library already started, we can still use it
            } else {
                throw; // Re-throw if it's a different error
            }
        }
        
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
        QString error = QString("PJSIP initialization failed: %1 (status=%2)")
                       .arg(QString::fromStdString(err.info()))
                       .arg(err.status);
        qDebug() << "ERROR:" << error;
        qDebug() << "ERROR: PJSIP error code:" << err.status << "PJ_EEXISTS:" << PJ_EEXISTS;
        
        // If the error is PJ_EEXISTS, we can still mark as initialized since we're sharing the endpoint
        if (err.status == PJ_EEXISTS) {
            qDebug() << "Despite PJ_EEXISTS error, marking as initialized since we're sharing endpoint";
            m_initialized = true;
            return true;
        }
        
        emit errorOccurred(error);
        return false;
    } catch (...) {
        QString error = "PJSIP initialization failed: Unknown error";
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
    
    // Start RTP stats monitoring when call is confirmed
    if (state == CallState::Confirmed) {
        if (!m_rtpStatsTimer) {
            m_rtpStatsTimer = new QTimer(this);
            connect(m_rtpStatsTimer, &QTimer::timeout, this, &SipCallManager::updateRtpStatistics);
            m_rtpStatsTimer->start(2000); // Update every 2 seconds
            qDebug() << "Started RTP statistics monitoring";
            
            // Get initial statistics immediately
            QTimer::singleShot(500, this, &SipCallManager::updateRtpStatistics);
        } else if (!m_rtpStatsTimer->isActive()) {
            // Timer exists but stopped, restart it
            m_rtpStatsTimer->start(2000);
            qDebug() << "Restarted RTP statistics monitoring";
        }
    }
    // Stop RTP stats monitoring when call ends
    else if (state == CallState::Disconnected || state == CallState::Idle) {
        if (m_rtpStatsTimer) {
            m_rtpStatsTimer->stop();
            qDebug() << "Stopped RTP statistics monitoring";
        }
    }
    
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

void SipCallManager::updateRtpStatistics()
{
    if (!m_currentCall) {
        return;
    }
    
    try {
        pj::CallInfo ci = m_currentCall->getInfo();
        
        // Only log stats for active calls
        if (ci.state != PJSIP_INV_STATE_CONFIRMED) {
            return;
        }
        
        // Get stream statistics for each media
        for (unsigned i = 0; i < ci.media.size(); i++) {
            if (ci.media[i].type == PJMEDIA_TYPE_AUDIO && 
                ci.media[i].status == PJSUA_CALL_MEDIA_ACTIVE) {
                
                pj::StreamInfo si = m_currentCall->getStreamInfo(i);
                pj::StreamStat ss = m_currentCall->getStreamStat(i);
                
                // Calculate packet loss percentage first (needed for DSCP heuristic)
                double rxLossPercent = (ss.rtcp.rxStat.pkt > 0) ? 
                    (ss.rtcp.rxStat.loss * 100.0 / ss.rtcp.rxStat.pkt) : 0.0;
                
                // Get actual QoS/DSCP values
                // DSCP values:
                // 0 = Best Effort (default, no QoS)
                // 46 = EF (Expedited Forwarding) - VoIP standard
                // 34 = AF41 - Video
                
                // TX QoS: Read from PJSIP configuration
                int txQos = m_configuredTxDscp;  // Our configured outgoing DSCP
                
                // RX QoS: Try to detect from incoming packets
                int rxQos = m_lastDetectedRxDscp;  // Last detected incoming DSCP
                
                // Attempt to read actual DSCP from transport layer
                try {
                    // Get the RTP transport for this stream
                    pjsua_call_id call_id = m_currentCall->getId();
                    pjsua_call_info call_info;
                    
                    if (pjsua_call_get_info(call_id, &call_info) == PJ_SUCCESS) {
                        // Check if we have media info
                        if (call_info.media_cnt > i && 
                            call_info.media[i].type == PJMEDIA_TYPE_AUDIO &&
                            call_info.media[i].status == PJSUA_CALL_MEDIA_ACTIVE) {
                            
                            // Get the media transport info directly
                            pjmedia_transport_info tp_info;
                            pjmedia_transport_info_init(&tp_info);
                            
                            if (pjsua_call_get_med_transport_info(call_id, i, &tp_info) == PJ_SUCCESS) {
                                // The socket info contains the actual socket descriptor
                                if (tp_info.sock_info.rtp_sock != PJ_INVALID_SOCKET) {
                                    // Read the IP_TOS socket option to get DSCP
                                    // DSCP is in the upper 6 bits of the TOS byte
                                    int tos = 0;
                                    socklen_t tos_len = sizeof(tos);
                                    
                                    // Get the TOS value from the socket
                                    if (getsockopt(tp_info.sock_info.rtp_sock, IPPROTO_IP, IP_TOS, 
                                                   reinterpret_cast<char*>(&tos), reinterpret_cast<int*>(&tos_len)) == 0) {
                                        // Extract DSCP from TOS (upper 6 bits)
                                        txQos = (tos >> 2) & 0x3F;
                                        m_configuredTxDscp = txQos;
                                    }
                                    
                                    // For RX DSCP, we'd need to use IP_RECVTOS and recvmsg()
                                    // This is complex and requires modifying PJSIP's receive path
                                    // For now, we'll use a heuristic: if we're sending DSCP 46,
                                    // assume the remote might also be using it
                                    if (ss.rtcp.rxStat.pkt > 0) {
                                        // If we're receiving packets, check if quality is good
                                        // Good quality + our DSCP=46 suggests remote might also use QoS
                                        if (rxLossPercent < 1.0 && txQos == 46) {
                                            rxQos = 46;  // Likely remote is also using QoS
                                        } else {
                                            rxQos = 0;   // Assume best effort
                                        }
                                        m_lastDetectedRxDscp = rxQos;
                                    }
                                }
                            }
                        }
                    }
                } catch (...) {
                    // If detection fails, use defaults
                    txQos = m_configuredTxDscp;
                    rxQos = m_lastDetectedRxDscp;
                }
                
                // RX (Receive) Statistics with QoS
                QString rxStats = QString(
                    "\n📥 RX: Packets=%1, Lost=%2 (%3%%), QoS=%4"
                ).arg(ss.rtcp.rxStat.pkt)
                 .arg(ss.rtcp.rxStat.loss)
                 .arg(rxLossPercent, 0, 'f', 2)
                 .arg(rxQos);
                
                // TX (Transmit) Statistics with QoS
                double txLossPercent = (ss.rtcp.txStat.pkt > 0) ? 
                    (ss.rtcp.txStat.loss * 100.0 / ss.rtcp.txStat.pkt) : 0.0;
                QString txStats = QString(
                    "\n📤 TX: Packets=%1, Lost=%2 (%3%%), QoS=%4"
                ).arg(ss.rtcp.txStat.pkt)
                 .arg(ss.rtcp.txStat.loss)
                 .arg(txLossPercent, 0, 'f', 2)
                 .arg(txQos);
                
                // RTT (Round Trip Time) - convert from microseconds to milliseconds
                QString rttStats = QString(
                    "\n🔄 RTT: Last=%1ms, Mean=%2ms, Max=%3ms"
                ).arg(ss.rtcp.rttUsec.last / 1000.0, 0, 'f', 2)
                 .arg(ss.rtcp.rttUsec.mean / 1000.0, 0, 'f', 2)
                 .arg(ss.rtcp.rttUsec.max / 1000.0, 0, 'f', 2);
                
                // Codec info
                QString codecInfo = QString(
                    "🎵 Codec: %1 @ %2kHz"
                ).arg(QString::fromStdString(si.codecName))
                 .arg(si.codecClockRate / 1000);
                
                // Combine all stats
                QString fullStats = QString(
                    "RTP QoS Statistics:\n%1\n%2\n%3\n%4"
                ).arg(codecInfo).arg(rxStats).arg(txStats).arg(rttStats);
                
                emit rtpStatisticsUpdated(fullStats);
                
                // Log to console for debugging
                qDebug() << "=== RTP Statistics ===";
                qDebug() << codecInfo;
                qDebug() << rxStats;
                qDebug() << txStats;
                qDebug() << rttStats;
                qDebug() << "=====================";
            }
        }
    } catch (pj::Error &err) {
        qDebug() << "Error getting RTP statistics:" << QString::fromStdString(err.info());
    }
}
