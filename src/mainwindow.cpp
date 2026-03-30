#include "mainwindow.h"
#include "models/environmentconfig.h"
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
#include <QRegularExpression>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent), 
      m_currentTestIndex(0), 
      m_testingAll(false),
      m_testingAllSip(false),
      m_currentSipTestIndex(0),
      m_activeVoipChecker(nullptr)
{
    // Hardcoded SIP credentials
    m_sipUsername = "7001";
    m_sipPassword = "7001";
    m_sipDomain = EnvironmentConfig::instance().getSipDomain();
    m_sipProxy = EnvironmentConfig::instance().getSipEndpoint();
    
    m_multiPingChecker = new MultiPingChecker(this);
    m_sipManager = new SipRegistrationManager(this);
    m_networkInfoManager = new NetworkInfoManager(this);
    m_callManager = new SipCallManager(this);
    
    m_totalTestsToRun = 0;
    m_completedTests = 0;
    
    m_sipExpiryTimer = new QTimer(this);
    m_sipExpiryTimer->setInterval(1000);
    connect(m_sipExpiryTimer, &QTimer::timeout, this, &MainWindow::updateSipTimers);
    m_sipExpiryTimer->start();
    setupUI();
    setupConnections();
    
    setWindowTitle("SIP Connectivity Tester - Eltropy VoIP V1.0.0");
    showMaximized();
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
    
    // Title with logo
    QHBoxLayout *titleLayout = new QHBoxLayout();
    
    QLabel *logoLabel = new QLabel();
    QPixmap logoPixmap(":/eltropy.png");
    if (!logoPixmap.isNull()) {
        logoLabel->setPixmap(logoPixmap.scaled(80, 80, Qt::KeepAspectRatio, Qt::SmoothTransformation));
    }
    logoLabel->setStyleSheet("background-color: transparent;");
    titleLayout->addStretch();
    titleLayout->addWidget(logoLabel);
    
    QLabel *titleLabel = new QLabel("Eltropy VoIP Diagnostic Tool");
    QFont titleFont;
    titleFont.setPointSize(24);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: white; background-color: transparent;");
    titleLayout->addWidget(titleLabel);
    titleLayout->addStretch();
    
    headerLayout->addLayout(titleLayout);
    
    QLabel *subtitleLabel = new QLabel("🔍 Test your connectivity with Eltropy VoIP Systems");
    QFont subtitleFont;
    subtitleFont.setPointSize(14);
    subtitleLabel->setFont(subtitleFont);
    subtitleLabel->setStyleSheet("color: rgba(255, 255, 255, 0.9);");
    subtitleLabel->setAlignment(Qt::AlignCenter);
    
    headerLayout->addWidget(subtitleLabel);
    
    QHBoxLayout *envLayout = new QHBoxLayout();
    QLabel *envLabel = new QLabel("VOIP Environment:");
    envLabel->setStyleSheet("color: white; font-size: 14pt; font-weight: bold; background-color: transparent;");
    envLayout->addWidget(envLabel);
    
    m_prodRadio = new QRadioButton("PROD");
    m_prodRadio->setStyleSheet("color: white; font-size: 15pt; font-weight: bold; background-color: transparent;");
    m_prodRadio->setChecked(true);
    connect(m_prodRadio, &QRadioButton::clicked, this, &MainWindow::onEnvironmentChanged);
    envLayout->addWidget(m_prodRadio);
    
    m_uatRadio = new QRadioButton("UAT");
    m_uatRadio->setStyleSheet("color: white; font-size: 15pt; font-weight: bold; background-color: transparent;");
    connect(m_uatRadio, &QRadioButton::clicked, this, &MainWindow::onEnvironmentChanged);
    envLayout->addWidget(m_uatRadio);
    
    envLayout->addStretch();
    
    headerLayout->addLayout(envLayout);
    
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
    
    QHBoxLayout *connHeaderLayout = new QHBoxLayout();
    
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
    connHeaderLayout->addWidget(testAllButton);
    
    QPushButton *cancelAllButton = new QPushButton("🛑 Cancel All Tests", this);
    cancelAllButton->setStyleSheet("QPushButton { "
                                   "background-color: #E74C3C; "
                                   "color: white; "
                                   "font-weight: bold; "
                                   "padding: 10px; "
                                   "border-radius: 5px; "
                                   "font-size: 14pt; "
                                   "}"
                                   "QPushButton:hover { background-color: #C0392B; }");
    cancelAllButton->setFixedHeight(50);
    connect(cancelAllButton, &QPushButton::clicked, this, &MainWindow::onCancelAllTestsClicked);
    connHeaderLayout->addWidget(cancelAllButton);
    
    connHeaderLayout->addSpacing(20);
    
    QLabel *attemptsLabel = new QLabel("Test Attempts:");
    attemptsLabel->setStyleSheet("font-weight: bold; color: #2c3e50; font-size: 12pt;");
    connHeaderLayout->addWidget(attemptsLabel);
    
    m_testAttempts = new QSpinBox();
    m_testAttempts->setRange(1, 20);
    m_testAttempts->setValue(5);
    m_testAttempts->setStyleSheet("padding: 8px; border: 2px solid #bdc3c7; border-radius: 4px; "
                                  "background: white; color: #2c3e50; font-size: 12pt;");
    m_testAttempts->setFixedWidth(80);
    connHeaderLayout->addWidget(m_testAttempts);
    
    connHeaderLayout->addStretch();
    connLayout->addLayout(connHeaderLayout);
    
    QScrollArea *scrollArea = new QScrollArea();
    scrollArea->setWidgetResizable(true);
    scrollArea->setFrameShape(QFrame::NoFrame);
    scrollArea->setStyleSheet("QScrollArea { background-color: #f5f7fa; border: none; }");
    
    m_connectivityScrollContent = new QWidget();
    m_connectivityGridLayout = new QGridLayout(m_connectivityScrollContent);
    m_connectivityGridLayout->setSpacing(15);
    m_connectivityGridLayout->setContentsMargins(10, 10, 10, 10);
    
    rebuildConnectivityBlocks();
    
    scrollArea->setWidget(m_connectivityScrollContent);
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
    
    QPushButton *sipTestAllButton = new QPushButton("🧪 Test All SIP Registration", this);
    sipTestAllButton->setStyleSheet("QPushButton { "
                                    "background-color: #3498DB; "
                                    "color: white; "
                                    "font-weight: bold; "
                                    "padding: 10px; "
                                    "border-radius: 5px; "
                                    "font-size: 12pt; "
                                    "}"
                                    "QPushButton:hover { background-color: #2980B9; }");
    sipTestAllButton->setFixedHeight(40);
    connect(sipTestAllButton, &QPushButton::clicked, this, &MainWindow::onSipTestAllClicked);
    sipHeaderLayout->addWidget(sipTestAllButton);
    
    QPushButton *sipUnregisterAllButton = new QPushButton("🚫 Unregister All", this);
    sipUnregisterAllButton->setStyleSheet("QPushButton { "
                                         "background-color: #E74C3C; "
                                         "color: white; "
                                         "font-weight: bold; "
                                         "padding: 10px; "
                                         "border-radius: 5px; "
                                         "font-size: 12pt; "
                                         "}"
                                         "QPushButton:hover { background-color: #C0392B; }");
    sipUnregisterAllButton->setFixedHeight(40);
    connect(sipUnregisterAllButton, &QPushButton::clicked, this, &MainWindow::onSipUnregisterAllClicked);
    sipHeaderLayout->addWidget(sipUnregisterAllButton);
    
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
    sipScrollArea->setFrameShape(QFrame::NoFrame);
    sipScrollArea->setStyleSheet("QScrollArea { border: none; background: #f5f7fa; }");
    
    m_sipScrollWidget = new QWidget();
    m_sipBlocksLayout = new QGridLayout(m_sipScrollWidget);
    m_sipBlocksLayout->setSpacing(15);
    m_sipBlocksLayout->setContentsMargins(10, 10, 10, 10);
    
    rebuildSipRegistrationBlocks();
    
    sipScrollArea->setWidget(m_sipScrollWidget);
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
    connect(m_callManager, &SipCallManager::rtpStatisticsUpdated, this, [this](const QString &stats) {
        addLog(stats, "INFO");
    });
    connect(m_callManager, &SipCallManager::errorOccurred,
            this, [this](const QString &error) {
                addLog("⚠️ " + error, "ERROR");
            });
}

