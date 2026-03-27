// This file contains the createCallTestTab implementation
// It will be included at the end of mainwindow.cpp

void MainWindow::createCallTestTab()
{
    m_callTestWidget = new QWidget();
    m_callTestWidget->setStyleSheet("QWidget { background-color: black; }");
    
    QVBoxLayout *mainLayout = new QVBoxLayout(m_callTestWidget);
    mainLayout->setSpacing(20);
    mainLayout->setContentsMargins(20, 20, 20, 20);
    
    // Title
    QLabel *titleLabel = new QLabel("☎️ SIP Call Testing");
    QFont titleFont;
    titleFont.setPointSize(18);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: #f5ebebe6; margin-bottom: 10px;");
    titleLabel->setStyleSheet("background-color: #1e1e1ee6; margin-bottom: 10px;");
    mainLayout->addWidget(titleLabel);
    
    // Create horizontal layout for side-by-side sections
    QHBoxLayout *sectionsLayout = new QHBoxLayout();
    sectionsLayout->setSpacing(20);
    
    // Registration section
    QGroupBox *regGroup = new QGroupBox("1️⃣ Registration Configuration");
    regGroup->setStyleSheet(
        "QGroupBox { "
        "background-color: #1e1e1e; "
        "color: #d4d4d4; "
        "font-weight: bold; "
        "font-size: 23pt; "
        "border: 2px solid #3498DB; "
        "border-radius: 8px; "
        "margin-top: 10px; "
        "padding-top: 15px; "
        "}"
        "QGroupBox::title { "
        "subcontrol-origin: margin; "
        "left: 10px; "
        "padding: 0 5px; "
        "}"
    );
    QVBoxLayout *regLayout = new QVBoxLayout(regGroup);
    
    // Transport selection
    QHBoxLayout *transportLayout = new QHBoxLayout();
    QLabel *transportLabel = new QLabel("Transport:");
    transportLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    transportLabel->setMinimumWidth(90);
    m_transportCombo = new QComboBox();
    m_transportCombo->addItem("UDP", static_cast<int>(SipTransportType::UDP));
    m_transportCombo->addItem("TCP", static_cast<int>(SipTransportType::TCP));
    m_transportCombo->addItem("TLS", static_cast<int>(SipTransportType::TLS));
    m_transportCombo->setStyleSheet("padding: 8px; font-size: 11pt; color: #2c3e50; background-color: white;");
    m_transportCombo->setMinimumWidth(120);
    transportLayout->addWidget(transportLabel);
    transportLayout->addWidget(m_transportCombo);
    transportLayout->addSpacing(30);
    
    // Port selection
    QLabel *portLabel = new QLabel("Port:");
    portLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    portLabel->setMinimumWidth(60);
    m_portCombo = new QComboBox();
    m_portCombo->setStyleSheet("padding: 8px; font-size: 11pt; color: #2c3e50; background-color: white;");
    m_portCombo->setMinimumWidth(120);
    transportLayout->addWidget(portLabel);
    transportLayout->addWidget(m_portCombo);
    transportLayout->addStretch();
    
    regLayout->addLayout(transportLayout);
    
    // Update port options based on transport
    connect(m_transportCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), [this](int index) {
        m_portCombo->clear();
        SipTransportType transport = static_cast<SipTransportType>(m_transportCombo->itemData(index).toInt());
        
        if (transport == SipTransportType::TLS) {
            m_portCombo->addItem("5061", 5061);
        } else {
            m_portCombo->addItem("5060", 5060);
            m_portCombo->addItem("5080", 5080);
        }
    });
    
    // Initialize port options
    m_portCombo->addItem("5060", 5060);
    m_portCombo->addItem("5080", 5080);
    
    // Registration status
    m_registrationStatusLabel = new QLabel("⚪ Not registered");
    m_registrationStatusLabel->setStyleSheet(
        "font-size: 12pt; "
        "padding: 10px; "
        "background-color: #2d2d30; "
        "color: #d4d4d4; "
        "border-radius: 5px; "
        "margin: 10px 0;"
    );
    regLayout->addWidget(m_registrationStatusLabel);
    
    // Register/Unregister buttons
    QHBoxLayout *regButtonLayout = new QHBoxLayout();
    
    m_registerCallBtn = new QPushButton("📞 Register for Calls");
    m_registerCallBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #3498DB; "
        "color: white; "
        "font-weight: bold; "
        "padding: 12px; "
        "border-radius: 5px; "
        "font-size: 12pt; "
        "}"
        "QPushButton:hover { background-color: #2980B9; }"
        "QPushButton:disabled { background-color: #BDC3C7; }"
    );
    connect(m_registerCallBtn, &QPushButton::clicked, this, &MainWindow::onRegisterForCallClicked);
    regButtonLayout->addWidget(m_registerCallBtn);
    
    m_unregisterCallBtn = new QPushButton("📴 Unregister");
    m_unregisterCallBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #E74C3C; "
        "color: white; "
        "font-weight: bold; "
        "padding: 12px; "
        "border-radius: 5px; "
        "font-size: 12pt; "
        "}"
        "QPushButton:hover { background-color: #C0392B; }"
        "QPushButton:disabled { background-color: #BDC3C7; }"
    );
    m_unregisterCallBtn->setEnabled(false);
    connect(m_unregisterCallBtn, &QPushButton::clicked, this, &MainWindow::onUnregisterForCallClicked);
    regButtonLayout->addWidget(m_unregisterCallBtn);
    
    regLayout->addLayout(regButtonLayout);
    
    sectionsLayout->addWidget(regGroup);
    
    // Call section
    QGroupBox *callGroup = new QGroupBox("2️⃣ Make a Call");
    callGroup->setStyleSheet(
        "QGroupBox { "
        "background-color: #1e1e1e; "
        "color: #d4d4d4; "
        "font-weight: bold; "
        "font-size: 23pt; "
        "border: 2px solid #27AE60; "
        "border-radius: 8px; "
        "margin-top: 10px; "
        "padding-top: 15px; "
        "}"
        "QGroupBox::title { "
        "subcontrol-origin: margin; "
        "left: 10px; "
        "padding: 0 5px; "
        "}"
    );
    QVBoxLayout *callLayout = new QVBoxLayout(callGroup);
    
    // Destination input
    QHBoxLayout *destLayout = new QHBoxLayout();
    QLabel *destLabel = new QLabel("Call to:");
    destLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    destLabel->setMinimumWidth(90);
    m_destinationEdit = new QLineEdit();
    m_destinationEdit->setPlaceholderText("Enter extension (e.g., 7002, 7003)");
    m_destinationEdit->setStyleSheet("padding: 8px; font-size: 11pt; color: #2c3e50; background-color: white; border: 2px solid #bdc3c7; border-radius: 5px;");
    m_destinationEdit->setEnabled(false);
    destLayout->addWidget(destLabel);
    destLayout->addWidget(m_destinationEdit);
    callLayout->addLayout(destLayout);
    
    // Quick dial buttons
    QHBoxLayout *quickDialLayout = new QHBoxLayout();
    QLabel *quickLabel = new QLabel("Quick Dial:");
    quickLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    quickLabel->setMinimumWidth(90);
    quickDialLayout->addWidget(quickLabel);
    
    QStringList quickNumbers = {"7002", "7003", "7004", "7005"};
    for (const QString &number : quickNumbers) {
        QPushButton *quickBtn = new QPushButton(number);
        quickBtn->setStyleSheet(
            "QPushButton { "
            "background-color: #95a5a6; "
            "color: white; "
            "padding: 8px 16px; "
            "border-radius: 4px; "
            "font-weight: bold; "
            "font-size: 11pt; "
            "}"
            "QPushButton:hover { background-color: #7f8c8d; }"
            "QPushButton:disabled { background-color: #ecf0f1; color: #bdc3c7; }"
        );
        quickBtn->setEnabled(false);
        quickBtn->setMinimumWidth(70);
        connect(quickBtn, &QPushButton::clicked, [this, number]() {
            m_destinationEdit->setText(number);
        });
        quickDialLayout->addWidget(quickBtn);
        
        // Store for enabling/disabling later
        quickBtn->setProperty("quickDial", true);
    }
    quickDialLayout->addStretch();
    callLayout->addLayout(quickDialLayout);
    
    // Call status
    m_callStatusLabel = new QLabel("⚪ No active call");
    m_callStatusLabel->setStyleSheet(
        "font-size: 12pt; "
        "padding: 10px; "
        "background-color: #2d2d30; "
        "color: #d4d4d4; "
        "border-radius: 5px; "
        "margin: 10px 0;"
    );
    callLayout->addWidget(m_callStatusLabel);
    
    // Call control buttons
    QHBoxLayout *controlLayout = new QHBoxLayout();
    
    m_makeCallBtn = new QPushButton("📞 Make Call");
    m_makeCallBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #27AE60; "
        "color: white; "
        "font-weight: bold; "
        "padding: 12px; "
        "border-radius: 5px; "
        "font-size: 12pt; "
        "}"
        "QPushButton:hover { background-color: #229954; }"
        "QPushButton:disabled { background-color: #BDC3C7; }"
    );
    m_makeCallBtn->setEnabled(false);
    connect(m_makeCallBtn, &QPushButton::clicked, this, &MainWindow::onMakeCallClicked);
    controlLayout->addWidget(m_makeCallBtn);
    
    m_hangupBtn = new QPushButton("📴 Hang Up");
    m_hangupBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #E74C3C; "
        "color: white; "
        "font-weight: bold; "
        "padding: 12px; "
        "border-radius: 5px; "
        "font-size: 12pt; "
        "}"
        "QPushButton:hover { background-color: #C0392B; }"
        "QPushButton:disabled { background-color: #BDC3C7; }"
    );
    m_hangupBtn->setEnabled(false);
    connect(m_hangupBtn, &QPushButton::clicked, this, &MainWindow::onHangupCallClicked);
    controlLayout->addWidget(m_hangupBtn);
    
    m_muteBtn = new QPushButton("🔇 Mute");
    m_muteBtn->setStyleSheet(
        "QPushButton { "
        "background-color: #F39C12; "
        "color: white; "
        "font-weight: bold; "
        "padding: 12px; "
        "border-radius: 5px; "
        "font-size: 12pt; "
        "}"
        "QPushButton:hover { background-color: #D68910; }"
        "QPushButton:disabled { background-color: #BDC3C7; }"
    );
    m_muteBtn->setEnabled(false);
    m_muteBtn->setCheckable(true);
    connect(m_muteBtn, &QPushButton::toggled, this, &MainWindow::onMuteToggled);
    controlLayout->addWidget(m_muteBtn);
    
    callLayout->addLayout(controlLayout);
    
    sectionsLayout->addWidget(callGroup);
    
    // Add the side-by-side sections to main layout
    mainLayout->addLayout(sectionsLayout);
    
    // Info section
    QLabel *infoLabel = new QLabel(
        "ℹ️ <b>How to use:</b><br>"
        "1. Select transport (UDP/TCP/TLS) and port<br>"
        "2. Click 'Register for Calls' to register with credentials (7001/7001)<br>"
        "3. Enter destination extension or use Quick Dial buttons<br>"
        "4. Click 'Make Call' to initiate the call<br>"
        "5. Audio will work bidirectionally once call is connected<br>"
        "6. Use Mute to toggle microphone, Hang Up to end call"
    );
    infoLabel->setStyleSheet(
        "background-color: #2d2d30; "
        "border-left: 4px solid #1ABC9C; "
        "padding: 15px; "
        "color: #d4d4d4; "
        "border-radius: 5px; "
        "font-size: 10pt;"
    );
    infoLabel->setWordWrap(true);
    mainLayout->addWidget(infoLabel);
    
    mainLayout->addStretch();
}

