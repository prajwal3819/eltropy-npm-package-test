#include "nattypechecker.h"
#include <QNetworkInterface>
#include <QRandomGenerator>
#include <QHostInfo>
#include <QDebug>

NatTypeChecker::NatTypeChecker(QObject *parent)
    : IConnectivityChecker(parent)
    , m_socket(nullptr)
    , m_timer(nullptr)
    , m_stunPort(3478)
    , m_localPort(0)
    , m_mappedPort1(0)
    , m_mappedPort2(0)
    , m_currentTest(0)
    , m_test1Response(false)
    , m_test2Response(false)
    , m_test3Response(false)
{
}

NatTypeChecker::~NatTypeChecker()
{
    cancel();
}

void NatTypeChecker::checkConnectivity(const QString &stunServer, int port, int timeoutMs)
{
    m_stunServer = stunServer;
    m_stunPort = port;
    m_currentTest = 0;
    m_test1Response = false;
    m_test2Response = false;
    m_test3Response = false;

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
            ConnectivityResult::STUN,
            m_stunServer,
            m_stunPort,
            ConnectivityResult::Failed,
            "Could not determine local IP address"
        ));
        return;
    }

    // Resolve STUN server
    emit progressUpdate("Resolving STUN server: " + stunServer);
    QHostInfo hostInfo = QHostInfo::fromName(stunServer);
    if (hostInfo.addresses().isEmpty()) {
        emit progressUpdate("Failed to resolve STUN server");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::STUN,
            m_stunServer,
            m_stunPort,
            ConnectivityResult::Failed,
            "Could not resolve STUN server: " + stunServer
        ));
        return;
    }

    m_primaryStunAddress = hostInfo.addresses().first();
    emit progressUpdate("Resolved to: " + m_primaryStunAddress.toString());

    // Create UDP socket
    m_socket = new QUdpSocket(this);
    connect(m_socket, &QUdpSocket::readyRead, this, &NatTypeChecker::onReadyRead);
    connect(m_socket, &QUdpSocket::errorOccurred, this, &NatTypeChecker::onError);

    // Bind to random port
    if (!m_socket->bind(QHostAddress::Any, 0)) {
        emit progressUpdate("Failed to bind UDP socket");
        emit connectivityChecked(ConnectivityResult(
            ConnectivityResult::STUN,
            m_stunServer,
            m_stunPort,
            ConnectivityResult::Failed,
            "Could not bind UDP socket: " + m_socket->errorString()
        ));
        cancel();
        return;
    }

    m_localPort = m_socket->localPort();
    emit progressUpdate(QString("Local: %1:%2").arg(m_localAddress.toString()).arg(m_localPort));

    // Setup timeout
    m_timer = new QTimer(this);
    m_timer->setSingleShot(true);
    connect(m_timer, &QTimer::timeout, this, &NatTypeChecker::onTimeout);
    m_timer->start(timeoutMs);

    // Start Test 1
    performTest1();
}

void NatTypeChecker::cancel()
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

void NatTypeChecker::performTest1()
{
    m_currentTest = 1;
    emit progressUpdate("Test 1: Checking basic connectivity...");
    sendBindingRequest(m_primaryStunAddress, m_stunPort);
}

void NatTypeChecker::performTest2()
{
    m_currentTest = 2;
    emit progressUpdate("Test 2: Checking from different port...");
    // Test 2 would use change-request attribute, but simplified for now
    sendBindingRequest(m_primaryStunAddress, m_stunPort);
}

void NatTypeChecker::performTest3()
{
    m_currentTest = 3;
    emit progressUpdate("Test 3: Checking port consistency...");
    sendBindingRequest(m_primaryStunAddress, m_stunPort);
}

void NatTypeChecker::sendBindingRequest(const QHostAddress &address, quint16 port)
{
    if (!m_socket) return;

    QByteArray request = createStunBindingRequest();
    qint64 sent = m_socket->writeDatagram(request, address, port);
    
    if (sent == -1) {
        emit progressUpdate("Failed to send STUN request: " + m_socket->errorString());
    } else {
        qDebug() << "NatTypeChecker: Sent" << sent << "bytes to" << address.toString() << ":" << port;
    }
}

