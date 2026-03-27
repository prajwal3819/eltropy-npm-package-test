// This file contains SIP packet logging implementation
// It will be included at the end of mainwindow.cpp

void MainWindow::onSipPacketLogged(const QString &packet)
{
    // Format SIP packets for better readability
    QString formattedPacket = packet.trimmed();
    
    // Detect packet type and add appropriate formatting
    if (formattedPacket.startsWith("TX ")) {
        addLog("📤 " + formattedPacket, "INFO");
    } else if (formattedPacket.startsWith("RX ")) {
        addLog("📥 " + formattedPacket, "INFO");
    } else if (formattedPacket.contains("INVITE ") || formattedPacket.contains("REGISTER ")) {
        addLog("  " + formattedPacket, "INFO");
    } else if (formattedPacket.startsWith("SIP/2.0")) {
        addLog("  " + formattedPacket, "SUCCESS");
    } else {
        addLog("  " + formattedPacket, "INFO");
    }
}
