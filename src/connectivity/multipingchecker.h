#ifndef MULTIPINGCHECKER_H
#define MULTIPINGCHECKER_H

#include <QObject>
#include "iconnectivitychecker.h"

class MultiPingChecker : public QObject
{
    Q_OBJECT

public:
    explicit MultiPingChecker(QObject *parent = nullptr);
    ~MultiPingChecker();

    void startTest(ConnectivityResult::Protocol protocol, 
                   const QString &host, 
                   int port, 
                   int attempts = 5,
                   int timeout = 5000);
    void cancel();

signals:
    void progressUpdate(int current, int total);
    void testCompleted(int successCount, int totalAttempts, const QList<ConnectivityResult> &results);
    void attemptCompleted(const ConnectivityResult &result);

private slots:
    void onCheckerCompleted(const ConnectivityResult &result);
    void runNextAttempt();

private:
    void cleanup();
    IConnectivityChecker* createChecker(ConnectivityResult::Protocol protocol);

    ConnectivityResult::Protocol m_protocol;
    QString m_host;
    int m_port;
    int m_totalAttempts;
    int m_currentAttempt;
    int m_timeout;
    int m_successCount;
    
    QList<ConnectivityResult> m_results;
    IConnectivityChecker *m_currentChecker;
};

#endif
