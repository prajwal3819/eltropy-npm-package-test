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
    src/mainwindow_calltab.cpp
    src/mainwindow_advancedtab.cpp
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
    src/models/environmentconfig.cpp
    src/models/environmentconfig.h
    src/sip/sipregistrationmanager.cpp
    src/sip/sipregistrationmanager.h
    src/sip/sipcallmanager.cpp
    src/sip/sipcallmanager.h
    src/network/networkinfomanager.cpp
    src/network/networkinfomanager.h
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

# PJSIP Configuration
if(WIN32)
    if(DEFINED ENV{PJSIP_ROOT})
        set(PJSIP_ROOT $ENV{PJSIP_ROOT})
    elseif(DEFINED ENV{VCPKG_ROOT})
        set(PJSIP_ROOT "$ENV{VCPKG_ROOT}/installed/x64-windows")
    else()
        message(FATAL_ERROR "PJSIP_ROOT or VCPKG_ROOT environment variable must be set")
    endif()
    
    target_include_directories(SIPConnectivityTester PRIVATE
        ${PJSIP_ROOT}/include
    )
    
    target_link_directories(SIPConnectivityTester PRIVATE
        ${PJSIP_ROOT}/lib
    )
    
    target_link_libraries(SIPConnectivityTester PRIVATE
        pjsua2-lib
        pjsua-lib
        pjsip-ua-lib
        pjsip-simple-lib
        pjsip-lib
        pjmedia-codec-lib
        pjmedia-lib
        pjmedia-videodev-lib
        pjmedia-audiodev-lib
        pjmedia-lib
        pjnath-lib
        pjlib-util-lib
        pjlib-lib
        resample-lib
        gsmcodec-lib
        speex-lib
        ilbccodec-lib
        g7221codec-lib
        srtp-lib
        ws2_32
        ole32
        dsound
        dxguid
        winmm
        iphlpapi
    )
elseif(APPLE)
    # macOS PJSIP configuration
    target_include_directories(SIPConnectivityTester PRIVATE
        /usr/local/include
    )
    
    target_link_directories(SIPConnectivityTester PRIVATE
        /usr/local/lib
    )
    
    target_link_libraries(SIPConnectivityTester PRIVATE
        pjsua2
        pjsua
        pjsip-ua
        pjsip-simple
        pjsip
        pjmedia-codec
        pjmedia
        pjmedia-videodev
        pjmedia-audiodev
        pjnath
        pjlib-util
        pjlib
        "-framework CoreAudio"
        "-framework AudioToolbox"
        "-framework CoreFoundation"
        "-framework Security"
    )
endif()

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
        XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "-"
        XCODE_ATTRIBUTE_CODE_SIGN_STYLE "Manual"
    )
    
    # Add post-build code signing for macOS
    add_custom_command(TARGET SIPConnectivityTester POST_BUILD
        COMMAND codesign --force --deep --sign - "$<TARGET_BUNDLE_DIR:SIPConnectivityTester>"
        COMMENT "Ad-hoc code signing the application bundle"
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
