#ifndef TCPCONNECTIVITYCHECKER_H
#define TCPCONNECTIVITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QTcpSocket>
#include <QTimer>
#include <QElapsedTimer>

class TcpConnectivityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit TcpConnectivityChecker(QObject *parent = nullptr);
    ~TcpConnectivityChecker() override;

    void checkConnectivity(const QString &host, int port, int timeout = 5000) override;
    void cancel() override;

private slots:
    void onConnected();
    void onError(QAbstractSocket::SocketError error);
    void onTimeout();

private:
    void cleanup();

    QTcpSocket *m_socket;
    QTimer *m_timeoutTimer;
    QElapsedTimer m_elapsedTimer;
    QString m_host;
    int m_port;
};

#endif
