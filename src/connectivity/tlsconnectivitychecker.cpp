#include "tlsconnectivitychecker.h"
#include <QSslConfiguration>
#include <QSslCipher>

TlsConnectivityChecker::TlsConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent), m_socket(nullptr), m_timeoutTimer(nullptr), m_port(0), m_completed(false)
{
}

TlsConnectivityChecker::~TlsConnectivityChecker()
{
    cleanup();
}

void TlsConnectivityChecker::checkConnectivity(const QString &host, int port, int timeout)
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

    connect(m_socket, &QSslSocket::encrypted, this, &TlsConnectivityChecker::onEncrypted);
    connect(m_socket, &QSslSocket::sslErrors, this, &TlsConnectivityChecker::onSslErrors);
    connect(m_socket, &QSslSocket::errorOccurred, this, &TlsConnectivityChecker::onError);
    connect(m_timeoutTimer, &QTimer::timeout, this, &TlsConnectivityChecker::onTimeout);

    emit progressUpdate(QString("Checking TLS connectivity to %1:%2...").arg(host).arg(port));

    m_elapsedTimer.start();
    m_socket->connectToHostEncrypted(host, port);
    m_timeoutTimer->start(timeout);
}

void TlsConnectivityChecker::cancel()
{
    cleanup();
}

void TlsConnectivityChecker::onEncrypted()
{
    if (!m_socket || m_completed) {
        return;
    }
    
    m_completed = true;
    qint64 responseTime = m_elapsedTimer.elapsed();
    
    QString cipherInfo = m_socket->sessionCipher().name();
    QString protocolInfo = m_socket->sessionCipher().protocolString();
    
    ConnectivityResult result(ConnectivityResult::TLS, m_host, m_port,
                             ConnectivityResult::Success,
                             QString("TLS handshake successful (%1, %2)")
                             .arg(protocolInfo).arg(cipherInfo));
    result.setResponseTime(responseTime);

    emit connectivityChecked(result);
    cleanup();
}

void TlsConnectivityChecker::onSslErrors(const QList<QSslError> &errors)
{
    QString errorMsg = "SSL Errors: ";
    for (const QSslError &error : errors) {
        errorMsg += error.errorString() + "; ";
    }

    m_socket->ignoreSslErrors();
}

void TlsConnectivityChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    if (!m_socket || m_completed) {
        return;
    }
    
    m_completed = true;
    
    QSslSocket *socket = m_socket;
    QString errorMsg = "TLS error";
    
    if (socket) {
        errorMsg = socket->errorString();
    }
    
    ConnectivityResult result(ConnectivityResult::TLS, m_host, m_port,
                             ConnectivityResult::Failed, errorMsg);
    emit connectivityChecked(result);
    cleanup();
}

void TlsConnectivityChecker::onTimeout()
{
    if (m_completed) {
        return;
    }
    
    m_completed = true;
    ConnectivityResult result(ConnectivityResult::TLS, m_host, m_port,
                             ConnectivityResult::Timeout,
                             "TLS handshake timed out");
    emit connectivityChecked(result);
    cleanup();
}

void TlsConnectivityChecker::cleanup()
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
