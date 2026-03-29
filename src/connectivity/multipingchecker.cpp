#include "multipingchecker.h"
#include "tcpconnectivitychecker.h"
#include "udpconnectivitychecker.h"
#include "tlsconnectivitychecker.h"
#include "wssconnectivitychecker.h"
#include "rtpconnectivitychecker.h"

MultiPingChecker::MultiPingChecker(QObject *parent)
    : QObject(parent), m_totalAttempts(5), m_currentAttempt(0), 
      m_timeout(5000), m_successCount(0), m_currentChecker(nullptr)
{
}

MultiPingChecker::~MultiPingChecker()
{
    cleanup();
}

void MultiPingChecker::startTest(ConnectivityResult::Protocol protocol,
                                 const QString &host,
                                 int port,
                                 int attempts,
                                 int timeout)
{
    cleanup();
    
    m_protocol = protocol;
    m_host = host;
    m_port = port;
    m_totalAttempts = attempts;
    m_timeout = timeout;
    m_currentAttempt = 0;
    m_successCount = 0;
    m_results.clear();
    
    runNextAttempt();
}

void MultiPingChecker::cancel()
{
    cleanup();
}

void MultiPingChecker::runNextAttempt()
{
    if (m_currentAttempt >= m_totalAttempts) {
        emit testCompleted(m_successCount, m_totalAttempts, m_results);
        cleanup();
        return;
    }
    
    m_currentAttempt++;
    emit progressUpdate(m_currentAttempt, m_totalAttempts);
    
    m_currentChecker = createChecker(m_protocol);
    if (!m_currentChecker) {
        return;
    }
    
    connect(m_currentChecker, &IConnectivityChecker::connectivityChecked,
            this, &MultiPingChecker::onCheckerCompleted);
    
    m_currentChecker->checkConnectivity(m_host, m_port, m_timeout);
}

void MultiPingChecker::onCheckerCompleted(const ConnectivityResult &result)
{
    m_results.append(result);
    
    if (result.status() == ConnectivityResult::Success) {
        m_successCount++;
    }
    
    emit attemptCompleted(result);
    
    if (m_currentChecker) {
        IConnectivityChecker *checker = m_currentChecker;
        m_currentChecker = nullptr;
        checker->disconnect();
        checker->deleteLater();
    }
    
    QTimer::singleShot(100, this, &MultiPingChecker::runNextAttempt);
}

void MultiPingChecker::cleanup()
{
    if (m_currentChecker) {
        IConnectivityChecker *checker = m_currentChecker;
        m_currentChecker = nullptr;
        checker->disconnect();
        checker->cancel();
        checker->deleteLater();
    }
}

IConnectivityChecker* MultiPingChecker::createChecker(ConnectivityResult::Protocol protocol)
{
    switch (protocol) {
        case ConnectivityResult::TCP:
            return new TcpConnectivityChecker(nullptr);
        case ConnectivityResult::UDP:
            return new UdpConnectivityChecker(nullptr);
        case ConnectivityResult::TLS:
            return new TlsConnectivityChecker(nullptr);
        case ConnectivityResult::WSS:
            return new WssConnectivityChecker(nullptr);
        case ConnectivityResult::RTP:
            return new RtpConnectivityChecker(nullptr);
        default:
            return nullptr;
    }
}
