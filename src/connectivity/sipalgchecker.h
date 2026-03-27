#ifndef SIPALGCHECKER_H
#define SIPALGCHECKER_H

#include "iconnectivitychecker.h"
#include <QUdpSocket>
#include <QTimer>
#include <QHostAddress>

class SipAlgChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit SipAlgChecker(QObject *parent = nullptr);
    ~SipAlgChecker() override;

    void checkConnectivity(const QString &host, int port, int timeoutMs) override;
    void cancel() override;

private slots:
    void onReadyRead();
    void onTimeout();
    void onError(QAbstractSocket::SocketError error);

private:
    void sendSipOptions();
    bool detectAlgModification(const QString &response);
    QString generateSipOptions(const QString &host, int port);
    
    QUdpSocket *m_socket;
    QTimer *m_timer;
    QString m_targetHost;
    int m_targetPort;
    int m_localPort;
    QHostAddress m_localAddress;
    QString m_sentMessage;
    int m_retryCount;
    static const int MAX_RETRIES = 3;
};

#endif // SIPALGCHECKER_H
