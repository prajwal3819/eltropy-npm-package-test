#include "mainwindow.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGridLayout>
#include <QPushButton>
#include <QLabel>
#include <QTextEdit>
#include <QScrollArea>
#include <QFrame>
#include <QTimer>
#include <QDateTime>
#include <QGroupBox>
#include <QDateTime>
#include <QTabWidget>
#include <QStatusBar>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent), 
      m_currentTestIndex(0), 
      m_testingAll(false),
      m_testingAllSip(false),
      m_currentSipTestIndex(0)
{
    // Hardcoded SIP credentials
    m_sipUsername = "7001";
    m_sipPassword = "7001";
    m_sipDomain = "fusionpbx-api.eltropy.com";
    m_sipProxy = "voip.eltropy.com";
    
    m_multiPingChecker = new MultiPingChecker(this);
    m_sipManager = new SipRegistrationManager(this);
    m_networkInfoManager = new NetworkInfoManager(this);
    m_callManager = new SipCallManager(this);
    
    m_sipExpiryTimer = new QTimer(this);
    m_sipExpiryTimer->setInterval(1000);
    connect(m_sipExpiryTimer, &QTimer::timeout, this, &MainWindow::updateSipTimers);
    m_sipExpiryTimer->start();
    setupUI();
    setupConnections();
    
    setWindowTitle("SIP Connectivity Tester - Eltropy VoIP V1.0.1");
    resize(1000, 700);
}

MainWindow::~MainWindow()
{
}