void MainWindow::onRegisterForCallClicked()
{
    addLog("========================================", "INFO");
    addLog("Registering for call testing...", "INFO");
    
    SipTransportType transport = static_cast<SipTransportType>(
        m_transportCombo->currentData().toInt()
    );
    int port = m_portCombo->currentData().toInt();
    
    QString transportStr = m_transportCombo->currentText();
    addLog(QString("Transport: %1, Port: %2").arg(transportStr).arg(port), "INFO");
    
    m_registerCallBtn->setEnabled(false);
    m_registerCallBtn->setText("⏳ Registering...");
    m_registrationStatusLabel->setText("⏳ Registering...");
    
    bool success = m_callManager->registerForCalls(
        m_sipUsername,
        m_sipPassword,
        m_sipDomain,
        m_sipProxy,
        transport,
        port
    );
    
    if (!success) {
        m_registerCallBtn->setEnabled(true);
        m_registerCallBtn->setText("📞 Register for Calls");
    }
}

void MainWindow::onUnregisterForCallClicked()
{
    addLog("========================================", "INFO");
    addLog("Unregistering from call service...", "INFO");
    
    m_callManager->unregister();
    
    m_registrationStatusLabel->setText("⚪ Not registered");
    m_registrationStatusLabel->setStyleSheet(
        "font-size: 12pt; "
        "padding: 10px; "
        "background-color: #2d2d30; "
        "color: #d4d4d4; "
        "border-radius: 5px; "
        "margin: 10px 0;"
    );
    
    m_registerCallBtn->setEnabled(true);
    m_registerCallBtn->setText("📞 Register for Calls");
    m_unregisterCallBtn->setEnabled(false);
    
    m_makeCallBtn->setEnabled(false);
    m_destinationEdit->setEnabled(false);
    
    // Disable quick dial buttons
    for (QPushButton *btn : m_callTestWidget->findChildren<QPushButton*>()) {
        if (btn->property("quickDial").toBool()) {
            btn->setEnabled(false);
        }
    }
    
    addLog("Unregistered successfully", "SUCCESS");
}

