#ifndef CONNECTIVITYTESTBLOCK_H
#define CONNECTIVITYTESTBLOCK_H

#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QProgressBar>
#include "models/connectivityresult.h"

class ConnectivityTestBlock : public QWidget
{
    Q_OBJECT

public:
    enum TestStatus {
        NotTested,
        Testing,
        AllSuccess,
        PartialSuccess,
        ConnectionRefused,
        AllFailed
    };

    explicit ConnectivityTestBlock(const QString &emoji,
                                   const QString &title,
                                   const QString &description,
                                   ConnectivityResult::Protocol protocol,
                                   const QString &host,
                                   int port,
                                   QWidget *parent = nullptr);

    void setStatus(TestStatus status);
    void setProgress(int current, int total);
    void setDetails(const QString &details);
    void reset();

    ConnectivityResult::Protocol protocol() const { return m_protocol; }
    QString host() const { return m_host; }
    int port() const { return m_port; }

signals:
    void testRequested(ConnectivityResult::Protocol protocol, const QString &host, int port);

private:
    void setupUI();
    void updateStatusDisplay();

    QString m_title;
    ConnectivityResult::Protocol m_protocol;
    QString m_host;
    int m_port;
    TestStatus m_status;

    QLabel *m_titleLabel;
    QLabel *m_statusLabel;
    QLabel *m_detailsLabel;
    QPushButton *m_testButton;
    QProgressBar *m_progressBar;
    QWidget *m_statusIndicator;
};

#endif
