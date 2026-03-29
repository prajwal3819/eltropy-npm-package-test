#include "wssconnectivitychecker.h"
#include <QSslConfiguration>
#include <QSslCipher>

WssConnectivityChecker::WssConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent),
      m_socket(nullptr),
      m_timeoutTimer(nullptr),
      m_port(0),
      m_completed(false)
{
}

WssConnectivityChecker::~WssConnectivityChecker()
{
    cleanup();
}

void WssConnectivityChecker::checkConnectivity(const QString &host, int port, int timeout)
{
    cleanup();

    m_host = host;
    m_port = port;
    m_completed = false;

    m_socket = new QSslSocket(this);
    m_timeoutTimer = new QTimer(this);
    m_timeoutTimer->setSingleShot(true);

    QSslConfiguration sslConfig = m_socket->sslConfiguration();
    sslConfig.setPeerVerifyMode(QSslSocket::VerifyNone);
    m_socket->setSslConfiguration(sslConfig);

    connect(m_socket, &QSslSocket::encrypted,
            this, &WssConnectivityChecker::onConnected);

    connect(m_socket, &QSslSocket::errorOccurred,
            this, &WssConnectivityChecker::onError);

    connect(m_socket, &QSslSocket::sslErrors,
            this, &WssConnectivityChecker::onSslErrors);

    connect(m_timeoutTimer, &QTimer::timeout,
            this, &WssConnectivityChecker::onTimeout);

    emit progressUpdate(QString("Checking WSS connectivity to %1:%2...")
                        .arg(host).arg(port));

    m_elapsedTimer.start();
    m_socket->connectToHostEncrypted(host, port);

    m_timeoutTimer->start(timeout);
}

void WssConnectivityChecker::cancel()
{
    cleanup();
}

void WssConnectivityChecker::onConnected()
{
    if (!m_socket || m_completed)
        return;

    m_completed = true;

    qint64 responseTime = m_elapsedTimer.elapsed();

    QString cipherInfo = m_socket->sessionCipher().name();
    QString protocolInfo = m_socket->sessionCipher().protocolString();

    ConnectivityResult result(
        ConnectivityResult::WSS,
        m_host,
        m_port,
        ConnectivityResult::Success,
        QString("WSS TLS handshake successful (%1, %2)")
            .arg(protocolInfo)
            .arg(cipherInfo)
    );

    result.setResponseTime(responseTime);

    emit connectivityChecked(result);
    cleanup();
}

void WssConnectivityChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    if (m_completed)
        return;

    m_completed = true;

    QString errorMsg = "WebSocket error";

    if (m_socket) {
        errorMsg = m_socket->errorString();
    }

    ConnectivityResult result(
        ConnectivityResult::WSS,
        m_host,
        m_port,
        ConnectivityResult::Failed,
        errorMsg
    );

    emit connectivityChecked(result);
    cleanup();
}

void WssConnectivityChecker::onSslErrors(const QList<QSslError> &errors)
{
    Q_UNUSED(errors);

    if (!m_socket)
        return;

    m_socket->ignoreSslErrors();
}

void WssConnectivityChecker::onTimeout()
{
    if (m_completed)
        return;

    m_completed = true;

    ConnectivityResult result(
        ConnectivityResult::WSS,
        m_host,
        m_port,
        ConnectivityResult::Timeout,
        "WebSocket connection timed out"
    );

    emit connectivityChecked(result);
    cleanup();
}

void WssConnectivityChecker::cleanup()
{
    if (m_timeoutTimer) {
        m_timeoutTimer->stop();
        QTimer *timer = m_timeoutTimer;
        m_timeoutTimer = nullptr;
        disconnect(timer, nullptr, this, nullptr);
        timer->deleteLater();
    }

    if (m_socket) {
        QSslSocket *socket = m_socket;
        m_socket = nullptr;
        disconnect(socket, nullptr, this, nullptr);
        socket->disconnectFromHost();
        socket->deleteLater();
    }
}