void MainWindow::onMakeCallClicked()
{
    QString destination = m_destinationEdit->text().trimmed();
    
    if (destination.isEmpty()) {
        addLog("Please enter a destination number", "ERROR");
        return;
    }
    
    addLog(QString("Making call to %1...").arg(destination), "INFO");
    
    m_makeCallBtn->setEnabled(false);
    m_destinationEdit->setEnabled(false);
    
    // Disable quick dial buttons
    for (QPushButton *btn : m_callTestWidget->findChildren<QPushButton*>()) {
        if (btn->property("quickDial").toBool()) {
            btn->setEnabled(false);
        }
    }
    
    bool success = m_callManager->makeCall(destination);
    
    if (success) {
        m_hangupBtn->setEnabled(true);
    } else {
        m_makeCallBtn->setEnabled(true);
        m_destinationEdit->setEnabled(true);
        
        // Re-enable quick dial buttons
        for (QPushButton *btn : m_callTestWidget->findChildren<QPushButton*>()) {
            if (btn->property("quickDial").toBool()) {
                btn->setEnabled(true);
            }
        }
    }
}

void MainWindow::onHangupCallClicked()
{
    addLog("Hanging up call...", "INFO");
    m_callManager->hangupCall();
    
    m_hangupBtn->setEnabled(false);
    m_muteBtn->setEnabled(false);
    m_muteBtn->setChecked(false);
    m_muteBtn->setText("🔇 Mute");
}

