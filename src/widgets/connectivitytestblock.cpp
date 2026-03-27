#include "connectivitytestblock.h"
#include <QVBoxLayout>
#include <QHBoxLayout>

ConnectivityTestBlock::ConnectivityTestBlock(const QString &emoji,
                                             const QString &title,
                                             const QString &description,
                                             ConnectivityResult::Protocol protocol,
                                             const QString &host,
                                             int port,
                                             QWidget *parent)
    : QWidget(parent), m_title(emoji + " " + title), m_protocol(protocol), 
      m_host(host), m_port(port), m_status(NotTested)
{
    m_detailsLabel = nullptr;
    setupUI();
    if (m_detailsLabel) {
        m_detailsLabel->setText(description);
    }
}

void ConnectivityTestBlock::setupUI()
{
    QVBoxLayout *mainLayout = new QVBoxLayout(this);
    mainLayout->setContentsMargins(15, 15, 15, 15);
    mainLayout->setSpacing(10);

    QHBoxLayout *headerLayout = new QHBoxLayout();
    
    m_statusIndicator = new QWidget(this);
    m_statusIndicator->setFixedSize(24, 24);
    m_statusIndicator->setStyleSheet("background-color: #E0E0E0; border-radius: 12px;");
    
    m_titleLabel = new QLabel(m_title, this);
    QFont titleFont = m_titleLabel->font();
    titleFont.setBold(true);
    titleFont.setPointSize(13);
    m_titleLabel->setFont(titleFont);
    m_titleLabel->setStyleSheet("color: #2c3e50;");
    
    m_testButton = new QPushButton("▶ Test", this);
    m_testButton->setFixedWidth(100);
    m_testButton->setStyleSheet(
        "QPushButton { "
        "background-color: #5c6bc0; "
        "color: white; "
        "border: none; "
        "border-radius: 5px; "
        "padding: 8px 15px; "
        "font-weight: bold; "
        "}"
        "QPushButton:hover { background-color: #3f51b5; }"
        "QPushButton:pressed { background-color: #303f9f; }"
        "QPushButton:disabled { background-color: #bdbdbd; }"
    );
    connect(m_testButton, &QPushButton::clicked, this, [this]() {
        emit testRequested(m_protocol, m_host, m_port);
    });
    
    headerLayout->addWidget(m_statusIndicator);
    headerLayout->addSpacing(10);
    headerLayout->addWidget(m_titleLabel);
    headerLayout->addStretch();
    headerLayout->addWidget(m_testButton);
    
    m_detailsLabel = new QLabel("", this);
    m_detailsLabel->setStyleSheet("color: #7f8c8d; font-size: 11pt;");
    m_detailsLabel->setWordWrap(true);
    
    m_statusLabel = new QLabel("⚪ Not tested yet", this);
    m_statusLabel->setStyleSheet("color: #95a5a6; font-size: 10pt;");
    
    m_progressBar = new QProgressBar(this);
    m_progressBar->setMaximum(5);
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
    
    mainLayout->addLayout(headerLayout);
    mainLayout->addWidget(m_detailsLabel);
    mainLayout->addWidget(m_statusLabel);
    mainLayout->addWidget(m_progressBar);
    
    setStyleSheet("ConnectivityTestBlock { "
                  "background-color: white; "
                  "border: 2px solid #e8eaf6; "
                  "border-radius: 10px; "
                  "}"
                  "ConnectivityTestBlock:hover { "
                  "border-color: #c5cae9; "
                  "}");
    setMinimumHeight(140);
}

void ConnectivityTestBlock::setStatus(TestStatus status)
{
    m_status = status;
    updateStatusDisplay();
}

void ConnectivityTestBlock::setProgress(int current, int total)
{
    m_progressBar->setMaximum(total);
    m_progressBar->setValue(current);
    m_progressBar->setFormat(QString("%1/%2").arg(current).arg(total));
    m_progressBar->setVisible(current > 0 && current < total);
}

void ConnectivityTestBlock::setDetails(const QString &details)
{
    m_detailsLabel->setText(details);
}

void ConnectivityTestBlock::reset()
{
    m_status = NotTested;
    m_progressBar->setValue(0);
    m_progressBar->setVisible(false);
    m_detailsLabel->clear();
    updateStatusDisplay();
}

void ConnectivityTestBlock::updateStatusDisplay()
{
    switch (m_status) {
        case NotTested:
            m_statusIndicator->setStyleSheet("background-color: #E0E0E0; border-radius: 12px;");
            m_statusLabel->setText("⚪ Not tested yet");
            m_statusLabel->setStyleSheet("color: #95a5a6; font-size: 10pt;");
            break;
        case Testing:
            m_statusIndicator->setStyleSheet("background-color: #FFA726; border-radius: 12px;");
            m_statusLabel->setText("🔄 Testing in progress...");
            m_statusLabel->setStyleSheet("color: #F57C00; font-size: 10pt; font-weight: bold;");
            m_testButton->setEnabled(false);
            break;
        case AllSuccess:
            m_statusIndicator->setStyleSheet("background-color: #66BB6A; border-radius: 12px;");
            m_statusLabel->setText("✅ All tests passed successfully!");
            m_statusLabel->setStyleSheet("color: #388E3C; font-size: 10pt; font-weight: bold;");
            m_testButton->setEnabled(true);
            break;
        case PartialSuccess:
            m_statusIndicator->setStyleSheet("background-color: #FFA726; border-radius: 12px;");
            m_statusLabel->setText("⚠️ Some tests failed");
            m_statusLabel->setStyleSheet("color: #F57C00; font-size: 10pt; font-weight: bold;");
            m_testButton->setEnabled(true);
            break;
        case AllFailed:
            m_statusIndicator->setStyleSheet("background-color: #EF5350; border-radius: 12px;");
            m_statusLabel->setText("❌ All tests failed");
            m_statusLabel->setStyleSheet("color: #C62828; font-size: 10pt; font-weight: bold;");
            m_testButton->setEnabled(true);
            break;
    }
}
