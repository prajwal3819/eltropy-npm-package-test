#ifndef SIPREGISTRATIONMANAGER_H
#define SIPREGISTRATIONMANAGER_H

#include <QObject>
#include <QString>
#include <QTimer>
#include <QMap>

// Forward declarations for PJSIP types
namespace pj {
    class Account;
    class Endpoint;
    class OnRegStateParam;
    class OnRegStartedParam;
}

class SipAccount;
class SipEndpoint;

enum class SipTransportType {
    UDP,
    TCP,
    TLS,
    WSS
};

struct SipCredentials {
    QString username;
    QString password;
    QString domain;
    QString proxy;
    int port;
    SipTransportType transport;
    int registrationTimeout; // seconds
};

class SipRegistrationManager : public QObject
{
    Q_OBJECT
    friend class SipAccount;

public:
    explicit SipRegistrationManager(QObject *parent = nullptr);
    ~SipRegistrationManager() override;

    // Registration control
    void registerAccount(const SipCredentials &credentials);
    void unregisterAccount(const QString &accountKey);
    void unregisterAll();
    bool isRegistered(const QString &accountKey) const;
    int getActiveRegistrationCount() const;
    
    // Status queries
    QString getLastError() const;
    
    // Auto-retry control
    void setAutoRetry(bool enabled, int maxRetries = 5, int intervalMs = 10000);
    bool isAutoRetryEnabled() const;

signals:
    void registrationStarted();
    void registrationSucceeded(const QString &accountKey, const QString &message, int expiresIn);
    void registrationFailed(const QString &error);
    void unregistered();
    void statusChanged(const QString &status);

private slots:
    void checkRegistrationStatus();
    void retryRegistration();

private:
    void initializePjsip();
    void shutdownPjsip();
    QString transportTypeToString(SipTransportType type) const;
    int getDefaultPort(SipTransportType type) const;

    SipEndpoint *m_endpoint;
    QMap<QString, SipAccount*> m_accounts;  // Key: transport:host:port
    QTimer *m_statusTimer;
    QTimer *m_retryTimer;
    
    bool m_initialized;
    bool m_autoRetryEnabled;
    int m_retryCount;
    int m_maxRetries;
    int m_retryIntervalMs;
    QString m_lastError;
    QMap<QString, SipCredentials> m_credentialsMap;  // Store credentials per account
    
    QString getAccountKey(SipTransportType transport, const QString &host, int port) const;
    QString getAccountKeyFromAccount(SipAccount *account) const;
};

#endif // SIPREGISTRATIONMANAGER_H
