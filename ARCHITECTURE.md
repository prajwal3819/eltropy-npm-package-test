# SIP Connectivity Tester - Architecture Documentation

## Overview

This document describes the architecture and design patterns used in the SIP Connectivity Tester application.

## Design Principles

1. **Modularity**: Each protocol checker is independent and implements a common interface
2. **Extensibility**: Easy to add new connectivity tests or protocols
3. **Separation of Concerns**: UI, business logic, and network operations are separated
4. **Asynchronous Operations**: All network operations are non-blocking
5. **Signal/Slot Pattern**: Qt's signal/slot mechanism for loose coupling

## Architecture Layers

### 1. Presentation Layer (UI)
- **MainWindow**: Primary user interface
  - Configuration input
  - Test execution controls
  - Results display
  - Export functionality

### 2. Business Logic Layer
- **ConnectivityManager**: Orchestrates all connectivity tests
  - Manages test queue
  - Coordinates test execution
  - Aggregates results
  - Provides progress updates

### 3. Network Testing Layer
- **IConnectivityChecker**: Abstract interface for all checkers
- **Protocol-Specific Checkers**: Implement actual connectivity tests
  - TcpConnectivityChecker
  - UdpConnectivityChecker
  - TlsConnectivityChecker
  - WssConnectivityChecker
  - RtpConnectivityChecker

### 4. Data Model Layer
- **ServerConfig**: Encapsulates server configuration
- **ConnectivityResult**: Represents test results with metadata

## Component Details

### IConnectivityChecker Interface

```cpp
class IConnectivityChecker : public QObject
{
    Q_OBJECT
public:
    virtual void checkConnectivity(host, port, timeout) = 0;
    virtual void cancel() = 0;
    
signals:
    void connectivityChecked(ConnectivityResult);
    void progressUpdate(QString);
};
```

**Purpose**: Defines contract for all connectivity checkers

**Benefits**:
- Polymorphic test execution
- Easy to add new protocol tests
- Consistent interface for manager

### ConnectivityManager

**Responsibilities**:
1. Queue management for sequential test execution
2. Checker lifecycle management
3. Result aggregation
4. Progress reporting

**Design Pattern**: Command Pattern + Queue
- Each test is a command in the queue
- Executed sequentially to avoid resource conflicts
- Results collected and reported

**Key Methods**:
- `runAllTests(ServerConfig)`: Initiates test suite
- `cancelTests()`: Stops ongoing tests
- `runNextTest()`: Executes next test in queue

### Protocol Checkers

#### TCP Connectivity Checker
- Uses `QTcpSocket`
- Measures connection establishment time
- Reports socket errors
- Implements timeout mechanism

#### UDP Connectivity Checker
- Uses `QUdpSocket`
- Sends SIP OPTIONS probe messages
- Implements retry mechanism (3 attempts)
- Validates responses from target server
- Handles one-way communication scenarios

#### TLS Connectivity Checker
- Uses `QSslSocket`
- Performs TLS handshake
- Reports cipher suite and protocol version
- Handles SSL errors gracefully
- Configurable certificate verification

#### WSS Connectivity Checker
- Uses `QWebSocket`
- Establishes WebSocket Secure connection
- Validates SSL/TLS layer
- Useful for WebRTC SIP implementations

#### RTP Connectivity Checker
- Uses `QUdpSocket`
- Sends minimal RTP packets (header only)
- Tests media port reachability
- Useful for firewall/NAT detection

## Data Flow

```
User Input (MainWindow)
    ↓
ServerConfig Creation
    ↓
ConnectivityManager.runAllTests()
    ↓
Test Queue Population
    ↓
Sequential Test Execution
    ↓
Individual Checker Execution
    ↓
Network Operations
    ↓
ConnectivityResult Generation
    ↓
Result Aggregation
    ↓
UI Update (MainWindow)
```

## Threading Model

- **Main Thread**: UI and event loop
- **Network Operations**: Qt's event-driven I/O (non-blocking)
- **No Worker Threads**: All operations use Qt's asynchronous I/O

