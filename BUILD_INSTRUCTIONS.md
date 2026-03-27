# Build Instructions - SIP Connectivity Tester

## Quick Start

### macOS (Recommended for Development)

1. **Install Qt**:
   ```bash
   # Using Homebrew
   brew install qt@6
   
   # Or download from https://www.qt.io/download
   ```

2. **Build with qmake**:
   ```bash
   cd /Users/prajwal/eltropy/eltroy-voip-connectivity-app
   /usr/local/opt/qt@6/bin/qmake SIPConnectivityTester.pro
   make
   ```

3. **Run**:
   ```bash
   open SIPConnectivityTester.app
   # or
   ./SIPConnectivityTester.app/Contents/MacOS/SIPConnectivityTester
   ```

### Alternative: CMake Build

```bash
mkdir build
cd build
cmake ..
cmake --build .
./SIPConnectivityTester.app/Contents/MacOS/SIPConnectivityTester
```

## Platform-Specific Instructions

### macOS - Creating Distributable Package

1. **Build Release Version**:
   ```bash
   qmake CONFIG+=release SIPConnectivityTester.pro
   make
   ```

2. **Deploy Qt Dependencies**:
   ```bash
   macdeployqt SIPConnectivityTester.app
   ```

3. **Create DMG**:
   ```bash
   macdeployqt SIPConnectivityTester.app -dmg
   ```

4. **Code Signing (Optional)**:
   ```bash
   codesign --deep --force --verify --verbose --sign "Developer ID Application: YourName" SIPConnectivityTester.app
   ```

### Windows - Building and Packaging

1. **Install Qt**:
   - Download Qt installer from https://www.qt.io/download
   - Install with MinGW or MSVC compiler

2. **Build**:
   ```cmd
   # Open Qt Command Prompt
   cd C:\path\to\eltroy-voip-connectivity-app
   qmake SIPConnectivityTester.pro
   nmake release  # or mingw32-make
   ```

3. **Deploy**:
   ```cmd
   cd release
   windeployqt SIPConnectivityTester.exe
   ```

4. **Create Installer**:
   - Use NSIS (Nullsoft Scriptable Install System):
     ```nsis
     !include "MUI2.nsh"
     
     Name "SIP Connectivity Tester"
     OutFile "SIPConnectivityTester-Setup.exe"
     InstallDir "$PROGRAMFILES\SIPConnectivityTester"
     
     Section "Install"
       SetOutPath "$INSTDIR"
       File /r "release\*.*"
       CreateShortcut "$DESKTOP\SIP Connectivity Tester.lnk" "$INSTDIR\SIPConnectivityTester.exe"
     SectionEnd
     ```
   
   - Or use Inno Setup with a script file

### Linux - Building

1. **Install Dependencies**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install qt6-base-dev qt6-websockets-dev build-essential
   
   # Fedora
   sudo dnf install qt6-qtbase-devel qt6-qtwebsockets-devel
   
   # Arch
   sudo pacman -S qt6-base qt6-websockets
   ```

2. **Build**:
   ```bash
   qmake6 SIPConnectivityTester.pro
   make
   ```

3. **Run**:
   ```bash
   ./SIPConnectivityTester
   ```

4. **Create AppImage** (Optional):
   ```bash
   # Use linuxdeployqt
   wget https://github.com/probonopd/linuxdeployqt/releases/download/continuous/linuxdeployqt-continuous-x86_64.AppImage
   chmod +x linuxdeployqt-continuous-x86_64.AppImage
   ./linuxdeployqt-continuous-x86_64.AppImage SIPConnectivityTester -appimage
   ```

## Development Setup

### Qt Creator (All Platforms)

1. Install Qt Creator
2. Open `SIPConnectivityTester.pro`
3. Configure kit (Desktop Qt 6.x)
4. Build (Ctrl+B / Cmd+B)
5. Run (Ctrl+R / Cmd+R)

### Visual Studio Code

1. Install C++ extension
2. Install Qt extension
3. Configure tasks.json:
   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "Build Qt Project",
         "type": "shell",
         "command": "qmake && make",
         "group": {
           "kind": "build",
           "isDefault": true
         }
       }
     ]
   }
   ```

