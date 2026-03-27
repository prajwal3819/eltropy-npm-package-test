#include "voipqualitychecker.h"
#include <QHostInfo>
#include <QRandomGenerator>
#include <QDebug>
#include <QtMath>

VoIPQualityChecker::VoIPQualityChecker(QObject *parent)
    : IConnectivityChecker(parent)
    , m_socket(nullptr)
    , m_timer(nullptr)
    , m_sendTimer(nullptr)
    , m_targetPort(0)
    , m_sequenceNumber(0)
    , m_totalPacketsSent(0)
    , m_packetsReceived(0)
    , m_lastTransit(0)
{
}

VoIPQualityChecker::~VoIPQualityChecker()
{
    cancel();
}

void VoIPQualityChecker::checkConnectivity(const QString &host, int port, int timeoutMs)
{
    m_targetHost = host;
    m_targetPort = port;
    m_sequenceNumber = 0;
    m_totalPacketsSent = 0;
    m_packetsReceived = 0;
    m_lastTransit = 0;
    
    m_packets.clear();
    m_jitterSamples.clear();
    m_packetReceived.clear();
    m_packetReceived.resize(PACKETS_TO_SEND, false);

    emit progressUpdate("Resolving host: " + host);
    
    // Resolve hostname
    QHostInfo hostInfo = QHostInfo::fromName(host);
    if (hostInfo.addresses().isEmpty()) {
        emit progressUpdate("Failed to resolve host");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::UDP,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            "Could not resolve hostname: " + host
        ));
        return;
    }

    m_targetAddress = hostInfo.addresses().first();
    emit progressUpdate("Resolved to: " + m_targetAddress.toString());

    // Create UDP socket
    m_socket = new QUdpSocket(this);
    connect(m_socket, &QUdpSocket::readyRead, this, &VoIPQualityChecker::onReadyRead);
    connect(m_socket, &QUdpSocket::errorOccurred, this, &VoIPQualityChecker::onError);

    if (!m_socket->bind(QHostAddress::Any, 0)) {
        emit progressUpdate("Failed to bind UDP socket");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::UDP,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            "Could not bind UDP socket: " + m_socket->errorString()
        ));
        cancel();
        return;
    }

    emit progressUpdate(QString("Starting VoIP quality test (%1 packets)...").arg(PACKETS_TO_SEND));

    // Setup timeout timer
    m_timer = new QTimer(this);
    m_timer->setSingleShot(true);
    connect(m_timer, &QTimer::timeout, this, &VoIPQualityChecker::onTimeout);
    m_timer->start(timeoutMs);

    // Setup packet sending timer
    m_sendTimer = new QTimer(this);
    connect(m_sendTimer, &QTimer::timeout, this, &VoIPQualityChecker::sendTestPacket);
    
    m_startTime = QDateTime::currentMSecsSinceEpoch();
    m_sendTimer->start(PACKET_INTERVAL_MS);
    
    // Send first packet immediately
    sendTestPacket();
}

void VoIPQualityChecker::cancel()
{
    if (m_sendTimer) {
        m_sendTimer->stop();
        m_sendTimer->deleteLater();
        m_sendTimer = nullptr;
    }

    if (m_timer) {
        m_timer->stop();
        m_timer->deleteLater();
        m_timer = nullptr;
    }

    if (m_socket) {
        m_socket->close();
        m_socket->deleteLater();
        m_socket = nullptr;
    }
}

void VoIPQualityChecker::sendTestPacket()
{
    if (!m_socket || m_totalPacketsSent >= PACKETS_TO_SEND) {
        if (m_totalPacketsSent >= PACKETS_TO_SEND) {
            m_sendTimer->stop();
            // Wait a bit for remaining packets, then calculate final metrics
            QTimer::singleShot(1000, this, [this]() {
                calculateMetrics();
                
                QString resultMsg = QString(
                    "Jitter: %1 ms\n"
                    "Packet Loss: %2%\n"
                    "Latency: %3 ms\n"
                    "MOS Score: %4/5.0\n"
                    "Burst Loss: %5%\n"
                    "Congestion: %6\n\n"
                    "Packets: %7/%8 received"
                ).arg(m_currentMetrics.jitter, 0, 'f', 2)
                 .arg(m_currentMetrics.packetLoss, 0, 'f', 2)
                 .arg(m_currentMetrics.latency, 0, 'f', 2)
                 .arg(m_currentMetrics.mosScore, 0, 'f', 2)
                 .arg(m_currentMetrics.burstPacketLoss, 0, 'f', 2)
                 .arg(m_currentMetrics.congestionDetected ? "Detected" : "None")
                 .arg(m_packetsReceived)
                 .arg(PACKETS_TO_SEND);
                
                emit progressUpdate("Test completed");
                emit connectivityChecked(ConnectivityResult(
                    ConnectivityResult::UDP,
                    m_targetHost,
                    m_targetPort,
                    ConnectivityResult::Success,
                    resultMsg
                ));
                
                cancel();
            });
        }
        return;
    }

    QByteArray packet = createTestPacket(m_sequenceNumber);
    qint64 sent = m_socket->writeDatagram(packet, m_targetAddress, m_targetPort);
    
    if (sent > 0) {
        m_totalPacketsSent++;
        m_sequenceNumber++;
        
        if (m_totalPacketsSent % 20 == 0) {
            emit progressUpdate(QString("Sent %1/%2 packets...").arg(m_totalPacketsSent).arg(PACKETS_TO_SEND));
        }
    }
}

