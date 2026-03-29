#ifndef WSSCONNECTIVITYCHECKER_H
#define WSSCONNECTIVITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QSslSocket>
#include <QTimer>
#include <QElapsedTimer>

class WssConnectivityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit WssConnectivityChecker(QObject *parent = nullptr);
    ~WssConnectivityChecker() override;

    void checkConnectivity(const QString &host, int port, int timeout = 5000) override;
    void cancel() override;

private slots:
    void onConnected();
    void onError(QAbstractSocket::SocketError error);
    void onSslErrors(const QList<QSslError> &errors);
    void onTimeout();

private:
    void cleanup();

    QSslSocket *m_socket;
    QTimer *m_timeoutTimer;
    QElapsedTimer m_elapsedTimer;

    QString m_host;
    int m_port;
    bool m_completed;
};

#endif