#include "serverconfig.h"

ServerConfig::ServerConfig()
    : m_tlsPort(5061), m_wssPort(443), m_timeout(5000)
{
    m_tcpPorts = {5060, 5080};
    m_udpPorts = {5060, 5080};
    m_rtpPorts = {10000, 20000};
}

ServerConfig::ServerConfig(const QString &host, const QList<int> &tcpPorts,
                           const QList<int> &udpPorts, int tlsPort, int wssPort,
                           const QList<int> &rtpPorts)
    : m_host(host), m_tcpPorts(tcpPorts), m_udpPorts(udpPorts),
      m_tlsPort(tlsPort), m_wssPort(wssPort), m_rtpPorts(rtpPorts),
      m_timeout(5000)
{
}
