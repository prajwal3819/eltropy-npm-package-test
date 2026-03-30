@echo off
REM Windows Build Script for SIP Connectivity Tester
REM This script builds the application on Windows using Qt and vcpkg

echo ========================================
echo SIP Connectivity Tester - Windows Build
echo ========================================
echo.

REM Check if VCPKG_ROOT is set
if "%VCPKG_ROOT%"=="" (
    echo WARNING: VCPKG_ROOT environment variable is not set
    echo Please set it to your vcpkg installation directory
    echo Example: set VCPKG_ROOT=C:\vcpkg
    echo.
    set /p VCPKG_ROOT="Enter vcpkg path (or press Enter to skip): "
)

if not "%VCPKG_ROOT%"=="" (
    echo Using VCPKG_ROOT: %VCPKG_ROOT%
    echo.
)

REM Clean previous build
echo [1/4] Cleaning previous build...
if exist Makefile (
    mingw32-make clean 2>nul
    del Makefile 2>nul
    del Makefile.Debug 2>nul
    del Makefile.Release 2>nul
)
if exist release rmdir /s /q release 2>nul
if exist debug rmdir /s /q debug 2>nul
echo Done.
echo.

REM Run qmake
echo [2/4] Running qmake...
qmake SIPConnectivityTester.pro -spec win32-g++ "CONFIG+=release"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: qmake failed
    echo Make sure Qt is installed and qmake is in your PATH
    echo Try: set PATH=C:\Qt\6.5.3\mingw_64\bin;%%PATH%%
    pause
    exit /b 1
)
echo Done.
echo.

REM Build
echo [3/4] Building application...
mingw32-make -j4
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    echo Check the error messages above
    pause
    exit /b 1
)
echo Done.
echo.

REM Deploy Qt dependencies
echo [4/4] Deploying Qt dependencies...
cd release
windeployqt --release --no-translations SIPConnectivityTester.exe
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: windeployqt failed, but build may still work
)
cd ..
echo Done.
echo.

echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Executable location: release\SIPConnectivityTester.exe
echo.
echo To run the application:
echo   cd release
echo   SIPConnectivityTester.exe
echo.
pause
