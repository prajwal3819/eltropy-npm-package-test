#include "sipalgchecker.h"
#include <QNetworkInterface>
#include <QDateTime>
#include <QRegularExpression>
#include <QRandomGenerator>
#include <QHostInfo>
#include <QDebug>

SipAlgChecker::SipAlgChecker(QObject *parent)
    : IConnectivityChecker(parent)
    , m_socket(nullptr)
    , m_timer(nullptr)
    , m_targetPort(0)
    , m_localPort(0)
    , m_retryCount(0)
{
}

SipAlgChecker::~SipAlgChecker()
{
    cancel();
}

void SipAlgChecker::checkConnectivity(const QString &host, int port, int timeoutMs)
{
    m_targetHost = host;
    m_targetPort = port;
    m_retryCount = 0;

    // Get local IP address
    QList<QHostAddress> addresses = QNetworkInterface::allAddresses();
    for (const QHostAddress &addr : addresses) {
        if (addr.protocol() == QAbstractSocket::IPv4Protocol && 
            !addr.isLoopback() && 
            !addr.toString().startsWith("169.254")) {
            m_localAddress = addr;
            break;
        }
    }

    if (m_localAddress.isNull()) {
        emit progressUpdate("Failed to get local IP address");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            "Could not determine local IP address"
        ));
        return;
    }

    // Create UDP socket
    m_socket = new QUdpSocket(this);
    connect(m_socket, &QUdpSocket::readyRead, this, &SipAlgChecker::onReadyRead);
    connect(m_socket, &QUdpSocket::errorOccurred, this, &SipAlgChecker::onError);

    // Bind to a random port
    if (!m_socket->bind(QHostAddress::Any, 0)) {
        emit progressUpdate("Failed to bind UDP socket");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            "Could not bind UDP socket: " + m_socket->errorString()
        ));
        cancel();
        return;
    }

    m_localPort = m_socket->localPort();

    // Setup timeout timer
    m_timer = new QTimer(this);
    m_timer->setSingleShot(true);
    connect(m_timer, &QTimer::timeout, this, &SipAlgChecker::onTimeout);
    m_timer->start(timeoutMs);

    emit progressUpdate(QString("Checking SIP ALG on %1:%2...").arg(host).arg(port));
    sendSipOptions();
}

void SipAlgChecker::cancel()
{
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

void SipAlgChecker::sendSipOptions()
{
    if (!m_socket) {
        qDebug() << "SipAlgChecker: Socket is null, cannot send";
        return;
    }

    qDebug() << "SipAlgChecker: Socket state:" << m_socket->state();
    qDebug() << "SipAlgChecker: Local address:" << m_localAddress.toString() << ":" << m_localPort;
    qDebug() << "SipAlgChecker: Target:" << m_targetHost << ":" << m_targetPort;

    m_sentMessage = generateSipOptions(m_targetHost, m_targetPort);
    QByteArray data = m_sentMessage.toUtf8();

    qDebug() << "SipAlgChecker: Sending" << data.size() << "bytes";
    
    // Try to resolve hostname to IP first
    QHostInfo hostInfo = QHostInfo::fromName(m_targetHost);
    if (hostInfo.addresses().isEmpty()) {
        QString errorMsg = "Could not resolve hostname: " + m_targetHost;
        qDebug() << "SipAlgChecker:" << errorMsg;
        emit progressUpdate(errorMsg);
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            errorMsg
        ));
        cancel();
        return;
    }
    
    QHostAddress targetAddress = hostInfo.addresses().first();
    qDebug() << "SipAlgChecker: Resolved" << m_targetHost << "to" << targetAddress.toString();

    qint64 written = m_socket->writeDatagram(data, targetAddress, m_targetPort);
    
    qDebug() << "SipAlgChecker: writeDatagram returned:" << written;
    
    if (written == -1) {
        QString errorMsg = m_socket ? m_socket->errorString() : "Socket error";
        qDebug() << "SipAlgChecker: Send failed:" << errorMsg;
        qDebug() << "SipAlgChecker: Socket error code:" << m_socket->error();
        emit progressUpdate("Failed to send SIP OPTIONS: " + errorMsg);
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Failed,
            "Failed to send packet: " + errorMsg
        ));
        cancel();
    } else {
        qDebug() << "SipAlgChecker: Successfully sent" << written << "bytes";
        emit progressUpdate(QString("Sent SIP OPTIONS (%1 bytes) to %2").arg(written).arg(targetAddress.toString()));
    }
}

QString SipAlgChecker::generateSipOptions(const QString &host, int port)
{
    QString callId = QString::number(QDateTime::currentMSecsSinceEpoch());
    QString branch = "z9hG4bK" + QString::number(QRandomGenerator::global()->generate());
    
    QString options = QString(
        "OPTIONS sip:%1:%2 SIP/2.0\r\n"
        "Via: SIP/2.0/UDP %3:%4;branch=%5;rport\r\n"
        "From: <sip:test@%3>;tag=test123\r\n"
        "To: <sip:%1:%2>\r\n"
        "Call-ID: %6@%3\r\n"
        "CSeq: 1 OPTIONS\r\n"
        "Contact: <sip:test@%3:%4>\r\n"
        "Max-Forwards: 70\r\n"
        "User-Agent: SIPConnectivityTester/1.0\r\n"
        "Content-Length: 0\r\n"
        "\r\n"
    ).arg(host)
     .arg(port)
     .arg(m_localAddress.toString())
     .arg(m_localPort)
     .arg(branch)
     .arg(callId);

    return options;
}