void MainWindow::setupUI()
{
    QWidget *centralWidget = new QWidget(this);
    setCentralWidget(centralWidget);
    
    QVBoxLayout *mainLayout = new QVBoxLayout(centralWidget);
    mainLayout->setSpacing(0);
    mainLayout->setContentsMargins(0, 0, 0, 0);
    
    // Header Section - at the very top
    QWidget *headerWidget = new QWidget();
    headerWidget->setStyleSheet("QWidget { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, "
                                "stop:0 #667eea, stop:1 #764ba2); "
                                "padding: 20px; }");
    QVBoxLayout *headerLayout = new QVBoxLayout(headerWidget);
    
    QLabel *titleLabel = new QLabel("📞 Eltropy VoIP Diagnostic Tool");
    QFont titleFont;
    titleFont.setPointSize(24);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: white;");
    titleLabel->setAlignment(Qt::AlignCenter);
    
    QLabel *subtitleLabel = new QLabel("🔍 Test your connectivity with Eltropy VoIP Systems");
    QFont subtitleFont;
    subtitleFont.setPointSize(14);
    subtitleLabel->setFont(subtitleFont);
    subtitleLabel->setStyleSheet("color: rgba(255, 255, 255, 0.9);");
    subtitleLabel->setAlignment(Qt::AlignCenter);
    
    headerLayout->addWidget(titleLabel);
    headerLayout->addWidget(subtitleLabel);
    
    mainLayout->addWidget(headerWidget);
    
    // Tab Widget below header
    QTabWidget *tabWidget = new QTabWidget();
    tabWidget->setStyleSheet("QTabWidget::pane { border: none; background: #f5f7fa; }"
                            "QTabBar::tab { background: #ecf0f1; color: #2c3e50; padding: 10px 20px; "
                            "border-top-left-radius: 5px; border-top-right-radius: 5px; margin-right: 2px; }"
                            "QTabBar::tab:selected { background: #3498DB; color: white; font-weight: bold; }");
    
    mainLayout->addWidget(tabWidget);
    
    // Tab 1: Connectivity Tests
    QWidget *connectivityTab = new QWidget();
    QVBoxLayout *connLayout = new QVBoxLayout(connectivityTab);
    connectivityTab->setStyleSheet("QWidget { background-color: black; }");
    connLayout->setSpacing(15);
    connLayout->setContentsMargins(20, 20, 20, 20);
    
    QPushButton *testAllButton = new QPushButton("🚀 Test All Connectivity", this);
    testAllButton->setStyleSheet("QPushButton { "
                                 "background-color: #3498DB; "
                                 "color: white; "
                                 "font-weight: bold; "
                                 "padding: 10px; "
                                 "border-radius: 5px; "
                                 "font-size: 14pt; "
                                 "}"
                                 "QPushButton:hover { background-color: #2980B9; }"
                                 "QPushButton:disabled { background-color: #BDC3C7; }");
    testAllButton->setFixedHeight(50);
    connect(testAllButton, &QPushButton::clicked, this, &MainWindow::onTestAllClicked);
    connLayout->addWidget(testAllButton);
    
    QScrollArea *scrollArea = new QScrollArea();
    scrollArea->setWidgetResizable(true);
    scrollArea->setFrameShape(QFrame::NoFrame);
    scrollArea->setStyleSheet("QScrollArea { background-color: #f5f7fa; border: none; }");
    
    QWidget *scrollContent = new QWidget();
    QGridLayout *gridLayout = new QGridLayout(scrollContent);
    gridLayout->setSpacing(15);
    gridLayout->setContentsMargins(10, 10, 10, 10);
    
    QString host = "voip.eltropy.com";
    
    int row = 0, col = 0;
    auto createBlock = [&](const QString &emoji, const QString &title, const QString &description, ConnectivityResult::Protocol protocol, int port) {
        ConnectivityTestBlock *block = new ConnectivityTestBlock(emoji, title, description, protocol, host, port, scrollContent);
        QString key = getBlockKey(protocol, host, port);
        m_testBlocks[key] = block;
        gridLayout->addWidget(block, row, col);
        col++;
        if (col >= 2) {
            col = 0;
            row++;
        }
        return block;
    };
    
    createBlock("🔌", "TCP Port 5060", "Standard SIP signaling to voip.eltropy.com over TCP", ConnectivityResult::TCP, 5060);
    createBlock("📡", "UDP Port 5060", "Standard SIP signaling to voip.eltropy.com over UDP", ConnectivityResult::UDP, 5060);
    createBlock("🔌", "TCP Port 5080", "Alternative SIP signaling to voip.eltropy.com over TCP", ConnectivityResult::TCP, 5080);
    createBlock("📡", "UDP Port 5080", "Alternative SIP signaling to voip.eltropy.com over UDP", ConnectivityResult::UDP, 5080);
    createBlock("🌐", "WSS Port 443", "WebSocket Secure for web-based calls to voip.eltropy.com", ConnectivityResult::WSS, 443);
    createBlock("🎙️", "RTP UDP Ports", "Real-time audio/video streaming ", ConnectivityResult::RTP, 10000);
    
    if (col != 0) {
        gridLayout->setColumnStretch(col, 1);
    }
    scrollArea->setWidget(scrollContent);
    connLayout->addWidget(scrollArea);
    tabWidget->addTab(connectivityTab, "🔌 Connectivity Tests");
    
    // Tab 2: Network Test
    // QWidget *networkTab = new QWidget();
    // QVBoxLayout *networkLayout = new QVBoxLayout(networkTab);
    // networkLayout->setSpacing(15);
    // networkLayout->setContentsMargins(20, 20, 20, 20);
    
    // QLabel *networkTitle = new QLabel("🌐 Network Diagnostics");
    // QFont networkTitleFont;
    // networkTitleFont.setPointSize(18);
    // networkTitleFont.setBold(true);
    // networkTitle->setFont(networkTitleFont);
    // networkTitle->setStyleSheet("color: #2c3e50; margin-bottom: 10px;");
    // networkLayout->addWidget(networkTitle);
    
    // QWidget *networkInfoWidget = new QWidget();
    // networkInfoWidget->setStyleSheet("background: white; border: 2px solid #e8eaf6; border-radius: 10px; padding: 20px;");
    // QVBoxLayout *networkInfoLayout = new QVBoxLayout(networkInfoWidget);
    
    // QLabel *ipLabel = new QLabel("📍 <b>Local IP Address:</b> Detecting...");
    // ipLabel->setStyleSheet("font-size: 12pt; color: #34495e; margin: 5px;");
    // QLabel *dnsLabel = new QLabel("🔍 <b>DNS Server:</b> Detecting...");
    // dnsLabel->setStyleSheet("font-size: 12pt; color: #34495e; margin: 5px;");
    // QLabel *gatewayLabel = new QLabel("🚪 <b>Default Gateway:</b> Detecting...");
    // gatewayLabel->setStyleSheet("font-size: 12pt; color: #34495e; margin: 5px;");
    // QLabel *latencyLabel = new QLabel("⏱️ <b>Network Latency:</b> Testing...");
    // latencyLabel->setStyleSheet("font-size: 12pt; color: #34495e; margin: 5px;");
    
    // networkInfoLayout->addWidget(ipLabel);
    // networkInfoLayout->addWidget(dnsLabel);
    // networkInfoLayout->addWidget(gatewayLabel);
    // networkInfoLayout->addWidget(latencyLabel);
    // networkLayout->addWidget(networkInfoWidget);
    // networkLayout->addStretch();
    // tabWidget->addTab(networkTab, "🌐 Network Test");
    
    // Tab 3: SIP Registration
    QWidget *sipRegTab = new QWidget();
    QVBoxLayout *sipRegLayout = new QVBoxLayout(sipRegTab);
    sipRegTab->setStyleSheet("QWidget { background-color: black; }");
    sipRegLayout->setSpacing(15);
    sipRegLayout->setContentsMargins(20, 20, 20, 20);
    
    // Test All Button and Timeout Setting
    QHBoxLayout *sipHeaderLayout = new QHBoxLayout();
    
    QPushButton *sipTestAllButton = new QPushButton("� Test All SIP Registration", this);
    sipTestAllButton->setStyleSheet("QPushButton { "
                                    "background-color: #3498DB; "
                                    "color: white; "
                                    "font-weight: bold; "
                                    "padding: 10px; "
                                    "border-radius: 5px; "
                                    "border: none; "
                                    "}"
                                    "QPushButton:hover { background-color: #2980B9; }");
    connect(sipTestAllButton, &QPushButton::clicked, this, &MainWindow::onSipTestAllClicked);
    sipHeaderLayout->addWidget(sipTestAllButton);
    
    sipHeaderLayout->addSpacing(20);
    
    QLabel *timeoutLabel = new QLabel("Registration Timeout (sec):");
    timeoutLabel->setStyleSheet("font-weight: bold; color: #2c3e50; font-size: 11pt;");
    sipHeaderLayout->addWidget(timeoutLabel);
    
    m_sipTimeout = new QSpinBox();
    m_sipTimeout->setRange(60, 3600);
    m_sipTimeout->setValue(60);
    m_sipTimeout->setStyleSheet("padding: 8px; border: 2px solid #bdc3c7; border-radius: 4px; "
                                 "background: white; color: #2c3e50; font-size: 11pt;");
    m_sipTimeout->setFixedWidth(100);
    sipHeaderLayout->addWidget(m_sipTimeout);
    
    sipHeaderLayout->addStretch();
    sipRegLayout->addLayout(sipHeaderLayout);
    
    // Scroll area for registration blocks
    QScrollArea *sipScrollArea = new QScrollArea();
    sipScrollArea->setWidgetResizable(true);
    sipScrollArea->setStyleSheet("QScrollArea { border: none; background: #f5f7fa; }");
    
    QWidget *sipScrollWidget = new QWidget();
    QVBoxLayout *sipBlocksLayout = new QVBoxLayout(sipScrollWidget);
    sipBlocksLayout->setSpacing(10);
    sipBlocksLayout->setContentsMargins(0, 0, 0, 0);
    
    // Create registration blocks for each transport/port combination
    struct SipTestConfig {
        QString transport;
        int port;
        SipTransportType type;
    };
    
    QList<SipTestConfig> sipConfigs = {
        {"TCP", 5060, SipTransportType::TCP},
        {"UDP", 5060, SipTransportType::UDP},
        {"TCP", 5080, SipTransportType::TCP},
        {"UDP", 5080, SipTransportType::UDP},
        {"TLS", 5061, SipTransportType::TLS},
        {"WSS", 443, SipTransportType::WSS}
    };
    
    for (const auto &config : sipConfigs) {
        SipRegistrationBlock *block = new SipRegistrationBlock(
            config.transport,
            m_sipProxy,
            config.port,
            config.type,
            this
        );
        
        QString key = getSipBlockKey(config.type, m_sipProxy, config.port);
        m_sipBlocks[key] = block;
        
        connect(block, &SipRegistrationBlock::testRequested,
                this, &MainWindow::onSipBlockRequested);
        
        sipBlocksLayout->addWidget(block);
    }
    
    sipScrollArea->setWidget(sipScrollWidget);
    sipRegLayout->addWidget(sipScrollArea);
    
    // Create network info tab
    createNetworkInfoTab();
    
    // Create call testing tab
    createCallTestTab();
    createAdvancedChecksTab();
    createVoIPQualityTab();
    
    // Add all tabs to the tab widget
    tabWidget->addTab(connectivityTab, "📡 Connectivity Tests");
    tabWidget->addTab(sipRegTab, "📞 SIP Registration");
    tabWidget->addTab(m_callTestWidget, "☎️ Call Testing");
    tabWidget->addTab(m_networkInfoWidget, "🌐 Network Info");
    tabWidget->addTab(m_advancedChecksWidget, "🔬 Advanced Checks");
    tabWidget->addTab(m_voipQualityWidget, "📊 VoIP Quality");
    
    // Set initial tab
    tabWidget->setCurrentIndex(0);
    
    // Logs section at bottom
    QWidget *logsHeaderWidget = new QWidget();
    QHBoxLayout *logsHeaderLayout = new QHBoxLayout(logsHeaderWidget);
    logsHeaderLayout->setContentsMargins(10, 5, 10, 5);
    
    QLabel *logsLabel = new QLabel("📋 Logs");
    logsLabel->setStyleSheet("font-size: 14pt; font-weight: bold; color: #2c3e50;");
    logsHeaderLayout->addWidget(logsLabel);
    
    QPushButton *clearLogsBtn = new QPushButton("🗑️ Clear Logs");
    clearLogsBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #e74c3c; "
        "color: white; "
        "border: none; "
        "border-radius: 5px; "
        "padding: 8px 15px; "
        "font-weight: bold; "
        "}"
        "QPushButton:hover { background-color: #c0392b; }"
    );
    connect(clearLogsBtn, &QPushButton::clicked, [this]() {
        m_logsTextEdit->clear();
        addLog("Logs cleared", "INFO");
    });
    logsHeaderLayout->addWidget(clearLogsBtn);
    logsHeaderLayout->addStretch();
    
    mainLayout->addWidget(logsHeaderWidget);
    
    m_logsTextEdit = new QTextEdit();
    m_logsTextEdit->setReadOnly(true);
    m_logsTextEdit->setStyleSheet(
        "QTextEdit { "
        "background-color: #1e1e1e; "
        "color: #d4d4d4; "
        "border: 2px solid #3e3e42; "
        "border-radius: 8px; "
        "padding: 10px; "
        "font-family: 'Courier New', monospace; "
        "font-size: 11pt; "
        "}"
    );
    m_logsTextEdit->setMinimumHeight(200);
    m_logsTextEdit->setMaximumHeight(300);
    mainLayout->addWidget(m_logsTextEdit);
    
    addLog("Application started - Ready for testing", "SUCCESS");
    statusBar()->showMessage("Ready");
}