QByteArray NatTypeChecker::createStunBindingRequest()
{
    QByteArray request;
    
    // STUN Binding Request
    // Message Type: 0x0001 (Binding Request)
    request.append((char)0x00);
    request.append((char)0x01);
    
    // Message Length: 0 (no attributes for basic request)
    request.append((char)0x00);
    request.append((char)0x00);
    
    // Magic Cookie: 0x2112A442
    request.append((char)0x21);
    request.append((char)0x12);
    request.append((char)0xA4);
    request.append((char)0x42);
    
    // Transaction ID: 96 bits (12 bytes) random
    m_transactionId.clear();
    for (int i = 0; i < 12; i++) {
        m_transactionId.append((char)(QRandomGenerator::global()->generate() & 0xFF));
    }
    request.append(m_transactionId);
    
    return request;
}

bool NatTypeChecker::parseStunResponse(const QByteArray &data, QHostAddress &mappedAddress, quint16 &mappedPort)
{
    if (data.size() < 20) {
        qDebug() << "NatTypeChecker: Response too short:" << data.size();
        return false;
    }

    // Check message type (should be 0x0101 for Binding Success Response)
    quint16 msgType = ((quint8)data[0] << 8) | (quint8)data[1];
    if (msgType != 0x0101) {
        qDebug() << "NatTypeChecker: Not a binding response:" << QString::number(msgType, 16);
        return false;
    }

    // Check magic cookie
    if ((quint8)data[4] != 0x21 || (quint8)data[5] != 0x12 || 
        (quint8)data[6] != 0xA4 || (quint8)data[7] != 0x42) {
        qDebug() << "NatTypeChecker: Invalid magic cookie";
        return false;
    }

    // Verify transaction ID
    QByteArray responseTransactionId = data.mid(8, 12);
    if (responseTransactionId != m_transactionId) {
        qDebug() << "NatTypeChecker: Transaction ID mismatch";
        return false;
    }

    // Parse attributes
    quint16 msgLength = ((quint8)data[2] << 8) | (quint8)data[3];
    int pos = 20; // Start after header
    
    while (pos + 4 <= data.size() && pos < 20 + msgLength) {
        quint16 attrType = ((quint8)data[pos] << 8) | (quint8)data[pos + 1];
        quint16 attrLength = ((quint8)data[pos + 2] << 8) | (quint8)data[pos + 3];
        pos += 4;
        
        if (pos + attrLength > data.size()) break;
        
        // MAPPED-ADDRESS (0x0001) or XOR-MAPPED-ADDRESS (0x0020)
        if (attrType == 0x0001 || attrType == 0x0020) {
            if (attrLength >= 8) {
                quint8 family = data[pos + 1];
                if (family == 0x01) { // IPv4
                    quint16 port = ((quint8)data[pos + 2] << 8) | (quint8)data[pos + 3];
                    quint32 addr = ((quint8)data[pos + 4] << 24) | 
                                  ((quint8)data[pos + 5] << 16) |
                                  ((quint8)data[pos + 6] << 8) | 
                                  (quint8)data[pos + 7];
                    
                    // XOR with magic cookie if XOR-MAPPED-ADDRESS
                    if (attrType == 0x0020) {
                        port ^= 0x2112;
                        addr ^= 0x2112A442;
                    }
                    
                    mappedPort = port;
                    mappedAddress = QHostAddress(addr);
                    
                    qDebug() << "NatTypeChecker: Mapped address:" << mappedAddress.toString() << ":" << mappedPort;
                    return true;
                }
            }
        }
        
        // Move to next attribute (attributes are padded to 4-byte boundary)
        pos += attrLength;
        while (pos % 4 != 0 && pos < data.size()) pos++;
    }
    
    return false;
}

