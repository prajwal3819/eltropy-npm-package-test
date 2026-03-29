#ifndef UDPCONNECTIVITYCHECKER_H
#define UDPCONNECTIVITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QUdpSocket>
#include <QTimer>
#include <QElapsedTimer>
#include <QHostInfo>

class UdpConnectivityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit UdpConnectivityChecker(QObject *parent = nullptr);
    ~UdpConnectivityChecker() override;

    void checkConnectivity(const QString &host, int port, int timeout = 5000) override;
    void cancel() override;

private slots:
    void onReadyRead();
    void onTimeout();
    void onHostLookup(const QHostInfo &hostInfo);
    void sendProbe();

private:
    void cleanup();
    QByteArray createSipOptionsProbe();

    QUdpSocket *m_socket;
    QTimer *m_timeoutTimer;
    QTimer *m_retryTimer;
    QElapsedTimer m_elapsedTimer;
    QString m_host;
    QHostAddress m_resolvedAddress;
    int m_port;
    int m_retryCount;
    bool m_isResolving;
    bool m_completed;
    static const int MAX_RETRIES = 3;
};

#endif