**Benefits**:
- Simple threading model
- No race conditions
- No mutex/lock complexity
- Responsive UI through event loop

## Error Handling

### Levels of Error Handling

1. **Network Level**: Socket errors, timeouts
2. **Protocol Level**: Invalid responses, handshake failures
3. **Application Level**: Configuration errors, resource allocation

### Error Reporting

- **ConnectivityResult.Status**: Success, Failed, Timeout
- **Error Messages**: Descriptive text for debugging
- **UI Feedback**: Color-coded results, detailed logs

## Extensibility Points

### Adding New Protocol Tests

1. Create new class implementing `IConnectivityChecker`
2. Implement `checkConnectivity()` and `cancel()`
3. Add to `ConnectivityManager::runAllTests()`
4. Update `ServerConfig` if needed
5. Update UI for configuration

### Adding New Features

- **Authentication**: Extend checkers with credential support
- **Metrics**: Add latency, jitter, packet loss measurements
- **Reporting**: Extend result model with additional data
- **Scheduling**: Add periodic testing capability

## Future Architecture Considerations

### Phase 2 (SIP Registration)
- Add `SipRegistrationManager`
- Implement SIP protocol stack (or use library)
- Add authentication mechanisms
- Support multiple transports

### Phase 3 (SIP Calls)
- Add `SipCallManager`
- Implement SDP parsing/generation
- Add audio codec support
- RTP stream analysis

### Phase 4 (System Information)
- Add `SystemInfoCollector`
- Platform-specific implementations
- Network interface enumeration
- QoS detection modules

## Dependencies

### Qt Modules
- **QtCore**: Core functionality, event loop
- **QtGui**: GUI components
- **QtWidgets**: Widget toolkit
- **QtNetwork**: TCP/UDP/TLS networking
- **QtWebSockets**: WebSocket support

### External Dependencies
- None (self-contained Qt application)

## Build System

### Supported Build Systems
1. **qmake**: Traditional Qt build system (.pro file)
2. **CMake**: Modern cross-platform build (CMakeLists.txt)

### Platform-Specific Considerations

#### macOS
- Bundle creation with `macdeployqt`
- Code signing for distribution
- Notarization for Gatekeeper

#### Windows
- Deployment with `windeployqt`
- Installer creation (NSIS/Inno Setup)
- Digital signatures

#### Linux
- AppImage or distribution packages
- Desktop integration files

## Testing Strategy

### Unit Testing (Future)
- Test individual checkers with mock servers
- Validate result parsing
- Configuration validation

### Integration Testing
- Test full workflow with real servers
- Validate UI interactions
- Cross-platform testing

### Manual Testing
- Customer network scenarios
- Various firewall configurations
- Different SIP server implementations

## Performance Considerations

1. **Sequential Testing**: Prevents resource conflicts
2. **Configurable Timeouts**: Balance between thoroughness and speed
3. **Retry Mechanisms**: UDP tests retry 3 times
4. **Resource Cleanup**: Proper socket closure and memory management

## Security Considerations

1. **TLS Verification**: Configurable certificate validation
2. **No Credential Storage**: Credentials not persisted (Phase 2+)
3. **Network Isolation**: No external dependencies
4. **Input Validation**: Sanitize user inputs

## Code Organization

```
src/
├── connectivity/          # Network testing components
│   ├── iconnectivitychecker.h
│   ├── *connectivitychecker.h/cpp
│   └── connectivitymanager.h/cpp
├── models/               # Data models
│   ├── serverconfig.h/cpp
│   └── connectivityresult.h/cpp
├── mainwindow.h/cpp/ui   # UI components
└── main.cpp              # Entry point
```

## Coding Standards

- **C++17**: Modern C++ features
- **Qt Conventions**: Signal/slot naming, member prefixes (m_)
- **RAII**: Resource management through object lifetime
- **Const Correctness**: Use const where applicable
- **Smart Pointers**: Qt parent-child ownership model
