#ifndef CONNECTIVITYRESULT_H
#define CONNECTIVITYRESULT_H

#include <QString>
#include <QDateTime>

class ConnectivityResult
{
public:
    enum Status {
        Success,
        Failed,
        Timeout,
        ConnectionRefused,
        InProgress
    };

    enum Protocol {
        TCP,
        UDP,
        TLS,
        WSS,
        RTP,
        RTCP,
        SIP,
        SIPALG,
        STUN
    };

    ConnectivityResult();
    ConnectivityResult(Protocol protocol, const QString &host, int port, 
                      Status status, const QString &message = QString());

    Protocol protocol() const { return m_protocol; }
    void setProtocol(Protocol protocol) { m_protocol = protocol; }

    QString host() const { return m_host; }
    void setHost(const QString &host) { m_host = host; }

    int port() const { return m_port; }
    void setPort(int port) { m_port = port; }

    Status status() const { return m_status; }
    void setStatus(Status status) { m_status = status; }

    QString message() const { return m_message; }
    void setMessage(const QString &message) { m_message = message; }

    qint64 responseTime() const { return m_responseTime; }
    void setResponseTime(qint64 time) { m_responseTime = time; }

    QDateTime timestamp() const { return m_timestamp; }
    void setTimestamp(const QDateTime &timestamp) { m_timestamp = timestamp; }

    QString protocolString() const;
    QString statusString() const;
    QString toString() const;

private:
    Protocol m_protocol;
    QString m_host;
    int m_port;
    Status m_status;
    QString m_message;
    qint64 m_responseTime;
    QDateTime m_timestamp;
};

#endif
