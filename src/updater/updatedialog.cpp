#include "updatedialog.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QMessageBox>

UpdateDialog::UpdateDialog(const QString &version, 
                          const QString &releaseNotes, 
                          const QString &downloadUrl,
                          QWidget *parent)
    : QDialog(parent)
    , m_downloadUrl(downloadUrl)
{
    setWindowTitle("Update Available");
    setMinimumSize(500, 400);
    
    QVBoxLayout *mainLayout = new QVBoxLayout(this);
    
    // Title
    m_titleLabel = new QLabel("🎉 A new version is available!", this);
    QFont titleFont = m_titleLabel->font();
    titleFont.setPointSize(14);
    titleFont.setBold(true);
    m_titleLabel->setFont(titleFont);
    mainLayout->addWidget(m_titleLabel);
    
    // Version info
    m_versionLabel = new QLabel(QString("Version %1 is now available").arg(version), this);
    mainLayout->addWidget(m_versionLabel);
    
    mainLayout->addSpacing(10);
    
    // Release notes
    QLabel *notesLabel = new QLabel("What's New:", this);
    QFont notesFont = notesLabel->font();
    notesFont.setBold(true);
    notesLabel->setFont(notesFont);
    mainLayout->addWidget(notesLabel);
    
    m_releaseNotesEdit = new QTextEdit(this);
    m_releaseNotesEdit->setReadOnly(true);
    m_releaseNotesEdit->setMarkdown(releaseNotes);
    mainLayout->addWidget(m_releaseNotesEdit);
    
    // Progress bar (hidden initially)
    m_progressBar = new QProgressBar(this);
    m_progressBar->setVisible(false);
    mainLayout->addWidget(m_progressBar);
    
    // Buttons
    QHBoxLayout *buttonLayout = new QHBoxLayout();
    buttonLayout->addStretch();
    
    m_skipButton = new QPushButton("Skip This Version", this);
    buttonLayout->addWidget(m_skipButton);
    
    m_downloadButton = new QPushButton("Download and Install", this);
    m_downloadButton->setDefault(true);
    buttonLayout->addWidget(m_downloadButton);
    
    mainLayout->addLayout(buttonLayout);
    
    // Connections
    connect(m_downloadButton, &QPushButton::clicked, this, [this]() {
        m_downloadButton->setEnabled(false);
        m_skipButton->setEnabled(false);
        m_progressBar->setVisible(true);
        emit downloadRequested(m_downloadUrl);
    });
    
    connect(m_skipButton, &QPushButton::clicked, this, [this]() {
        emit skipUpdate();
        reject();
    });
}

void UpdateDialog::setDownloadProgress(qint64 bytesReceived, qint64 bytesTotal)
{
    if (bytesTotal > 0) {
        int percentage = (bytesReceived * 100) / bytesTotal;
        m_progressBar->setValue(percentage);
        
        // Show size in MB
        double receivedMB = bytesReceived / (1024.0 * 1024.0);
        double totalMB = bytesTotal / (1024.0 * 1024.0);
        m_progressBar->setFormat(QString("Downloading: %1 MB / %2 MB (%p%)")
                                .arg(receivedMB, 0, 'f', 1)
                                .arg(totalMB, 0, 'f', 1));
    }
}

void UpdateDialog::onDownloadComplete()
{
    m_progressBar->setValue(100);
    m_progressBar->setFormat("Download complete! Installing...");
    
    QMessageBox::information(this, "Update Ready", 
                            "The update has been downloaded and will be installed now.\n"
                            "The application will restart.");
    accept();
}

void UpdateDialog::onDownloadFailed(const QString &error)
{
    m_downloadButton->setEnabled(true);
    m_skipButton->setEnabled(true);
    m_progressBar->setVisible(false);
    
    QMessageBox::critical(this, "Download Failed", 
                         QString("Failed to download update:\n%1").arg(error));
}
