#include "udpconnectivitychecker.h"
#include <QHostAddress>
#include <QNetworkDatagram>

UdpConnectivityChecker::UdpConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent), m_socket(nullptr), m_timeoutTimer(nullptr),
      m_retryTimer(nullptr), m_port(0), m_retryCount(0)
{
}

UdpConnectivityChecker::~UdpConnectivityChecker()
{
    cleanup();
}

void UdpConnectivityChecker::checkConnectivity(const QString &host, int port, int timeout)
{
    cleanup();

    m_host = host;
    m_port = port;
    m_retryCount = 0;

    m_socket = new QUdpSocket(this);
    m_timeoutTimer = new QTimer(this);
    m_retryTimer = new QTimer(this);
    
    m_timeoutTimer->setSingleShot(true);
    m_retryTimer->setSingleShot(false);

    if (!m_socket->bind()) {
        ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                 ConnectivityResult::Failed, 
                                 "Failed to bind UDP socket");
        emit connectivityChecked(result);
        cleanup();
        return;
    }

    connect(m_socket, &QUdpSocket::readyRead, this, &UdpConnectivityChecker::onReadyRead);
    connect(m_timeoutTimer, &QTimer::timeout, this, &UdpConnectivityChecker::onTimeout);
    connect(m_retryTimer, &QTimer::timeout, this, &UdpConnectivityChecker::sendProbe);

    emit progressUpdate(QString("Checking UDP connectivity to %1:%2...").arg(host).arg(port));

    m_elapsedTimer.start();
    sendProbe();
    
    if (m_retryTimer) {
        m_retryTimer->start(1000);
    }
    if (m_timeoutTimer) {
        m_timeoutTimer->start(timeout);
    }
}

void UdpConnectivityChecker::cancel()
{
    cleanup();
}

void UdpConnectivityChecker::sendProbe()
{
    if (!m_socket || !m_retryTimer) {
        return;
    }
    
    if (m_retryCount >= MAX_RETRIES) {
        m_retryTimer->stop();
        return;
    }

    QByteArray probe = createSipOptionsProbe();
    QHostAddress hostAddr(m_host);
    
    // Try to resolve hostname if it's not an IP address
    if (hostAddr.isNull()) {
        emit progressUpdate(QString("Resolving hostname %1...").arg(m_host));
    }
    
    qint64 sent = m_socket->writeDatagram(probe, QHostAddress(m_host), m_port);
    
    if (sent == -1) {
        QString errorMsg = QString("Failed to send UDP packet: %1").arg(m_socket->errorString());
        ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                 ConnectivityResult::Failed, errorMsg);
        emit connectivityChecked(result);
        cleanup();
        return;
    }

    m_retryCount++;
    emit progressUpdate(QString("Sent UDP probe %1/%2 to %3:%4 (%5 bytes)")
                       .arg(m_retryCount).arg(MAX_RETRIES).arg(m_host).arg(m_port).arg(sent));
}

void UdpConnectivityChecker::onReadyRead()
{
    if (!m_socket) {
        return;
    }
    
    while (m_socket->hasPendingDatagrams()) {
        QNetworkDatagram datagram = m_socket->receiveDatagram();
        
        if (datagram.senderAddress().toString() == m_host || 
            datagram.senderAddress().toString() == QHostAddress(m_host).toString()) {
            
            qint64 responseTime = m_elapsedTimer.elapsed();
            
            ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                     ConnectivityResult::Success,
                                     QString("UDP response received (%1 bytes)")
                                     .arg(datagram.data().size()));
            result.setResponseTime(responseTime);
            
            emit connectivityChecked(result);
            cleanup();
            return;
        }
    }
}

void UdpConnectivityChecker::onTimeout()
{
    ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                             ConnectivityResult::Timeout,
                             QString("No UDP response received after %1 attempts")
                             .arg(m_retryCount));
    emit connectivityChecked(result);
    cleanup();
}

void UdpConnectivityChecker::cleanup()
{
    if (m_retryTimer) {
        m_retryTimer->stop();
        m_retryTimer->blockSignals(true);
        m_retryTimer->disconnect();
        delete m_retryTimer;
        m_retryTimer = nullptr;
    }

    if (m_timeoutTimer) {
        m_timeoutTimer->stop();
        m_timeoutTimer->blockSignals(true);
        m_timeoutTimer->disconnect();
        delete m_timeoutTimer;
        m_timeoutTimer = nullptr;
    }

    if (m_socket) {
        m_socket->blockSignals(true);
        m_socket->close();
        m_socket->disconnect();
        delete m_socket;
        m_socket = nullptr;
    }
}

QByteArray UdpConnectivityChecker::createSipOptionsProbe()
{
    QString probe = QString(
        "OPTIONS sip:%1:%2 SIP/2.0\r\n"
        "Via: SIP/2.0/UDP %3:%4;branch=z9hG4bK%5\r\n"
        "Max-Forwards: 70\r\n"
        "To: <sip:%1:%2>\r\n"
        "From: <sip:probe@%3>;tag=%6\r\n"
        "Call-ID: %7@%3\r\n"
        "CSeq: 1 OPTIONS\r\n"
        "Contact: <sip:probe@%3:%4>\r\n"
        "Accept: application/sdp\r\n"
        "Content-Length: 0\r\n"
        "\r\n"
    ).arg(m_host)
     .arg(m_port)
     .arg(m_socket->localAddress().toString())
     .arg(m_socket->localPort())
     .arg(QDateTime::currentMSecsSinceEpoch())
     .arg(QDateTime::currentMSecsSinceEpoch())
     .arg(QDateTime::currentMSecsSinceEpoch());

    return probe.toUtf8();
}
