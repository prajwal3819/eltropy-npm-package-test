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
    titleFont.setPointSize(23);
    titleFont.setBold(true);
    titleLabel->setFont(titleFont);
    titleLabel->setStyleSheet("color: #d4d4d4; padding: 10px;");
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
    
    // Domain display (truncated - show last 19 characters)
    QString fullDomain = m_sipDomain;
    QString truncatedDomain = fullDomain.length() > 19 ? "..." + fullDomain.right(19) : fullDomain;
    m_domainDisplayLabel = new QLabel(QString("📍 Registers to: <b>%1</b>").arg(truncatedDomain));
    m_domainDisplayLabel->setStyleSheet(
        "color: #a0a0a0; "
        "font-size: 10pt; "
        "padding: 5px 10px; "
        "background-color: #2d2d30; "
        "border-radius: 4px; "
        "margin-bottom: 10px;"
    );
    m_domainDisplayLabel->setToolTip(fullDomain);
    regLayout->addWidget(m_domainDisplayLabel);
    
    // Transport selection
    QHBoxLayout *transportLayout = new QHBoxLayout();
    QLabel *transportLabel = new QLabel("Transport:");
    transportLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    transportLabel->setMinimumWidth(90);
    m_transportCombo = new QComboBox();
    m_transportCombo->addItem("TCP", static_cast<int>(SipTransportType::TCP));
    m_transportCombo->addItem("UDP", static_cast<int>(SipTransportType::UDP));
    m_transportCombo->addItem("TLS", static_cast<int>(SipTransportType::TLS));
    m_transportCombo->setStyleSheet(
        "QComboBox {"
        "    padding: 8px;"
        "    font-size: 11pt;"
        "    color: #2c3e50;"
        "    background-color: white;"
        "    border: 1px solid #bdc3c7;"
        "    border-radius: 3px;"
        "}"
        "QComboBox::drop-down {"
        "    border: none;"
        "}"
        "QComboBox::down-arrow {"
        "    image: none;"
        "    border-left: 5px solid transparent;"
        "    border-right: 5px solid transparent;"
        "    border-top: 5px solid #2c3e50;"
        "    margin-right: 5px;"
        "}"
        "QComboBox QAbstractItemView {"
        "    background-color: white;"
        "    color: #2c3e50;"
        "    selection-background-color: #ecf0f1;"
        "    selection-color: #2c3e50;"
        "    border: 1px solid #bdc3c7;"
        "}"
    );
    m_transportCombo->setMinimumWidth(120);
    transportLayout->addWidget(transportLabel);
    transportLayout->addWidget(m_transportCombo);
    // transportLayout->addSpacing(30);
    
    // Port selection
    QLabel *portLabel = new QLabel("Port:");
    portLabel->setStyleSheet("font-weight: bold; font-size: 11pt; color: #d4d4d4;");
    portLabel->setMinimumWidth(60);
    m_portCombo = new QComboBox();
    m_portCombo->setStyleSheet(
        "QComboBox {"
        "    padding: 8px;"
        "    font-size: 11pt;"
        "    color: #2c3e50;"
        "    background-color: white;"
        "    border: 1px solid #bdc3c7;"
        "    border-radius: 3px;"
        "}"
        "QComboBox::drop-down {"
        "    border: none;"
        "}"
        "QComboBox::down-arrow {"
        "    image: none;"
        "    border-left: 5px solid transparent;"
        "    border-right: 5px solid transparent;"
        "    border-top: 5px solid #2c3e50;"
        "    margin-right: 5px;"
        "}"
        "QComboBox QAbstractItemView {"
        "    background-color: white;"
        "    color: #2c3e50;"
        "    selection-background-color: #ecf0f1;"
        "    selection-color: #2c3e50;"
        "    border: 1px solid #bdc3c7;"
        "}"
    );
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
    
    // Single line with audio check options and call-to field
    QHBoxLayout *callOptionsLayout = new QHBoxLayout();
    
    m_oneWayAudioRadio = new QRadioButton("🎤 One-Way");
    m_oneWayAudioRadio->setStyleSheet("color: #d4d4d4; font-size: 10pt; padding: 5px;");
    m_oneWayAudioRadio->setChecked(true);
    m_oneWayAudioRadio->setEnabled(false);
    callOptionsLayout->addWidget(m_oneWayAudioRadio);
    
    m_twoWayAudioRadio = new QRadioButton("🔊 Two-Way");
    m_twoWayAudioRadio->setStyleSheet("color: #d4d4d4; font-size: 10pt; padding: 5px;");
    m_twoWayAudioRadio->setEnabled(false);
    callOptionsLayout->addWidget(m_twoWayAudioRadio);
    
    m_customNumberRadio = new QRadioButton("📞 Custom Number");
    m_customNumberRadio->setStyleSheet("color: #d4d4d4; font-size: 10pt; padding: 5px;");
    m_customNumberRadio->setEnabled(false);
    callOptionsLayout->addWidget(m_customNumberRadio);
    
    callOptionsLayout->addSpacing(20);
    
    
    m_destinationEdit = new QLineEdit();
    m_destinationEdit->setText("7002");
    m_destinationEdit->setPlaceholderText("Enter number");
    m_destinationEdit->setStyleSheet("padding: 6px; font-size: 10pt; color: #2c3e50; background-color: white; border: 2px solid #bdc3c7; border-radius: 5px;");
    m_destinationEdit->setEnabled(false);
    m_destinationEdit->setMaximumWidth(150);
    callOptionsLayout->addWidget(m_destinationEdit);
    
    callOptionsLayout->addStretch();
    callLayout->addLayout(callOptionsLayout);
    
    // Instructional message area
    m_callInstructionLabel = new QLabel(
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
    m_callInstructionLabel->setWordWrap(true);
    callLayout->addWidget(m_callInstructionLabel);
    
    // Connect radio buttons to update instructions
    connect(m_oneWayAudioRadio, &QRadioButton::toggled, this, &MainWindow::updateCallInstructions);
    connect(m_twoWayAudioRadio, &QRadioButton::toggled, this, &MainWindow::updateCallInstructions);
    connect(m_customNumberRadio, &QRadioButton::toggled, this, &MainWindow::updateCallInstructions);
    
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
        "2. Click 'Register for Calls' to register with the SIP server<br>"
        "3. Choose audio check type: One-Way or Two-Way or Custom Number<br>" 
        "4. Click 'Make Call' to initiate the audio check<br>"
        "5. Use Mute to toggle microphone, Hang Up to end call"
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
    
    // Re-enable transport and port selection when unregistered
    m_transportCombo->setEnabled(true);
    m_portCombo->setEnabled(true);
    
    m_makeCallBtn->setEnabled(false);
    m_destinationEdit->setEnabled(false);
    m_oneWayAudioRadio->setEnabled(false);
    m_twoWayAudioRadio->setEnabled(false);
    m_customNumberRadio->setEnabled(false);
    
    addLog("Unregistered successfully", "SUCCESS");
}

