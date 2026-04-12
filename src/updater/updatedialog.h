#ifndef UPDATEDIALOG_H
#define UPDATEDIALOG_H

#include <QDialog>
#include <QLabel>
#include <QTextEdit>
#include <QPushButton>
#include <QProgressBar>

class UpdateDialog : public QDialog
{
    Q_OBJECT

public:
    explicit UpdateDialog(const QString &version, 
                         const QString &releaseNotes, 
                         const QString &downloadUrl,
                         QWidget *parent = nullptr);

signals:
    void downloadRequested(const QString &downloadUrl);
    void skipUpdate();

public slots:
    void setDownloadProgress(qint64 bytesReceived, qint64 bytesTotal);
    void onDownloadComplete();
    void onDownloadFailed(const QString &error);

private:
    QLabel *m_titleLabel;
    QLabel *m_versionLabel;
    QTextEdit *m_releaseNotesEdit;
    QProgressBar *m_progressBar;
    QPushButton *m_downloadButton;
    QPushButton *m_skipButton;
    QString m_downloadUrl;
};

#endif // UPDATEDIALOG_H
