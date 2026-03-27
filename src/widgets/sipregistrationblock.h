#ifndef SIPREGISTRATIONBLOCK_H
#define SIPREGISTRATIONBLOCK_H

#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include "../sip/sipregistrationmanager.h"

class SipRegistrationBlock : public QWidget
{
    Q_OBJECT

public:
    enum Status {
        Idle,
        Registering,
        Registered,
        Failed
    };

    explicit SipRegistrationBlock(const QString &transport, 
                                  const QString &host, 
                                  int port,
                                  SipTransportType transportType,
                                  QWidget *parent = nullptr);

    void setStatus(Status status);
    void setMessage(const QString &message);
    void setExpiryTime(int seconds);
    void reset();
    
    QString transport() const { return m_transport; }
    QString host() const { return m_host; }
    int port() const { return m_port; }
    SipTransportType transportType() const { return m_transportType; }

signals:
    void testRequested(SipTransportType transportType, const QString &host, int port);
    void unregisterRequested(SipTransportType transportType, const QString &host, int port);

private slots:
    void onTestClicked();
    void onUnregisterClicked();

private:
    void setupUI();
    QString getStatusIcon() const;
    QString getStatusColor() const;

    QString m_transport;
    QString m_host;
    int m_port;
    SipTransportType m_transportType;
    Status m_status;
    QString m_message;

    QLabel *m_statusLabel;
    QLabel *m_infoLabel;
    QLabel *m_timerLabel;
    QPushButton *m_testButton;
    QPushButton *m_unregisterButton;
};

#endif // SIPREGISTRATIONBLOCK_H
