cmake_minimum_required(VERSION 3.16)

project(SIPConnectivityTester VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 COMPONENTS Core Gui Widgets Network WebSockets QUIET)
if (NOT Qt6_FOUND)
    find_package(Qt5 5.15 REQUIRED COMPONENTS Core Gui Widgets Network WebSockets)
endif()

set(PROJECT_SOURCES
    src/main.cpp
    src/mainwindow.cpp
    src/mainwindow.h
    src/mainwindow.ui
    src/connectivity/tcpconnectivitychecker.cpp
    src/connectivity/tcpconnectivitychecker.h
    src/connectivity/udpconnectivitychecker.cpp
    src/connectivity/udpconnectivitychecker.h
    src/connectivity/tlsconnectivitychecker.cpp
    src/connectivity/tlsconnectivitychecker.h
    src/connectivity/wssconnectivitychecker.cpp
    src/connectivity/wssconnectivitychecker.h
    src/connectivity/rtpconnectivitychecker.cpp
    src/connectivity/rtpconnectivitychecker.h
    src/connectivity/connectivitymanager.cpp
    src/connectivity/connectivitymanager.h
    src/connectivity/iconnectivitychecker.h
    src/models/connectivityresult.cpp
    src/models/connectivityresult.h
    src/models/serverconfig.cpp
    src/models/serverconfig.h
)

if(Qt6_FOUND)
    qt_add_executable(SIPConnectivityTester
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES}
    )
else()
    add_executable(SIPConnectivityTester
        ${PROJECT_SOURCES}
    )
endif()

target_include_directories(SIPConnectivityTester PRIVATE src)

if(Qt6_FOUND)
    target_link_libraries(SIPConnectivityTester PRIVATE
        Qt6::Core
        Qt6::Gui
        Qt6::Widgets
        Qt6::Network
        Qt6::WebSockets
    )
else()
    target_link_libraries(SIPConnectivityTester PRIVATE
        Qt5::Core
        Qt5::Gui
        Qt5::Widgets
        Qt5::Network
        Qt5::WebSockets
    )
endif()

if(WIN32)
    set_target_properties(SIPConnectivityTester PROPERTIES
        WIN32_EXECUTABLE TRUE
    )
endif()

if(APPLE)
    set_target_properties(SIPConnectivityTester PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_GUI_IDENTIFIER com.eltropy.sipconnectivitytester
        MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
        MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist.in
    )
endif()

if(Qt6_FOUND)
    qt_finalize_executable(SIPConnectivityTester)
endif()

install(TARGETS SIPConnectivityTester
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
