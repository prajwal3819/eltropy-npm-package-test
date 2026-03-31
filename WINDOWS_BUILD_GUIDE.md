# Windows Build Guide - SIP Connectivity Tester

This guide will help you build the Windows .exe file on your Windows machine using vcpkg.

## Prerequisites

You mentioned you have:
- ✅ vcpkg installed in `~/Documents/Github/vcpkg`
- ✅ Qt installed via vcpkg

## Step-by-Step Build Instructions

### Step 1: Install Required Dependencies via vcpkg

Open **Command Prompt** or **PowerShell** and run:

```cmd
cd %USERPROFILE%\Documents\Github\vcpkg

REM Install PJSIP (for SIP/VoIP functionality)
vcpkg install pjproject:x64-windows

REM Install OpenSSL (for secure connections)
vcpkg install openssl:x64-windows

REM Install Qt6 with WebSockets (if not already installed)
vcpkg install qt6-base:x64-windows
vcpkg install qt6-websockets:x64-windows

REM Integrate vcpkg with your system
vcpkg integrate install
```

**Wait for installation to complete** - this may take 10-30 minutes depending on your internet speed.

### Step 2: Verify Qt Installation

Check if Qt is properly installed:

```cmd
cd %USERPROFILE%\Documents\Github\vcpkg\installed\x64-windows

REM Check for qmake
dir bin\qmake.exe

REM Check for Qt WebSockets
dir lib\cmake\Qt6WebSockets
```

If these files exist, Qt is installed correctly.

### Step 3: Set Environment Variables

Set the required environment variables:

```cmd
REM Set VCPKG_ROOT
set VCPKG_ROOT=%USERPROFILE%\Documents\Github\vcpkg

REM Add Qt to PATH
set PATH=%VCPKG_ROOT%\installed\x64-windows\tools\qt6\bin;%PATH%
set PATH=%VCPKG_ROOT%\installed\x64-windows\bin;%PATH%

REM Verify qmake is accessible
qmake --version
```

You should see Qt version information (e.g., "QMake version 3.1, Using Qt version 6.x.x").

### Step 4: Navigate to Project Directory

```cmd
cd %USERPROFILE%\Documents\GitHub\eltropy-npm-package-test
```

(Adjust the path if your project is in a different location)

### Step 5: Clean Previous Builds (if any)

```cmd
REM Remove old build files
if exist Makefile del Makefile
if exist Makefile.Debug del Makefile.Debug
if exist Makefile.Release del Makefile.Release
if exist release rmdir /s /q release
if exist debug rmdir /s /q debug
```

### Step 6: Configure the Project with qmake

```cmd
REM Configure for release build
qmake SIPConnectivityTester.pro -spec win32-msvc "CONFIG+=release"
```

**Expected output:**
- No errors
- Makefile.Release should be created

**If you get errors:**
- "Unknown module(s) in QT: websockets" → Install `qt6-websockets:x64-windows` via vcpkg
- "qmake: command not found" → Add Qt bin to PATH (see Step 3)

### Step 7: Build the Application

```cmd
REM Build using nmake (MSVC) or jom (faster parallel build)
nmake release
```

**Alternative** (if you have MinGW instead of MSVC):
```cmd
REM If using MinGW, configure with:
qmake SIPConnectivityTester.pro -spec win32-g++ "CONFIG+=release"

REM Then build with:
mingw32-make release
```

**Build time:** 2-5 minutes depending on your CPU.

### Step 8: Deploy Qt Dependencies

The .exe needs Qt DLLs to run. Deploy them:

```cmd
cd release

REM Deploy Qt dependencies
windeployqt --release --no-translations SIPConnectivityTester.exe
```

### Step 9: Copy vcpkg DLLs

Copy PJSIP and OpenSSL DLLs from vcpkg:

```cmd
REM Still in the release folder
copy %VCPKG_ROOT%\installed\x64-windows\bin\*.dll .
```

### Step 10: Test the Application

```cmd
REM Run the application
SIPConnectivityTester.exe
```

