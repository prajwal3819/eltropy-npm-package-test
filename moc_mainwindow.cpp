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
        "onMultiPingAttemptCompleted",
        "ConnectivityResult",
        "result",
        "onSipTestAllClicked",
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
        "onVoipQualityTestCompleted",
        "onVoipQualityProgressUpdate",
        "onVoipQualityMetricsUpdated",
        "VoIPQualityMetrics",
        "metrics"
    };

    QtMocHelpers::UintData qt_methods {
        // Slot 'onTestAllClicked'
        QtMocHelpers::SlotData<void()>(1, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onTestBlockRequested'
        QtMocHelpers::SlotData<void(ConnectivityResult::Protocol, const QString &, int)>(3, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 4, 5 }, { QMetaType::QString, 6 }, { QMetaType::Int, 7 },
        }}),
        // Slot 'onMultiPingProgress'
        QtMocHelpers::SlotData<void(int, int)>(8, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 9 }, { QMetaType::Int, 10 },
        }}),
        // Slot 'onMultiPingCompleted'
        QtMocHelpers::SlotData<void(int, int, const QList<ConnectivityResult> &)>(11, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 12 }, { QMetaType::Int, 13 }, { 0x80000000 | 14, 15 },
        }}),
        // Slot 'onMultiPingAttemptCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(16, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 17, 18 },
        }}),
        // Slot 'onSipTestAllClicked'
        QtMocHelpers::SlotData<void()>(19, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipBlockRequested'
        QtMocHelpers::SlotData<void(SipTransportType, const QString &, int)>(20, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 21, 22 }, { QMetaType::QString, 6 }, { QMetaType::Int, 7 },
        }}),
        // Slot 'onSipUnregisterRequested'
        QtMocHelpers::SlotData<void(SipTransportType, const QString &, int)>(23, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 21, 22 }, { QMetaType::QString, 6 }, { QMetaType::Int, 7 },
        }}),
        // Slot 'onSipRegistrationStarted'
        QtMocHelpers::SlotData<void()>(24, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipRegistrationSucceeded'
        QtMocHelpers::SlotData<void(const QString &, const QString &, int)>(25, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 26 }, { QMetaType::QString, 27 }, { QMetaType::Int, 28 },
        }}),
        // Slot 'onSipRegistrationFailed'
        QtMocHelpers::SlotData<void(const QString &)>(29, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 30 },
        }}),
        // Slot 'onSipUnregistered'
        QtMocHelpers::SlotData<void()>(31, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipStatusChanged'
        QtMocHelpers::SlotData<void(const QString &)>(32, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 33 },
        }}),
        // Slot 'updateSipTimers'
        QtMocHelpers::SlotData<void()>(34, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onNetworkInfoUpdated'
        QtMocHelpers::SlotData<void(const NetworkDiagnostics &)>(35, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 36, 37 },
        }}),
        // Slot 'onGatewayLatencyMeasured'
        QtMocHelpers::SlotData<void(int)>(38, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 39 },
        }}),
        // Slot 'onPublicIpDiscovered'
        QtMocHelpers::SlotData<void(const QString &)>(40, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 41 },
        }}),
        // Slot 'onRegisterForCallClicked'
        QtMocHelpers::SlotData<void()>(42, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onUnregisterForCallClicked'
        QtMocHelpers::SlotData<void()>(43, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onMakeCallClicked'
        QtMocHelpers::SlotData<void()>(44, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onHangupCallClicked'
        QtMocHelpers::SlotData<void()>(45, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onMuteToggled'
        QtMocHelpers::SlotData<void()>(46, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onCallRegistrationStatusChanged'
        QtMocHelpers::SlotData<void(bool, const QString &)>(47, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Bool, 48 }, { QMetaType::QString, 27 },
        }}),
        // Slot 'onCallStateChanged'
        QtMocHelpers::SlotData<void(CallState, const QString &)>(49, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 50, 51 }, { QMetaType::QString, 52 },
        }}),
        // Slot 'onSipPacketLogged'
        QtMocHelpers::SlotData<void(const QString &)>(53, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 54 },
        }}),
        // Slot 'onCheckSipAlgClicked'
        QtMocHelpers::SlotData<void()>(55, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onSipAlgCheckCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(56, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 17, 18 },
        }}),
        // Slot 'onSipAlgProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(57, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 27 },
        }}),
        // Slot 'onCheckNatTypeClicked'
        QtMocHelpers::SlotData<void()>(58, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onNatTypeCheckCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(59, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 17, 18 },
        }}),
        // Slot 'onNatTypeProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(60, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 27 },
        }}),
        // Slot 'onStartVoipQualityTest'
        QtMocHelpers::SlotData<void()>(61, 2, QMC::AccessPrivate, QMetaType::Void),
        // Slot 'onVoipQualityTestCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(62, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 17, 18 },
        }}),
        // Slot 'onVoipQualityProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(63, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 27 },
        }}),
        // Slot 'onVoipQualityMetricsUpdated'
        QtMocHelpers::SlotData<void(const VoIPQualityMetrics &)>(64, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 65, 66 },
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
        case 1: _t->onTestBlockRequested((*reinterpret_cast<std::add_pointer_t<ConnectivityResult::Protocol>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 2: _t->onMultiPingProgress((*reinterpret_cast<std::add_pointer_t<int>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[2]))); break;
        case 3: _t->onMultiPingCompleted((*reinterpret_cast<std::add_pointer_t<int>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<QList<ConnectivityResult>>>(_a[3]))); break;
        case 4: _t->onMultiPingAttemptCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 5: _t->onSipTestAllClicked(); break;
        case 6: _t->onSipBlockRequested((*reinterpret_cast<std::add_pointer_t<SipTransportType>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 7: _t->onSipUnregisterRequested((*reinterpret_cast<std::add_pointer_t<SipTransportType>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 8: _t->onSipRegistrationStarted(); break;
        case 9: _t->onSipRegistrationSucceeded((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2])),(*reinterpret_cast<std::add_pointer_t<int>>(_a[3]))); break;
        case 10: _t->onSipRegistrationFailed((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 11: _t->onSipUnregistered(); break;
        case 12: _t->onSipStatusChanged((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 13: _t->updateSipTimers(); break;
        case 14: _t->onNetworkInfoUpdated((*reinterpret_cast<std::add_pointer_t<NetworkDiagnostics>>(_a[1]))); break;
        case 15: _t->onGatewayLatencyMeasured((*reinterpret_cast<std::add_pointer_t<int>>(_a[1]))); break;
        case 16: _t->onPublicIpDiscovered((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 17: _t->onRegisterForCallClicked(); break;
        case 18: _t->onUnregisterForCallClicked(); break;
        case 19: _t->onMakeCallClicked(); break;
        case 20: _t->onHangupCallClicked(); break;
        case 21: _t->onMuteToggled(); break;
        case 22: _t->onCallRegistrationStatusChanged((*reinterpret_cast<std::add_pointer_t<bool>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2]))); break;
        case 23: _t->onCallStateChanged((*reinterpret_cast<std::add_pointer_t<CallState>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QString>>(_a[2]))); break;
        case 24: _t->onSipPacketLogged((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 25: _t->onCheckSipAlgClicked(); break;
        case 26: _t->onSipAlgCheckCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 27: _t->onSipAlgProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 28: _t->onCheckNatTypeClicked(); break;
        case 29: _t->onNatTypeCheckCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 30: _t->onNatTypeProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 31: _t->onStartVoipQualityTest(); break;
        case 32: _t->onVoipQualityTestCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 33: _t->onVoipQualityProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 34: _t->onVoipQualityMetricsUpdated((*reinterpret_cast<std::add_pointer_t<VoIPQualityMetrics>>(_a[1]))); break;
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
        if (_id < 35)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 35;
    }
    if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 35)
            *reinterpret_cast<QMetaType *>(_a[0]) = QMetaType();
        _id -= 35;
    }
    return _id;
}
QT_WARNING_POP
