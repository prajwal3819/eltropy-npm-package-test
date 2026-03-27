#ifndef RTPCONNECTIVITYCHECKER_H
#define RTPCONNECTIVITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QUdpSocket>
#include <QTimer>
#include <QElapsedTimer>

class RtpConnectivityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit RtpConnectivityChecker(QObject *parent = nullptr);
    ~RtpConnectivityChecker() override;

    void checkConnectivity(const QString &host, int port, int timeout = 5000) override;
    void cancel() override;

private slots:
    void onReadyRead();
    void onTimeout();
    void sendRtpProbe();

private:
    void cleanup();
    QByteArray createRtpPacket();

    QUdpSocket *m_socket;
    QTimer *m_timeoutTimer;
    QTimer *m_retryTimer;
    QElapsedTimer m_elapsedTimer;
    QString m_host;
    int m_port;
    int m_retryCount;
    quint16 m_sequenceNumber;
    quint32 m_timestamp;
    quint32 m_ssrc;
    static const int MAX_RETRIES = 3;
};

#endif
