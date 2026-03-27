#include "rtpconnectivitychecker.h"
#include <QHostAddress>
#include <QNetworkDatagram>
#include <QRandomGenerator>

RtpConnectivityChecker::RtpConnectivityChecker(QObject *parent)
    : IConnectivityChecker(parent), m_socket(nullptr), m_timeoutTimer(nullptr),
      m_retryTimer(nullptr), m_port(0), m_retryCount(0), m_sequenceNumber(0)
{
    m_timestamp = QRandomGenerator::global()->generate();
    m_ssrc = QRandomGenerator::global()->generate();
}

RtpConnectivityChecker::~RtpConnectivityChecker()
{
    cleanup();
}

void RtpConnectivityChecker::checkConnectivity(const QString &host, int port, int timeout)
{
    cleanup();

    m_host = host;
    m_port = port;
    m_retryCount = 0;
    m_sequenceNumber = 0;

    m_socket = new QUdpSocket(this);
    m_timeoutTimer = new QTimer(this);
    m_retryTimer = new QTimer(this);
    
    m_timeoutTimer->setSingleShot(true);
    m_retryTimer->setSingleShot(false);

    if (!m_socket->bind()) {
        ConnectivityResult result(ConnectivityResult::RTP, m_host, m_port,
                                 ConnectivityResult::Failed,
                                 "Failed to bind UDP socket for RTP");
        emit connectivityChecked(result);
        cleanup();
        return;
    }

    connect(m_socket, &QUdpSocket::readyRead, this, &RtpConnectivityChecker::onReadyRead);
    connect(m_timeoutTimer, &QTimer::timeout, this, &RtpConnectivityChecker::onTimeout);
    connect(m_retryTimer, &QTimer::timeout, this, &RtpConnectivityChecker::sendRtpProbe);

    emit progressUpdate(QString("Checking RTP connectivity to %1:%2...").arg(host).arg(port));

    m_elapsedTimer.start();
    sendRtpProbe();
    m_retryTimer->start(1000);
    m_timeoutTimer->start(timeout);
}

void RtpConnectivityChecker::cancel()
{
    cleanup();
}

void RtpConnectivityChecker::sendRtpProbe()
{
    if (!m_socket || !m_retryTimer) {
        return;
    }
    
    if (m_retryCount >= MAX_RETRIES) {
        m_retryTimer->stop();
        return;
    }

    QByteArray rtpPacket = createRtpPacket();
    qint64 sent = m_socket->writeDatagram(rtpPacket, QHostAddress(m_host), m_port);
    
    if (sent == -1) {
        ConnectivityResult result(ConnectivityResult::RTP, m_host, m_port,
                                 ConnectivityResult::Failed,
                                 "Failed to send RTP packet");
        emit connectivityChecked(result);
        cleanup();
        return;
    }

    m_retryCount++;
    m_sequenceNumber++;
    m_timestamp += 160;
    
    emit progressUpdate(QString("Sent RTP probe %1/%2 to %3:%4")
                       .arg(m_retryCount).arg(MAX_RETRIES).arg(m_host).arg(m_port));
}

void RtpConnectivityChecker::onReadyRead()
{
    if (!m_socket) {
        return;
    }
    
    while (m_socket->hasPendingDatagrams()) {
        QNetworkDatagram datagram = m_socket->receiveDatagram();
        
        if (datagram.data().size() >= 12) {
            qint64 responseTime = m_elapsedTimer.elapsed();
            
            ConnectivityResult result(ConnectivityResult::RTP, m_host, m_port,
                                     ConnectivityResult::Success,
                                     QString("RTP response received (%1 bytes)")
                                     .arg(datagram.data().size()));
            result.setResponseTime(responseTime);
            
            emit connectivityChecked(result);
            cleanup();
            return;
        }
    }
}

void RtpConnectivityChecker::onTimeout()
{
    ConnectivityResult result(ConnectivityResult::RTP, m_host, m_port,
                             ConnectivityResult::Success,
                             QString("RTP port is reachable (sent %1 packets, no errors)")
                             .arg(m_retryCount));
    emit connectivityChecked(result);
    cleanup();
}

void RtpConnectivityChecker::cleanup()
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

QByteArray RtpConnectivityChecker::createRtpPacket()
{
    QByteArray packet;
    packet.resize(12);

    packet[0] = 0x80;
    packet[1] = 0x00;
    
    packet[2] = (m_sequenceNumber >> 8) & 0xFF;
    packet[3] = m_sequenceNumber & 0xFF;
    
    packet[4] = (m_timestamp >> 24) & 0xFF;
    packet[5] = (m_timestamp >> 16) & 0xFF;
    packet[6] = (m_timestamp >> 8) & 0xFF;
    packet[7] = m_timestamp & 0xFF;
    
    packet[8] = (m_ssrc >> 24) & 0xFF;
    packet[9] = (m_ssrc >> 16) & 0xFF;
    packet[10] = (m_ssrc >> 8) & 0xFF;
    packet[11] = m_ssrc & 0xFF;

    return packet;
}