void MainWindow::setupConnections()
{
    for (ConnectivityTestBlock *block : m_testBlocks.values()) {
        connect(block, &ConnectivityTestBlock::testRequested,
                this, &MainWindow::onTestBlockRequested);
    }
    
    connect(m_multiPingChecker, &MultiPingChecker::progressUpdate,
            this, &MainWindow::onMultiPingProgress);
    connect(m_multiPingChecker, &MultiPingChecker::testCompleted,
            this, &MainWindow::onMultiPingCompleted);
    connect(m_multiPingChecker, &MultiPingChecker::attemptCompleted,
            this, &MainWindow::onMultiPingAttemptCompleted);
    
    // SIP Registration connections
    for (SipRegistrationBlock *block : m_sipBlocks.values()) {
        connect(block, &SipRegistrationBlock::testRequested,
                this, &MainWindow::onSipBlockRequested);
        connect(block, &SipRegistrationBlock::unregisterRequested,
                this, &MainWindow::onSipUnregisterRequested);
    }
    
    connect(m_sipManager, &SipRegistrationManager::registrationStarted,
            this, &MainWindow::onSipRegistrationStarted);
    connect(m_sipManager, &SipRegistrationManager::registrationSucceeded,
            this, &MainWindow::onSipRegistrationSucceeded);
    connect(m_sipManager, &SipRegistrationManager::registrationFailed,
            this, &MainWindow::onSipRegistrationFailed);
    connect(m_sipManager, &SipRegistrationManager::unregistered,
            this, &MainWindow::onSipUnregistered);
    connect(m_sipManager, &SipRegistrationManager::statusChanged,
            this, &MainWindow::onSipStatusChanged);
    
    // Network info connections
    connect(m_networkInfoManager, &NetworkInfoManager::networkInfoUpdated,
            this, &MainWindow::onNetworkInfoUpdated);
    connect(m_networkInfoManager, &NetworkInfoManager::gatewayLatencyMeasured,
            this, &MainWindow::onGatewayLatencyMeasured);
    connect(m_networkInfoManager, &NetworkInfoManager::publicIpDiscovered,
            this, &MainWindow::onPublicIpDiscovered);
    
    // Refresh network info after UI is fully initialized
    QTimer::singleShot(100, m_networkInfoManager, &NetworkInfoManager::refreshNetworkInfo);
    
    // Call testing connections
    connect(m_callManager, &SipCallManager::registrationStatusChanged, this, &MainWindow::onCallRegistrationStatusChanged);
    connect(m_callManager, &SipCallManager::callStateChanged, this, &MainWindow::onCallStateChanged);
    connect(m_callManager, &SipCallManager::sipPacketLogged, this, &MainWindow::onSipPacketLogged);
    connect(m_callManager, &SipCallManager::errorOccurred,
            this, [this](const QString &error) {
                addLog("⚠️ " + error, "ERROR");
            });
}

