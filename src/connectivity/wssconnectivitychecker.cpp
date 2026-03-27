#include "wssconnectivitychecker.h"
#include <QSslConfiguration>

WssConnectivityChecker::WssConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent),
      m_webSocket(nullptr),
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

    m_webSocket = new QWebSocket(QString(), QWebSocketProtocol::VersionLatest);
    m_webSocket->setParent(this);

    m_timeoutTimer = new QTimer(this);
    m_timeoutTimer->setSingleShot(true);

    QSslConfiguration sslConfig = m_webSocket->sslConfiguration();
    sslConfig.setPeerVerifyMode(QSslSocket::VerifyNone);
    m_webSocket->setSslConfiguration(sslConfig);

    connect(m_webSocket, &QWebSocket::connected,
            this, &WssConnectivityChecker::onConnected);

    connect(m_webSocket, &QWebSocket::errorOccurred,
            this, &WssConnectivityChecker::onError);

    connect(m_webSocket, &QWebSocket::sslErrors,
            this, &WssConnectivityChecker::onSslErrors);

    connect(m_timeoutTimer, &QTimer::timeout,
            this, &WssConnectivityChecker::onTimeout);

    emit progressUpdate(QString("Checking WSS connectivity to %1:%2...")
                        .arg(host).arg(port));

    QString url = QString("wss://%1:%2").arg(host).arg(port);

    m_elapsedTimer.start();
    m_webSocket->open(QUrl(url));

    m_timeoutTimer->start(timeout);
}

void WssConnectivityChecker::cancel()
{
    cleanup();
}

void WssConnectivityChecker::onConnected()
{
    if (!m_webSocket || m_completed)
        return;

    m_completed = true;

    qint64 responseTime = m_elapsedTimer.elapsed();

    ConnectivityResult result(
        ConnectivityResult::WSS,
        m_host,
        m_port,
        ConnectivityResult::Success,
        "WebSocket Secure connection established"
    );

    result.setResponseTime(responseTime);

    emit connectivityChecked(result);
    cleanup();
}

// void WssConnectivityChecker::onError(QAbstractSocket::SocketError error)
// {
//     Q_UNUSED(error);

//     if (!m_webSocket || m_completed)
//         return;

//     m_completed = true;

//     QString errorMsg = m_webSocket->errorString();

//     ConnectivityResult result(
//         ConnectivityResult::WSS,
//         m_host,
//         m_port,
//         ConnectivityResult::Failed,
//         errorMsg
//     );

//     emit connectivityChecked(result);

//     QMetaObject::invokeMethod(this, "cleanup", Qt::QueuedConnection);
// }

void WssConnectivityChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    if (m_completed)
        return;

    m_completed = true;

    QWebSocket *socket = m_webSocket;
    QString errorMsg = "WebSocket error";

    if (socket) {
        errorMsg = socket->errorString();
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

    if (!m_webSocket)
        return;

    m_webSocket->ignoreSslErrors();
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

    if (m_webSocket) {
        QWebSocket *socket = m_webSocket;
        m_webSocket = nullptr;
        disconnect(socket, nullptr, this, nullptr);
        socket->close();
        socket->deleteLater();
    }
}