#ifndef NATTYPECHECKER_H
#define NATTYPECHECKER_H

#include "iconnectivitychecker.h"
#include <QUdpSocket>
#include <QTimer>
#include <QHostAddress>

class NatTypeChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    enum NatType {
        Unknown,
        OpenInternet,           // No NAT
        FullCone,              // Best for VoIP
        RestrictedCone,        // Good for VoIP
        PortRestrictedCone,    // Acceptable for VoIP
        Symmetric,             // Problematic for VoIP
        UdpBlocked,            // Cannot use VoIP
        Error
    };

    explicit NatTypeChecker(QObject *parent = nullptr);
    ~NatTypeChecker();

    void checkConnectivity(const QString &stunServer, int port = 3478, int timeoutMs = 5000) override;
    void cancel() override;

    static QString natTypeToString(NatType type);
    static QString natTypeDescription(NatType type);

signals:
    void progressUpdate(const QString &message);

private slots:
    void onReadyRead();
    void onError(QAbstractSocket::SocketError error);
    void onTimeout();

private:
    void performTest1();
    void performTest2();
    void performTest3();
    void sendBindingRequest(const QHostAddress &address, quint16 port);
    bool parseStunResponse(const QByteArray &data, QHostAddress &mappedAddress, quint16 &mappedPort);
    QByteArray createStunBindingRequest();

    QUdpSocket *m_socket;
    QTimer *m_timer;
    QString m_stunServer;
    quint16 m_stunPort;
    QHostAddress m_primaryStunAddress;
    QHostAddress m_secondaryStunAddress;
    
    QHostAddress m_localAddress;
    quint16 m_localPort;
    QHostAddress m_mappedAddress1;
    quint16 m_mappedPort1;
    QHostAddress m_mappedAddress2;
    quint16 m_mappedPort2;
    
    int m_currentTest;
    bool m_test1Response;
    bool m_test2Response;
    bool m_test3Response;
    
    QByteArray m_transactionId;
};

#endif // NATTYPECHECKER_H
