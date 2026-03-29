#include "sipregistrationblock.h"
#include "models/environmentconfig.h"
#include <QVBoxLayout>
#include <QHBoxLayout>

SipRegistrationBlock::SipRegistrationBlock(const QString &transport,
                                           const QString &host,
                                           int port,
                                           SipTransportType transportType,
                                           QWidget *parent)
    : QWidget(parent),
      m_transport(transport),
      m_host(host),
      m_port(port),
      m_transportType(transportType),
      m_status(Idle),
      m_message("⚪ Not tested")
{
    setupUI();
}

void SipRegistrationBlock::setupUI()
{
    QVBoxLayout *mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(15, 15, 15, 15);
    mainLayout->setSpacing(10);

    QHBoxLayout *topLayout = new QHBoxLayout();
    
    m_statusLabel = new QLabel(getStatusIcon());
    m_statusLabel->setStyleSheet("font-size: 24pt;");
    m_statusLabel->setFixedWidth(40);
    topLayout->addWidget(m_statusLabel);

    QVBoxLayout *infoLayout = new QVBoxLayout();
    
    QLabel *titleLabel = new QLabel(QString("<b>%1 - Port %2</b>")
                                    .arg(m_transport)
                                    .arg(m_port));
    titleLabel->setStyleSheet("font-size: 13pt; color: #2c3e50;");
    
    m_infoLabel = new QLabel(m_message);
    m_infoLabel->setStyleSheet("font-size: 11pt; color: #7f8c8d;");
    m_infoLabel->setWordWrap(true);
    
    m_timerLabel = new QLabel("Standard SIP Signaling over " + m_transport + " it will try to register with " + EnvironmentConfig::instance().getSipEndpoint() + ":" + QString::number(m_port));
    m_timerLabel->setStyleSheet("font-size: 11pt; color: #7f8c8d;");
    
    infoLayout->addWidget(titleLabel);
    infoLayout->addWidget(m_infoLabel);
    infoLayout->addWidget(m_timerLabel);
    
    topLayout->addLayout(infoLayout, 1);
    
    // Add progress bar
    m_progressBar = new QProgressBar(this);
    m_progressBar->setMaximum(6);
    m_progressBar->setValue(0);
    m_progressBar->setTextVisible(true);
    m_progressBar->setVisible(false);
    m_progressBar->setStyleSheet(
        "QProgressBar { "
        "border: 2px solid #e0e0e0; "
        "border-radius: 5px; "
        "text-align: center; "
        "background-color: #f5f5f5; "
        "}"
        "QProgressBar::chunk { "
        "background-color: #5c6bc0; "
        "border-radius: 3px; "
        "}"
    );
    
    QVBoxLayout *buttonLayout = new QVBoxLayout();
    
    m_testButton = new QPushButton("🚀 Register");
    m_testButton->setStyleSheet(
        "QPushButton { "
        "background-color: #3498DB; "
        "color: white; "
        "font-weight: bold; "
        "padding: 8px 15px; "
        "border-radius: 5px; "
        "border: none; "
        "}"
        "QPushButton:hover { background-color: #2980B9; }"
        "QPushButton:disabled { background-color: #95a5a6; }"
    );
    connect(m_testButton, &QPushButton::clicked, this, &SipRegistrationBlock::onTestClicked);
    
    m_unregisterButton = new QPushButton("❌ Unregister");
    m_unregisterButton->setStyleSheet(
        "QPushButton { "
        "background-color: #e74c3c; "
        "color: white; "
        "font-weight: bold; "
        "padding: 8px 15px; "
        "border-radius: 5px; "
        "border: none; "
        "}"
        "QPushButton:hover { background-color: #c0392b; }"
        "QPushButton:disabled { background-color: #95a5a6; }"
    );
    m_unregisterButton->setEnabled(false);
    connect(m_unregisterButton, &QPushButton::clicked, this, &SipRegistrationBlock::onUnregisterClicked);
    
    buttonLayout->addWidget(m_testButton);
    buttonLayout->addWidget(m_unregisterButton);
    
    topLayout->addLayout(buttonLayout);
    
    mainLayout->addLayout(topLayout);
    mainLayout->addWidget(m_progressBar);
    
    setStyleSheet("SipRegistrationBlock { "
                 "background: white; "
                 "border: 2px solid #e8eaf6; "
                 "border-radius: 10px; "
                 "}");
}

void SipRegistrationBlock::setStatus(Status status)
{
    m_status = status;
    m_statusLabel->setText(getStatusIcon());
    
    QString borderColor = getStatusColor();
    setStyleSheet(QString("SipRegistrationBlock { "
                         "background: white; "
                         "border: 2px solid %1; "
                         "border-radius: 10px; "
                         "}").arg(borderColor));
    
    m_testButton->setEnabled(status != Registering && status != Registered);
    m_unregisterButton->setEnabled(status == Registered);
    
    
}

void SipRegistrationBlock::setMessage(const QString &message)
{
    m_message = message;
    
    // Set text color based on message type
    if (message.contains("Registering", Qt::CaseInsensitive) || 
        message.contains("Retrying", Qt::CaseInsensitive)) {
        // Orange for registering/retry messages
        m_infoLabel->setStyleSheet("color: #ff9800; font-size: 11pt;");
    } else if (message.contains("failed", Qt::CaseInsensitive) || 
               message.contains("error", Qt::CaseInsensitive) ||
               message.contains("timeout", Qt::CaseInsensitive)) {
        // Red for error/failure messages
        m_infoLabel->setStyleSheet("color: #e74c3c; font-size: 11pt; font-weight: bold;");
    } else {
        // Gray for other messages
        m_infoLabel->setStyleSheet("color: #7f8c8d; font-size: 11pt;");
    }
    
    m_infoLabel->setText(message);
}

void SipRegistrationBlock::setExpiryTime(int seconds)
{
    if (seconds > 0) {
        m_timerLabel->setText(QString("⏱️ Expires in %1s").arg(seconds));
    }
    // } else {
    //     m_timerLabel->setText("⏱️ --");
    // }
}

void SipRegistrationBlock::setProgress(int current, int total)
{
    m_progressBar->setMaximum(total);
    m_progressBar->setValue(current);
    m_progressBar->setFormat(QString("Attempt %1/%2").arg(current).arg(total));
    m_progressBar->setVisible(current > 0 && current <= total);
}

void SipRegistrationBlock::reset()
{
    setStatus(Idle);
    setMessage("⚪ Not tested");
    setExpiryTime(0);
    m_progressBar->setValue(0);
    m_progressBar->setVisible(false);
}

void SipRegistrationBlock::onTestClicked()
{
    emit testRequested(m_transportType, m_host, m_port);
}

void SipRegistrationBlock::onUnregisterClicked()
{
    emit unregisterRequested(m_transportType, m_host, m_port);
}

QString SipRegistrationBlock::getStatusIcon() const
{
    switch (m_status) {
        case Idle: return "⚪";
        case Registering: return "🟠";
        case Registered: return "🟢";
        case Failed: return "🔴";
        default: return "⚪";
    }
}

QString SipRegistrationBlock::getStatusColor() const
{
    switch (m_status) {
        case Idle: return "#e8eaf6";
        case Registering: return "#FFA726"; // Orange color for registering
        case Registered: return "#27ae60";
        case Failed: return "#e74c3c";
        default: return "#e8eaf6";
    }
}
