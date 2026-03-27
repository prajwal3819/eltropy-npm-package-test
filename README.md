# SIP Connectivity Tester

A cross-platform Qt-based application for testing SIP/VoIP network connectivity from customer networks.

## Phase 1 - Network Connectivity Testing (Current)

This application performs comprehensive connectivity tests to SIP servers:

### Features

- **TCP Connectivity**: Tests TCP connections to SIP ports (default: 5060, 5080)
- **UDP Connectivity**: Tests UDP connections with SIP OPTIONS probes (default: 5060, 5080)
- **TLS Connectivity**: Tests secure TLS connections (default: 5061)
- **WSS Connectivity**: Tests WebSocket Secure connections (default: 443)
- **RTP Connectivity**: Tests UDP connectivity for RTP media streams (configurable ports)

### Architecture

The application follows a modular design pattern:

```
src/
├── models/                      # Data models
│   ├── serverconfig.h/cpp      # Server configuration
│   └── connectivityresult.h/cpp # Test result model
├── connectivity/                # Connectivity checkers
│   ├── iconnectivitychecker.h  # Interface for all checkers
│   ├── tcpconnectivitychecker.h/cpp
│   ├── udpconnectivitychecker.h/cpp
│   ├── tlsconnectivitychecker.h/cpp
│   ├── wssconnectivitychecker.h/cpp
│   ├── rtpconnectivitychecker.h/cpp
│   └── connectivitymanager.h/cpp # Orchestrates all tests
├── mainwindow.h/cpp/ui          # Main application UI
└── main.cpp                     # Application entry point
```

### Key Components

#### IConnectivityChecker (Interface)
Base interface for all connectivity checkers with:
- `checkConnectivity()` - Initiates connectivity test
- `cancel()` - Cancels ongoing test
- Signals for results and progress updates

#### Connectivity Checkers
Each protocol has a dedicated checker:
- **TcpConnectivityChecker**: Establishes TCP connection and measures response time
- **UdpConnectivityChecker**: Sends SIP OPTIONS probes and waits for responses
- **TlsConnectivityChecker**: Performs TLS handshake and validates SSL/TLS connection
- **WssConnectivityChecker**: Establishes WebSocket Secure connection
- **RtpConnectivityChecker**: Sends RTP packets to test media stream connectivity

#### ConnectivityManager
Orchestrates all connectivity tests:
- Queues tests based on configuration
- Executes tests sequentially
- Aggregates results
- Provides progress updates

## Building the Application

### Prerequisites

- Qt 5.15+ or Qt 6.x
- C++17 compatible compiler
- CMake 3.16+ or qmake

### macOS Build Instructions

#### Using Qt Creator (Recommended)
1. Install Qt from https://www.qt.io/download
2. Open `SIPConnectivityTester.pro` in Qt Creator
3. Configure the project with your Qt kit
4. Build and Run (Cmd+R)

#### Using Command Line with qmake
```bash
cd /Users/prajwal/eltropy/eltroy-voip-connectivity-app
qmake SIPConnectivityTester.pro
make
./SIPConnectivityTester.app/Contents/MacOS/SIPConnectivityTester
```

#### Creating macOS Package (.dmg)
```bash
# After building
macdeployqt SIPConnectivityTester.app -dmg
```

### Windows Build Instructions

#### Using Qt Creator
1. Install Qt with MinGW or MSVC compiler
2. Open `SIPConnectivityTester.pro` in Qt Creator
3. Configure with Windows kit
4. Build and Run

#### Using Command Line
```cmd
qmake SIPConnectivityTester.pro
nmake  # or mingw32-make
```

#### Creating Windows Installer
```cmd
# After building
windeployqt SIPConnectivityTester.exe
# Use NSIS or Inno Setup to create installer
```

### Linux Build Instructions

```bash
# Install Qt development packages
sudo apt-get install qt5-default qtbase5-dev

# Build
qmake SIPConnectivityTester.pro
make
./SIPConnectivityTester
```

## Usage

1. **Configure Server Settings**:
   - Enter your SIP server hostname or IP address
   - Configure ports for each protocol (comma-separated for multiple ports)
   - Set timeout value (default: 5 seconds)

2. **Run Tests**:
   - Click "Start Tests" to begin connectivity testing
   - Monitor progress in the results panel
   - Tests run sequentially for each protocol/port combination

3. **View Results**:
   - Results show status (Success/Failed/Timeout)
   - Response times for successful connections
   - Detailed error messages for failures
   - Color-coded results (Green=Success, Red=Failed, Orange=Timeout)

4. **Export Results**:
   - Click "Export Results" to save test results to a text file
   - Useful for sharing with support teams

## Future Phases

### Phase 2 - SIP Registration Testing
- Implement SIP REGISTER functionality
- Support TCP, UDP, and TLS transports
- Configurable retry attempts (3-5 times)
- Authentication support

### Phase 3 - SIP Call Testing
- Full SIP call establishment
- Audio quality testing
- RTP stream analysis
- Call metrics collection

### Phase 4 - System Information Collection
- OS and version detection
- Network interface enumeration
- QoS settings detection
- SIP ALG detection
- NAT type detection
- STUN/TURN support

## Technical Details

### UDP Connectivity Testing
- Sends SIP OPTIONS messages as probes
- Retries up to 3 times with 1-second intervals
- Validates responses from the target server

### TLS Connectivity Testing
- Performs full TLS handshake
- Reports cipher suite and protocol version
- Configurable certificate verification

### RTP Connectivity Testing
- Sends minimal RTP packets (header only)
- Tests UDP port reachability
- Useful for firewall/NAT traversal testing

## Troubleshooting

### macOS Security
If you get "unidentified developer" warning:
```bash
xattr -cr SIPConnectivityTester.app
```

### Windows Firewall
Allow the application through Windows Firewall when prompted.

### Linux Permissions
For binding to privileged ports (<1024), run with appropriate permissions or use ports >1024.

## License

Copyright © 2026 Eltropy. All rights reserved.

## Support

For issues or questions, contact your system administrator.
