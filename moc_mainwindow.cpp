/****************************************************************************
** Meta object code from reading C++ file 'mainwindow.h'
**
** Created by: The Qt Meta Object Compiler version 69 (Qt 6.10.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "src/mainwindow.h"
#include <QtGui/qtextcursor.h>
#include <QtCore/qmetatype.h>
#include <QtCore/QList>

#include <QtCore/qtmochelpers.h>

#include <memory>


#include <QtCore/qxptype_traits.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'mainwindow.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 69
#error "This file was generated using the moc from 6.10.2. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

#ifndef Q_CONSTINIT
#define Q_CONSTINIT
#endif

QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
QT_WARNING_DISABLE_GCC("-Wuseless-cast")
namespace {
struct qt_meta_tag_ZN10MainWindowE_t {};
} // unnamed namespace

template <> constexpr inline auto MainWindow::qt_create_metaobjectdata<qt_meta_tag_ZN10MainWindowE_t>()
{
    namespace QMC = QtMocConstants;
    QtMocHelpers::StringRefStorage qt_stringData {
        "MainWindow",
        "onTestAllClicked",
        "",
        "onCancelAllTestsClicked",
        "onTestBlockRequested",
        "ConnectivityResult::Protocol",
        "protocol",
        "host",
        "port",
        "onMultiPingProgress",
        "current",
        "total",
        "onMultiPingCompleted",
        "successCount",
        "totalAttempts",
        "QList<ConnectivityResult>",
        "results",
        "onParallelTestCompleted",
        "key",
        "onMultiPingAttemptCompleted",
        "ConnectivityResult",
        "result",
        "onConnectivityChecked",
        "onSipTestAllClicked",
        "onSipUnregisterAllClicked",
        "onSipBlockRequested",
        "SipTransportType",
        "transportType",
        "onSipUnregisterRequested",
        "onSipRegistrationStarted",
        "onSipRegistrationSucceeded",
        "accountKey",
        "message",
        "expiresIn",
        "onSipRegistrationFailed",
        "error",
        "onSipUnregistered",
        "onSipStatusChanged",
        "status",
        "updateSipTimers",
        "onNetworkInfoUpdated",
        "NetworkDiagnostics",
        "diagnostics",
        "onGatewayLatencyMeasured",
        "latencyMs",
        "onPublicIpDiscovered",
        "publicIp",
        "onRegisterForCallClicked",
        "onUnregisterForCallClicked",
        "onMakeCallClicked",
        "onHangupCallClicked",
        "onMuteToggled",
        "onCallRegistrationStatusChanged",
        "registered",
        "onCallStateChanged",
        "CallState",
        "state",
        "info",
        "onSipPacketLogged",
        "packet",
        "onCheckSipAlgClicked",
        "onSipAlgCheckCompleted",
        "onSipAlgProgressUpdate",
        "onCheckNatTypeClicked",
        "onNatTypeCheckCompleted",
        "onNatTypeProgressUpdate",
        "onStartVoipQualityTest",
        "onCancelVoipQualityTest",
        "onVoipQualityTestCompleted",
        "onVoipQualityProgressUpdate",
        "onVoipQualityMetricsUpdated",
        "VoIPQualityMetrics",
        "metrics"
    };

    QtMocHelpers::UintData qt_methods {
        // Slot 'onTestAllClicked'
        QtMocHelpers::SlotData<void()>(1, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onCancelAllTestsClicked'
        QtMocHelpers::SlotData<void()>(3, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onTestBlockRequested'
        QtMocHelpers::SlotData<void(ConnectivityResult::Protocol, const QString &, int)>(4, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 5, 6 }, { QMetaType::QString, 7 }, { QMetaType::Int, 8 },
        }}),
        // Slot 'onMultiPingProgress'
        QtMocHelpers::SlotData<void(int, int)>(9, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 10 }, { QMetaType::Int, 11 },
        }}),
        // Slot 'onMultiPingCompleted'
        QtMocHelpers::SlotData<void(int, int, const QList<ConnectivityResult> &)>(12, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 13 }, { QMetaType::Int, 14 }, { 0x80000000 | 15, 16 },
        }}),
        // Slot 'onParallelTestCompleted'
        QtMocHelpers::SlotData<void(const QString &, int, int, const QList<ConnectivityResult> &)>(17, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 18 }, { QMetaType::Int, 13 }, { QMetaType::Int, 14 }, { 0x80000000 | 15, 16 },
        }}),
        // Slot 'onMultiPingAttemptCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(19, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 20, 21 },
        }}),
        // Slot 'onConnectivityChecked'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(22, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 20, 21 },
        }}),
        // Slot 'onSipTestAllClicked'
        QtMocHelpers::SlotData<void()>(23, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipUnregisterAllClicked'
        QtMocHelpers::SlotData<void()>(24, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipBlockRequested'
        QtMocHelpers::SlotData<void(SipTransportType, const QString &, int)>(25, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 26, 27 }, { QMetaType::QString, 7 }, { QMetaType::Int, 8 },
        }}),
        // Slot 'onSipUnregisterRequested'
        QtMocHelpers::SlotData<void(SipTransportType, const QString &, int)>(28, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 26, 27 }, { QMetaType::QString, 7 }, { QMetaType::Int, 8 },
        }}),
        // Slot 'onSipRegistrationStarted'
        QtMocHelpers::SlotData<void()>(29, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipRegistrationSucceeded'
        QtMocHelpers::SlotData<void(const QString &, const QString &, int)>(30, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 31 }, { QMetaType::QString, 32 }, { QMetaType::Int, 33 },
        }}),
        // Slot 'onSipRegistrationFailed'
        QtMocHelpers::SlotData<void(const QString &, const QString &)>(34, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 31 }, { QMetaType::QString, 35 },
        }}),
        // Slot 'onSipUnregistered'
        QtMocHelpers::SlotData<void()>(36, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipStatusChanged'
        QtMocHelpers::SlotData<void(const QString &)>(37, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 38 },
        }}),
        // Slot 'updateSipTimers'
        QtMocHelpers::SlotData<void()>(39, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onNetworkInfoUpdated'
        QtMocHelpers::SlotData<void(const NetworkDiagnostics &)>(40, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 41, 42 },
        }}),
        // Slot 'onGatewayLatencyMeasured'
        QtMocHelpers::SlotData<void(int)>(43, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 44 },
        }}),
        // Slot 'onPublicIpDiscovered'
        QtMocHelpers::SlotData<void(const QString &)>(45, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 46 },
        }}),
        // Slot 'onRegisterForCallClicked'
        QtMocHelpers::SlotData<void()>(47, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onUnregisterForCallClicked'
        QtMocHelpers::SlotData<void()>(48, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onMakeCallClicked'
        QtMocHelpers::SlotData<void()>(49, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onHangupCallClicked'
        QtMocHelpers::SlotData<void()>(50, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onMuteToggled'
        QtMocHelpers::SlotData<void()>(51, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onCallRegistrationStatusChanged'
        QtMocHelpers::SlotData<void(bool, const QString &)>(52, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Bool, 53 }, { QMetaType::QString, 32 },
        }}),
        // Slot 'onCallStateChanged'
        QtMocHelpers::SlotData<void(CallState, const QString &)>(54, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 55, 56 }, { QMetaType::QString, 57 },
        }}),
        // Slot 'onSipPacketLogged'
        QtMocHelpers::SlotData<void(const QString &)>(58, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 59 },
        }}),
        // Slot 'onCheckSipAlgClicked'
        QtMocHelpers::SlotData<void()>(60, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipAlgCheckCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(61, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 20, 21 },
        }}),
        // Slot 'onSipAlgProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(62, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 32 },
        }}),
        // Slot 'onCheckNatTypeClicked'
        QtMocHelpers::SlotData<void()>(63, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onNatTypeCheckCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(64, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 20, 21 },
        }}),
        // Slot 'onNatTypeProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(65, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 32 },
        }}),
        // Slot 'onStartVoipQualityTest'
        QtMocHelpers::SlotData<void()>(66, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onCancelVoipQualityTest'
        QtMocHelpers::SlotData<void()>(67, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onVoipQualityTestCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(68, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 20, 21 },
        }}),
        // Slot 'onVoipQualityProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(69, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 32 },
        }}),
        // Slot 'onVoipQualityMetricsUpdated'
        QtMocHelpers::SlotData<void(const VoIPQualityMetrics &)>(70, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 71, 72 },
        }}),
    };
    QtMocHelpers::UintData qt_properties {
    };
    QtMocHelpers::UintData qt_enums {
    };
    return QtMocHelpers::metaObjectData<MainWindow, qt_meta_tag_ZN10MainWindowE_t>(QMC::MetaObjectFlag{}, qt_stringData,
            qt_methods, qt_properties, qt_enums);
}
Q_CONSTINIT const QMetaObject MainWindow::staticMetaObject = { {
    QMetaObject::SuperData::link<QMainWindow::staticMetaObject>(),
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN10MainWindowE_t>.stringdata,
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN10MainWindowE_t>.data,
    qt_static_metacall,
    nullptr,
    qt_staticMetaObjectRelocatingContent<qt_meta_tag_ZN10MainWindowE_t>.metaTypes,
    nullptr
} };

void MainWindow::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    auto *_t = static_cast<MainWindow *>(_o);
    if (_c == QMetaObject::InvokeMetaMethod) {
        switch (_id) {
        case 0: _t->onTestAllClicked(); break;
        case 1: _t->onCancelAllTestsClicked(); break;
        case 2: _t->onTestBlockRequested((*reinterpret_cast<std::add_pointer_t<ConnectivityResult::Protocol>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 3: _t->onMultiPingProgress((*reinterpret_cast<std::add_pointer_t<int>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[2]))); break;
        case 4: _t->onMultiPingCompleted((*reinterpret_cast<std::add_pointer_t<int>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<QList<ConnectivityResult>>>(_a[3]))); break;
        case 5: _t->onParallelTestCompleted((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3])),(*reinterpret_cast<std::add_pointer_t<QList<ConnectivityResult>>>(_a[4]))); break;
        case 6: _t->onMultiPingAttemptCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 7: _t->onConnectivityChecked((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 8: _t->onSipTestAllClicked(); break;
        case 9: _t->onSipUnregisterAllClicked(); break;
        case 10: _t->onSipBlockRequested((*reinterpret_cast<std::add_pointer_t<SipTransportType>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 11: _t->onSipUnregisterRequested((*reinterpret_cast<std::add_pointer_t<SipTransportType>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 12: _t->onSipRegistrationStarted(); break;
        case 13: _t->onSipRegistrationSucceeded((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 14: _t->onSipRegistrationFailed((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2]))); break;
        case 15: _t->onSipUnregistered(); break;
        case 16: _t->onSipStatusChanged((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 17: _t->updateSipTimers(); break;
        case 18: _t->onNetworkInfoUpdated((*reinterpret_cast<std::add_pointer_t<NetworkDiagnostics>>(_a[1]))); break;
        case 19: _t->onGatewayLatencyMeasured((*reinterpret_cast<std::add_pointer_t<int>>(_a[1]))); break;
        case 20: _t->onPublicIpDiscovered((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 21: _t->onRegisterForCallClicked(); break;
        case 22: _t->onUnregisterForCallClicked(); break;
        case 23: _t->onMakeCallClicked(); break;
        case 24: _t->onHangupCallClicked(); break;
        case 25: _t->onMuteToggled(); break;
        case 26: _t->onCallRegistrationStatusChanged((*reinterpret_cast<std::add_pointer_t<bool>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2]))); break;
        case 27: _t->onCallStateChanged((*reinterpret_cast<std::add_pointer_t<CallState>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2]))); break;
        case 28: _t->onSipPacketLogged((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 29: _t->onCheckSipAlgClicked(); break;
        case 30: _t->onSipAlgCheckCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 31: _t->onSipAlgProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 32: _t->onCheckNatTypeClicked(); break;
        case 33: _t->onNatTypeCheckCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 34: _t->onNatTypeProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 35: _t->onStartVoipQualityTest(); break;
        case 36: _t->onCancelVoipQualityTest(); break;
        case 37: _t->onVoipQualityTestCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 38: _t->onVoipQualityProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 39: _t->onVoipQualityMetricsUpdated((*reinterpret_cast<std::add_pointer_t<VoIPQualityMetrics>>(_a[1]))); break;
        default: ;
        }
    }
}

const QMetaObject *MainWindow::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *MainWindow::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_staticMetaObjectStaticContent<qt_meta_tag_ZN10MainWindowE_t>.strings))
        return static_cast<void*>(this);
    return QMainWindow::qt_metacast(_clname);
}

int MainWindow::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QMainWindow::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 40)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 40;
    }
    if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 40)
            *reinterpret_cast<QMetaType *>(_a[0]) = QMetaType();
        _id -= 40;
    }
    return _id;
}
QT_WARNING_POP
