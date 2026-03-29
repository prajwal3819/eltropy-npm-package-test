#ifndef NETWORKINFOMANAGER_H
#define NETWORKINFOMANAGER_H

#include <QObject>
#include <QNetworkInterface>
#include <QHostAddress>
#include <QProcess>
#include <QTimer>

class QNetworkReply;

struct NetworkInterfaceInfo {
    QString name;
    QString hardwareName;
    QString macAddress;
    QList<QHostAddress> ipAddresses;
    bool isActive;
    bool isLoopback;
};

struct NetworkDiagnostics {
    QList<NetworkInterfaceInfo> interfaces;
    QStringList dnsServers;
    QString dhcpServer;
    QString defaultGateway;
    int gatewayLatencyMs;
    QString publicIp;
};

class NetworkInfoManager : public QObject
{
    Q_OBJECT

public:
    explicit NetworkInfoManager(QObject *parent = nullptr);
    ~NetworkInfoManager();

    void refreshNetworkInfo();
    NetworkDiagnostics getNetworkDiagnostics() const { return m_diagnostics; }
    
    QList<NetworkInterfaceInfo> getActiveInterfaces() const;
    QStringList getDnsServers() const;
    QString getDhcpServer() const;
    QString getDefaultGateway() const;

signals:
    void networkInfoUpdated(const NetworkDiagnostics &diagnostics);
    void gatewayLatencyMeasured(int latencyMs);
    void publicIpDiscovered(const QString &ip);

private slots:
    void onGatewayPingFinished(int exitCode, QProcess::ExitStatus exitStatus);
    void onPublicIpCheckFinished(QNetworkReply *reply);

private:
    void gatherInterfaceInfo();
    void gatherDnsInfo();
    void gatherGatewayInfo();
    void gatherDhcpInfo();
    void measureGatewayLatency();
    void discoverPublicIp();
    
    QString parseGatewayFromRoute();
    QString parseDhcpFromLease();
    int parsePingLatency(const QString &output);

    NetworkDiagnostics m_diagnostics;
    QProcess *m_pingProcess;
    QProcess *m_publicIpProcess;
};

#endif // NETWORKINFOMANAGER_H
