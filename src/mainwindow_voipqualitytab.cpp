// VoIP Quality Tab Implementation
// This file is included at the end of mainwindow.cpp

#include "connectivity/voipqualitychecker.h"

void MainWindow::createVoIPQualityTab()
{
    m_voipQualityWidget = new QWidget();
    QVBoxLayout *mainLayout = new QVBoxLayout(m_voipQualityWidget);
    m_voipQualityWidget->setStyleSheet("background-color: black;");
    mainLayout->setContentsMargins(20, 20, 20, 20);
    mainLayout->setSpacing(15);
    
    // Title
    QLabel *titleLabel = new QLabel("VoIP Quality Metrics");
    QFont titleFont = titleLabel->font();
    titleFont.setPointSize(16);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: #d4d4d4; padding: 10px;");
    mainLayout->addWidget(titleLabel);
    
    // Description
    QLabel *descLabel = new QLabel(
        "Measure real-time VoIP call quality metrics including jitter, packet loss, latency, and MOS score."
    );
    descLabel->setWordWrap(true);
    descLabel->setStyleSheet("color: #a0a0a0; padding: 5px; font-size: 11pt;");
    mainLayout->addWidget(descLabel);
    
    mainLayout->addSpacing(10);
    
    // Create horizontal layout for side-by-side sections
    QHBoxLayout *sectionsLayout = new QHBoxLayout();
    sectionsLayout->setSpacing(15);
    
    // Test Configuration Section
    QGroupBox *configGroup = new QGroupBox("Test Configuration");
    configGroup->setStyleSheet(
        "QGroupBox {"
        "    background-color: #2d2d30;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 5px;"
        "    margin-top: 10px;"
        "    padding: 15px;"
        "    font-size: 12pt;"
        "    font-weight: bold;"
        "    color: #d4d4d4;"
        "}"
        "QGroupBox::title {"
        "    subcontrol-origin: margin;"
        "    left: 10px;"
        "    padding: 0 5px;"
        "}"
    );
    
    QVBoxLayout *configLayout = new QVBoxLayout(configGroup);
    configLayout->setSpacing(10);
    
    // Server input
    QHBoxLayout *serverLayout = new QHBoxLayout();
    
    QLabel *serverLabel = new QLabel("Test Server:");
    serverLabel->setStyleSheet("color: #d4d4d4; font-weight: normal; min-width: 100px;");
    serverLayout->addWidget(serverLabel);
    
    m_voipQualityServerEdit = new QLineEdit();
    m_voipQualityServerEdit->setPlaceholderText("e.g., voip.eltropy.com");
    m_voipQualityServerEdit->setText("voip.eltropy.com");
    m_voipQualityServerEdit->setStyleSheet(
        "QLineEdit {"
        "    background-color: #1e1e1e;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 3px;"
        "    padding: 8px;"
        "    color: #d4d4d4;"
        "    font-size: 10pt;"
        "}"
        "QLineEdit:focus {"
        "    border: 1px solid #007acc;"
        "}"
    );
    serverLayout->addWidget(m_voipQualityServerEdit, 1);
    
    QLabel *portLabel = new QLabel("Port:");
    portLabel->setStyleSheet("color: #d4d4d4; font-weight: normal; margin-left: 10px;");
    serverLayout->addWidget(portLabel);
    
    m_voipQualityPortSpin = new QSpinBox();
    m_voipQualityPortSpin->setRange(1, 65535);
    m_voipQualityPortSpin->setValue(10000);
    m_voipQualityPortSpin->setStyleSheet(
        "QSpinBox {"
        "    background-color: #1e1e1e;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 3px;"
        "    padding: 8px;"
        "    color: #d4d4d4;"
        "    font-size: 10pt;"
        "    min-width: 80px;"
        "}"
        "QSpinBox:focus {"
        "    border: 1px solid #007acc;"
        "}"
    );
    serverLayout->addWidget(m_voipQualityPortSpin);
    
    configLayout->addLayout(serverLayout);
    
    // Start test button
    m_startVoipQualityBtn = new QPushButton("Start Quality Test");
    m_startVoipQualityBtn->setStyleSheet(
        "QPushButton {"
        "    background-color: #0e639c;"
        "    color: white;"
        "    border: none;"
        "    border-radius: 3px;"
        "    padding: 10px 20px;"
        "    font-size: 11pt;"
        "    font-weight: bold;"
        "}"
        "QPushButton:hover {"
        "    background-color: #1177bb;"
        "}"
        "QPushButton:pressed {"
        "    background-color: #0d5a8f;"
        "}"
        "QPushButton:disabled {"
        "    background-color: #3e3e42;"
        "    color: #808080;"
        "}"
    );
    connect(m_startVoipQualityBtn, &QPushButton::clicked, this, &MainWindow::onStartVoipQualityTest);
    configLayout->addWidget(m_startVoipQualityBtn);
    
    sectionsLayout->addWidget(configGroup, 1);
    
    // Metrics Display Section
    QGroupBox *metricsGroup = new QGroupBox("Quality Metrics");
    metricsGroup->setStyleSheet(
        "QGroupBox {"
        "    background-color: #2d2d30;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 5px;"
        "    margin-top: 10px;"
        "    padding: 15px;"
        "    font-size: 12pt;"
        "    font-weight: bold;"
        "    color: #d4d4d4;"
        "}"
        "QGroupBox::title {"
        "    subcontrol-origin: margin;"
        "    left: 10px;"
        "    padding: 0 5px;"
        "}"
    );
    
    QGridLayout *metricsLayout = new QGridLayout(metricsGroup);
    metricsLayout->setSpacing(15);
    
    QString metricLabelStyle = "color: #a0a0a0; font-weight: normal; font-size: 10pt;";
    QString metricValueStyle = "color: #4ec9b0; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;";
    
    // Jitter
    QLabel *jitterLabel = new QLabel("Jitter (ms)");
    jitterLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(jitterLabel, 0, 0);
    
    m_jitterValueLabel = new QLabel("--");
    m_jitterValueLabel->setAlignment(Qt::AlignCenter);
    m_jitterValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_jitterValueLabel, 1, 0);
    
    // Packet Loss
    QLabel *packetLossLabel = new QLabel("Packet Loss (%)");
    packetLossLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(packetLossLabel, 0, 1);
    
    m_packetLossValueLabel = new QLabel("--");
    m_packetLossValueLabel->setAlignment(Qt::AlignCenter);
    m_packetLossValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_packetLossValueLabel, 1, 1);
    
    // Latency
    QLabel *latencyLabel = new QLabel("Latency (ms)");
    latencyLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(latencyLabel, 0, 2);
    
    m_latencyValueLabel = new QLabel("--");
    m_latencyValueLabel->setAlignment(Qt::AlignCenter);
    m_latencyValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_latencyValueLabel, 1, 2);
    
    // MOS Score
    QLabel *mosLabel = new QLabel("MOS Score");
    mosLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(mosLabel, 2, 0);
    
    m_mosValueLabel = new QLabel("--");
    m_mosValueLabel->setAlignment(Qt::AlignCenter);
    m_mosValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_mosValueLabel, 3, 0);
    
    // Burst Packet Loss
    QLabel *burstLossLabel = new QLabel("Burst Loss (%)");
    burstLossLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(burstLossLabel, 2, 1);
    
    m_burstLossValueLabel = new QLabel("--");
    m_burstLossValueLabel->setAlignment(Qt::AlignCenter);
    m_burstLossValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_burstLossValueLabel, 3, 1);
    
    // Congestion
    QLabel *congestionLabel = new QLabel("Congestion");
    congestionLabel->setStyleSheet(metricLabelStyle);
    metricsLayout->addWidget(congestionLabel, 2, 2);
    
    m_congestionValueLabel = new QLabel("--");
    m_congestionValueLabel->setAlignment(Qt::AlignCenter);
    m_congestionValueLabel->setStyleSheet(metricValueStyle);
    metricsLayout->addWidget(m_congestionValueLabel, 3, 2);
    
    sectionsLayout->addWidget(metricsGroup, 1);
    
    // Add the horizontal sections layout to main layout
    mainLayout->addLayout(sectionsLayout);
    
    // Status label
    m_voipQualityStatusLabel = new QLabel("Click 'Start Quality Test' to begin measuring VoIP quality metrics.");
    m_voipQualityStatusLabel->setWordWrap(true);
    m_voipQualityStatusLabel->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #3e3e42;"
    );
    m_voipQualityStatusLabel->setAlignment(Qt::AlignTop | Qt::AlignLeft);
    mainLayout->addWidget(m_voipQualityStatusLabel);
    
    // Add stretch to push everything to the top
    mainLayout->addStretch();
}

