#ifndef CONNECTIVITYMANAGER_H
#define CONNECTIVITYMANAGER_H

#include <QObject>
#include <QQueue>
#include "models/serverconfig.h"
#include "models/connectivityresult.h"
#include "iconnectivitychecker.h"

class ConnectivityManager : public QObject
{
    Q_OBJECT

public:
    explicit ConnectivityManager(QObject *parent = nullptr);
    ~ConnectivityManager();

    void runAllTests(const ServerConfig &config);
    void cancelTests();
    bool isRunning() const { return m_isRunning; }

signals:
    void testStarted(const QString &testName);
    void testCompleted(const ConnectivityResult &result);
    void progressUpdate(const QString &message);
    void allTestsCompleted(const QList<ConnectivityResult> &results);

private slots:
    void onTestCompleted(const ConnectivityResult &result);
    void onProgressUpdate(const QString &message);

private:
    void runNextTest();
    void cleanup();

    struct TestTask {
        QString name;
        IConnectivityChecker *checker;
        QString host;
        int port;
    };

    QQueue<TestTask> m_testQueue;
    QList<ConnectivityResult> m_results;
    IConnectivityChecker *m_currentChecker;
    bool m_isRunning;
    int m_timeout;
};

#endif