void MainWindow::onTestAllClicked()
{
    m_testQueue.clear();
    m_currentTestIndex = 0;
    m_testingAll = true;
    
    addLog("========================================", "INFO");
    addLog("Starting comprehensive connectivity test suite", "TEST");
    addLog(QString("Total tests to run: %1").arg(m_testBlocks.size()), "INFO");
    
    for (ConnectivityTestBlock *block : m_testBlocks.values()) {
        block->reset();
        m_testQueue.append(qMakePair(block->protocol(), 
                                     qMakePair(block->host(), block->port())));
    }
    
    statusBar()->showMessage("Starting all tests...");
    testNextBlock();
}

void MainWindow::onTestBlockRequested(ConnectivityResult::Protocol protocol, 
                                      const QString &host, int port)
{
    m_testingAll = false;
    
    QString protocolName = (protocol == ConnectivityResult::TCP ? "TCP" :
                           protocol == ConnectivityResult::UDP ? "UDP" :
                           protocol == ConnectivityResult::TLS ? "TLS" :
                           protocol == ConnectivityResult::WSS ? "WSS" : "RTP");
    
    addLog("========================================", "INFO");
    addLog(QString("Starting individual test: %1 %2:%3").arg(protocolName).arg(host).arg(port), "TEST");
    
    QString key = getBlockKey(protocol, host, port);
    m_currentTestKey = key;
    ConnectivityTestBlock *block = m_testBlocks.value(key);
    
    if (block) {
        block->reset();
        block->setStatus(ConnectivityTestBlock::Testing);
        statusBar()->showMessage(QString("Testing %1:%2...").arg(host).arg(port));
        m_multiPingChecker->startTest(protocol, host, port, 5, 5000);
    }
}

void MainWindow::onMultiPingProgress(int current, int total)
{
    if (m_testingAll && m_currentTestIndex < m_testQueue.size()) {
        auto testInfo = m_testQueue[m_currentTestIndex];
        QString key = getBlockKey(testInfo.first, testInfo.second.first, testInfo.second.second);
        ConnectivityTestBlock *block = m_testBlocks.value(key);
        if (block) {
            block->setProgress(current, total);
        }
    } else if (!m_testingAll && !m_currentTestKey.isEmpty()) {
        ConnectivityTestBlock *block = m_testBlocks.value(m_currentTestKey);
        if (block) {
            block->setProgress(current, total);
        }
    }
}

