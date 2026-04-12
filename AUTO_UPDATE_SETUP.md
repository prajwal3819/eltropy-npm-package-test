# Auto-Update Setup Guide

This guide explains how to set up automatic updates for the SIP Connectivity Tester application.

## Overview

The application includes a built-in auto-update system that:
- Checks for new versions on GitHub Releases
- Downloads updates automatically
- Installs updates with minimal user interaction
- Works cross-platform (Windows, macOS, Linux)

## Setup Steps

### 1. Update the Update URL

Edit `src/updater/autoupdater.cpp` and change the update URL:

```cpp
static const QString UPDATE_CHECK_URL = "https://api.github.com/repos/YOUR_ORG/YOUR_REPO/releases/latest";
```

Replace `YOUR_ORG` and `YOUR_REPO` with your GitHub organization and repository name.

### 2. Update Version Number

The version is defined in two places:

**CMakeLists.txt:**
```cmake
project(SIPConnectivityTester VERSION 1.0.0 LANGUAGES CXX)
```

**src/updater/autoupdater.cpp:**
```cpp
static const QString CURRENT_VERSION = "1.0.0";
```

Keep these synchronized when releasing new versions.

### 3. Enable Auto-Update in MainWindow

Add to `src/mainwindow.h`:
```cpp
#include "updater/autoupdater.h"

private:
    AutoUpdater *m_autoUpdater;
```

Add to `src/mainwindow.cpp` constructor:
```cpp
#include "updater/updatedialog.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_autoUpdater(new AutoUpdater(this))
{
    // ... existing code ...
    
    // Setup auto-updater
    connect(m_autoUpdater, &AutoUpdater::updateAvailable, 
            this, &MainWindow::onUpdateAvailable);
    connect(m_autoUpdater, &AutoUpdater::noUpdateAvailable,
            this, []() { qDebug() << "No updates available"; });
    connect(m_autoUpdater, &AutoUpdater::updateCheckFailed,
            this, [](const QString &error) { qDebug() << "Update check failed:" << error; });
    
    // Enable automatic checking (every 24 hours)
    m_autoUpdater->setAutoCheckEnabled(true);
    
    // Or check manually on startup
    // m_autoUpdater->checkForUpdates();
}
```

Add the update handler method to `src/mainwindow.cpp`:
```cpp
void MainWindow::onUpdateAvailable(const QString &version, 
                                   const QString &releaseNotes, 
                                   const QString &downloadUrl)
{
    UpdateDialog *dialog = new UpdateDialog(version, releaseNotes, downloadUrl, this);
    
    connect(dialog, &UpdateDialog::downloadRequested, 
            m_autoUpdater, &AutoUpdater::downloadAndInstall);
    connect(m_autoUpdater, &AutoUpdater::downloadProgress,
            dialog, &UpdateDialog::setDownloadProgress);
    connect(m_autoUpdater, &AutoUpdater::downloadComplete,
            dialog, &UpdateDialog::onDownloadComplete);
    connect(m_autoUpdater, &AutoUpdater::downloadFailed,
            dialog, &UpdateDialog::onDownloadFailed);
    
    dialog->exec();
    dialog->deleteLater();
}
```

Add to `src/mainwindow.h`:
```cpp
private slots:
    void onUpdateAvailable(const QString &version, 
                          const QString &releaseNotes, 
                          const QString &downloadUrl);
```

### 4. Add "Check for Updates" Menu Item (Optional)

In your menu setup:
```cpp
QMenu *helpMenu = menuBar()->addMenu("Help");
QAction *checkUpdatesAction = helpMenu->addAction("Check for Updates...");
connect(checkUpdatesAction, &QAction::triggered, 
        m_autoUpdater, &AutoUpdater::checkForUpdates);
```

## Creating Releases

### Manual Release Process

