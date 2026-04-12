#ifndef AUTOUPDATER_H
#define AUTOUPDATER_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QVersionNumber>
#include <QTimer>

class AutoUpdater : public QObject
{
    Q_OBJECT

public:
    explicit AutoUpdater(QObject *parent = nullptr);
    ~AutoUpdater();

    // Check for updates manually
    void checkForUpdates();
    
    // Enable/disable automatic checking
    void setAutoCheckEnabled(bool enabled);
    bool isAutoCheckEnabled() const { return m_autoCheckEnabled; }
    
    // Set check interval (in hours)
    void setCheckInterval(int hours);
    
    // Get current version
    static QString getCurrentVersion();
    
    // Download and install update
    void downloadAndInstall(const QString &downloadUrl);

signals:
    void updateAvailable(const QString &version, const QString &releaseNotes, const QString &downloadUrl);
    void noUpdateAvailable();
    void updateCheckFailed(const QString &error);
    void downloadProgress(qint64 bytesReceived, qint64 bytesTotal);
    void downloadComplete(const QString &filePath);
    void downloadFailed(const QString &error);

private slots:
    void onUpdateCheckFinished();
    void onDownloadProgress(qint64 bytesReceived, qint64 bytesTotal);
    void onDownloadFinished();

private:
    void parseUpdateResponse(const QByteArray &data);
    bool isNewerVersion(const QString &remoteVersion);
    QString getDownloadPath();
    void installUpdate(const QString &filePath);

    QNetworkAccessManager *m_networkManager;
    QNetworkReply *m_currentReply;
    QTimer *m_autoCheckTimer;
    bool m_autoCheckEnabled;
    QString m_updateUrl;
    QString m_downloadingFile;
};

#endif // AUTOUPDATER_H