QByteArray VoIPQualityChecker::createTestPacket(quint32 sequence)
{
    QByteArray packet;
    QDataStream stream(&packet, QIODevice::WriteOnly);
    stream.setByteOrder(QDataStream::BigEndian);
    
    // Magic number to identify our packets
    stream << quint32(0x564F4950); // "VOIP"
    stream << sequence;
    stream << QDateTime::currentMSecsSinceEpoch();
    
    // Add some payload (simulate typical VoIP packet size ~160 bytes)
    for (int i = 0; i < 30; i++) {
        stream << quint32(QRandomGenerator::global()->generate());
    }
    
    return packet;
}

bool VoIPQualityChecker::parseTestPacket(const QByteArray &data, quint32 &sequence, qint64 &timestamp)
{
    if (data.size() < 16) {
        return false;
    }

    QDataStream stream(data);
    stream.setByteOrder(QDataStream::BigEndian);
    
    quint32 magic;
    stream >> magic;
    
    if (magic != 0x564F4950) {
        return false;
    }
    
    stream >> sequence;
    stream >> timestamp;
    
    return true;
}

void VoIPQualityChecker::onReadyRead()
{
    while (m_socket && m_socket->hasPendingDatagrams()) {
        QByteArray data;
        data.resize(m_socket->pendingDatagramSize());
        QHostAddress sender;
        quint16 senderPort;
        
        m_socket->readDatagram(data.data(), data.size(), &sender, &senderPort);
        
        quint32 sequence;
        qint64 sendTimestamp;
        
        if (parseTestPacket(data, sequence, sendTimestamp)) {
            qint64 receiveTime = QDateTime::currentMSecsSinceEpoch();
            
            PacketInfo info;
            info.sequence = sequence;
            info.timestamp = sendTimestamp;
            info.receiveTime = receiveTime;
            m_packets.append(info);
            
            if (sequence < PACKETS_TO_SEND) {
                m_packetReceived[sequence] = true;
            }
            
            m_packetsReceived++;
            
            // Calculate transit time and jitter
            double transit = receiveTime - sendTimestamp;
            if (m_lastTransit > 0) {
                double jitter = qAbs(transit - m_lastTransit);
                m_jitterSamples.append(jitter);
            }
            m_lastTransit = transit;
            
            // Update metrics periodically
            if (m_packetsReceived % 10 == 0) {
                calculateMetrics();
                emit metricsUpdated(m_currentMetrics);
            }
        }
    }
}

void VoIPQualityChecker::calculateMetrics()
{
    m_currentMetrics.jitter = calculateJitter();
    m_currentMetrics.packetLoss = calculatePacketLoss();
    m_currentMetrics.latency = calculateLatency();
    m_currentMetrics.burstPacketLoss = calculateBurstPacketLoss();
    m_currentMetrics.congestionDetected = detectCongestion();
    m_currentMetrics.mosScore = calculateMOS(m_currentMetrics.latency, 
                                             m_currentMetrics.jitter, 
                                             m_currentMetrics.packetLoss);
    m_currentMetrics.packetsReceived = m_packetsReceived;
    m_currentMetrics.packetsLost = m_totalPacketsSent - m_packetsReceived;
    m_currentMetrics.totalPackets = m_totalPacketsSent;
}

double VoIPQualityChecker::calculateJitter()
{
    if (m_jitterSamples.isEmpty()) {
        return 0.0;
    }
    
    double sum = 0;
    for (double jitter : m_jitterSamples) {
        sum += jitter;
    }
    
    return sum / m_jitterSamples.size();
}

double VoIPQualityChecker::calculatePacketLoss()
{
    if (m_totalPacketsSent == 0) {
        return 0.0;
    }
    
    int lost = m_totalPacketsSent - m_packetsReceived;
    return (lost * 100.0) / m_totalPacketsSent;
}

