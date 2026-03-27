#include "connectivitymanager.h"
#include "tcpconnectivitychecker.h"
#include "udpconnectivitychecker.h"
#include "tlsconnectivitychecker.h"
#include "wssconnectivitychecker.h"
#include "rtpconnectivitychecker.h"
#include "sipalgchecker.h"

ConnectivityManager::ConnectivityManager(QObject *parent)
    : QObject(parent), m_currentChecker(nullptr), m_isRunning(false), m_timeout(5000)
{
}

ConnectivityManager::~ConnectivityManager()
{
    cleanup();
}

void ConnectivityManager::runAllTests(const ServerConfig &config)
{
    if (m_isRunning) {
        return;
    }

    cleanup();
    m_results.clear();
    m_testQueue.clear();
    m_isRunning = true;
    m_timeout = config.timeout();

    for (int port : config.tcpPorts()) {
        TestTask task;
        task.name = QString("TCP:%1:%2").arg(config.host()).arg(port);
        task.checker = new TcpConnectivityChecker(this);
        task.host = config.host();
        task.port = port;
        m_testQueue.enqueue(task);
    }

    for (int port : config.udpPorts()) {
        TestTask task;
        task.name = QString("UDP:%1:%2").arg(config.host()).arg(port);
        task.checker = new UdpConnectivityChecker(this);
        task.host = config.host();
        task.port = port;
        m_testQueue.enqueue(task);
    }

    if (config.tlsPort() > 0) {
        TestTask task;
        task.name = QString("TLS:%1:%2").arg(config.host()).arg(config.tlsPort());
        task.checker = new TlsConnectivityChecker(this);
        task.host = config.host();
        task.port = config.tlsPort();
        m_testQueue.enqueue(task);
    }

    if (config.wssPort() > 0) {
        TestTask task;
        task.name = QString("WSS:%1:%2").arg(config.host()).arg(config.wssPort());
        task.checker = new WssConnectivityChecker(this);
        task.host = config.host();
        task.port = config.wssPort();
        m_testQueue.enqueue(task);
    }

    for (int port : config.rtpPorts()) {
        TestTask task;
        task.name = QString("RTP:%1:%2").arg(config.host()).arg(port);
        task.checker = new RtpConnectivityChecker(this);
        task.host = config.host();
        task.port = port;
        m_testQueue.enqueue(task);
    }

    emit progressUpdate(QString("Starting connectivity tests (%1 tests queued)").arg(m_testQueue.size()));
    runNextTest();
}

void ConnectivityManager::cancelTests()
{
    if (m_currentChecker) {
        m_currentChecker->cancel();
    }
    
    cleanup();
    emit progressUpdate("Tests cancelled by user");
}

void ConnectivityManager::runNextTest()
{
    if (m_testQueue.isEmpty()) {
        m_isRunning = false;
        emit progressUpdate(QString("All tests completed. Results: %1 total").arg(m_results.size()));
        emit allTestsCompleted(m_results);
        return;
    }

    TestTask task = m_testQueue.dequeue();
    m_currentChecker = task.checker;

    connect(m_currentChecker, &IConnectivityChecker::connectivityChecked,
            this, &ConnectivityManager::onTestCompleted);
    connect(m_currentChecker, &IConnectivityChecker::progressUpdate,
            this, &ConnectivityManager::onProgressUpdate);

    emit testStarted(task.name);
    m_currentChecker->checkConnectivity(task.host, task.port, m_timeout);
}

void ConnectivityManager::onTestCompleted(const ConnectivityResult &result)
{
    m_results.append(result);
    emit testCompleted(result);

    if (m_currentChecker) {
        m_currentChecker->deleteLater();
        m_currentChecker = nullptr;
    }

    runNextTest();
}

void ConnectivityManager::onProgressUpdate(const QString &message)
{
    emit progressUpdate(message);
}

void ConnectivityManager::cleanup()
{
    m_isRunning = false;
    m_testQueue.clear();

    if (m_currentChecker) {
        m_currentChecker->deleteLater();
        m_currentChecker = nullptr;
    }
}
