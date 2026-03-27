#include "connectivityresult.h"

ConnectivityResult::ConnectivityResult()
    : m_protocol(TCP), m_port(0), m_status(InProgress), 
      m_responseTime(0), m_timestamp(QDateTime::currentDateTime())
{
}

ConnectivityResult::ConnectivityResult(Protocol protocol, const QString &host, 
                                       int port, Status status, const QString &message)
    : m_protocol(protocol), m_host(host), m_port(port), 
      m_status(status), m_message(message), m_responseTime(0),
      m_timestamp(QDateTime::currentDateTime())
{
}

QString ConnectivityResult::protocolString() const
{
    switch (m_protocol) {
        case TCP: return "TCP";
        case UDP: return "UDP";
        case TLS: return "TLS";
        case WSS: return "WSS";
        case RTP: return "RTP";
        case RTCP: return "RTCP";
        case SIP: return "SIP";
        case SIPALG: return "SIP ALG";
        case STUN: return "STUN";
        default: return "Unknown";
    }
}

QString ConnectivityResult::statusString() const
{
    switch (m_status) {
        case Success: return "Success";
        case Failed: return "Failed";
        case Timeout: return "Timeout";
        case InProgress: return "In Progress";
        default: return "Unknown";
    }
}

QString ConnectivityResult::toString() const
{
    QString result = QString("[%1] %2:%3:%4 - %5")
                        .arg(m_timestamp.toString("yyyy-MM-dd hh:mm:ss"))
                        .arg(protocolString())
                        .arg(m_host)
                        .arg(m_port)
                        .arg(statusString());
    
    if (m_status == Success && m_responseTime > 0) {
        result += QString(" (%1 ms)").arg(m_responseTime);
    }
    
    if (!m_message.isEmpty()) {
        result += QString(" - %1").arg(m_message);
    }
    
    return result;
}