void MainWindow::onTestAllClicked()
{
    // Clean up any existing parallel checkers
    for (MultiPingChecker *checker : m_activeCheckers.values()) {
        checker->cancel();
        checker->deleteLater();
    }
    m_activeCheckers.clear();
    
    m_testingAll = true;
    m_totalTestsToRun = m_testBlocks.size();
    m_completedTests = 0;
    
    addLog("========================================", "INFO");
    addLog("Starting comprehensive connectivity test suite (PARALLEL MODE)", "TEST");
    addLog(QString("Total tests to run: %1").arg(m_totalTestsToRun), "INFO");
    
    statusBar()->showMessage(QString("Running %1 tests in parallel...").arg(m_totalTestsToRun));
    
    // Start all tests in parallel
    for (ConnectivityTestBlock *block : m_testBlocks.values()) {
        block->reset();
        block->setStatus(ConnectivityTestBlock::Testing);
        
        QString key = getBlockKey(block->protocol(), block->host(), block->port());
        
        // Create a new checker for this test
        MultiPingChecker *checker = new MultiPingChecker(this);
        m_activeCheckers[key] = checker;
        
        // Connect signals for this specific checker
        connect(checker, &MultiPingChecker::progressUpdate, this, [this, key](int current, int total) {
            ConnectivityTestBlock *block = m_testBlocks.value(key);
            if (block) {
                block->setProgress(current, total);
            }
        });
        
        connect(checker, &MultiPingChecker::testCompleted, this, [this, key](int successCount, int totalAttempts, const QList<ConnectivityResult> &results) {
            onParallelTestCompleted(key, successCount, totalAttempts, results);
        });
        
        // Start the test
        QString protocolName = (block->protocol() == ConnectivityResult::TCP ? "TCP" :
                               block->protocol() == ConnectivityResult::UDP ? "UDP" :
                               block->protocol() == ConnectivityResult::TLS ? "TLS" :
                               block->protocol() == ConnectivityResult::WSS ? "WSS" : "RTP");
        
        int attempts = m_testAttempts->value();
        addLog(QString("Starting %1 %2:%3 (%4 attempts)").arg(protocolName).arg(block->host()).arg(block->port()).arg(attempts), "TEST");
        checker->startTest(block->protocol(), block->host(), block->port(), attempts, 5000);
    }
}