## Troubleshooting

### macOS: "Qt not found"
```bash
export PATH="/usr/local/opt/qt@6/bin:$PATH"
export LDFLAGS="-L/usr/local/opt/qt@6/lib"
export CPPFLAGS="-I/usr/local/opt/qt@6/include"
```

### Windows: "Cannot find qmake"
Add Qt bin directory to PATH:
```cmd
set PATH=C:\Qt\6.x.x\mingw_64\bin;%PATH%
```

### Linux: Missing WebSockets module
```bash
sudo apt-get install libqt6websockets6-dev
```

### Build Errors: "undefined reference to vtable"
```bash
# Clean and rebuild
make clean
qmake
make
```

## Testing the Build

After building, test basic functionality:

1. Launch the application
2. Enter a test server (e.g., `sip.example.com`)
3. Click "Start Tests"
4. Verify results appear in the results panel
5. Test "Export Results" functionality

## Automated Windows Builds (GitHub Actions)

### Using GitHub Actions for Windows MSI

The project includes a GitHub Actions workflow that automatically builds Windows installers:

**Location**: `.github/workflows/windows-build.yml`

**What it does**:
- Builds the application for Windows (64-bit)
- Installs all dependencies (Qt, PJSIP, OpenSSL) via vcpkg
- Creates a portable ZIP package
- Creates an MSI installer using WiX Toolset
- Uploads artifacts for download

**Triggering a build**:

1. **Automatic**: Push to `main` or `develop` branch
2. **Manual**: Go to Actions tab → Windows Build → Run workflow

**Downloading builds**:

1. Go to the Actions tab in GitHub
2. Click on the latest successful workflow run
3. Download artifacts:
   - `SIPConnectivityTester-Windows-Portable.zip` - Portable version
   - `SIPConnectivityTester-Setup.msi` - MSI installer

**Creating a release**:

```bash
# Tag a release
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will automatically create a release with installers
```

### Manual Windows Build (Without GitHub Actions)

If you need to build locally on Windows:

1. **Install Qt for Windows** (MinGW or MSVC)
2. **Install vcpkg**:
   ```powershell
   git clone https://github.com/Microsoft/vcpkg.git
   cd vcpkg
   .\bootstrap-vcpkg.bat
   .\vcpkg install pjproject:x64-windows openssl:x64-windows
   .\vcpkg integrate install
   ```

3. **Build**:
   ```cmd
   qmake SIPConnectivityTester.pro -spec win32-g++
   mingw32-make release
   cd release
   windeployqt SIPConnectivityTester.exe
   ```

4. **Create MSI** (using WiX):
   ```powershell
   dotnet tool install --global wix
   wix build installer.wxs -o SIPConnectivityTester-Setup.msi
   ```

## Distribution Checklist

- [ ] Build in Release mode
- [ ] Run on clean system (no Qt installed)
- [ ] Test all connectivity features
- [ ] Verify UI responsiveness
- [ ] Check file size (should be reasonable with dependencies)
- [ ] Test on target OS version
- [ ] Create installer/package
- [ ] Sign binaries (macOS/Windows)
- [ ] Test installer on clean system

## Performance Optimization

For smaller binary size:

```bash
# Strip symbols (Linux/macOS)
strip SIPConnectivityTester

# Windows
strip SIPConnectivityTester.exe
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    
    steps:
    - uses: actions/checkout@v2
    - name: Install Qt
      uses: jurplel/install-qt-action@v3
      with:
        version: '6.5.0'
    - name: Build
      run: |
        qmake SIPConnectivityTester.pro
        make
```

## Support

For build issues, check:
1. Qt version compatibility (5.15+ or 6.x)
2. Compiler version (C++17 support required)
3. All Qt modules installed (Core, Gui, Widgets, Network, WebSockets)