void MainWindow::onMakeCallClicked()
{
    QString destination;
    QString callType;
    
    // Determine destination based on audio check type
    if (m_oneWayAudioRadio->isChecked()) {
        destination = "*1";
        callType = "One-Way Audio Check";
        addLog("Initiating One-Way Audio Check (calling *1)...", "INFO");
    } else if (m_twoWayAudioRadio->isChecked()) {
        destination = "*2";
        callType = "Two-Way Audio Check";
        addLog("Initiating Two-Way Audio Check (calling *2)...", "INFO");
    } else if (m_customNumberRadio->isChecked()) {
        // Custom number from text field
        destination = m_destinationEdit->text().trimmed();
        if (destination.isEmpty()) {
            addLog("Please enter a destination number", "ERROR");
            return;
        }
        callType = "Custom Number";
        addLog(QString("Making call to %1...").arg(destination), "INFO");
    }
    
    m_makeCallBtn->setEnabled(false);
    m_destinationEdit->setEnabled(false);
    m_oneWayAudioRadio->setEnabled(false);
    m_twoWayAudioRadio->setEnabled(false);
    m_customNumberRadio->setEnabled(false);
    
    bool success = m_callManager->makeCall(destination);
    
    if (success) {
        m_hangupBtn->setEnabled(true);
    } else {
        m_makeCallBtn->setEnabled(true);
        m_destinationEdit->setEnabled(true);
        m_oneWayAudioRadio->setEnabled(true);
        m_twoWayAudioRadio->setEnabled(true);
        m_customNumberRadio->setEnabled(true);
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
        // Parse expiry time from message (format: "Registered (expires in XXXs)")
        QRegularExpression expiryRegex("expires in (\\d+)s");
        QRegularExpressionMatch match = expiryRegex.match(message);
        if (match.hasMatch()) {
            int expiresIn = match.captured(1).toInt();
            m_callRegistrationExpiryTime = QDateTime::currentDateTime().addSecs(expiresIn);
        }
        
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
        
        // Disable transport and port selection once registered
        m_transportCombo->setEnabled(false);
        m_portCombo->setEnabled(false);
        
        m_makeCallBtn->setEnabled(true);
        m_destinationEdit->setEnabled(true);
        m_oneWayAudioRadio->setEnabled(true);
        m_twoWayAudioRadio->setEnabled(true);
        m_customNumberRadio->setEnabled(true);
        
        addLog("========================================", "SUCCESS");
        addLog("SIP Call Registration successful!", "SUCCESS");
        addLog(message, "SUCCESS");
        addLog("Ready to make calls", "SUCCESS");
        addLog("========================================", "SUCCESS");
    } else {
        m_callRegistrationExpiryTime = QDateTime();
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

void MainWindow::updateCallRegistrationTimer()
{
    if (!m_callRegistrationExpiryTime.isValid()) {
        return;
    }
    
    QDateTime now = QDateTime::currentDateTime();
    int secondsRemaining = now.secsTo(m_callRegistrationExpiryTime);
    
    if (secondsRemaining > 0) {
        QString statusText = QString("✅ Registered (expires in %1s)").arg(secondsRemaining);
        m_registrationStatusLabel->setText(statusText);
    } else {
        m_callRegistrationExpiryTime = QDateTime();
        m_registrationStatusLabel->setText("⚠️ Registration expired");
        m_registrationStatusLabel->setStyleSheet(
            "font-size: 12pt; "
            "padding: 10px; "
            "background-color: #3a2e1e; "
            "border-radius: 5px; "
            "margin: 10px 0; "
            "color: #ffa726;"
        );
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
            m_oneWayAudioRadio->setEnabled(true);
            m_twoWayAudioRadio->setEnabled(true);
            m_customNumberRadio->setEnabled(true);
            m_hangupBtn->setEnabled(false);
            m_muteBtn->setEnabled(false);
            m_muteBtn->setChecked(false);
            m_muteBtn->setText("🔇 Mute");
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
            m_makeCallBtn->setEnabled(true);
            m_destinationEdit->setEnabled(true);
            m_oneWayAudioRadio->setEnabled(true);
            m_twoWayAudioRadio->setEnabled(true);
            m_customNumberRadio->setEnabled(true);
            m_hangupBtn->setEnabled(false);
            m_muteBtn->setEnabled(false);
            m_muteBtn->setChecked(false);
            m_muteBtn->setText("🔇 Mute");
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