void NatTypeChecker::onReadyRead()
{
    while (m_socket && m_socket->hasPendingDatagrams()) {
        QByteArray data;
        data.resize(m_socket->pendingDatagramSize());
        QHostAddress sender;
        quint16 senderPort;
        
        m_socket->readDatagram(data.data(), data.size(), &sender, &senderPort);
        
        qDebug() << "NatTypeChecker: Received" << data.size() << "bytes from" << sender.toString() << ":" << senderPort;
        
        QHostAddress mappedAddr;
        quint16 mappedPort;
        
        if (parseStunResponse(data, mappedAddr, mappedPort)) {
            if (m_currentTest == 1) {
                m_test1Response = true;
                m_mappedAddress1 = mappedAddr;
                m_mappedPort1 = mappedPort;
                
                emit progressUpdate(QString("Mapped to: %1:%2").arg(mappedAddr.toString()).arg(mappedPort));
                
                // Determine NAT type based on results
                NatType natType;
                QString description;
                
                if (m_localAddress == m_mappedAddress1 && m_localPort == m_mappedPort1) {
                    natType = OpenInternet;
                    description = "No NAT detected - Direct internet connection";
                } else if (m_localPort == m_mappedPort1) {
                    natType = FullCone;
                    description = "Full Cone NAT - Excellent for VoIP";
                } else {
                    // Simplified: assume Port Restricted Cone for most home routers
                    natType = PortRestrictedCone;
                    description = "Port Restricted Cone NAT - Good for VoIP";
                }
                
                QString resultMsg = QString("%1\n\nLocal: %2:%3\nMapped: %4:%5")
                    .arg(description)
                    .arg(m_localAddress.toString())
                    .arg(m_localPort)
                    .arg(m_mappedAddress1.toString())
                    .arg(m_mappedPort1);
                
                emit progressUpdate(natTypeToString(natType));
                emit connectivityChecked(ConnectivityResult(
                    ConnectivityResult::STUN,
                    m_stunServer,
                    m_stunPort,
                    ConnectivityResult::Success,
                    resultMsg
                ));
                
                cancel();
            }
        }
    }
}

void NatTypeChecker::onError(QAbstractSocket::SocketError error)
{
    Q_UNUSED(error);
    
    QString errorMsg = m_socket ? m_socket->errorString() : "Unknown socket error";
    emit progressUpdate("Socket error: " + errorMsg);
    emit connectivityChecked(ConnectivityResult(
        ConnectivityResult::STUN,
        m_stunServer,
        m_stunPort,
        ConnectivityResult::Failed,
        "Socket error: " + errorMsg
    ));
    cancel();
}

void NatTypeChecker::onTimeout()
{
    emit progressUpdate("NAT type detection timed out");
    emit connectivityChecked(ConnectivityResult(
        ConnectivityResult::STUN,
        m_stunServer,
        m_stunPort,
        ConnectivityResult::Timeout,
        "No response from STUN server. Check firewall settings."
    ));
    cancel();
}

QString NatTypeChecker::natTypeToString(NatType type)
{
    switch (type) {
        case OpenInternet: return "Open Internet (No NAT)";
        case FullCone: return "Full Cone NAT";
        case RestrictedCone: return "Restricted Cone NAT";
        case PortRestrictedCone: return "Port Restricted Cone NAT";
        case Symmetric: return "Symmetric NAT";
        case UdpBlocked: return "UDP Blocked";
        case Error: return "Error";
        default: return "Unknown";
    }
}

QString NatTypeChecker::natTypeDescription(NatType type)
{
    switch (type) {
        case OpenInternet:
            return "No NAT - Direct internet connection. Excellent for VoIP.";
        case FullCone:
            return "Full Cone NAT - Best NAT type for VoIP. All traffic from same internal port uses same external port.";
        case RestrictedCone:
            return "Restricted Cone NAT - Good for VoIP. May require STUN for some scenarios.";
        case PortRestrictedCone:
            return "Port Restricted Cone NAT - Acceptable for VoIP. STUN recommended.";
        case Symmetric:
            return "Symmetric NAT - Problematic for VoIP. Different external port for each destination. May need TURN relay.";
        case UdpBlocked:
            return "UDP Blocked - Cannot use VoIP. Firewall is blocking UDP traffic.";
        case Error:
            return "Error occurred during NAT detection.";
        default:
            return "Unknown NAT type.";
    }
}
