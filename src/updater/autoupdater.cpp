#include "autoupdater.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QFile>
#include <QDir>
#include <QStandardPaths>
#include <QProcess>
#include <QCoreApplication>
#include <QDebug>
#include <QDesktopServices>
#include <QUrl>

// Update this URL to point to your update server
static const QString UPDATE_CHECK_URL = "https://api.github.com/repos/YOUR_ORG/YOUR_REPO/releases/latest";
static const QString CURRENT_VERSION = "1.0.0";

AutoUpdater::AutoUpdater(QObject *parent)
    : QObject(parent)
    , m_networkManager(new QNetworkAccessManager(this))
    , m_currentReply(nullptr)
    , m_autoCheckTimer(new QTimer(this))
    , m_autoCheckEnabled(false)
    , m_updateUrl(UPDATE_CHECK_URL)
{
    connect(m_autoCheckTimer, &QTimer::timeout, this, &AutoUpdater::checkForUpdates);
    
    // Default: check every 24 hours
    setCheckInterval(24);
}

AutoUpdater::~AutoUpdater()
{
    if (m_currentReply) {
        m_currentReply->abort();
        m_currentReply->deleteLater();
    }
}

QString AutoUpdater::getCurrentVersion()
{
    return CURRENT_VERSION;
}

void AutoUpdater::setAutoCheckEnabled(bool enabled)
{
    m_autoCheckEnabled = enabled;
    
    if (enabled) {
        m_autoCheckTimer->start();
        // Check immediately on enable
        checkForUpdates();
    } else {
        m_autoCheckTimer->stop();
    }
}

void AutoUpdater::setCheckInterval(int hours)
{
    m_autoCheckTimer->setInterval(hours * 60 * 60 * 1000); // Convert to milliseconds
}

void AutoUpdater::checkForUpdates()
{
    qDebug() << "Checking for updates...";
    
    if (m_currentReply) {
        qDebug() << "Update check already in progress";
        return;
    }
    
    QNetworkRequest request(m_updateUrl);
    request.setHeader(QNetworkRequest::UserAgentHeader, "SIPConnectivityTester/" + CURRENT_VERSION);
    
    m_currentReply = m_networkManager->get(request);
    connect(m_currentReply, &QNetworkReply::finished, this, &AutoUpdater::onUpdateCheckFinished);
}

void AutoUpdater::onUpdateCheckFinished()
{
    if (!m_currentReply) {
        return;
    }
    
    if (m_currentReply->error() != QNetworkReply::NoError) {
        QString error = m_currentReply->errorString();
        qDebug() << "Update check failed:" << error;
        emit updateCheckFailed(error);
        m_currentReply->deleteLater();
        m_currentReply = nullptr;
        return;
    }
    
    QByteArray data = m_currentReply->readAll();
    m_currentReply->deleteLater();
    m_currentReply = nullptr;
    
    parseUpdateResponse(data);
}

void AutoUpdater::parseUpdateResponse(const QByteArray &data)
{
    QJsonDocument doc = QJsonDocument::fromJson(data);
    if (!doc.isObject()) {
        emit updateCheckFailed("Invalid response format");
        return;
    }
    
    QJsonObject obj = doc.object();
    
    // GitHub API format
    QString tagName = obj["tag_name"].toString();
    QString version = tagName.startsWith("v") ? tagName.mid(1) : tagName;
    QString releaseNotes = obj["body"].toString();
    
    if (!isNewerVersion(version)) {
        qDebug() << "No update available. Current:" << CURRENT_VERSION << "Remote:" << version;
        emit noUpdateAvailable();
        return;
    }
    
    // Find the appropriate download URL for the platform
    QString downloadUrl;
    QJsonArray assets = obj["assets"].toArray();
    
#ifdef Q_OS_WIN
    QString platformSuffix = ".exe";
#elif defined(Q_OS_MAC)
    QString platformSuffix = ".dmg";
#else
    QString platformSuffix = ".AppImage";
#endif
    
    for (const QJsonValue &asset : assets) {
        QJsonObject assetObj = asset.toObject();
        QString name = assetObj["name"].toString();
        
        if (name.endsWith(platformSuffix)) {
            downloadUrl = assetObj["browser_download_url"].toString();
            break;
        }
    }
    
    if (downloadUrl.isEmpty()) {
        emit updateCheckFailed("No suitable download found for this platform");
        return;
    }
    
    qDebug() << "Update available:" << version;
    emit updateAvailable(version, releaseNotes, downloadUrl);
}

bool AutoUpdater::isNewerVersion(const QString &remoteVersion)
{
    QVersionNumber current = QVersionNumber::fromString(CURRENT_VERSION);
    QVersionNumber remote = QVersionNumber::fromString(remoteVersion);
    
    return remote > current;
}

void AutoUpdater::downloadAndInstall(const QString &downloadUrl)
{
    qDebug() << "Downloading update from:" << downloadUrl;
    
    if (m_currentReply) {
        qDebug() << "Download already in progress";
        return;
    }
    
    QNetworkRequest request(downloadUrl);
    request.setHeader(QNetworkRequest::UserAgentHeader, "SIPConnectivityTester/" + CURRENT_VERSION);
    
    m_currentReply = m_networkManager->get(request);
    connect(m_currentReply, &QNetworkReply::downloadProgress, this, &AutoUpdater::onDownloadProgress);
    connect(m_currentReply, &QNetworkReply::finished, this, &AutoUpdater::onDownloadFinished);
}

void AutoUpdater::onDownloadProgress(qint64 bytesReceived, qint64 bytesTotal)
{
    emit downloadProgress(bytesReceived, bytesTotal);
}

void AutoUpdater::onDownloadFinished()
{
    if (!m_currentReply) {
        return;
    }
    
    if (m_currentReply->error() != QNetworkReply::NoError) {
        QString error = m_currentReply->errorString();
        qDebug() << "Download failed:" << error;
        emit downloadFailed(error);
        m_currentReply->deleteLater();
        m_currentReply = nullptr;
        return;
    }
    
    QByteArray data = m_currentReply->readAll();
    QString filePath = getDownloadPath();
    
    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly)) {
        emit downloadFailed("Failed to save update file");
        m_currentReply->deleteLater();
        m_currentReply = nullptr;
        return;
    }
    
    file.write(data);
    file.close();
    
    m_currentReply->deleteLater();
    m_currentReply = nullptr;
    
    qDebug() << "Update downloaded to:" << filePath;
    emit downloadComplete(filePath);
    
    // Optionally auto-install
    installUpdate(filePath);
}

QString AutoUpdater::getDownloadPath()
{
    QString downloadDir = QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
    
#ifdef Q_OS_WIN
    return downloadDir + "/SIPConnectivityTester-Update.exe";
#elif defined(Q_OS_MAC)
    return downloadDir + "/SIPConnectivityTester-Update.dmg";
#else
    return downloadDir + "/SIPConnectivityTester-Update.AppImage";
#endif
}

void AutoUpdater::installUpdate(const QString &filePath)
{
#ifdef Q_OS_WIN
    // On Windows, launch the installer and quit the app
    QProcess::startDetached(filePath, QStringList());
    QCoreApplication::quit();
#elif defined(Q_OS_MAC)
    // On macOS, open the DMG file
    QDesktopServices::openUrl(QUrl::fromLocalFile(filePath));
    // User needs to manually drag to Applications folder
#else
    // On Linux, make executable and launch
    QFile::setPermissions(filePath, QFile::ReadOwner | QFile::WriteOwner | QFile::ExeOwner);
    QProcess::startDetached(filePath, QStringList());
    QCoreApplication::quit();
#endif
}
