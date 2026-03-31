#include "networkinfomanager.h"
#include <QNetworkInterface>
#include <QFile>
#include <QTextStream>
#include <QRegularExpression>
#include <QDebug>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>

NetworkInfoManager::NetworkInfoManager(QObject *parent)
    : QObject(parent),
      m_pingProcess(nullptr),
      m_publicIpProcess(nullptr)
{
}

NetworkInfoManager::~NetworkInfoManager()
{
    if (m_pingProcess) {
        m_pingProcess->kill();
        m_pingProcess->deleteLater();
    }
    if (m_publicIpProcess) {
        m_publicIpProcess->kill();
        m_publicIpProcess->deleteLater();
    }
}

void NetworkInfoManager::refreshNetworkInfo()
{
    m_diagnostics = NetworkDiagnostics();
    
    // Gather synchronous information first
    gatherInterfaceInfo();
    gatherDnsInfo();
    gatherGatewayInfo();
    gatherDhcpInfo();
    
    // Emit initial update with synchronous data
    emit networkInfoUpdated(m_diagnostics);
    
    // Start async operations (they will emit their own signals when complete)
    measureGatewayLatency();
    discoverPublicIp();
}

void NetworkInfoManager::gatherInterfaceInfo()
{
    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
    
    for (const QNetworkInterface &iface : interfaces) {
        NetworkInterfaceInfo info;
        info.name = iface.name();
        info.hardwareName = iface.humanReadableName();
        info.macAddress = iface.hardwareAddress();
        info.isActive = iface.flags().testFlag(QNetworkInterface::IsUp) && 
                       iface.flags().testFlag(QNetworkInterface::IsRunning);
        info.isLoopback = iface.flags().testFlag(QNetworkInterface::IsLoopBack);
        
        QList<QNetworkAddressEntry> entries = iface.addressEntries();
        for (const QNetworkAddressEntry &entry : entries) {
            QHostAddress addr = entry.ip();
            if (addr.protocol() == QAbstractSocket::IPv4Protocol || 
                addr.protocol() == QAbstractSocket::IPv6Protocol) {
                info.ipAddresses.append(addr);
            }
        }
        
        if (!info.isLoopback && info.isActive && !info.ipAddresses.isEmpty()) {
            m_diagnostics.interfaces.append(info);
        }
    }
}

void NetworkInfoManager::gatherDnsInfo()
{
    // On macOS, read DNS servers from /etc/resolv.conf
    QFile resolvConf("/etc/resolv.conf");
    if (resolvConf.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream in(&resolvConf);
        while (!in.atEnd()) {
            QString line = in.readLine().trimmed();
            if (line.startsWith("nameserver")) {
                QStringList parts = line.split(QRegularExpression("\\s+"));
                if (parts.size() >= 2) {
                    m_diagnostics.dnsServers.append(parts[1]);
                }
            }
        }
        resolvConf.close();
    }
    
    // Also try scutil on macOS for more accurate DNS info
    QProcess scutil;
    scutil.start("scutil", QStringList() << "--dns");
    scutil.waitForFinished(2000);
    QString output = scutil.readAllStandardOutput();
    
    QRegularExpression dnsRegex("nameserver\\[\\d+\\]\\s*:\\s*([\\d\\.]+)");
    QRegularExpressionMatchIterator it = dnsRegex.globalMatch(output);
    while (it.hasNext()) {
        QRegularExpressionMatch match = it.next();
        QString dns = match.captured(1);
        if (!m_diagnostics.dnsServers.contains(dns)) {
            m_diagnostics.dnsServers.append(dns);
        }
    }
}

void NetworkInfoManager::gatherGatewayInfo()
{
    m_diagnostics.defaultGateway = parseGatewayFromRoute();
}

void NetworkInfoManager::gatherDhcpInfo()
{
    m_diagnostics.dhcpServer = parseDhcpFromLease();
}

QString NetworkInfoManager::parseGatewayFromRoute()
{
    QProcess netstat;
    netstat.start("netstat", QStringList() << "-nr");
    netstat.waitForFinished(2000);
    QString output = netstat.readAllStandardOutput();
    
    QStringList lines = output.split('\n');
    for (const QString &line : lines) {
        if (line.contains("default") || line.startsWith("0.0.0.0")) {
            QRegularExpression gwRegex("\\s+(\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+");
            QRegularExpressionMatch match = gwRegex.match(line);
            if (match.hasMatch()) {
                return match.captured(1);
            }
        }
    }
    
    return "Not found";
}

QString NetworkInfoManager::parseDhcpFromLease()
{
    // On macOS, DHCP lease info is in /var/db/dhcpclient/leases/
    QProcess ipconfig;
    ipconfig.start("ipconfig", QStringList() << "getpacket" << "en0");
    ipconfig.waitForFinished(2000);
    QString output = ipconfig.readAllStandardOutput();
    
    QRegularExpression dhcpRegex("server_identifier\\s*\\(ip\\):\\s*([\\d\\.]+)");
    QRegularExpressionMatch match = dhcpRegex.match(output);
    if (match.hasMatch()) {
        return match.captured(1);
    }
    
    return "Not found";
}

