# Windows TLS/SSL Setup Guide

## Overview

TLS connectivity requires OpenSSL libraries on Windows. Qt does not bundle OpenSSL by default, so it must be installed separately.

## Symptoms of Missing OpenSSL

If OpenSSL is not installed, you'll see:
- TLS connectivity tests fail with "SSL/TLS not supported"
- Error message: "OpenSSL library not found"
- WSS (WebSocket Secure) connections fail

## Installing OpenSSL on Windows

### Option 1: Using Chocolatey (Recommended)

```cmd
choco install openssl -y
```

### Option 2: Manual Installation

1. Download OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html
2. Choose **Win64 OpenSSL v3.x.x** (or v1.1.1 for older systems)
3. Run the installer
4. Select "Copy OpenSSL DLLs to: The Windows system directory"

### Option 3: Using vcpkg

```cmd
vcpkg install openssl:x64-windows
```

## Required DLL Files

The application needs these DLL files in the same directory as the executable:

**For OpenSSL 3.x:**
- `libssl-3-x64.dll`
- `libcrypto-3-x64.dll`

**For OpenSSL 1.1.x:**
- `libssl-1_1-x64.dll`
- `libcrypto-1_1-x64.dll`

## Deployment

### For Portable Builds

Copy the OpenSSL DLLs to the same folder as `SIPConnectivityTester.exe`:

```cmd
copy "C:\Program Files\OpenSSL\bin\libssl-3-x64.dll" .
copy "C:\Program Files\OpenSSL\bin\libcrypto-3-x64.dll" .
```

Or for OpenSSL 1.1.x:

```cmd
copy "C:\Program Files\OpenSSL-Win64\bin\libssl-1_1-x64.dll" .
copy "C:\Program Files\OpenSSL-Win64\bin\libcrypto-1_1-x64.dll" .
```

### For MSI Installers

The GitHub Actions workflow automatically includes OpenSSL DLLs in the build.

## Verifying OpenSSL Installation

### Check if OpenSSL is Installed

```cmd
where openssl
```

### Check DLL Locations

**OpenSSL 3.x:**
```cmd
dir "C:\Program Files\OpenSSL\bin\libssl-3-x64.dll"
dir "C:\Program Files\OpenSSL\bin\libcrypto-3-x64.dll"
```

**OpenSSL 1.1.x:**
```cmd
dir "C:\Program Files\OpenSSL-Win64\bin\libssl-1_1-x64.dll"
dir "C:\Program Files\OpenSSL-Win64\bin\libcrypto-1_1-x64.dll"
```

### Test TLS in the Application

1. Launch SIP Connectivity Tester
2. Go to "Connectivity Tests" tab
3. Run a TLS connectivity test
4. Check the log output for SSL version info

If SSL is working, you'll see:
```
TLS Check: SSL supported, build version: OpenSSL 3.x.x runtime version: OpenSSL 3.x.x
```

If SSL is not working, you'll see:
```
TLS Check Failed: SSL/TLS not supported. OpenSSL library not found.
```

## Troubleshooting

### "SSL/TLS not supported" Error

**Cause:** OpenSSL DLLs are not in the application directory or system PATH.

**Solution:**
1. Install OpenSSL (see above)
2. Copy the DLLs to the application directory
3. Or add OpenSSL bin directory to system PATH

### "The code execution cannot proceed because libssl-3-x64.dll was not found"

**Cause:** OpenSSL 3.x DLLs are missing.

**Solution:**
```cmd
copy "C:\Program Files\OpenSSL\bin\libssl-3-x64.dll" <app_directory>
copy "C:\Program Files\OpenSSL\bin\libcrypto-3-x64.dll" <app_directory>
```

### "The code execution cannot proceed because libssl-1_1-x64.dll was not found"

**Cause:** OpenSSL 1.1.x DLLs are missing.

**Solution:**
```cmd
copy "C:\Program Files\OpenSSL-Win64\bin\libssl-1_1-x64.dll" <app_directory>
copy "C:\Program Files\OpenSSL-Win64\bin\libcrypto-1_1-x64.dll" <app_directory>
```

### TLS Tests Still Failing After Installing OpenSSL

1. **Restart the application** - DLLs are loaded at startup
2. **Check DLL architecture** - Must use 64-bit DLLs for 64-bit app
3. **Check Qt version compatibility** - Qt 6 requires OpenSSL 3.x or 1.1.1
4. **Use Dependency Walker** to check which DLLs are loaded:
   - Download: https://www.dependencywalker.com/
   - Open `SIPConnectivityTester.exe`
   - Look for `libssl` and `libcrypto` in the module list

### Different OpenSSL Versions

Qt supports multiple OpenSSL versions:
- **Qt 6.x**: OpenSSL 3.x (preferred) or OpenSSL 1.1.1
- **Qt 5.15**: OpenSSL 1.1.1 (preferred) or OpenSSL 1.0.2

The application will automatically detect and use whichever version is available.

## Development Environment Setup

For local development on Windows:

1. Install OpenSSL:
   ```cmd
   choco install openssl -y
   ```

2. Add to system PATH (if not already added):
   ```cmd
   setx PATH "%PATH%;C:\Program Files\OpenSSL\bin"
   ```

3. Verify Qt can find OpenSSL:
   ```cpp
   qDebug() << "SSL Support:" << QSslSocket::supportsSsl();
   qDebug() << "SSL Version:" << QSslSocket::sslLibraryVersionString();
   ```

## GitHub Actions Build

The Windows build workflow automatically:
1. Installs OpenSSL via Chocolatey
2. Copies OpenSSL DLLs to the build output
3. Includes them in the portable ZIP and MSI installer

No manual intervention needed for CI/CD builds.

## Security Notes

- The application uses `QSslSocket::VerifyNone` for connectivity testing
- This is intentional - we're testing connectivity, not certificate validity
- For production SIP/TLS connections, proper certificate verification should be enabled
- Keep OpenSSL updated for security patches

## References

- [Qt SSL Documentation](https://doc.qt.io/qt-6/ssl.html)
- [OpenSSL Windows Builds](https://slproweb.com/products/Win32OpenSSL.html)
- [Qt Network Security](https://doc.qt.io/qt-6/qtnetwork-index.html#secure-sockets-layer-ssl)
