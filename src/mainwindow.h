#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QMap>
#include <QTextEdit>
#include <QLineEdit>
#include <QComboBox>
#include <QSpinBox>
#include <QLabel>
#include "connectivity/connectivitymanager.h"
#include "connectivity/multipingchecker.h"
#include "models/serverconfig.h"
#include "widgets/connectivitytestblock.h"
#include "widgets/sipregistrationblock.h"
#include "sip/sipregistrationmanager.h"
#include "sip/sipcallmanager.h"
#include "network/networkinfomanager.h"

enum class CallState;
struct VoIPQualityMetrics;

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void onTestAllClicked();
    void onTestBlockRequested(ConnectivityResult::Protocol protocol, const QString &host, int port);
    void onMultiPingProgress(int current, int total);
    void onMultiPingCompleted(int successCount, int totalAttempts, const QList<ConnectivityResult> &results);
    void onMultiPingAttemptCompleted(const ConnectivityResult &result);
    
    // SIP Registration slots
    void onSipTestAllClicked();
    void onSipBlockRequested(SipTransportType transportType, const QString &host, int port);
    void onSipUnregisterRequested(SipTransportType transportType, const QString &host, int port);
    void onSipRegistrationStarted();
    void onSipRegistrationSucceeded(const QString &accountKey, const QString &message, int expiresIn);
    void onSipRegistrationFailed(const QString &error);
    void onSipUnregistered();
    void onSipStatusChanged(const QString &status);
    void updateSipTimers();
    
    // Network diagnostics slots
    void onNetworkInfoUpdated(const NetworkDiagnostics &diagnostics);
    void onGatewayLatencyMeasured(int latencyMs);
    void onPublicIpDiscovered(const QString &publicIp);
    
    // Call testing slots
    void onRegisterForCallClicked();
    void onUnregisterForCallClicked();
    void onMakeCallClicked();
    void onHangupCallClicked();
    void onMuteToggled();
    void onCallRegistrationStatusChanged(bool registered, const QString &message);
    void onCallStateChanged(CallState state, const QString &info);
    void onSipPacketLogged(const QString &packet);
    
    // Advanced Checks slots
    void onCheckSipAlgClicked();
    void onSipAlgCheckCompleted(const ConnectivityResult &result);
    void onSipAlgProgressUpdate(const QString &message);
    
    void onCheckNatTypeClicked();
    void onNatTypeCheckCompleted(const ConnectivityResult &result);
    void onNatTypeProgressUpdate(const QString &message);
    
    // VoIP Quality slots
    void onStartVoipQualityTest();
    void onVoipQualityTestCompleted(const ConnectivityResult &result);
    void onVoipQualityProgressUpdate(const QString &message);
    void onVoipQualityMetricsUpdated(const VoIPQualityMetrics &metrics);

private:
    void setupUI();
    void setupConnections();
    void createConnectivityTab();
    void testNextBlock();
    void addLog(const QString &message, const QString &level = "INFO");
    ConnectivityTestBlock* findBlockByKey(const QString &key);
    QString getBlockKey(ConnectivityResult::Protocol protocol, const QString &host, int port);
    QMap<QString, ConnectivityTestBlock*> m_testBlocks;
    MultiPingChecker *m_multiPingChecker;
    QList<QPair<ConnectivityResult::Protocol, QPair<QString, int>>> m_testQueue;
    int m_currentTestIndex;
    bool m_testingAll;
    QString m_currentTestKey;
    QTextEdit *m_logsTextEdit;
    
    // SIP Registration members
    SipRegistrationManager *m_sipManager;
    QMap<QString, SipRegistrationBlock*> m_sipBlocks;
    QSpinBox *m_sipTimeout;
    QString m_currentSipTestKey;
    bool m_testingAllSip;
    int m_currentSipTestIndex;
    QList<QPair<SipTransportType, QPair<QString, int>>> m_sipTestQueue;
    QTimer *m_sipTimerUpdate;
    QMap<QString, QDateTime> m_sipExpiryTimes;
    
    // Hardcoded SIP credentials
    QString m_sipUsername;
    QString m_sipPassword;
    QString m_sipDomain;
    QString m_sipProxy;
    
    void testNextSipBlock();
    SipRegistrationBlock* findSipBlockByKey(const QString &key);
    QString getSipBlockKey(SipTransportType transportType, const QString &host, int port);
    
    void createNetworkInfoTab();
    void createCallTestTab();
    void createAdvancedChecksTab();
    void createVoIPQualityTab();
    void updateNetworkInfoDisplay(const NetworkDiagnostics &diagnostics);
    
    QTimer *m_sipExpiryTimer;
    
    // Network diagnostics members
    NetworkInfoManager *m_networkInfoManager;
    QWidget *m_networkInfoWidget;
    QLabel *m_interfacesLabel;
    QLabel *m_dnsLabel;
    QLabel *m_dhcpLabel;
    QLabel *m_gatewayLabel;
    QLabel *m_latencyLabel;
    QLabel *m_publicIpLabel;
    QPushButton *m_refreshNetworkBtn;
    
    // Call testing
    SipCallManager *m_callManager;
    QWidget *m_callTestWidget;
    QComboBox *m_transportCombo;
    QComboBox *m_portCombo;
    QLineEdit *m_destinationEdit;
    QPushButton *m_registerCallBtn;
    QPushButton *m_unregisterCallBtn;
    QPushButton *m_makeCallBtn;
    QPushButton *m_hangupBtn;
    QPushButton *m_muteBtn;
    QLabel *m_callStatusLabel;
    QLabel *m_registrationStatusLabel;
    
    // Advanced Checks
    QWidget *m_advancedChecksWidget;
    QLineEdit *m_sipAlgHostEdit;
    QSpinBox *m_sipAlgPortSpin;
    QPushButton *m_checkSipAlgBtn;
    QLabel *m_sipAlgResultLabel;
    QLineEdit *m_natStunServerEdit;
    QPushButton *m_checkNatTypeBtn;
    QLabel *m_natTypeResultLabel;
    
    // VoIP Quality
    QWidget *m_voipQualityWidget;
    QLineEdit *m_voipQualityServerEdit;
    QSpinBox *m_voipQualityPortSpin;
    QPushButton *m_startVoipQualityBtn;
    QLabel *m_jitterValueLabel;
    QLabel *m_packetLossValueLabel;
    QLabel *m_latencyValueLabel;
    QLabel *m_mosValueLabel;
    QLabel *m_burstLossValueLabel;
    QLabel *m_congestionValueLabel;
    QLabel *m_voipQualityStatusLabel;
};

#endif
