#include "tcpconnectivitychecker.h"

TcpConnectivityChecker::TcpConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent), m_socket(nullptr), m_timeoutTimer(nullptr), m_port(0)
{
}

TcpConnectivityChecker::~TcpConnectivityChecker()
{
    cleanup();
}

void TcpConnectivityChecker::checkConnectivity(const QString &host, int port, int timeout)
{
    cleanup();

    m_host = host;
    m_port = port;

    m_socket = new QTcpSocket(this);
    m_timeoutTimer = new QTimer(this);
    m_timeoutTimer->setSingleShot(true);

    connect(m_socket, &QTcpSocket::connected, this, &TcpConnectivityChecker::onConnected);
    connect(m_socket, &QTcpSocket::errorOccurred, this, &TcpConnectivityChecker::onError);
    connect(m_timeoutTimer, &QTimer::timeout, this, &TcpConnectivityChecker::onTimeout);

    emit progressUpdate(QString("Checking TCP connectivity to %1:%2...").arg(host).arg(port));

    m_elapsedTimer.start();
    m_socket->connectToHost(host, port);
    m_timeoutTimer->start(timeout);
}

void TcpConnectivityChecker::cancel()
{
    cleanup();
}

void TcpConnectivityChecker::onConnected()
{
    if (!m_socket) {
        return;
    }
    
    qint64 responseTime = m_elapsedTimer.elapsed();
    
    ConnectivityResult result(ConnectivityResult::TCP, m_host, m_port, 
                             ConnectivityResult::Success, 
                             "TCP connection established successfully");
    result.setResponseTime(responseTime);

    emit connectivityChecked(result);
    cleanup();
}

void TcpConnectivityChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    if (!m_socket) {
        return;
    }
    
    QString errorMsg = m_socket->errorString();
    ConnectivityResult result(ConnectivityResult::TCP, m_host, m_port,
                             ConnectivityResult::Failed, errorMsg);
    emit connectivityChecked(result);
    
    cleanup();
}

void TcpConnectivityChecker::onTimeout()
{
    ConnectivityResult result(ConnectivityResult::TCP, m_host, m_port,
                             ConnectivityResult::Timeout, 
                             "Connection attempt timed out");
    emit connectivityChecked(result);
    cleanup();
}

void TcpConnectivityChecker::cleanup()
{
    if (m_timeoutTimer) {
        m_timeoutTimer->stop();
        m_timeoutTimer->blockSignals(true);
        disconnect(m_timeoutTimer, nullptr, this, nullptr);
        delete m_timeoutTimer;
        m_timeoutTimer = nullptr;
    }

    if (m_socket) {
        m_socket->blockSignals(true);
        disconnect(m_socket, nullptr, this, nullptr);
        m_socket->abort();
        delete m_socket;
        m_socket = nullptr;
    }
}