void MainWindow::onMuteToggled()
{
    m_callManager->toggleMute();
    
    if (m_muteBtn->isChecked()) {
        m_muteBtn->setText("🔊 Unmute");
        addLog("Microphone muted", "INFO");
    } else {
        m_muteBtn->setText("🔇 Mute");
        addLog("Microphone unmuted", "INFO");
    }
}

void MainWindow::onCallRegistrationStatusChanged(bool registered, const QString &message)
{
    if (registered) {
        m_registrationStatusLabel->setText("✅ " + message);
        m_registrationStatusLabel->setStyleSheet(
            "font-size: 12pt; "
            "padding: 10px; "
            "background-color: #1e3a28; "
            "border-radius: 5px; "
            "margin: 10px 0; "
            "color: #4ade80;"
        );
        
        m_registerCallBtn->setEnabled(false);
        m_registerCallBtn->setText("✅ Registered");
        m_unregisterCallBtn->setEnabled(true);
        
        m_makeCallBtn->setEnabled(true);
        m_destinationEdit->setEnabled(true);
        
        // Enable quick dial buttons
        for (QPushButton *btn : m_callTestWidget->findChildren<QPushButton*>()) {
            if (btn->property("quickDial").toBool()) {
                btn->setEnabled(true);
            }
        }
        
        addLog("========================================", "SUCCESS");
        addLog("SIP Call Registration successful!", "SUCCESS");
        addLog(message, "SUCCESS");
        addLog("Ready to make calls", "SUCCESS");
        addLog("========================================", "SUCCESS");
    } else {
        m_registrationStatusLabel->setText("❌ " + message);
        m_registrationStatusLabel->setStyleSheet(
            "font-size: 12pt; "
            "padding: 10px; "
            "background-color: #3a1e1e; "
            "border-radius: 5px; "
            "margin: 10px 0; "
            "color: #f87171;"
        );
        
        m_registerCallBtn->setEnabled(true);
        m_registerCallBtn->setText("📞 Register for Calls");
        m_unregisterCallBtn->setEnabled(false);
        
        addLog("Registration failed: " + message, "ERROR");
    }
}