void MainWindow::onStartVoipQualityTest()
{
    QString server = m_voipQualityServerEdit->text().trimmed();
    int port = m_voipQualityPortSpin->value();
    
    if (server.isEmpty()) {
        m_voipQualityStatusLabel->setText("❌ Please enter a test server address.");
        m_voipQualityStatusLabel->setStyleSheet(
            "color: #f48771; "
            "font-size: 10pt; "
            "font-weight: normal; "
            "padding: 10px; "
            "background-color: #1e1e1e; "
            "border-radius: 3px; "
            "border: 1px solid #f48771;"
        );
        return;
    }
    
    // Reset metrics display
    m_jitterValueLabel->setText("--");
    m_packetLossValueLabel->setText("--");
    m_latencyValueLabel->setText("--");
    m_mosValueLabel->setText("--");
    m_burstLossValueLabel->setText("--");
    m_congestionValueLabel->setText("--");
    
    m_startVoipQualityBtn->setEnabled(false);
    m_voipQualityStatusLabel->setText("🔍 Starting VoIP quality test...\n\nSending test packets to " + server + ":" + QString::number(port));
    m_voipQualityStatusLabel->setStyleSheet(
        "color: #4ec9b0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #4ec9b0;"
    );
    
    addLog("Starting VoIP quality test...", "INFO");
    addLog(QString("Server: %1:%2").arg(server).arg(port), "INFO");
    
    // Create and run VoIP quality checker
    VoIPQualityChecker *checker = new VoIPQualityChecker(this);
    connect(checker, &VoIPQualityChecker::connectivityChecked, this, &MainWindow::onVoipQualityTestCompleted);
    connect(checker, &VoIPQualityChecker::progressUpdate, this, &MainWindow::onVoipQualityProgressUpdate);
    connect(checker, &VoIPQualityChecker::metricsUpdated, this, &MainWindow::onVoipQualityMetricsUpdated);
    
    checker->checkConnectivity(server, port, 30000); // 30 second timeout
}