void NetworkInfoManager::measureGatewayLatency()
{
    if (m_diagnostics.defaultGateway.isEmpty() || 
        m_diagnostics.defaultGateway == "Not found") {
        qDebug() << "Cannot measure gateway latency: gateway not found";
        m_diagnostics.gatewayLatencyMs = -1;
        emit gatewayLatencyMeasured(m_diagnostics.gatewayLatencyMs);
        return;
    }
    
    if (m_pingProcess) {
        m_pingProcess->kill();
        m_pingProcess->deleteLater();
    }
    
    qDebug() << "Starting ping to gateway:" << m_diagnostics.defaultGateway;
    m_pingProcess = new QProcess(this);
    connect(m_pingProcess, QOverload<int, QProcess::ExitStatus>::of(&QProcess::finished),
            this, &NetworkInfoManager::onGatewayPingFinished);
    
    m_pingProcess->start("ping", QStringList() << "-c" << "3" << m_diagnostics.defaultGateway);
}

void NetworkInfoManager::onGatewayPingFinished(int exitCode, QProcess::ExitStatus exitStatus)
{
    Q_UNUSED(exitStatus);
    
    if (exitCode == 0 && m_pingProcess) {
        QString output = m_pingProcess->readAllStandardOutput();
        QString errorOutput = m_pingProcess->readAllStandardError();
        qDebug() << "Gateway ping output:" << output;
        qDebug() << "Gateway ping error output:" << errorOutput;
        m_diagnostics.gatewayLatencyMs = parsePingLatency(output);
        qDebug() << "Gateway ping successful, parsed latency:" << m_diagnostics.gatewayLatencyMs << "ms";
    } else {
        QString errorOutput = m_pingProcess ? m_pingProcess->readAllStandardError() : QString("");
        m_diagnostics.gatewayLatencyMs = -1;
        qDebug() << "Gateway ping failed, exit code:" << exitCode << "error:" << errorOutput;
    }
    
    // Always emit the signal so UI gets updated
    emit gatewayLatencyMeasured(m_diagnostics.gatewayLatencyMs);
    
    if (m_pingProcess) {
        m_pingProcess->deleteLater();
        m_pingProcess = nullptr;
    }
}

int NetworkInfoManager::parsePingLatency(const QString &output)
{
    // Parse average latency from ping output
    // macOS format: "round-trip min/avg/max/stddev = 1.234/2.345/3.456/0.789 ms"
    // Also try: "rtt min/avg/max/mdev = 1.234/2.345/3.456/0.789 ms"
    
    qDebug() << "Parsing ping output for latency...";
    
    // Try macOS format first
    QRegularExpression macRegex("round-trip[^=]+=\\s*[\\d\\.]+/([\\d\\.]+)/");
    QRegularExpressionMatch match = macRegex.match(output);
    if (match.hasMatch()) {
        double latency = match.captured(1).toDouble();
        qDebug() << "Parsed latency (macOS format):" << latency;
        return static_cast<int>(latency);
    }
    
    // Try Linux format
    QRegularExpression linuxRegex("rtt[^=]+=\\s*[\\d\\.]+/([\\d\\.]+)/");
    match = linuxRegex.match(output);
    if (match.hasMatch()) {
        double latency = match.captured(1).toDouble();
        qDebug() << "Parsed latency (Linux format):" << latency;
        return static_cast<int>(latency);
    }
    
    // Try simpler pattern
    QRegularExpression simpleRegex("avg[=/]([\\d\\.]+)");
    match = simpleRegex.match(output);
    if (match.hasMatch()) {
        double latency = match.captured(1).toDouble();
        qDebug() << "Parsed latency (simple format):" << latency;
        return static_cast<int>(latency);
    }
    
    qDebug() << "Failed to parse latency from ping output";
    return -1;
}

void NetworkInfoManager::discoverPublicIp()
{
    qDebug() << "Starting public IP discovery...";
    QNetworkAccessManager *manager = new QNetworkAccessManager(this);
    connect(manager, &QNetworkAccessManager::finished, this, &NetworkInfoManager::onPublicIpCheckFinished);
    
    QNetworkRequest request(QUrl("https://api.ipify.org"));
    request.setTransferTimeout(5000);
    manager->get(request);
}

void NetworkInfoManager::onPublicIpCheckFinished(QNetworkReply *reply)
{
    qDebug() << "Public IP check finished, reply:" << (reply ? "valid" : "null");
    
    if (!reply) {
        qDebug() << "Public IP check: reply is null";
        m_diagnostics.publicIp = "Unable to detect";
        emit publicIpDiscovered(m_diagnostics.publicIp);
        return;
    }
    
    if (reply->error() == QNetworkReply::NoError) {
        m_diagnostics.publicIp = reply->readAll().trimmed();
        qDebug() << "Public IP discovered:" << m_diagnostics.publicIp;
        emit publicIpDiscovered(m_diagnostics.publicIp);
    } else {
        m_diagnostics.publicIp = "Unable to detect";
        qDebug() << "Public IP detection failed:" << reply->errorString();
        emit publicIpDiscovered(m_diagnostics.publicIp);
    }
    
    reply->deleteLater();
    reply->manager()->deleteLater();
}

QList<NetworkInterfaceInfo> NetworkInfoManager::getActiveInterfaces() const
{
    return m_diagnostics.interfaces;
}

QStringList NetworkInfoManager::getDnsServers() const
{
    return m_diagnostics.dnsServers;
}

QString NetworkInfoManager::getDhcpServer() const
{
    return m_diagnostics.dhcpServer;
}

QString NetworkInfoManager::getDefaultGateway() const
{
    return m_diagnostics.defaultGateway;
}
