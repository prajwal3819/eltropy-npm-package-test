/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 6.10.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QFormLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenu>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QSpinBox>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QTextEdit>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *actionExit;
    QAction *actionAbout;
    QWidget *centralwidget;
    QVBoxLayout *verticalLayout;
    QGroupBox *configGroupBox;
    QFormLayout *formLayout;
    QLabel *serverHostLabel;
    QLineEdit *serverHostEdit;
    QLabel *tcpPortsLabel;
    QLineEdit *tcpPortsEdit;
    QLabel *udpPortsLabel;
    QLineEdit *udpPortsEdit;
    QLabel *tlsPortLabel;
    QLineEdit *tlsPortEdit;
    QLabel *wssPortLabel;
    QLineEdit *wssPortEdit;
    QLabel *rtpPortsLabel;
    QLineEdit *rtpPortsEdit;
    QLabel *timeoutLabel;
    QSpinBox *timeoutSpinBox;
    QHBoxLayout *buttonLayout;
    QPushButton *startButton;
    QPushButton *cancelButton;
    QPushButton *clearButton;
    QPushButton *exportButton;
    QSpacerItem *horizontalSpacer;
    QGroupBox *resultsGroupBox;
    QVBoxLayout *verticalLayout_2;
    QTextEdit *resultsText;
    QLabel *statusLabel;
    QMenuBar *menubar;
    QMenu *menuFile;
    QMenu *menuHelp;
    QStatusBar *statusbar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName("MainWindow");
        MainWindow->resize(900, 700);
        actionExit = new QAction(MainWindow);
        actionExit->setObjectName("actionExit");
        actionAbout = new QAction(MainWindow);
        actionAbout->setObjectName("actionAbout");
        centralwidget = new QWidget(MainWindow);
        centralwidget->setObjectName("centralwidget");
        verticalLayout = new QVBoxLayout(centralwidget);
        verticalLayout->setObjectName("verticalLayout");
        configGroupBox = new QGroupBox(centralwidget);
        configGroupBox->setObjectName("configGroupBox");
        formLayout = new QFormLayout(configGroupBox);
        formLayout->setObjectName("formLayout");
        serverHostLabel = new QLabel(configGroupBox);
        serverHostLabel->setObjectName("serverHostLabel");

        formLayout->setWidget(0, QFormLayout::ItemRole::LabelRole, serverHostLabel);

        serverHostEdit = new QLineEdit(configGroupBox);
        serverHostEdit->setObjectName("serverHostEdit");

        formLayout->setWidget(0, QFormLayout::ItemRole::FieldRole, serverHostEdit);

        tcpPortsLabel = new QLabel(configGroupBox);
        tcpPortsLabel->setObjectName("tcpPortsLabel");

        formLayout->setWidget(1, QFormLayout::ItemRole::LabelRole, tcpPortsLabel);

        tcpPortsEdit = new QLineEdit(configGroupBox);
        tcpPortsEdit->setObjectName("tcpPortsEdit");

        formLayout->setWidget(1, QFormLayout::ItemRole::FieldRole, tcpPortsEdit);

        udpPortsLabel = new QLabel(configGroupBox);
        udpPortsLabel->setObjectName("udpPortsLabel");

        formLayout->setWidget(2, QFormLayout::ItemRole::LabelRole, udpPortsLabel);

        udpPortsEdit = new QLineEdit(configGroupBox);
        udpPortsEdit->setObjectName("udpPortsEdit");

        formLayout->setWidget(2, QFormLayout::ItemRole::FieldRole, udpPortsEdit);

        tlsPortLabel = new QLabel(configGroupBox);
        tlsPortLabel->setObjectName("tlsPortLabel");

        formLayout->setWidget(3, QFormLayout::ItemRole::LabelRole, tlsPortLabel);

        tlsPortEdit = new QLineEdit(configGroupBox);
        tlsPortEdit->setObjectName("tlsPortEdit");

        formLayout->setWidget(3, QFormLayout::ItemRole::FieldRole, tlsPortEdit);

        wssPortLabel = new QLabel(configGroupBox);
        wssPortLabel->setObjectName("wssPortLabel");

        formLayout->setWidget(4, QFormLayout::ItemRole::LabelRole, wssPortLabel);

        wssPortEdit = new QLineEdit(configGroupBox);
        wssPortEdit->setObjectName("wssPortEdit");

        formLayout->setWidget(4, QFormLayout::ItemRole::FieldRole, wssPortEdit);

        rtpPortsLabel = new QLabel(configGroupBox);
        rtpPortsLabel->setObjectName("rtpPortsLabel");

        formLayout->setWidget(5, QFormLayout::ItemRole::LabelRole, rtpPortsLabel);

        rtpPortsEdit = new QLineEdit(configGroupBox);
        rtpPortsEdit->setObjectName("rtpPortsEdit");

        formLayout->setWidget(5, QFormLayout::ItemRole::FieldRole, rtpPortsEdit);

        timeoutLabel = new QLabel(configGroupBox);
        timeoutLabel->setObjectName("timeoutLabel");

        formLayout->setWidget(6, QFormLayout::ItemRole::LabelRole, timeoutLabel);

        timeoutSpinBox = new QSpinBox(configGroupBox);
        timeoutSpinBox->setObjectName("timeoutSpinBox");
        timeoutSpinBox->setMinimum(1);
        timeoutSpinBox->setMaximum(60);
        timeoutSpinBox->setValue(5);

        formLayout->setWidget(6, QFormLayout::ItemRole::FieldRole, timeoutSpinBox);


        verticalLayout->addWidget(configGroupBox);

        buttonLayout = new QHBoxLayout();
        buttonLayout->setObjectName("buttonLayout");
        startButton = new QPushButton(centralwidget);
        startButton->setObjectName("startButton");

        buttonLayout->addWidget(startButton);

        cancelButton = new QPushButton(centralwidget);
        cancelButton->setObjectName("cancelButton");

        buttonLayout->addWidget(cancelButton);

        clearButton = new QPushButton(centralwidget);
        clearButton->setObjectName("clearButton");

        buttonLayout->addWidget(clearButton);

        exportButton = new QPushButton(centralwidget);
        exportButton->setObjectName("exportButton");

        buttonLayout->addWidget(exportButton);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Policy::Expanding, QSizePolicy::Policy::Minimum);

        buttonLayout->addItem(horizontalSpacer);


        verticalLayout->addLayout(buttonLayout);

        resultsGroupBox = new QGroupBox(centralwidget);
        resultsGroupBox->setObjectName("resultsGroupBox");
        verticalLayout_2 = new QVBoxLayout(resultsGroupBox);
        verticalLayout_2->setObjectName("verticalLayout_2");
        resultsText = new QTextEdit(resultsGroupBox);
        resultsText->setObjectName("resultsText");
        resultsText->setReadOnly(true);

        verticalLayout_2->addWidget(resultsText);


        verticalLayout->addWidget(resultsGroupBox);

        statusLabel = new QLabel(centralwidget);
        statusLabel->setObjectName("statusLabel");

        verticalLayout->addWidget(statusLabel);

        MainWindow->setCentralWidget(centralwidget);
        menubar = new QMenuBar(MainWindow);
        menubar->setObjectName("menubar");
        menubar->setGeometry(QRect(0, 0, 900, 24));
        menuFile = new QMenu(menubar);
        menuFile->setObjectName("menuFile");
        menuHelp = new QMenu(menubar);
        menuHelp->setObjectName("menuHelp");
        MainWindow->setMenuBar(menubar);
        statusbar = new QStatusBar(MainWindow);
        statusbar->setObjectName("statusbar");
        MainWindow->setStatusBar(statusbar);

        menubar->addAction(menuFile->menuAction());
        menubar->addAction(menuHelp->menuAction());
        menuFile->addAction(actionExit);
        menuHelp->addAction(actionAbout);

        retranslateUi(MainWindow);
        QObject::connect(actionExit, &QAction::triggered, MainWindow, qOverload<>(&QMainWindow::close));

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QCoreApplication::translate("MainWindow", "SIP Connectivity Tester", nullptr));
        actionExit->setText(QCoreApplication::translate("MainWindow", "Exit", nullptr));
        actionAbout->setText(QCoreApplication::translate("MainWindow", "About", nullptr));
        configGroupBox->setTitle(QCoreApplication::translate("MainWindow", "Server Configuration", nullptr));
        serverHostLabel->setText(QCoreApplication::translate("MainWindow", "Server Host:", nullptr));
        serverHostEdit->setPlaceholderText(QCoreApplication::translate("MainWindow", "e.g., sip.example.com or 192.168.1.100", nullptr));
        tcpPortsLabel->setText(QCoreApplication::translate("MainWindow", "TCP Ports:", nullptr));
        tcpPortsEdit->setText(QCoreApplication::translate("MainWindow", "5060, 5080", nullptr));
        tcpPortsEdit->setPlaceholderText(QCoreApplication::translate("MainWindow", "Comma-separated ports", nullptr));
        udpPortsLabel->setText(QCoreApplication::translate("MainWindow", "UDP Ports:", nullptr));
        udpPortsEdit->setText(QCoreApplication::translate("MainWindow", "5060, 5080", nullptr));
        udpPortsEdit->setPlaceholderText(QCoreApplication::translate("MainWindow", "Comma-separated ports", nullptr));
        tlsPortLabel->setText(QCoreApplication::translate("MainWindow", "TLS Port:", nullptr));
        tlsPortEdit->setText(QCoreApplication::translate("MainWindow", "5061", nullptr));
        wssPortLabel->setText(QCoreApplication::translate("MainWindow", "WSS Port:", nullptr));
        wssPortEdit->setText(QCoreApplication::translate("MainWindow", "443", nullptr));
        rtpPortsLabel->setText(QCoreApplication::translate("MainWindow", "RTP Ports:", nullptr));
        rtpPortsEdit->setText(QCoreApplication::translate("MainWindow", "10000, 20000", nullptr));
        rtpPortsEdit->setPlaceholderText(QCoreApplication::translate("MainWindow", "Comma-separated ports", nullptr));
        timeoutLabel->setText(QCoreApplication::translate("MainWindow", "Timeout (seconds):", nullptr));
        startButton->setText(QCoreApplication::translate("MainWindow", "Start Tests", nullptr));
        cancelButton->setText(QCoreApplication::translate("MainWindow", "Cancel", nullptr));
        clearButton->setText(QCoreApplication::translate("MainWindow", "Clear Results", nullptr));
        exportButton->setText(QCoreApplication::translate("MainWindow", "Export Results", nullptr));
        resultsGroupBox->setTitle(QCoreApplication::translate("MainWindow", "Test Results", nullptr));
        resultsText->setHtml(QCoreApplication::translate("MainWindow", "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0//EN\" \"http://www.w3.org/TR/REC-html40/strict.dtd\">\n"
"<html><head><meta name=\"qrichtext\" content=\"1\" /><style type=\"text/css\">\n"
"p, li { white-space: pre-wrap; }\n"
"</style></head><body style=\" font-family:'.AppleSystemUIFont'; font-size:13pt; font-weight:400; font-style:normal;\">\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\">Ready to start connectivity tests...</p></body></html>", nullptr));
        statusLabel->setText(QCoreApplication::translate("MainWindow", "Status: Ready", nullptr));
        menuFile->setTitle(QCoreApplication::translate("MainWindow", "File", nullptr));
        menuHelp->setTitle(QCoreApplication::translate("MainWindow", "Help", nullptr));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