void MainWindow::onVoipQualityTestCompleted(const ConnectivityResult &result)
{
    m_startVoipQualityBtn->setEnabled(true);
    
    QString statusText;
    QString styleSheet;
    
    if (result.status() == ConnectivityResult::Success) {
        statusText = "✅ Quality Test Complete\n\n" + result.message();
        styleSheet = "color: #4ec9b0; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #4ec9b0;";
        addLog("✅ VoIP Quality Test: COMPLETED", "SUCCESS");
    } else if (result.status() == ConnectivityResult::Failed) {
        statusText = "❌ Test Failed\n\n" + result.message();
        styleSheet = "color: #f48771; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #f48771;";
        addLog("❌ VoIP Quality Test: FAILED - " + result.message(), "ERROR");
    } else if (result.status() == ConnectivityResult::Timeout) {
        statusText = "⏱️ Test Timed Out\n\n" + result.message();
        styleSheet = "color: #dcdcaa; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #dcdcaa;";
        addLog("⏱️ VoIP Quality Test: TIMEOUT", "ERROR");
    }
    
    m_voipQualityStatusLabel->setText(statusText);
    m_voipQualityStatusLabel->setStyleSheet(styleSheet);
    
    // Clean up checker
    sender()->deleteLater();
}

void MainWindow::onVoipQualityProgressUpdate(const QString &message)
{
    addLog("VoIP Quality: " + message, "INFO");
}

void MainWindow::onVoipQualityMetricsUpdated(const VoIPQualityMetrics &metrics)
{
    // Update jitter
    m_jitterValueLabel->setText(QString::number(metrics.jitter, 'f', 2));
    QString jitterColor = metrics.jitter < 20 ? "#4ec9b0" : (metrics.jitter < 50 ? "#dcdcaa" : "#f48771");
    m_jitterValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(jitterColor));
    
    // Update packet loss
    m_packetLossValueLabel->setText(QString::number(metrics.packetLoss, 'f', 2));
    QString lossColor = metrics.packetLoss < 1 ? "#4ec9b0" : (metrics.packetLoss < 3 ? "#dcdcaa" : "#f48771");
    m_packetLossValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(lossColor));
    
    // Update latency
    m_latencyValueLabel->setText(QString::number(metrics.latency, 'f', 2));
    QString latencyColor = metrics.latency < 150 ? "#4ec9b0" : (metrics.latency < 300 ? "#dcdcaa" : "#f48771");
    m_latencyValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(latencyColor));
    
    // Update MOS score
    m_mosValueLabel->setText(QString::number(metrics.mosScore, 'f', 2));
    QString mosColor = metrics.mosScore >= 4.0 ? "#4ec9b0" : (metrics.mosScore >= 3.0 ? "#dcdcaa" : "#f48771");
    m_mosValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(mosColor));
    
    // Update burst loss
    m_burstLossValueLabel->setText(QString::number(metrics.burstPacketLoss, 'f', 2));
    QString burstColor = metrics.burstPacketLoss < 2 ? "#4ec9b0" : (metrics.burstPacketLoss < 5 ? "#dcdcaa" : "#f48771");
    m_burstLossValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(burstColor));
    
    // Update congestion
    m_congestionValueLabel->setText(metrics.congestionDetected ? "Detected" : "None");
    QString congestionColor = metrics.congestionDetected ? "#f48771" : "#4ec9b0";
    m_congestionValueLabel->setStyleSheet(QString("color: %1; font-weight: bold; font-size: 18pt; padding: 10px; background-color: #1e1e1e; border-radius: 3px;").arg(congestionColor));
}