void MainWindow::onCancelAllTestsClicked()
{
    addLog("========================================", "INFO");
    addLog("Cancelling all connectivity tests", "WARNING");
    
    // Cancel all active parallel checkers
    int cancelledCount = m_activeCheckers.size();
    for (MultiPingChecker *checker : m_activeCheckers.values()) {
        if (checker) {
            checker->cancel();
            checker->deleteLater();
        }
    }
    m_activeCheckers.clear();
    
    // Reset all test blocks to idle state
    for (ConnectivityTestBlock *block : m_testBlocks.values()) {
        if (block) {
            block->setStatus(ConnectivityTestBlock::NotTested);
            block->setDetails("Test cancelled");
        }
    }
    
    // Reset test state
    m_testingAll = false;
    m_totalTestsToRun = 0;
    m_completedTests = 0;
    
    if (cancelledCount > 0) {
        addLog(QString("Cancelled %1 running test(s)").arg(cancelledCount), "WARNING");
        statusBar()->showMessage(QString("Cancelled %1 test(s)").arg(cancelledCount));
    } else {
        addLog("No tests were running", "INFO");
        statusBar()->showMessage("No tests to cancel");
    }
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
        int attempts = m_testAttempts->value();
        statusBar()->showMessage(QString("Testing %1:%2 (%3 attempts)...").arg(host).arg(port).arg(attempts));
        m_multiPingChecker->startTest(protocol, host, port, attempts, 5000);
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
        // Check if all failures are ConnectionRefused
        bool allConnectionRefused = true;
        bool hasTimeout = false;
        for (const ConnectivityResult &result : results) {
            if (result.status() == ConnectivityResult::Timeout) {
                hasTimeout = true;
                allConnectionRefused = false;
                break;
            } else if (result.status() != ConnectivityResult::ConnectionRefused) {
                allConnectionRefused = false;
            }
        }
        
        if (allConnectionRefused && !results.isEmpty()) {
            status = ConnectivityTestBlock::ConnectionRefused;
            details = QString("🚫 Connection actively rejected\n"
                            "\nPossible causes:\n"
                            "• Server port is not listening\n");
                            // "• Firewall is actively blocking the connection");
            logLevel = "WARNING";
            addLog(QString("Test failed: Connection refused on all %1 attempts - port actively rejected").arg(totalAttempts), logLevel);
        } else if (hasTimeout) {
            status = ConnectivityTestBlock::AllFailed;
            details = QString("⏱️ Connection timeout - no response received\n"
                            "Most likely cause:\n"
                            "• Firewall is silently dropping packets\n"
                            "• Network routing issue or host unreachable");
            logLevel = "ERROR";
            addLog(QString("Test failed: Connection timeout on all attempts - likely firewall blocking"), logLevel);
        } else {
            status = ConnectivityTestBlock::AllFailed;
            details = QString("✗ All %1 attempts failed").arg(totalAttempts);
            logLevel = "ERROR";
            addLog(QString("Test failed: 0/%1 attempts successful").arg(totalAttempts), logLevel);
        }
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

void MainWindow::onParallelTestCompleted(const QString &key, int successCount, int totalAttempts, const QList<ConnectivityResult> &results)
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
        // Check if all failures are ConnectionRefused
        bool allConnectionRefused = true;
        bool hasTimeout = false;
        for (const ConnectivityResult &result : results) {
            if (result.status() == ConnectivityResult::Timeout) {
                hasTimeout = true;
                allConnectionRefused = false;
                break;
            } else if (result.status() != ConnectivityResult::ConnectionRefused) {
                allConnectionRefused = false;
            }
        }
        
        if (allConnectionRefused && !results.isEmpty()) {
            status = ConnectivityTestBlock::ConnectionRefused;
            details = QString("🚫 Connection actively rejected\n"
                            "\nPossible causes:\n"
                            "• Server port is not listening\n");
                            // "• Firewall is actively blocking the connection");
            logLevel = "WARNING";
            addLog(QString("Test failed: Connection refused on all %1 attempts - port actively rejected").arg(totalAttempts), logLevel);
        } else if (hasTimeout) {
            status = ConnectivityTestBlock::AllFailed;
            details = QString("⏱️ Connection timeout - no response received\n"
                            "Most likely cause:\n"
                            "• Firewall is silently dropping packets\n"
                            "• Network routing issue or host unreachable");
            logLevel = "ERROR";
            addLog(QString("Test failed: Connection timeout on all attempts - likely firewall blocking"), logLevel);
        } else {
            status = ConnectivityTestBlock::AllFailed;
            details = QString("✗ All %1 attempts failed").arg(totalAttempts);
            logLevel = "ERROR";
            addLog(QString("Test failed: 0/%1 attempts successful").arg(totalAttempts), logLevel);
        }
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
    
    // Update the test block
    ConnectivityTestBlock *block = m_testBlocks.value(key);
    if (block) {
        block->setStatus(status);
        block->setDetails(details);
    }
    
    // Clean up the checker for this test
    MultiPingChecker *checker = m_activeCheckers.value(key);
    if (checker) {
        m_activeCheckers.remove(key);
        checker->deleteLater();
    }
    
    // Track completion
    m_completedTests++;
    statusBar()->showMessage(QString("Tests completed: %1/%2").arg(m_completedTests).arg(m_totalTestsToRun));
    
    // Check if all tests are done
    if (m_completedTests >= m_totalTestsToRun) {
        addLog("========================================", "INFO");
        addLog("All connectivity tests completed!", "SUCCESS");
        statusBar()->showMessage("All tests completed!");
        m_testingAll = false;
        m_activeCheckers.clear();
    }
}