void SipAlgChecker::onReadyRead()
{
    while (m_socket && m_socket->hasPendingDatagrams()) {
        QByteArray buffer;
        buffer.resize(m_socket->pendingDatagramSize());
        
        QHostAddress sender;
        quint16 senderPort;
        
        m_socket->readDatagram(buffer.data(), buffer.size(), &sender, &senderPort);
        QString response = QString::fromUtf8(buffer);
        
        emit progressUpdate(QString("Received response from %1:%2").arg(sender.toString()).arg(senderPort));
        
        // Check if SIP ALG modified the packet
        bool algDetected = detectAlgModification(response);
        
        QString message;
        ConnectivityResult::Status status;
        
        if (algDetected) {
            status = ConnectivityResult::Failed;
            message = "SIP ALG DETECTED - Router is modifying SIP packets. This may cause connectivity issues. Recommendation: Disable SIP ALG in router settings.";
        } else {
            status = ConnectivityResult::Success;
            message = "No SIP ALG detected - SIP packets are not being modified by the router.";
        }
        
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            status,
            message
        ));
        
        cancel();
        return;
    }
}

bool SipAlgChecker::detectAlgModification(const QString &response)
{
    // Look for our original IP and port in the response
    // If the server echoes back different values, SIP ALG is active
    
    QString expectedIp = m_localAddress.toString();
    QString expectedPort = QString::number(m_localPort);
    
    // Check Via header for modifications
    QRegularExpression viaRegex("Via:\\s*SIP/2\\.0/UDP\\s+([^:;]+):(\\d+)", 
                                QRegularExpression::CaseInsensitiveOption);
    QRegularExpressionMatch viaMatch = viaRegex.match(response);
    
    if (viaMatch.hasMatch()) {
        QString receivedIp = viaMatch.captured(1);
        QString receivedPort = viaMatch.captured(2);
        
        if (receivedIp != expectedIp || receivedPort != expectedPort) {
            qDebug() << "SIP ALG detected: Via header modified";
            qDebug() << "Expected:" << expectedIp << ":" << expectedPort;
            qDebug() << "Received:" << receivedIp << ":" << receivedPort;
            return true;
        }
    }
    
    // Check Contact header for modifications
    QRegularExpression contactRegex("Contact:\\s*<sip:[^@]+@([^:>]+):(\\d+)>",
                                    QRegularExpression::CaseInsensitiveOption);
    QRegularExpressionMatch contactMatch = contactRegex.match(response);
    
    if (contactMatch.hasMatch()) {
        QString receivedIp = contactMatch.captured(1);
        QString receivedPort = contactMatch.captured(2);
        
        if (receivedIp != expectedIp || receivedPort != expectedPort) {
            qDebug() << "SIP ALG detected: Contact header modified";
            qDebug() << "Expected:" << expectedIp << ":" << expectedPort;
            qDebug() << "Received:" << receivedIp << ":" << receivedPort;
            return true;
        }
    }
    
    // Check for "received" parameter in Via header (added by some SIP ALG implementations)
    if (response.contains("received=", Qt::CaseInsensitive)) {
        QRegularExpression receivedRegex("received=([^;\\s]+)",
                                         QRegularExpression::CaseInsensitiveOption);
        QRegularExpressionMatch receivedMatch = receivedRegex.match(response);
        
        if (receivedMatch.hasMatch()) {
            QString receivedIp = receivedMatch.captured(1);
            if (receivedIp != expectedIp) {
                qDebug() << "SIP ALG detected: 'received' parameter added/modified";
                qDebug() << "Expected:" << expectedIp;
                qDebug() << "Received:" << receivedIp;
                return true;
            }
        }
    }
    
    return false;
}

void SipAlgChecker::onTimeout()
{
    if (m_retryCount < MAX_RETRIES) {
        m_retryCount++;
        emit progressUpdate(QString("Retry %1/%2...").arg(m_retryCount).arg(MAX_RETRIES));
        sendSipOptions();
        
        if (m_timer) {
            m_timer->start(5000);
        }
    } else {
        emit progressUpdate("SIP ALG check timed out");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::SIPALG,
            m_targetHost,
            m_targetPort,
            ConnectivityResult::Timeout,
            "No response received from server. Cannot determine SIP ALG status."
        ));
        cancel();
    }
}

void SipAlgChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    QString errorMsg = m_socket ? m_socket->errorString() : "Unknown socket error";
    emit progressUpdate("Socket error: " + errorMsg);
    emit connectivityChecked(ConnectivityResult(
        ConnectivityResult::SIPALG,
        m_targetHost,
        m_targetPort,
        ConnectivityResult::Failed,
        "Socket error: " + errorMsg
    ));
    cancel();
}