1. **Update version numbers** in `CMakeLists.txt` and `autoupdater.cpp`
2. **Commit and tag:**
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push origin voip --tags
   ```
3. **Build for each platform:**
   - Windows: `.exe` installer
   - macOS: `.dmg` disk image
   - Linux: `.AppImage`
4. **Create GitHub Release:**
   - Go to GitHub → Releases → Create new release
   - Select the tag (v1.0.1)
   - Add release notes
   - Upload the built binaries
   - Publish release

### Automated Release with GitHub Actions

Create `.github/workflows/release.yml`:

```yaml
name: Release Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup MSVC
        uses: ilammy/msvc-dev-cmd@v1
        
      - name: Install Qt
        uses: jurplel/install-qt-action@v3
        with:
          version: '6.5.3'
          
      # ... build steps from windows-build.yml ...
      
      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./SIPConnectivityTester-Windows.exe
          asset_name: SIPConnectivityTester-Windows-${{ github.ref_name }}.exe
          asset_content_type: application/octet-stream

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Qt
        run: brew install qt@6
        
      # ... build and package as DMG ...
      
      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ github.event.release.upload_url }}
          asset_path: ./SIPConnectivityTester.dmg
          asset_name: SIPConnectivityTester-macOS-${{ github.ref_name }}.dmg
          asset_content_type: application/octet-stream
```

## Update Flow

1. **User opens app** → Auto-updater checks for updates (if enabled)
2. **New version found** → Shows update dialog with release notes
3. **User clicks "Download and Install"** → Downloads update in background
4. **Download complete** → Installs and restarts app automatically

## Testing Updates

1. **Test with older version:**
   - Set `CURRENT_VERSION` to `0.9.0`
   - Create a release `v1.0.0` on GitHub
   - Run the app and verify update is detected

2. **Test download:**
   - Verify progress bar works
   - Check downloaded file location
   - Verify installation process

3. **Test skip:**
   - Verify "Skip This Version" works
   - Check that it doesn't prompt again immediately

## Configuration Options

### Check Interval
```cpp
m_autoUpdater->setCheckInterval(24); // Check every 24 hours
```

### Disable Auto-Check
```cpp
m_autoUpdater->setAutoCheckEnabled(false);
```

### Manual Check Only
```cpp
// Don't enable auto-check, only check when user requests
connect(checkUpdatesAction, &QAction::triggered, 
        m_autoUpdater, &AutoUpdater::checkForUpdates);
```

## Platform-Specific Notes

### Windows
- Installer should be created with NSIS or WiX
- Update will launch the new installer and quit the app
- User may need admin privileges

### macOS
- Package as `.dmg` disk image
- App will open the DMG, user drags to Applications
- Consider code signing for smooth updates

### Linux
- Use AppImage for portability
- Update will replace the AppImage and restart
- Make sure file has execute permissions

## Troubleshooting

### Updates Not Detected
- Check GitHub API URL is correct
- Verify release is published (not draft)
- Check version comparison logic

### Download Fails
- Verify asset names match platform suffixes
- Check network connectivity
- Verify GitHub release assets are public

### Installation Fails
- Check file permissions
- Verify installer is valid
- Check platform-specific installation code

## Security Considerations

1. **Use HTTPS** for all update checks and downloads
2. **Verify signatures** (optional but recommended):
   - Add signature verification to `autoupdater.cpp`
   - Sign releases with GPG or code signing certificate
3. **Rate limiting**: GitHub API has rate limits (60 requests/hour unauthenticated)
4. **User consent**: Always show what's being updated before downloading

## Alternative Solutions

If you need more advanced features:

1. **Sparkle (macOS)**: https://sparkle-project.org/
2. **WinSparkle (Windows)**: https://winsparkle.org/
3. **Qt Installer Framework**: https://doc.qt.io/qtinstallerframework/
4. **Electron Auto-Updater**: If considering Electron migration

## Support

For issues with the auto-updater:
1. Check logs in the application
2. Verify GitHub release format
3. Test with manual update check
4. Review network requests in debug mode
