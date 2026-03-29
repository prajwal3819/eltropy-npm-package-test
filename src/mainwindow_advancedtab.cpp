// Advanced Checks Tab Implementation
// This file is included at the end of mainwindow.cpp

#include "connectivity/sipalgchecker.h"
#include "connectivity/nattypechecker.h"
#include "models/environmentconfig.h"

void MainWindow::createAdvancedChecksTab()
{
    m_advancedChecksWidget = new QWidget();
    QVBoxLayout *mainLayout = new QVBoxLayout(m_advancedChecksWidget);
    m_advancedChecksWidget->setStyleSheet("background-color: black;");
    mainLayout->setContentsMargins(20, 20, 20, 20);
    mainLayout->setSpacing(15);
    
    // Title
    QLabel *titleLabel = new QLabel("Advanced Network Diagnostics");
    QFont titleFont = titleLabel->font();
    titleFont.setPointSize(23);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: #d4d4d4; padding: 10px;");
    mainLayout->addWidget(titleLabel);
    
    // Description
    QLabel *descLabel = new QLabel(
        "Advanced diagnostic tools to detect network issues that may affect SIP connectivity."
    );
    descLabel->setWordWrap(true);
    descLabel->setStyleSheet("color: #a0a0a0; padding: 5px; font-size: 11pt;");
    mainLayout->addWidget(descLabel);
    
    mainLayout->addSpacing(10);
    
    // Create horizontal layout for side-by-side sections
    QHBoxLayout *sectionsLayout = new QHBoxLayout();
    sectionsLayout->setSpacing(15);
    
    // SIP ALG Detection Section
    QGroupBox *sipAlgGroup = new QGroupBox("SIP ALG Detection");
    sipAlgGroup->setStyleSheet(
        "QGroupBox {"
        "    background-color: #2d2d30;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 5px;"
        "    margin-top: 10px;"
        "    padding: 15px;"
        "    font-size: 20pt;"
        "    font-weight: bold;"
        "    color: #d4d4d4;"
        "}"
        "QGroupBox::title {"
        "    subcontrol-origin: margin;"
        "    left: 10px;"
        "    padding: 0 5px;"
        "}"
    );
    
    QVBoxLayout *sipAlgLayout = new QVBoxLayout(sipAlgGroup);
    sipAlgLayout->setSpacing(10);
    
    // Info text
    QLabel *sipAlgInfo = new QLabel(
        "SIP ALG (Application Layer Gateway) is a router feature that can interfere with SIP traffic "
        "by modifying packet headers. This often causes one-way audio, failed connections, or registration issues.\n\n"
        "This test will detect if your router is modifying SIP packets."
    );
    sipAlgInfo->setWordWrap(true);
    sipAlgInfo->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 5px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px;"
    );
    sipAlgLayout->addWidget(sipAlgInfo);
    
    // Input fields
    QHBoxLayout *inputLayout = new QHBoxLayout();
    
    QLabel *hostLabel = new QLabel("SIP Server:");
    hostLabel->setStyleSheet("color: #d4d4d4; font-weight: normal; min-width: 80px;");
    inputLayout->addWidget(hostLabel);
    
    m_sipAlgHostEdit = new QLineEdit();
    m_sipAlgHostEdit->setPlaceholderText("e.g., " + EnvironmentConfig::instance().getSipEndpoint());
    m_sipAlgHostEdit->setText(EnvironmentConfig::instance().getSipEndpoint());
    m_sipAlgHostEdit->setStyleSheet(
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
    inputLayout->addWidget(m_sipAlgHostEdit, 1);
    
    QLabel *portLabel = new QLabel("Port:");
    portLabel->setStyleSheet("color: #d4d4d4; font-weight: normal; margin-left: 10px;");
    inputLayout->addWidget(portLabel);
    
    m_sipAlgPortSpin = new QSpinBox();
    m_sipAlgPortSpin->setRange(1, 65535);
    m_sipAlgPortSpin->setValue(5060);
    m_sipAlgPortSpin->setStyleSheet(
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
    inputLayout->addWidget(m_sipAlgPortSpin);
    
    sipAlgLayout->addLayout(inputLayout);
    
    // Check button
    m_checkSipAlgBtn = new QPushButton("Check for SIP ALG");
    m_checkSipAlgBtn->setStyleSheet(
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
    connect(m_checkSipAlgBtn, &QPushButton::clicked, this, &MainWindow::onCheckSipAlgClicked);
    sipAlgLayout->addWidget(m_checkSipAlgBtn);
    
    // Result label
    m_sipAlgResultLabel = new QLabel("Click 'Check for SIP ALG' to test your network.");
    m_sipAlgResultLabel->setWordWrap(true);
    m_sipAlgResultLabel->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #3e3e42;"
    );
    m_sipAlgResultLabel->setMinimumHeight(80);
    m_sipAlgResultLabel->setAlignment(Qt::AlignTop | Qt::AlignLeft);
    sipAlgLayout->addWidget(m_sipAlgResultLabel);
    
    sectionsLayout->addWidget(sipAlgGroup);
    
    // NAT Type Detection Section
    QGroupBox *natTypeGroup = new QGroupBox("NAT Type Detection");
    natTypeGroup->setStyleSheet(
        "QGroupBox {"
        "    background-color: #2d2d30;"
        "    border: 1px solid #3e3e42;"
        "    border-radius: 5px;"
        "    margin-top: 10px;"
        "    padding: 15px;"
        "    font-size: 20pt;"
        "    font-weight: bold;"
        "    color: #d4d4d4;"
        "}"
        "QGroupBox::title {"
        "    subcontrol-origin: margin;"
        "    left: 10px;"
        "    padding: 0 5px;"
        "}"
    );
    
    QVBoxLayout *natTypeLayout = new QVBoxLayout(natTypeGroup);
    natTypeLayout->setSpacing(10);
    
    // Info text
    QLabel *natTypeInfo = new QLabel(
        "NAT (Network Address Translation) type affects how your router handles VoIP traffic. "
        "This test uses STUN protocol to determine your NAT type.\n\n"
        "NAT Types (from best to worst for VoIP):\n"
        "• Open Internet / Full Cone - Excellent\n"
        "• Restricted Cone / Port Restricted - Good\n"
        "• Symmetric NAT - Problematic (may need TURN relay)"
    );
    natTypeInfo->setWordWrap(true);
    natTypeInfo->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 5px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px;"
    );
    natTypeLayout->addWidget(natTypeInfo);
    
    // STUN server input
    QHBoxLayout *stunInputLayout = new QHBoxLayout();
    
    QLabel *stunLabel = new QLabel("STUN Server:");
    stunLabel->setStyleSheet("color: #d4d4d4; font-weight: normal; min-width: 100px;");
    stunInputLayout->addWidget(stunLabel);
    
    m_natStunServerEdit = new QLineEdit();
    m_natStunServerEdit->setPlaceholderText("e.g., stun.l.google.com");
    m_natStunServerEdit->setText("stun.l.google.com:19302");
    m_natStunServerEdit->setStyleSheet(
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
    stunInputLayout->addWidget(m_natStunServerEdit, 1);
    
    natTypeLayout->addLayout(stunInputLayout);
    
    // Check button
    m_checkNatTypeBtn = new QPushButton("Detect NAT Type");
    m_checkNatTypeBtn->setStyleSheet(
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
    connect(m_checkNatTypeBtn, &QPushButton::clicked, this, &MainWindow::onCheckNatTypeClicked);
    natTypeLayout->addWidget(m_checkNatTypeBtn);
    
    // Result label
    m_natTypeResultLabel = new QLabel("Click 'Detect NAT Type' to check your network configuration.");
    m_natTypeResultLabel->setWordWrap(true);
    m_natTypeResultLabel->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #3e3e42;"
    );
    m_natTypeResultLabel->setMinimumHeight(100);
    m_natTypeResultLabel->setAlignment(Qt::AlignTop | Qt::AlignLeft);
    natTypeLayout->addWidget(m_natTypeResultLabel);
    
    sectionsLayout->addWidget(natTypeGroup);
    
    // Add the horizontal sections layout to main layout
    mainLayout->addLayout(sectionsLayout);
    
    // Add stretch to push everything to the top
    mainLayout->addStretch();
}

void MainWindow::onCheckSipAlgClicked()
{
    QString host = m_sipAlgHostEdit->text().trimmed();
    int port = m_sipAlgPortSpin->value();
    
    if (host.isEmpty()) {
        m_sipAlgResultLabel->setText("❌ Please enter a SIP server address.");
        m_sipAlgResultLabel->setStyleSheet(
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
    
    m_checkSipAlgBtn->setEnabled(false);
    m_sipAlgResultLabel->setText("🔍 Checking for SIP ALG...\n\nSending SIP OPTIONS to " + host + ":" + QString::number(port));
    m_sipAlgResultLabel->setStyleSheet(
        "color: #4ec9b0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #4ec9b0;"
    );
    
    addLog("Starting SIP ALG detection test...", "INFO");
    addLog(QString("Target: %1:%2").arg(host).arg(port), "INFO");
    
    // Create and run SIP ALG checker
    SipAlgChecker *checker = new SipAlgChecker(this);
    connect(checker, &SipAlgChecker::connectivityChecked, this, &MainWindow::onSipAlgCheckCompleted);
    connect(checker, &SipAlgChecker::progressUpdate, this, &MainWindow::onSipAlgProgressUpdate);
    
    checker->checkConnectivity(host, port, 10000); // 10 second timeout
}

void MainWindow::onSipAlgCheckCompleted(const ConnectivityResult &result)
{
    m_checkSipAlgBtn->setEnabled(true);
    
    QString statusText;
    QString styleSheet;
    
    if (result.status() == ConnectivityResult::Success) {
        statusText = "✅ No SIP ALG Detected\n\n"
                    "Your router is NOT modifying SIP packets. This is good!\n\n"
                    "SIP traffic should work normally without interference.";
        styleSheet = "color: #4ec9b0; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #4ec9b0;";
        addLog("✅ SIP ALG Check: PASSED - No SIP ALG detected", "SUCCESS");
    } else if (result.status() == ConnectivityResult::Failed) {
        if (result.message().contains("SIP ALG DETECTED")) {
            statusText = "⚠️ SIP ALG DETECTED!\n\n"
                        "Your router is modifying SIP packets. This can cause:\n"
                        "• One-way audio or no audio\n"
                        "• Failed call connections\n"
                        "• Registration issues\n\n"
                        "📋 Recommendation: Disable SIP ALG in your router settings.";
            styleSheet = "color: #f48771; "
                        "font-size: 10pt; "
                        "font-weight: normal; "
                        "padding: 10px; "
                        "background-color: #1e1e1e; "
                        "border-radius: 3px; "
                        "border: 1px solid #f48771;";
            addLog("⚠️ SIP ALG Check: FAILED - SIP ALG is active on your router", "ERROR");
        } else {
            statusText = "❌ Test Failed\n\n" + result.message();
            styleSheet = "color: #f48771; "
                        "font-size: 10pt; "
                        "font-weight: normal; "
                        "padding: 10px; "
                        "background-color: #1e1e1e; "
                        "border-radius: 3px; "
                        "border: 1px solid #f48771;";
            addLog("❌ SIP ALG Check: ERROR - " + result.message(), "ERROR");
        }
    } else if (result.status() == ConnectivityResult::Timeout) {
        statusText = "⏱️ Test Timed Out\n\n"
                    "No response received from the SIP server.\n\n"
                    "This could mean:\n"
                    "• Server is not responding\n"
                    "• Firewall is blocking UDP port " + QString::number(result.port()) + "\n"
                    "• Network connectivity issues\n\n"
                    "Cannot determine SIP ALG status.";
        styleSheet = "color: #dcdcaa; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #dcdcaa;";
        addLog("⏱️ SIP ALG Check: TIMEOUT - No response from server", "ERROR");
    }
    
    m_sipAlgResultLabel->setText(statusText);
    m_sipAlgResultLabel->setStyleSheet(styleSheet);
    
    // Clean up checker
    sender()->deleteLater();
}

void MainWindow::onSipAlgProgressUpdate(const QString &message)
{
    addLog("SIP ALG: " + message, "INFO");
}

void MainWindow::onCheckNatTypeClicked()
{
    QString stunServer = m_natStunServerEdit->text().trimmed();
    
    if (stunServer.isEmpty()) {
        m_natTypeResultLabel->setText("❌ Please enter a STUN server address.");
        m_natTypeResultLabel->setStyleSheet(
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
    
    // Parse server:port
    QString server = stunServer;
    int port = 3478; // Default STUN port
    
    if (stunServer.contains(':')) {
        QStringList parts = stunServer.split(':');
        server = parts[0];
        if (parts.size() > 1) {
            port = parts[1].toInt();
            if (port <= 0 || port > 65535) {
                port = 3478;
            }
        }
    }
    
    m_checkNatTypeBtn->setEnabled(false);
    m_natTypeResultLabel->setText("🔍 Detecting NAT type...\n\nConnecting to STUN server: " + server + ":" + QString::number(port));
    m_natTypeResultLabel->setStyleSheet(
        "color: #4ec9b0; "
        "font-size: 10pt; "
        "font-weight: normal; "
        "padding: 10px; "
        "background-color: #1e1e1e; "
        "border-radius: 3px; "
        "border: 1px solid #4ec9b0;"
    );
    
    addLog("Starting NAT type detection...", "INFO");
    addLog(QString("STUN Server: %1:%2").arg(server).arg(port), "INFO");
    
    // Create and run NAT type checker
    NatTypeChecker *checker = new NatTypeChecker(this);
    connect(checker, &NatTypeChecker::connectivityChecked, this, &MainWindow::onNatTypeCheckCompleted);
    connect(checker, &NatTypeChecker::progressUpdate, this, &MainWindow::onNatTypeProgressUpdate);
    
    checker->checkConnectivity(server, port, 10000); // 10 second timeout
}

void MainWindow::onNatTypeCheckCompleted(const ConnectivityResult &result)
{
    m_checkNatTypeBtn->setEnabled(true);
    
    QString statusText;
    QString styleSheet;
    
    if (result.status() == ConnectivityResult::Success) {
        statusText = "✅ NAT Type Detected\n\n" + result.message();
        
        // Determine color based on NAT type quality
        QString borderColor = "#4ec9b0"; // Green for good NAT types
        if (result.message().contains("Symmetric")) {
            borderColor = "#dcdcaa"; // Yellow for symmetric NAT
        } else if (result.message().contains("Full Cone") || result.message().contains("Open Internet")) {
            borderColor = "#4ec9b0"; // Green for excellent NAT types
        }
        
        styleSheet = QString(
            "color: #d4d4d4; "
            "font-size: 10pt; "
            "font-weight: normal; "
            "padding: 10px; "
            "background-color: #1e1e1e; "
            "border-radius: 3px; "
            "border: 1px solid %1;"
        ).arg(borderColor);
        
        addLog("✅ NAT Type Detection: SUCCESS", "SUCCESS");
        addLog(result.message(), "INFO");
    } else if (result.status() == ConnectivityResult::Failed) {
        statusText = "❌ Detection Failed\n\n" + result.message();
        styleSheet = "color: #f48771; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #f48771;";
        addLog("❌ NAT Type Detection: FAILED - " + result.message(), "ERROR");
    } else if (result.status() == ConnectivityResult::Timeout) {
        statusText = "⏱️ Detection Timed Out\n\n"
                    "No response from STUN server.\n\n"
                    "Possible causes:\n"
                    "• Firewall blocking UDP traffic\n"
                    "• STUN server is down\n"
                    "• Network connectivity issues";
        styleSheet = "color: #dcdcaa; "
                    "font-size: 10pt; "
                    "font-weight: normal; "
                    "padding: 10px; "
                    "background-color: #1e1e1e; "
                    "border-radius: 3px; "
                    "border: 1px solid #dcdcaa;";
        addLog("⏱️ NAT Type Detection: TIMEOUT", "ERROR");
    }
    
    m_natTypeResultLabel->setText(statusText);
    m_natTypeResultLabel->setStyleSheet(styleSheet);
    
    // Clean up checker
    sender()->deleteLater();
}

void MainWindow::onNatTypeProgressUpdate(const QString &message)
{
    addLog("NAT Detection: " + message, "INFO");
}