void MainWindow::onMultiPingAttemptCompleted(const ConnectivityResult &result)
{
    Q_UNUSED(result);
}

void MainWindow::onConnectivityChecked(const ConnectivityResult &result)
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
    m_testingAllSip = true;
    
    addLog("========================================", "INFO");
    addLog("Starting comprehensive SIP registration test suite (PARALLEL MODE)", "TEST");
    addLog(QString("Total tests to run: %1").arg(m_sipBlocks.size()), "INFO");
    
    statusBar()->showMessage(QString("Starting %1 SIP registrations in parallel...").arg(m_sipBlocks.size()));
    
    // Start all registrations in parallel
    for (SipRegistrationBlock *block : m_sipBlocks.values()) {
        // Don't reset - just update status directly to avoid showing "Not tested"
        block->setStatus(SipRegistrationBlock::Registering);
        block->setMessage("⏳ Registering...");
        block->setExpiryTime(0);
        
        QString transportName = (block->transportType() == SipTransportType::TCP ? "TCP" :
                                block->transportType() == SipTransportType::UDP ? "UDP" :
                                block->transportType() == SipTransportType::TLS ? "TLS" : "WSS");
        
        addLog(QString("Starting %1 %2:%3").arg(transportName).arg(block->host()).arg(block->port()), "TEST");
        
        SipCredentials credentials;
        credentials.username = m_sipUsername;
        credentials.password = m_sipPassword;
        credentials.domain = m_sipDomain;
        credentials.proxy = block->host();
        credentials.port = block->port();
        credentials.transport = block->transportType();
        credentials.registrationTimeout = m_sipTimeout->value();
        
        m_sipManager->registerAccount(credentials);
    }
}

