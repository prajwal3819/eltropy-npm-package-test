#ifndef ICONNECTIVITYCHECKER_H
#define ICONNECTIVITYCHECKER_H

#include <QObject>
#include "models/connectivityresult.h"

class IConnectivityChecker : public QObject
{
    Q_OBJECT

public:
    explicit IConnectivityChecker(QObject *parent = nullptr) : QObject(parent) {}
    virtual ~IConnectivityChecker() = default;

    virtual void checkConnectivity(const QString &host, int port, int timeout = 5000) = 0;
    virtual void cancel() = 0;

signals:
    void connectivityChecked(const ConnectivityResult &result);
    void progressUpdate(const QString &message);
};

#endif
