#ifndef SIPCALLMANAGER_H
#define SIPCALLMANAGER_H

#include <QObject>
#include <QString>
#include <pjsua2.hpp>
#include "sipregistrationmanager.h"

class SipLogWriter : public pj::LogWriter
{
public:
    SipLogWriter(QObject *manager) : m_manager(manager) {}
    virtual void write(const pj::LogEntry &entry) override;
    
private:
    QObject *m_manager;
};

enum class CallState {
    Idle,
    Calling,
    Incoming,
    Early,
    Connecting,
    Confirmed,
    Disconnected
};

class SipCall : public pj::Call
{
public:
    SipCall(pj::Account &acc, int call_id = PJSUA_INVALID_ID);
    virtual ~SipCall();
    
    virtual void onCallState(pj::OnCallStateParam &prm) override;
    virtual void onCallMediaState(pj::OnCallMediaStateParam &prm) override;
    
    void setCallManager(QObject *manager) { m_manager = manager; }
    
private:
    QObject *m_manager;
};

class SipCallAccount : public pj::Account
{
public:
    SipCallAccount() : m_manager(nullptr) {}
    void setCallManager(QObject *manager) { m_manager = manager; }
    
    virtual void onRegState(pj::OnRegStateParam &prm) override;
    
private:
    QObject *m_manager;
};

class SipCallManager : public QObject
{
    Q_OBJECT
    
public:
    explicit SipCallManager(QObject *parent = nullptr);
    ~SipCallManager();
    
    bool registerForCalls(const QString &username, const QString &password,
                         const QString &domain, const QString &proxy,
                         SipTransportType transport, int port);
    void unregister();
    
    bool makeCall(const QString &destination);
    void hangupCall();
    void answerCall();
    void toggleMute();
    void toggleHold();
    
    bool isRegistered() const { return m_isRegistered; }
    bool isInCall() const { return m_currentCall != nullptr; }
    CallState getCallState() const { return m_callState; }
    
signals:
    void registrationStatusChanged(bool registered, const QString &message);
    void callStateChanged(CallState state, const QString &info);
    void callDurationUpdated(int seconds);
    void audioLevelChanged(int txLevel, int rxLevel);
    void errorOccurred(const QString &error);
    void sipPacketLogged(const QString &packet);
    
public slots:
    void onCallStateChanged(CallState state, const QString &info);
    void onCallMediaStateChanged();
    
private:
    bool initializePjsip();
    void cleanupPjsip();
    QString getTransportString(SipTransportType transport);
    
    pj::Endpoint *m_endpoint;
    SipCallAccount *m_account;
    SipCall *m_currentCall;
    
    bool m_initialized;
    bool m_isRegistered;
    bool m_isMuted;
    bool m_isOnHold;
    CallState m_callState;
    
    QString m_username;
    QString m_password;
    QString m_domain;
    QString m_proxy;
    SipTransportType m_transport;
    int m_port;
};

#endif // SIPCALLMANAGER_H