void MainWindow::onSipUnregisterAllClicked()
{
    addLog("========================================", "INFO");
    addLog("Unregistering all SIP accounts", "INFO");
    
    int unregisteredCount = 0;
    
    // Unregister all accounts that have active registrations (tracked in m_sipExpiryTimes)
    QStringList keysToUnregister = m_sipExpiryTimes.keys();
    
    for (const QString &key : keysToUnregister) {
        // Unregister the account
        m_sipManager->unregisterAccount(key);
        
        // Update the block UI
        SipRegistrationBlock *block = m_sipBlocks.value(key);
        if (block) {
            block->setStatus(SipRegistrationBlock::Idle);
            block->setMessage("Unregistered");
            
            QString transportName = (block->transportType() == SipTransportType::TCP ? "TCP" :
                                    block->transportType() == SipTransportType::UDP ? "UDP" :
                                    block->transportType() == SipTransportType::TLS ? "TLS" : "WSS");
            
            addLog(QString("Unregistered: %1 %2:%3").arg(transportName).arg(block->host()).arg(block->port()), "INFO");
        }
        
        unregisteredCount++;
    }
    
    // Clear all expiry times
    m_sipExpiryTimes.clear();
    
    // Stop any ongoing test all sequence
    m_testingAllSip = false;
    m_sipTestQueue.clear();
    m_currentSipTestIndex = 0;
    m_currentSipTestKey.clear();
    
    if (unregisteredCount > 0) {
        addLog(QString("Unregistered %1 SIP account(s)").arg(unregisteredCount), "SUCCESS");
        statusBar()->showMessage(QString("Unregistered %1 SIP account(s)").arg(unregisteredCount));
    } else {
        addLog("No active SIP registrations to unregister", "INFO");
        statusBar()->showMessage("No active SIP registrations");
    }
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
        // Don't reset - just update status directly to avoid showing "Not tested"
        block->setStatus(SipRegistrationBlock::Registering);
        block->setMessage("⏳ Registering...");
        block->setExpiryTime(0);
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
        block->setProgress(0, 0); // Hide progress bar on success
        
        // Update expiry time using the actual expiry from PJSIP
        m_sipExpiryTimes[blockKey] = QDateTime::currentDateTime().addSecs(expiresIn);
        
        qDebug() << "Updated expiry for" << blockKey << "- expires in" << expiresIn << "seconds";
    }
}

void MainWindow::onSipRegistrationFailed(const QString &accountKey, const QString &error)
{
    qDebug() << "========================================";
    qDebug() << "MainWindow::onSipRegistrationFailed CALLED";
    qDebug() << "Account Key:" << accountKey;
    qDebug() << "Error:" << error;
    qDebug() << "========================================";
    
    addLog("SIP registration failed: " + error, "ERROR");
    
    // Use the accountKey to find the correct block
    SipRegistrationBlock *block = m_sipBlocks.value(accountKey);
    
    if (block) {
        qDebug() << "Setting block to Failed status with message:" << error;
        block->setStatus(SipRegistrationBlock::Failed);
        block->setMessage(error);
        block->setProgress(0, 0); // Hide progress bar on failure
        qDebug() << "Block status updated successfully";
    } else {
        qDebug() << "WARNING: Could not find block for accountKey:" << accountKey;
        qDebug() << "Available blocks:" << m_sipBlocks.keys();
    }
}

