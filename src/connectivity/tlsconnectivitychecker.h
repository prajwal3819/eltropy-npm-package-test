#ifndef TLSCONNECTIVITYCHECKER_H
#define TLSCONNECTIVITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QSslSocket>
#include <QTimer>
#include <QElapsedTimer>

class TlsConnectivityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit TlsConnectivityChecker(QObject *parent = nullptr);
    ~TlsConnectivityChecker() override;

    void checkConnectivity(const QString &host, int port, int timeout = 5000) override;
    void cancel() override;

private slots:
    void onEncrypted();
    void onSslErrors(const QList<QSslError> &errors);
    void onError(QAbstractSocket::SocketError error);
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
