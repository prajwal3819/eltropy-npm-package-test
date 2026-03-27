#ifndef VOIPQUALITYCHECKER_H
#define VOIPQUALITYCHECKER_H

#include "iconnectivitychecker.h"
#include <QUdpSocket>
#include <QTimer>
#include <QElapsedTimer>
#include <QVector>
#include <QHostAddress>

struct VoIPQualityMetrics {
    double jitter;              // ms
    double packetLoss;          // percentage
    double latency;             // ms (round-trip time)
    double mosScore;            // 1.0 - 5.0
    double burstPacketLoss;     // percentage
    bool congestionDetected;
    int packetsReceived;
    int packetsLost;
    int totalPackets;
    
    VoIPQualityMetrics() 
        : jitter(0), packetLoss(0), latency(0), mosScore(0), 
          burstPacketLoss(0), congestionDetected(false),
          packetsReceived(0), packetsLost(0), totalPackets(0) {}
};

class VoIPQualityChecker : public IConnectivityChecker
{
    Q_OBJECT

public:
    explicit VoIPQualityChecker(QObject *parent = nullptr);
    ~VoIPQualityChecker();

    void checkConnectivity(const QString &host, int port, int timeoutMs = 30000) override;
    void cancel() override;

signals:
    void progressUpdate(const QString &message);
    void metricsUpdated(const VoIPQualityMetrics &metrics);

private slots:
    void onReadyRead();
    void onError(QAbstractSocket::SocketError error);
    void onTimeout();
    void sendTestPacket();

private:
    struct PacketInfo {
        quint32 sequence;
        qint64 timestamp;
        qint64 receiveTime;
    };

    void calculateMetrics();
    double calculateJitter();
    double calculatePacketLoss();
    double calculateLatency();
    double calculateMOS(double latency, double jitter, double packetLoss);
    double calculateBurstPacketLoss();
    bool detectCongestion();
    QByteArray createTestPacket(quint32 sequence);
    bool parseTestPacket(const QByteArray &data, quint32 &sequence, qint64 &timestamp);

    QUdpSocket *m_socket;
    QTimer *m_timer;
    QTimer *m_sendTimer;
    QString m_targetHost;
    quint16 m_targetPort;
    QHostAddress m_targetAddress;
    
    quint32 m_sequenceNumber;
    QVector<PacketInfo> m_packets;
    QVector<double> m_jitterSamples;
    QVector<bool> m_packetReceived;
    
    qint64 m_startTime;
    int m_totalPacketsSent;
    int m_packetsReceived;
    double m_lastTransit;
    
    VoIPQualityMetrics m_currentMetrics;
    
    static const int PACKETS_TO_SEND = 100;
    static const int PACKET_INTERVAL_MS = 20; // 50 packets/sec (typical VoIP)
};

#endif // VOIPQUALITYCHECKER_H