void MainWindow::onSipUnregistered()
{
    addLog("SIP account unregistered", "INFO");
}

void MainWindow::onSipStatusChanged(const QString &status)
{
    addLog("SIP Status: " + status, "INFO");
    
    // Try to find the block to update
    SipRegistrationBlock *block = nullptr;
    QString accountKey;
    
    // First, try to parse account key from new format: "[accountKey] message"
    QRegularExpression bracketKeyRegex("^\\[([^\\]]+)\\]");
    QRegularExpressionMatch bracketMatch = bracketKeyRegex.match(status);
    
    if (bracketMatch.hasMatch()) {
        accountKey = bracketMatch.captured(1);
        block = m_sipBlocks.value(accountKey);
    }
    
    // If not found, try using m_currentSipTestKey (for individual tests)
    if (!block && !m_currentSipTestKey.isEmpty()) {
        accountKey = m_currentSipTestKey;
        block = m_sipBlocks.value(accountKey);
    }
    
    // If not found and we're in "Test All" mode, parse the account key from old status format
    // Status format: "1:voip.eltropy.com:5060: In Progress"
    if (!block && m_testingAllSip) {
        QRegularExpression accountKeyRegex("(\\d+):([^:]+):(\\d+):");
        QRegularExpressionMatch accountMatch = accountKeyRegex.match(status);
        
        if (accountMatch.hasMatch()) {
            accountKey = QString("%1:%2:%3")
                .arg(accountMatch.captured(1))
                .arg(accountMatch.captured(2))
                .arg(accountMatch.captured(3));
            block = m_sipBlocks.value(accountKey);
        }
    }
    
    if (block) {
        // Parse attempt count from status messages like "Retrying registration (attempt 2/5)..." or "Registering (attempt 3/6)..."
        QRegularExpression attemptRegex("attempt (\\d+)/(\\d+)");
        QRegularExpressionMatch match = attemptRegex.match(status);
        
        if (match.hasMatch()) {
            int current = match.captured(1).toInt();
            int total = match.captured(2).toInt();
            block->setProgress(current, total);
        }
        
        // Remove the [accountKey] prefix from the message for display
        QString displayMessage = status;
        if (bracketMatch.hasMatch()) {
            displayMessage = status.mid(bracketMatch.capturedEnd()).trimmed();
        }
        
        // If status contains "Retrying", keep the Registering status but update message
        if (status.contains("Retrying", Qt::CaseInsensitive)) {
            block->setStatus(SipRegistrationBlock::Registering);
            block->setMessage(displayMessage);
        }
        // If status is "Registering", update to show registering
        else if (status.contains("Registering", Qt::CaseInsensitive)) {
            block->setStatus(SipRegistrationBlock::Registering);
            block->setMessage(displayMessage);
        }
        // Other status updates are handled by specific callbacks
    }
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
    m_currentSipTestKey = key;  // Set current test key so success/failure handlers work
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
    
    // Also update call registration timer
    updateCallRegistrationTimer();
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
    interfacesGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 16pt; "
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
    dnsGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 16pt; "
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
    gatewayGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 16pt; "
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
    latencyGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 16pt; "
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
    publicIpGroup->setStyleSheet("QGroupBox { font-weight: bold; font-size: 16pt; "
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
    qDebug() << "MainWindow::onGatewayLatencyMeasured called with:" << latencyMs;
    if (latencyMs > 0) {
        m_latencyLabel->setText(QString("<b>Gateway Latency:</b> %1 ms").arg(latencyMs));
        addLog(QString("Gateway latency: %1 ms").arg(latencyMs), "INFO");
    } else {
        m_latencyLabel->setText("<b>Gateway Latency:</b> Unable to measure");
        addLog("Gateway latency: Unable to measure", "WARNING");
    }
}

void MainWindow::onPublicIpDiscovered(const QString &ip)
{
    qDebug() << "MainWindow::onPublicIpDiscovered called with:" << ip;
    m_publicIpLabel->setText(QString("🌐 <b>Public IP Address:</b> %1").arg(ip));
    addLog(QString("Public IP: %1").arg(ip), "INFO");
}

void MainWindow::onEnvironmentChanged()
{
    Environment env = m_prodRadio->isChecked() ? Environment::PROD : Environment::UAT;
    EnvironmentConfig::instance().setEnvironment(env);
    
    m_sipProxy = EnvironmentConfig::instance().getSipEndpoint();
    m_sipDomain = EnvironmentConfig::instance().getSipDomain();
    
    rebuildConnectivityBlocks();
    rebuildSipRegistrationBlocks();
    
    // Update VoIP quality server field
    if (m_voipQualityServerEdit) {
        m_voipQualityServerEdit->setText(EnvironmentConfig::instance().getVoipProxyEndpoint());
        m_voipQualityServerEdit->setPlaceholderText("e.g., " + EnvironmentConfig::instance().getVoipProxyEndpoint());
    }
    
    // Update SIP ALG host field
    if (m_sipAlgHostEdit) {
        m_sipAlgHostEdit->setText(EnvironmentConfig::instance().getSipEndpoint());
        m_sipAlgHostEdit->setPlaceholderText("e.g., " + EnvironmentConfig::instance().getSipEndpoint());
    }
    
    // Update call domain display
    updateCallDomainDisplay();
    
    addLog(QString("Environment changed to: %1").arg(EnvironmentConfig::instance().environmentName()), "INFO");
    addLog("All endpoints updated for " + EnvironmentConfig::instance().environmentName(), "INFO");
}

void MainWindow::updateCallDomainDisplay()
{
    if (m_domainDisplayLabel) {
        QString fullDomain = m_sipDomain;
        QString truncatedDomain = fullDomain.length() > 19 ? "..." + fullDomain.right(19) : fullDomain;
        m_domainDisplayLabel->setText(QString("📍 Registers to: <b>%1</b>").arg(truncatedDomain));
        m_domainDisplayLabel->setToolTip(fullDomain);
    }
}

void MainWindow::updateCallInstructions()
{
    if (!m_callInstructionLabel) return;
    
    if (m_oneWayAudioRadio && m_oneWayAudioRadio->isChecked()) {
        m_callInstructionLabel->setText(
            "ℹ️ <b>One-Way Audio Check (calls *1):</b> You will hear a message from Eltropy VoIP testing platform. "
            "If audio is clear, hang up. If not audible, there may be a RTP firewall issue with your network blocking incoming audio."
        );
        m_callInstructionLabel->setStyleSheet(
            "background-color: #2d2d30; "
            "border-left: 3px solid #3498DB; "
            "padding: 10px; "
            "color: #d4d4d4; "
            "border-radius: 3px; "
            "font-size: 12pt;"
        );
    } else if (m_twoWayAudioRadio && m_twoWayAudioRadio->isChecked()) {
        m_callInstructionLabel->setText(
            "ℹ️ <b>Two-Way Audio Check (calls *2):</b> You will land in a 2-way audio check system. "
            "Speak for 15 seconds, then you'll hear your recording played back. "
            "If playback doesn't work, there may be an RTP firewall issue with your network."
        );
        m_callInstructionLabel->setStyleSheet(
            "background-color: #2d2d30; "
            "border-left: 3px solid #27AE60; "
            "padding: 10px; "
            "color: #d4d4d4; "
            "border-radius: 3px; "
            "font-size: 12pt;"
        );
    } else if (m_customNumberRadio && m_customNumberRadio->isChecked()) {
        m_callInstructionLabel->setText(
            "ℹ️ <b>Custom Number Call:</b> Calling the number entered in textbox. "
            "This will place a regular call to the specified extension or phone number."
        );
        m_callInstructionLabel->setStyleSheet(
            "background-color: #2d2d30; "
            "border-left: 3px solid #F39C12; "
            "padding: 10px; "
            "color: #d4d4d4; "
            "border-radius: 3px; "
            "font-size: 12pt;"
        );
    }
}

void MainWindow::rebuildConnectivityBlocks()
{
    // Clear existing blocks
    QLayoutItem *item;
    while ((item = m_connectivityGridLayout->takeAt(0)) != nullptr) {
        delete item->widget();
        delete item;
    }
    m_testBlocks.clear();
    
    QString host = EnvironmentConfig::instance().getSipEndpoint();
    QString tcpPortCheckHost = EnvironmentConfig::instance().getTcpPortCheckEndpoint();
    
    int row = 0, col = 0;
    auto createBlock = [&](const QString &emoji, const QString &title, const QString &description, ConnectivityResult::Protocol protocol, int port) {
        ConnectivityTestBlock *block = new ConnectivityTestBlock(emoji, title, description, protocol, host, port, m_connectivityScrollContent);
        connect(block, &ConnectivityTestBlock::testRequested, this, &MainWindow::onTestBlockRequested);
        QString key = getBlockKey(protocol, host, port);
        m_testBlocks[key] = block;
        m_connectivityGridLayout->addWidget(block, row, col);
        col++;
        if (col >= 2) {
            col = 0;
            row++;
        }
        return block;
    };
    
    createBlock("🔌", "TCP Port 5060", "Standard SIP signaling to " + host + " over TCP", ConnectivityResult::TCP, 5060);
    createBlock("📡", "UDP Port 5060", "Standard SIP signaling to " + host + " over UDP", ConnectivityResult::UDP, 5060);
    createBlock("🔌", "TCP Port 5080", "Alternative SIP signaling to " + host + " over TCP", ConnectivityResult::TCP, 5080);
    createBlock("📡", "UDP Port 5080", "Alternative SIP signaling to " + host + " over UDP", ConnectivityResult::UDP, 5080);
    createBlock("🌐", "WSS Port 443", "WebSocket Secure for web-based calls to " + host, ConnectivityResult::WSS, 443);
    
    // RTP port tests using TCP to domain name
    ConnectivityTestBlock *rtpBlock = new ConnectivityTestBlock("🎙️", "TCP Port 16381 (RTP)", "Media port connectivity check to " + tcpPortCheckHost, ConnectivityResult::TCP, tcpPortCheckHost, 16381, m_connectivityScrollContent);
    QString rtpKey = getBlockKey(ConnectivityResult::TCP, tcpPortCheckHost, 16381);
    m_testBlocks[rtpKey] = rtpBlock;
    m_connectivityGridLayout->addWidget(rtpBlock, row, col);
    col++;
    if (col >= 2) {
        col = 0;
        row++;
    }
    
    if (col != 0) {
        m_connectivityGridLayout->setColumnStretch(col, 1);
    }
}

void MainWindow::rebuildSipRegistrationBlocks()
{
    // Clear existing blocks
    QLayoutItem *item;
    while ((item = m_sipBlocksLayout->takeAt(0)) != nullptr) {
        delete item->widget();
        delete item;
    }
    m_sipBlocks.clear();
    
    // Create registration blocks for each transport/port combination
    struct SipTestConfig {
        QString name;
        int port;
        SipTransportType type;
    };
    
    QList<SipTestConfig> sipConfigs = {
        {"TCP", 5060, SipTransportType::TCP},
        {"TLS", 5061, SipTransportType::TLS},
        {"UDP", 5060, SipTransportType::UDP},
        {"TCP", 5080, SipTransportType::TCP},
        {"UDP", 5080, SipTransportType::UDP}
    };
    
    // Add blocks in 2-column grid layout
    int sipRow = 0, sipCol = 0;
    for (const auto &config : sipConfigs) {
        SipRegistrationBlock *block = new SipRegistrationBlock(
            config.name,
            m_sipProxy,
            config.port,
            config.type,
            m_sipScrollWidget
        );
        
        QString key = getSipBlockKey(config.type, m_sipProxy, config.port);
        m_sipBlocks[key] = block;
        
        connect(block, &SipRegistrationBlock::testRequested,
                this, &MainWindow::onSipBlockRequested);
        connect(block, &SipRegistrationBlock::unregisterRequested,
                this, &MainWindow::onSipUnregisterRequested);
        
        m_sipBlocksLayout->addWidget(block, sipRow, sipCol);
        
        sipCol++;
        if (sipCol >= 2) {
            sipCol = 0;
            sipRow++;
        }
    }
}

// Include Advanced Checks tab implementation
#include "mainwindow_advancedtab.cpp"

// Include call testing tab implementation
#include "mainwindow_calltab.cpp"

// Include VoIP Quality tab implementation
#include "mainwindow_voipqualitytab.cpp"