The application should launch in maximized window mode.

## Troubleshooting

### Issue: "qmake: command not found"

**Solution:**
```cmd
set PATH=%VCPKG_ROOT%\installed\x64-windows\tools\qt6\bin;%PATH%
qmake --version
```

### Issue: "Unknown module(s) in QT: websockets"

**Solution:**
```cmd
cd %VCPKG_ROOT%
vcpkg install qt6-websockets:x64-windows
```

### Issue: "pjsua2.hpp: No such file or directory"

**Solution:**
```cmd
cd %VCPKG_ROOT%
vcpkg install pjproject:x64-windows
set VCPKG_ROOT=%USERPROFILE%\Documents\Github\vcpkg
```

### Issue: Application crashes on startup

**Solution:** Missing DLLs. Run:
```cmd
cd release
windeployqt --release SIPConnectivityTester.exe
copy %VCPKG_ROOT%\installed\x64-windows\bin\*.dll .
```

### Issue: "LINK : fatal error LNK1181: cannot open input file"

**Solution:** PJSIP libraries not found. Verify installation:
```cmd
dir %VCPKG_ROOT%\installed\x64-windows\lib\pj*.lib
```

If empty, reinstall:
```cmd
vcpkg remove pjproject:x64-windows
vcpkg install pjproject:x64-windows
```

## Creating a Portable Package

Once built successfully, create a portable folder:

```cmd
REM From project root
mkdir SIPConnectivityTester-Portable
xcopy /E /I release SIPConnectivityTester-Portable

REM Create a ZIP file (requires 7-Zip)
7z a SIPConnectivityTester-Windows.zip SIPConnectivityTester-Portable
```

## Quick Build Script

Save this as `build-windows.bat` in your project root:

```batch
@echo off
echo ========================================
echo Building SIP Connectivity Tester
echo ========================================

REM Set vcpkg root
set VCPKG_ROOT=%USERPROFILE%\Documents\Github\vcpkg

REM Add Qt to PATH
set PATH=%VCPKG_ROOT%\installed\x64-windows\tools\qt6\bin;%PATH%
set PATH=%VCPKG_ROOT%\installed\x64-windows\bin;%PATH%

REM Clean
echo [1/4] Cleaning...
if exist Makefile nmake clean 2>nul
if exist release rmdir /s /q release 2>nul
if exist debug rmdir /s /q debug 2>nul

REM Configure
echo [2/4] Configuring...
qmake SIPConnectivityTester.pro -spec win32-msvc "CONFIG+=release"
if %ERRORLEVEL% NEQ 0 goto error

REM Build
echo [3/4] Building...
nmake release
if %ERRORLEVEL% NEQ 0 goto error

REM Deploy
echo [4/4] Deploying...
cd release
windeployqt --release --no-translations SIPConnectivityTester.exe
copy %VCPKG_ROOT%\installed\x64-windows\bin\*.dll . 2>nul
cd ..

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo Executable: release\SIPConnectivityTester.exe
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo Build failed!
echo ========================================
pause
exit /b 1
```

Then simply run:
```cmd
build-windows.bat
```

## Summary

**Quick commands to build:**

```cmd
cd %USERPROFILE%\Documents\Github\vcpkg
vcpkg install pjproject:x64-windows openssl:x64-windows qt6-base:x64-windows qt6-websockets:x64-windows

set VCPKG_ROOT=%USERPROFILE%\Documents\Github\vcpkg
set PATH=%VCPKG_ROOT%\installed\x64-windows\tools\qt6\bin;%PATH%

cd %USERPROFILE%\Documents\GitHub\eltropy-npm-package-test
qmake SIPConnectivityTester.pro -spec win32-msvc "CONFIG+=release"
nmake release
cd release
windeployqt --release --no-translations SIPConnectivityTester.exe
copy %VCPKG_ROOT%\installed\x64-windows\bin\*.dll .
SIPConnectivityTester.exe
```

Your .exe will be in the `release` folder!