double VoIPQualityChecker::calculateLatency()
{
    if (m_packets.isEmpty()) {
        return 0.0;
    }
    
    double totalLatency = 0;
    for (const PacketInfo &info : m_packets) {
        totalLatency += (info.receiveTime - info.timestamp);
    }
    
    return totalLatency / m_packets.size();
}

double VoIPQualityChecker::calculateMOS(double latency, double jitter, double packetLoss)
{
    // E-Model based MOS calculation (simplified)
    // R-factor calculation
    double R = 93.2 - (latency / 40.0) - (jitter / 10.0) - (packetLoss * 2.5);
    
    // Clamp R-factor
    R = qMax(0.0, qMin(100.0, R));
    
    // Convert R-factor to MOS
    double mos;
    if (R < 0) {
        mos = 1.0;
    } else if (R > 100) {
        mos = 4.5;
    } else {
        mos = 1.0 + 0.035 * R + R * (R - 60.0) * (100.0 - R) * 7.0 * 0.000001;
    }
    
    return qMax(1.0, qMin(5.0, mos));
}

double VoIPQualityChecker::calculateBurstPacketLoss()
{
    if (m_packetReceived.isEmpty()) {
        return 0.0;
    }
    
    int maxBurst = 0;
    int currentBurst = 0;
    int totalBurstLoss = 0;
    int burstCount = 0;
    
    for (bool received : m_packetReceived) {
        if (!received) {
            currentBurst++;
        } else {
            if (currentBurst > 0) {
                maxBurst = qMax(maxBurst, currentBurst);
                totalBurstLoss += currentBurst;
                burstCount++;
                currentBurst = 0;
            }
        }
    }
    
    if (currentBurst > 0) {
        maxBurst = qMax(maxBurst, currentBurst);
        totalBurstLoss += currentBurst;
        burstCount++;
    }
    
    if (burstCount == 0) {
        return 0.0;
    }
    
    // Return average burst size as percentage
    double avgBurst = static_cast<double>(totalBurstLoss) / burstCount;
    return (avgBurst / m_packetReceived.size()) * 100.0;
}

bool VoIPQualityChecker::detectCongestion()
{
    // Congestion indicators:
    // 1. High packet loss (> 5%)
    // 2. High jitter (> 30ms)
    // 3. Increasing latency trend
    
    if (m_currentMetrics.packetLoss > 5.0) {
        return true;
    }
    
    if (m_currentMetrics.jitter > 30.0) {
        return true;
    }
    
    // Check for increasing latency trend
    if (m_packets.size() >= 20) {
        int halfPoint = m_packets.size() / 2;
        double firstHalfAvg = 0;
        double secondHalfAvg = 0;
        
        for (int i = 0; i < halfPoint; i++) {
            firstHalfAvg += (m_packets[i].receiveTime - m_packets[i].timestamp);
        }
        firstHalfAvg /= halfPoint;
        
        for (int i = halfPoint; i < m_packets.size(); i++) {
            secondHalfAvg += (m_packets[i].receiveTime - m_packets[i].timestamp);
        }
        secondHalfAvg /= (m_packets.size() - halfPoint);
        
        // If latency increased by more than 20ms, consider it congestion
        if (secondHalfAvg - firstHalfAvg > 20.0) {
            return true;
        }
    }
    
    return false;
}

void VoIPQualityChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    QString errorMsg = m_socket ? m_socket->errorString() : "Unknown socket error";
    emit progressUpdate("Socket error: " + errorMsg);
    emit connectivityChecked(ConnectivityResult(
        ConnectivityResult::UDP,
        m_targetHost,
        m_targetPort,
        ConnectivityResult::Failed,
        "Socket error: " + errorMsg
    ));
    cancel();
}

void VoIPQualityChecker::onTimeout()
{
    calculateMetrics();
    
    QString resultMsg = QString(
        "Test incomplete (timeout)\n\n"
        "Jitter: %1 ms\n"
        "Packet Loss: %2%\n"
        "Latency: %3 ms\n"
        "MOS Score: %4/5.0\n"
        "Packets: %5/%6 received"
    ).arg(m_currentMetrics.jitter, 0, 'f', 2)
     .arg(m_currentMetrics.packetLoss, 0, 'f', 2)
     .arg(m_currentMetrics.latency, 0, 'f', 2)
     .arg(m_currentMetrics.mosScore, 0, 'f', 2)
     .arg(m_packetsReceived)
     .arg(m_totalPacketsSent);
    
    emit progressUpdate("Test timed out");
    emit connectivityChecked(ConnectivityResult(
        ConnectivityResult::UDP,
        m_targetHost,
        m_targetPort,
        ConnectivityResult::Timeout,
        resultMsg
    ));
    cancel();
}