void MainWindow::onCallStateChanged(CallState state, const QString &info)
{
    QString statusText;
    QString styleSheet = "font-size: 12pt; padding: 10px; border-radius: 5px; margin: 10px 0;";
    
    switch (state) {
        case CallState::Idle:
            statusText = "⚪ No active call";
            styleSheet += "background-color: #2d2d30; color: #d4d4d4;";
            m_makeCallBtn->setEnabled(true);
            m_destinationEdit->setEnabled(true);
            m_hangupBtn->setEnabled(false);
            m_muteBtn->setEnabled(false);
            m_muteBtn->setChecked(false);
            m_muteBtn->setText("🔇 Mute");
            
            // Re-enable quick dial buttons
            for (QPushButton *btn : m_callTestWidget->findChildren<QPushButton*>()) {
                if (btn->property("quickDial").toBool()) {
                    btn->setEnabled(true);
                }
            }
            break;
            
        case CallState::Calling:
            statusText = "📞 " + info;
            styleSheet += "background-color: #1e3a50; color: #60a5fa;";
            break;
            
        case CallState::Early:
            statusText = "📳 " + info;
            styleSheet += "background-color: #1e3a50; color: #60a5fa;";
            break;
            
        case CallState::Confirmed:
            statusText = "✅ " + info;
            styleSheet += "background-color: #1e3a28; color: #4ade80;";
            m_muteBtn->setEnabled(true);
            addLog("Call connected - Audio active", "SUCCESS");
            break;
            
        case CallState::Disconnected:
            statusText = "📴 " + info;
            styleSheet += "background-color: #3a1e1e; color: #f87171;";
            addLog("Call ended", "INFO");
            break;
            
        default:
            statusText = info;
            styleSheet += "background-color: #2d2d30; color: #d4d4d4;";
            break;
    }
    
    m_callStatusLabel->setText(statusText);
    m_callStatusLabel->setStyleSheet(styleSheet);
    addLog("Call state: " + info, "INFO");
}