void MainWindow::onMultiPingCompleted(int successCount, int totalAttempts, 
                                      const QList<ConnectivityResult> &results)
{
    ConnectivityTestBlock::TestStatus status;
    QString details;
    QString logLevel;
    
    if (successCount == totalAttempts) {
        status = ConnectivityTestBlock::AllSuccess;
        details = QString("✓ All %1 attempts successful").arg(totalAttempts);
        logLevel = "SUCCESS";
        addLog(QString("Test passed: %1/%2 attempts successful").arg(successCount).arg(totalAttempts), logLevel);
    } else if (successCount > 0) {
        status = ConnectivityTestBlock::PartialSuccess;
        details = QString("⚠ %1/%2 attempts successful").arg(successCount).arg(totalAttempts);
        logLevel = "WARNING";
        addLog(QString("Test partially successful: %1/%2 attempts passed").arg(successCount).arg(totalAttempts), logLevel);
    } else {
        status = ConnectivityTestBlock::AllFailed;
        details = QString("✗ All %1 attempts failed").arg(totalAttempts);
        logLevel = "ERROR";
        addLog(QString("Test failed: 0/%1 attempts successful").arg(totalAttempts), logLevel);
    }
    
    if (!results.isEmpty()) {
        qint64 totalTime = 0;
        int validTimes = 0;
        for (const ConnectivityResult &result : results) {
            if (result.status() == ConnectivityResult::Success && result.responseTime() > 0) {
                totalTime += result.responseTime();
                validTimes++;
            }
        }
        if (validTimes > 0) {
            qint64 avgTime = totalTime / validTimes;
            details += QString(" | Avg: %1ms").arg(avgTime);
            addLog(QString("Average response time: %1ms").arg(avgTime), "INFO");
        }
        
        if (successCount < totalAttempts && successCount > 0) {
            details += "\nSome attempts failed - possible network instability";
            addLog("Network instability detected - some attempts failed", "WARNING");
        }
    }
    
    if (m_testingAll && m_currentTestIndex < m_testQueue.size()) {
        auto testInfo = m_testQueue[m_currentTestIndex];
        QString key = getBlockKey(testInfo.first, testInfo.second.first, testInfo.second.second);
        ConnectivityTestBlock *block = m_testBlocks.value(key);
        if (block) {
            block->setStatus(status);
            block->setDetails(details);
        }
        
        m_currentTestIndex++;
        
        if (m_currentTestIndex < m_testQueue.size()) {
            QTimer::singleShot(200, this, &MainWindow::testNextBlock);
        } else {
            addLog("========================================", "INFO");
            addLog("All connectivity tests completed!", "SUCCESS");
            statusBar()->showMessage("All tests completed!");
            m_testingAll = false;
        }
    } else if (!m_currentTestKey.isEmpty()) {
        ConnectivityTestBlock *block = m_testBlocks.value(m_currentTestKey);
        if (block) {
            block->setStatus(status);
            block->setDetails(details);
        }
        statusBar()->showMessage("Test completed");
        m_currentTestKey.clear();
    }
}

void MainWindow::onMultiPingAttemptCompleted(const ConnectivityResult &result)
{
    Q_UNUSED(result);
}

void MainWindow::testNextBlock()
{
    if (m_currentTestIndex >= m_testQueue.size()) {
        return;
    }
    
    auto testInfo = m_testQueue[m_currentTestIndex];
    ConnectivityResult::Protocol protocol = testInfo.first;
    QString host = testInfo.second.first;
    int port = testInfo.second.second;
    
    QString protocolName = (protocol == ConnectivityResult::TCP ? "TCP" :
                           protocol == ConnectivityResult::UDP ? "UDP" :
                           protocol == ConnectivityResult::TLS ? "TLS" :
                           protocol == ConnectivityResult::WSS ? "WSS" : "RTP");
    
    addLog(QString("Testing %1 %2:%3 [%4/%5]")
           .arg(protocolName).arg(host).arg(port)
           .arg(m_currentTestIndex + 1).arg(m_testQueue.size()), "TEST");
    
    QString key = getBlockKey(protocol, host, port);
    ConnectivityTestBlock *block = m_testBlocks.value(key);
    
    if (block) {
        block->setStatus(ConnectivityTestBlock::Testing);
        statusBar()->showMessage(QString("Testing %1 %2:%3 (%4/%5)...")
                                .arg(protocolName)
                                .arg(host).arg(port)
                                .arg(m_currentTestIndex + 1)
                                .arg(m_testQueue.size()));
        m_multiPingChecker->startTest(protocol, host, port, 5, 5000);
    }
}

ConnectivityTestBlock* MainWindow::findBlockByKey(const QString &key)
{
    return m_testBlocks.value(key, nullptr);
}

QString MainWindow::getBlockKey(ConnectivityResult::Protocol protocol, 
                                const QString &host, int port)
{
    return QString("%1:%2:%3").arg(static_cast<int>(protocol)).arg(host).arg(port);
}

void MainWindow::createConnectivityTab()
{
}

void MainWindow::addLog(const QString &message, const QString &level)
{
    if (!m_logsTextEdit) return;
    
    QString timestamp = QDateTime::currentDateTime().toString("hh:mm:ss");
    QString colorCode;
    QString icon;
    
    if (level == "SUCCESS") {
        colorCode = "#4CAF50";
        icon = "✅";
    } else if (level == "ERROR") {
        colorCode = "#F44336";
        icon = "❌";
    } else if (level == "WARNING") {
        colorCode = "#FF9800";
        icon = "⚠️";
    } else if (level == "TEST") {
        colorCode = "#2196F3";
        icon = "🔄";
    } else {
        colorCode = "#9E9E9E";
        icon = "ℹ️";
    }
    
    QString logEntry = QString("<span style='color: #888;'>[%1]</span> "
                               "<span style='color: %2;'>%3 %4</span> %5<br>")
                           .arg(timestamp)
                           .arg(colorCode)
                           .arg(icon)
                           .arg(level)
                           .arg(message);
    
    m_logsTextEdit->moveCursor(QTextCursor::End);
    m_logsTextEdit->insertHtml(logEntry);
    m_logsTextEdit->moveCursor(QTextCursor::End);
}

// SIP Registration slot implementations
void MainWindow::onSipTestAllClicked()
{
    m_sipTestQueue.clear();
    m_currentSipTestIndex = 0;
    m_testingAllSip = true;
    
    addLog("========================================", "INFO");
    addLog("Starting comprehensive SIP registration test suite", "TEST");
    addLog(QString("Total tests to run: %1").arg(m_sipBlocks.size()), "INFO");
    
    for (SipRegistrationBlock *block : m_sipBlocks.values()) {
        block->reset();
        m_sipTestQueue.append(qMakePair(block->transportType(),
                                        qMakePair(block->host(), block->port())));
    }
    
    statusBar()->showMessage("Starting all SIP registration tests...");
    testNextSipBlock();
}

