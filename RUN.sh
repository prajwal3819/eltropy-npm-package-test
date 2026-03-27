#!/bin/bash
# Script to run SIP Connectivity Tester with proper environment

# Set Qt plugin path
export QT_QPA_PLATFORM_PLUGIN_PATH=/opt/homebrew/share/qt/plugins

# Run the app
./SIPConnectivityTester.app/Contents/MacOS/SIPConnectivityTester
