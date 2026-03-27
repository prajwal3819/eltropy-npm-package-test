#ifndef SERVERCONFIG_H
#define SERVERCONFIG_H

#include <QString>
#include <QList>

class ServerConfig
{
public:
    ServerConfig();
    ServerConfig(const QString &host, const QList<int> &tcpPorts, 
                 const QList<int> &udpPorts, int tlsPort, int wssPort,
                 const QList<int> &rtpPorts);

    QString host() const { return m_host; }
    void setHost(const QString &host) { m_host = host; }

    QList<int> tcpPorts() const { return m_tcpPorts; }
    void setTcpPorts(const QList<int> &ports) { m_tcpPorts = ports; }

    QList<int> udpPorts() const { return m_udpPorts; }
    void setUdpPorts(const QList<int> &ports) { m_udpPorts = ports; }

    int tlsPort() const { return m_tlsPort; }
    void setTlsPort(int port) { m_tlsPort = port; }

    int wssPort() const { return m_wssPort; }
    void setWssPort(int port) { m_wssPort = port; }

    QList<int> rtpPorts() const { return m_rtpPorts; }
    void setRtpPorts(const QList<int> &ports) { m_rtpPorts = ports; }

    int timeout() const { return m_timeout; }
    void setTimeout(int timeout) { m_timeout = timeout; }

private:
    QString m_host;
    QList<int> m_tcpPorts;
    QList<int> m_udpPorts;
    int m_tlsPort;
    int m_wssPort;
    QList<int> m_rtpPorts;
    int m_timeout;
};

#endif