void MainWindow::onSipBlockRequested(SipTransportType transportType, const QString &host, int port)
{
    m_testingAllSip = false;
    
    QString transportName = (transportType == SipTransportType::TCP ? "TCP" :
                            transportType == SipTransportType::UDP ? "UDP" :
                            transportType == SipTransportType::TLS ? "TLS" : "WSS");
    
    addLog("========================================", "INFO");
    addLog(QString("Starting SIP registration: %1 %2:%3").arg(transportName).arg(host).arg(port), "TEST");
    
    QString key = getSipBlockKey(transportType, host, port);
    m_currentSipTestKey = key;
    SipRegistrationBlock *block = m_sipBlocks.value(key);
    
    if (block) {
        block->reset();
        block->setStatus(SipRegistrationBlock::Registering);
        statusBar()->showMessage(QString("Registering via %1 %2:%3...").arg(transportName).arg(host).arg(port));
        
        SipCredentials credentials;
        credentials.username = m_sipUsername;
        credentials.password = m_sipPassword;
        credentials.domain = m_sipDomain;
        credentials.proxy = host;
        credentials.port = port;
        credentials.transport = transportType;
        credentials.registrationTimeout = m_sipTimeout->value();
        
        m_sipManager->registerAccount(credentials);
    }
}

void MainWindow::onSipRegistrationStarted()
{
    addLog("SIP registration started", "INFO");
}

void MainWindow::onSipRegistrationSucceeded(const QString &accountKey, const QString &message, int expiresIn)
{
    addLog("SIP registration succeeded: " + message + " [" + accountKey + "]", "SUCCESS");
    
    // Find the block that matches this account key
    SipRegistrationBlock *block = nullptr;
    QString blockKey;
    
    // Account key format: "transport:host:port"
    // Block key format: same
    for (auto it = m_sipBlocks.begin(); it != m_sipBlocks.end(); ++it) {
        QString testKey = getSipBlockKey(it.value()->transportType(), 
                                         it.value()->host(), 
                                         it.value()->port());
        if (testKey == accountKey) {
            block = it.value();
            blockKey = it.key();
            break;
        }
    }
    
    if (block) {
        block->setStatus(SipRegistrationBlock::Registered);
        block->setMessage(message);
        
        // Update expiry time using the actual expiry from PJSIP
        m_sipExpiryTimes[blockKey] = QDateTime::currentDateTime().addSecs(expiresIn);
        
        qDebug() << "Updated expiry for" << blockKey << "- expires in" << expiresIn << "seconds";
    }
    
    if (m_testingAllSip && !m_currentSipTestKey.isEmpty() && blockKey == m_currentSipTestKey) {
        // For "Test All", keep registration active and move to next
        QTimer::singleShot(2000, this, &MainWindow::testNextSipBlock);
    }
}

void MainWindow::onSipRegistrationFailed(const QString &error)
{
    addLog("SIP registration failed: " + error, "ERROR");
    
    if (!m_currentSipTestKey.isEmpty()) {
        SipRegistrationBlock *block = m_sipBlocks.value(m_currentSipTestKey);
        if (block) {
            block->setStatus(SipRegistrationBlock::Failed);
            block->setMessage(error);
        }
    }
    
    if (m_testingAllSip) {
        QTimer::singleShot(1000, this, &MainWindow::testNextSipBlock);
    }
}

void MainWindow::onSipUnregistered()
{
    addLog("SIP account unregistered", "INFO");
}

void MainWindow::onSipStatusChanged(const QString &status)
{
    addLog("SIP Status: " + status, "INFO");
}

void MainWindow::testNextSipBlock()
{
    if (m_currentSipTestIndex >= m_sipTestQueue.size()) {
        m_testingAllSip = false;
        addLog("========================================", "INFO");
        addLog("All SIP registration tests completed", "SUCCESS");
        statusBar()->showMessage("All SIP registration tests completed");
        return;
    }
    
    auto testInfo = m_sipTestQueue[m_currentSipTestIndex];
    SipTransportType transportType = testInfo.first;
    QString host = testInfo.second.first;
    int port = testInfo.second.second;
    
    m_currentSipTestIndex++;
    
    QString transportName = (transportType == SipTransportType::TCP ? "TCP" :
                            transportType == SipTransportType::UDP ? "UDP" :
                            transportType == SipTransportType::TLS ? "TLS" : "WSS");
    
    addLog(QString("Testing SIP registration %1/%2: %3 %4:%5")
           .arg(m_currentSipTestIndex).arg(m_sipTestQueue.size())
           .arg(transportName).arg(host).arg(port), "TEST");
    
    QString key = getSipBlockKey(transportType, host, port);
    SipRegistrationBlock *block = m_sipBlocks.value(key);
    
    if (block) {
        block->setStatus(SipRegistrationBlock::Registering);
        statusBar()->showMessage(QString("Testing %1 %2:%3 (%4/%5)...")
                                .arg(transportName).arg(host).arg(port)
                                .arg(m_currentSipTestIndex).arg(m_sipTestQueue.size()));
        
        SipCredentials credentials;
        credentials.username = m_sipUsername;
        credentials.password = m_sipPassword;
        credentials.domain = m_sipDomain;
        credentials.proxy = host;
        credentials.port = port;
        credentials.transport = transportType;
        credentials.registrationTimeout = m_sipTimeout->value();
        
        m_sipManager->registerAccount(credentials);
    }
}

