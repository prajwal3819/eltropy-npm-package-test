#include "mainwindow.h"
#include <QApplication>
#include <QIcon>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    
    a.setApplicationName("SIP Connectivity Tester");
    a.setApplicationVersion("1.0.0");
    a.setOrganizationName("Eltropy");
    
    // Set application icon
    a.setWindowIcon(QIcon(":/eltropy.png"));
    
    MainWindow w;
    w.show();
    
    return a.exec();
}
