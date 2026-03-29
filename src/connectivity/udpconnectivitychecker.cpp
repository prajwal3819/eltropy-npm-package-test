#include "udpconnectivitychecker.h"
#include <QHostAddress>
#include <QNetworkDatagram>

namespace {
bool isSipResponse(const QByteArray &data)
{
    return data.startsWith("SIP/2.0 ");
}
}

UdpConnectivityChecker::UdpConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent), m_socket(nullptr), m_timeoutTimer(nullptr),
      m_retryTimer(nullptr), m_port(0), m_retryCount(0), m_isResolving(false),
      m_completed(false)
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
    m_isResolving = false;
    m_completed = false;

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

    // Try to parse as IP address first
    m_resolvedAddress = QHostAddress(m_host);
    
    // If not a valid IP, resolve hostname
    if (m_resolvedAddress.isNull()) {
        emit progressUpdate(QString("Resolving hostname %1...").arg(m_host));
        m_isResolving = true;
        QHostInfo::lookupHost(m_host, this, SLOT(onHostLookup(QHostInfo)));
        
        // Start timeout timer during DNS lookup
        if (m_timeoutTimer) {
            m_timeoutTimer->start(timeout);
        }
    } else {
        // Already have IP address, start sending probes
        m_elapsedTimer.start();
        sendProbe();
        
        if (m_retryTimer) {
            m_retryTimer->start(1000);
        }
        if (m_timeoutTimer) {
            m_timeoutTimer->start(timeout);
        }
    }
}

void UdpConnectivityChecker::cancel()
{
    cleanup();
}

void UdpConnectivityChecker::onHostLookup(const QHostInfo &hostInfo)
{
    if (m_completed) {
        return;
    }

    m_isResolving = false;
    
    if (hostInfo.error() != QHostInfo::NoError) {
        m_completed = true;
        ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                 ConnectivityResult::Failed,
                                 QString("DNS lookup failed: %1").arg(hostInfo.errorString()));
        emit connectivityChecked(result);
        cleanup();
        return;
    }
    
    QList<QHostAddress> addresses = hostInfo.addresses();
    if (addresses.isEmpty()) {
        m_completed = true;
        ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                 ConnectivityResult::Failed,
                                 "No IP addresses found for hostname");
        emit connectivityChecked(result);
        cleanup();
        return;
    }
    
    // Use the first IPv4 address, or first address if no IPv4 found
    m_resolvedAddress = addresses.first();
    for (const QHostAddress &addr : addresses) {
        if (addr.protocol() == QAbstractSocket::IPv4Protocol) {
            m_resolvedAddress = addr;
            break;
        }
    }
    
    emit progressUpdate(QString("Resolved %1 to %2").arg(m_host).arg(m_resolvedAddress.toString()));
    
    // Now start sending probes
    m_elapsedTimer.start();
    sendProbe();
    
    if (m_retryTimer) {
        m_retryTimer->start(1000);
    }
}

void UdpConnectivityChecker::sendProbe()
{
    if (!m_socket || !m_retryTimer || m_completed) {
        return;
    }
    
    // Don't send if still resolving hostname
    if (m_isResolving) {
        return;
    }
    
    // Don't send if we don't have a valid address
    if (m_resolvedAddress.isNull()) {
        return;
    }
    
    if (m_retryCount >= MAX_RETRIES) {
        m_retryTimer->stop();
        return;
    }

    QByteArray probe = createSipOptionsProbe();
    
    qint64 sent = m_socket->writeDatagram(probe, m_resolvedAddress, m_port);
    
    if (sent == -1) {
        m_completed = true;
        QString errorMsg = QString("Failed to send UDP packet: %1").arg(m_socket->errorString());
        ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                 ConnectivityResult::Failed, errorMsg);
        emit connectivityChecked(result);
        cleanup();
        return;
    }

    m_retryCount++;
    emit progressUpdate(QString("Sent UDP probe %1/%2 to %3 (%4:%5) - %6 bytes")
                       .arg(m_retryCount).arg(MAX_RETRIES)
                       .arg(m_host).arg(m_resolvedAddress.toString()).arg(m_port).arg(sent));
}

void UdpConnectivityChecker::onReadyRead()
{
    if (!m_socket || m_completed) {
        return;
    }
    
    while (m_socket->hasPendingDatagrams()) {
        QNetworkDatagram datagram = m_socket->receiveDatagram();
        const QByteArray data = datagram.data();
        const bool matchesTargetPort = datagram.senderPort() == m_port;
        const bool matchesResolvedAddress = datagram.senderAddress() == m_resolvedAddress;
        const bool looksLikeSipResponse = isSipResponse(data);

        if (matchesResolvedAddress || (matchesTargetPort && looksLikeSipResponse)) {
            m_completed = true;
            qint64 responseTime = m_elapsedTimer.elapsed();

            ConnectivityResult result(ConnectivityResult::UDP, m_host, m_port,
                                     ConnectivityResult::Success,
                                     QString("UDP response received from %1:%2 (%3 bytes)")
                                     .arg(datagram.senderAddress().toString())
                                     .arg(datagram.senderPort())
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
    if (m_completed) {
        return;
    }

    m_completed = true;
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
        QTimer *timer = m_retryTimer;
        m_retryTimer = nullptr;
        timer->stop();
        disconnect(timer, nullptr, this, nullptr);
        timer->deleteLater();
    }

    if (m_timeoutTimer) {
        QTimer *timer = m_timeoutTimer;
        m_timeoutTimer = nullptr;
        timer->stop();
        disconnect(timer, nullptr, this, nullptr);
        timer->deleteLater();
    }

    if (m_socket) {
        QUdpSocket *socket = m_socket;
        m_socket = nullptr;
        disconnect(socket, nullptr, this, nullptr);
        socket->close();
        socket->deleteLater();
    }

    m_isResolving = false;
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