SipRegistrationBlock* MainWindow::findSipBlockByKey(const QString &key)
{
    return m_sipBlocks.value(key, nullptr);
}

QString MainWindow::getSipBlockKey(SipTransportType transportType, const QString &host, int port)
{
    return QString("%1:%2:%3").arg(static_cast<int>(transportType)).arg(host).arg(port);
}

void MainWindow::onSipUnregisterRequested(SipTransportType transportType, const QString &host, int port)
{
    QString transportName = (transportType == SipTransportType::TCP ? "TCP" :
                            transportType == SipTransportType::UDP ? "UDP" :
                            transportType == SipTransportType::TLS ? "TLS" : "WSS");
    
    addLog(QString("Unregistering %1 %2:%3...").arg(transportName).arg(host).arg(port), "INFO");
    
    QString key = getSipBlockKey(transportType, host, port);
    QString accountKey = QString("%1:%2:%3").arg(static_cast<int>(transportType)).arg(host).arg(port);
    
    m_sipManager->unregisterAccount(accountKey);
    
    SipRegistrationBlock *block = m_sipBlocks.value(key);
    if (block) {
        block->setStatus(SipRegistrationBlock::Idle);
        block->setMessage("Unregistered");
        block->setExpiryTime(0);
    }
    
    m_sipExpiryTimes.remove(key);
    
    statusBar()->showMessage(QString("Unregistered %1 %2:%3").arg(transportName).arg(host).arg(port));
}

void MainWindow::updateSipTimers()
{
    QDateTime now = QDateTime::currentDateTime();
    
    for (auto it = m_sipExpiryTimes.begin(); it != m_sipExpiryTimes.end(); ++it) {
        QString key = it.key();
        QDateTime expiryTime = it.value();
        
        int secondsRemaining = now.secsTo(expiryTime);
        
        SipRegistrationBlock *block = m_sipBlocks.value(key);
        if (block) {
            if (secondsRemaining > 0) {
                block->setExpiryTime(secondsRemaining);
            } else {
                // Registration expired
                block->setExpiryTime(0);
                block->setStatus(SipRegistrationBlock::Idle);
                block->setMessage("Registration expired");
            }
        }
    }
}

#include "mainwindow_siplog.cpp"

void MainWindow::createNetworkInfoTab()
{
    m_networkInfoWidget = new QWidget();
    m_networkInfoWidget->setStyleSheet("QWidget { background-color: black; }");
    QVBoxLayout *layout = new QVBoxLayout(m_networkInfoWidget);
    layout->setSpacing(20);
    layout->setContentsMargins(20, 20, 20, 20);
    
    // Title and refresh button
    QHBoxLayout *headerLayout = new QHBoxLayout();
    QLabel *titleLabel = new QLabel("🌐 Network Diagnostics");
    titleLabel->setStyleSheet("font-size: 18pt; font-weight: bold; color: #2c3e50;");
    headerLayout->addWidget(titleLabel);
    
    QPushButton *refreshButton = new QPushButton("🔄 Refresh");
    refreshButton->setStyleSheet("QPushButton { "
                                 "background-color: #3498DB; "
                                 "color: white; "
                                 "font-weight: bold; "
                                 "padding: 8px 15px; "
                                 "border-radius: 5px; "
                                 "}"
                                 "QPushButton:hover { background-color: #2980B9; }");
    connect(refreshButton, &QPushButton::clicked, m_networkInfoManager, &NetworkInfoManager::refreshNetworkInfo);
    headerLayout->addWidget(refreshButton);
    headerLayout->addStretch();
    
    layout->addLayout(headerLayout);
    
    // Scroll area for network info
    QScrollArea *scrollArea = new QScrollArea();
    scrollArea->setWidgetResizable(true);
    scrollArea->setStyleSheet("QScrollArea { border: none; background: #f5f7fa; }");
    
    QWidget *scrollContent = new QWidget();
    QVBoxLayout *contentLayout = new QVBoxLayout(scrollContent);
    contentLayout->setSpacing(15);
    
    // Network Interfaces Section
    QGroupBox *interfacesGroup = new QGroupBox("Network Interfaces");
    interfacesGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 12pt; "
                                  "border: 2px solid #3498DB; border-radius: 5px; "
                                  "margin-top: 10px; padding-top: 10px; }"
                                  "QGroupBox::title { subcontrol-origin: margin; left: 10px; }");
    QVBoxLayout *interfacesLayout = new QVBoxLayout(interfacesGroup);
    m_interfacesLabel = new QLabel("Loading...");
    m_interfacesLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_interfacesLabel->setWordWrap(true);
    interfacesLayout->addWidget(m_interfacesLabel);
    contentLayout->addWidget(interfacesGroup);
    
    // DNS Servers Section
    QGroupBox *dnsGroup = new QGroupBox("DNS Servers");
    dnsGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 12pt; "
                           "border: 2px solid #27ae60; border-radius: 5px; "
                           "margin-top: 10px; padding-top: 10px; }"
                           "QGroupBox::title { subcontrol-origin: margin; left: 10px; }");
    QVBoxLayout *dnsLayout = new QVBoxLayout(dnsGroup);
    m_dnsLabel = new QLabel("Loading...");
    m_dnsLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_dnsLabel->setWordWrap(true);
    dnsLayout->addWidget(m_dnsLabel);
    contentLayout->addWidget(dnsGroup);
    
    // Gateway & DHCP Section
    QGroupBox *gatewayGroup = new QGroupBox("Gateway & DHCP");
    gatewayGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 12pt; "
                               "border: 2px solid #e67e22; border-radius: 5px; "
                               "margin-top: 10px; padding-top: 10px; }"
                               "QGroupBox::title { subcontrol-origin: margin; left: 10px; }");
    QVBoxLayout *gatewayLayout = new QVBoxLayout(gatewayGroup);
    m_gatewayLabel = new QLabel("Loading...");
    m_gatewayLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_gatewayLabel->setWordWrap(true);
    gatewayLayout->addWidget(m_gatewayLabel);
    m_dhcpLabel = new QLabel("Loading...");
    m_dhcpLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_dhcpLabel->setWordWrap(true);
    gatewayLayout->addWidget(m_dhcpLabel);
    contentLayout->addWidget(gatewayGroup);
    
    // Latency Section
    QGroupBox *latencyGroup = new QGroupBox("Network Latency");
    latencyGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 12pt; "
                               "border: 2px solid #9b59b6; border-radius: 5px; "
                               "margin-top: 10px; padding-top: 10px; }"
                               "QGroupBox::title { subcontrol-origin: margin; left: 10px; }");
    QVBoxLayout *latencyLayout = new QVBoxLayout(latencyGroup);
    m_latencyLabel = new QLabel("Loading...");
    m_latencyLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_latencyLabel->setWordWrap(true);
    latencyLayout->addWidget(m_latencyLabel);
    contentLayout->addWidget(latencyGroup);
    
    // Public IP Section
    QGroupBox *publicIpGroup = new QGroupBox("Public IP Address");
    publicIpGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 12pt; "
                                "border: 2px solid #e74c3c; border-radius: 5px; "
                                "margin-top: 10px; padding-top: 10px; }"
                                "QGroupBox::title { subcontrol-origin: margin; left: 10px; }");
    QVBoxLayout *publicIpLayout = new QVBoxLayout(publicIpGroup);
    m_publicIpLabel = new QLabel("Detecting...");
    m_publicIpLabel->setStyleSheet("font-size: 11pt; padding: 10px;");
    m_publicIpLabel->setWordWrap(true);
    publicIpLayout->addWidget(m_publicIpLabel);
    contentLayout->addWidget(publicIpGroup);
    
    contentLayout->addStretch();
    scrollArea->setWidget(scrollContent);
    layout->addWidget(scrollArea);
}

void MainWindow::updateNetworkInfoDisplay(const NetworkDiagnostics &diagnostics)
{
    // Update interfaces
    QString interfacesText;
    for (const NetworkInterfaceInfo &iface : diagnostics.interfaces) {
        interfacesText += QString("<b>%1</b> (%2)<br>").arg(iface.hardwareName).arg(iface.name);
        interfacesText += QString("MAC: %1<br>").arg(iface.macAddress);
        for (const QHostAddress &addr : iface.ipAddresses) {
            interfacesText += QString("IP: %1<br>").arg(addr.toString());
        }
        interfacesText += "<br>";
    }
    m_interfacesLabel->setText(interfacesText.isEmpty() ? "No active interfaces found" : interfacesText);
    
    // Update DNS
    QString dnsText;
    for (const QString &dns : diagnostics.dnsServers) {
        dnsText += QString("• %1<br>").arg(dns);
    }
    m_dnsLabel->setText(dnsText.isEmpty() ? "No DNS servers found" : dnsText);
    
    // Update Gateway
    m_gatewayLabel->setText(QString("<b>Default Gateway:</b> %1").arg(diagnostics.defaultGateway));
    
    // Update DHCP
    m_dhcpLabel->setText(QString("<b>DHCP Server:</b> %1").arg(diagnostics.dhcpServer));
    
    // Update Latency
    if (diagnostics.gatewayLatencyMs > 0) {
        m_latencyLabel->setText(QString("<b>Gateway Latency:</b> %1 ms").arg(diagnostics.gatewayLatencyMs));
    } else {
        m_latencyLabel->setText("<b>Gateway Latency:</b> Measuring...");
    }
    
    // Update Public IP
    if (!diagnostics.publicIp.isEmpty()) {
        m_publicIpLabel->setText(QString("<b>%1</b>").arg(diagnostics.publicIp));
    }
}

void MainWindow::onNetworkInfoUpdated(const NetworkDiagnostics &diagnostics)
{
    updateNetworkInfoDisplay(diagnostics);
    addLog("Network diagnostics updated", "INFO");
}

void MainWindow::onGatewayLatencyMeasured(int latencyMs)
{
    if (latencyMs > 0) {
        m_latencyLabel->setText(QString("<b>Gateway Latency:</b> %1 ms").arg(latencyMs));
        addLog(QString("Gateway latency: %1 ms").arg(latencyMs), "INFO");
    }
}

void MainWindow::onPublicIpDiscovered(const QString &ip)
{
    m_publicIpLabel->setText(QString("🌐 <b>Public IP Address:</b> %1").arg(ip));
    addLog(QString("Public IP: %1").arg(ip), "INFO");
}

// Include Advanced Checks tab implementation
#include "mainwindow_advancedtab.cpp"

// Include call testing tab implementation
#include "mainwindow_calltab.cpp"

// Include VoIP Quality tab implementation
#include "mainwindow_voipqualitytab.cpp"
