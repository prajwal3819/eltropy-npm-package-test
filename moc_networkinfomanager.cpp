/****************************************************************************
** Meta object code from reading C++ file 'networkinfomanager.h'
**
** Created by: The Qt Meta Object Compiler version 69 (Qt 6.10.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "src/network/networkinfomanager.h"
#include <QtCore/qmetatype.h>

#include <QtCore/qtmochelpers.h>

#include <memory>


#include <QtCore/qxptype_traits.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'networkinfomanager.h' doesn't include <QObject>."
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
struct qt_meta_tag_ZN18NetworkInfoManagerE_t {};
} // unnamed namespace

template <> constexpr inline auto NetworkInfoManager::qt_create_metaobjectdata<qt_meta_tag_ZN18NetworkInfoManagerE_t>()
{
    namespace QMC = QtMocConstants;
    QtMocHelpers::StringRefStorage qt_stringData {
        "NetworkInfoManager",
        "networkInfoUpdated",
        "",
        "NetworkDiagnostics",
        "diagnostics",
        "gatewayLatencyMeasured",
        "latencyMs",
        "publicIpDiscovered",
        "ip",
        "onGatewayPingFinished",
        "exitCode",
        "QProcess::ExitStatus",
        "exitStatus",
        "onPublicIpCheckFinished"
    };

    QtMocHelpers::UintData qt_methods {
        // Signal 'networkInfoUpdated'
        QtMocHelpers::SignalData<void(const NetworkDiagnostics &)>(1, 2, QMC::AccessPublic, QMetaType::Void, {{
            { 0x80000000 | 3, 4 },
        }}),
        // Signal 'gatewayLatencyMeasured'
        QtMocHelpers::SignalData<void(int)>(5, 2, QMC::AccessPublic, QMetaType::Void, {{
            { QMetaType::Int, 6 },
        }}),
        // Signal 'publicIpDiscovered'
        QtMocHelpers::SignalData<void(const QString &)>(7, 2, QMC::AccessPublic, QMetaType::Void, {{
            { QMetaType::QString, 8 },
        }}),
        // Slot 'onGatewayPingFinished'
        QtMocHelpers::SlotData<void(int, QProcess::ExitStatus)>(9, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::Int, 10 }, { 0x80000000 | 11, 12 },
        }}),
        // Slot 'onPublicIpCheckFinished'
        QtMocHelpers::SlotData<void()>(13, 2, QMC::AccessPrivate, QMetaType::Void),
    };
    QtMocHelpers::UintData qt_properties {
    };
    QtMocHelpers::UintData qt_enums {
    };
    return QtMocHelpers::metaObjectData<NetworkInfoManager, qt_meta_tag_ZN18NetworkInfoManagerE_t>(QMC::MetaObjectFlag{}, qt_stringData,
            qt_methods, qt_properties, qt_enums);
}
Q_CONSTINIT const QMetaObject NetworkInfoManager::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN18NetworkInfoManagerE_t>.stringdata,
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN18NetworkInfoManagerE_t>.data,
    qt_static_metacall,
    nullptr,
    qt_staticMetaObjectRelocatingContent<qt_meta_tag_ZN18NetworkInfoManagerE_t>.metaTypes,
    nullptr
} };

void NetworkInfoManager::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    auto *_t = static_cast<NetworkInfoManager *>(_o);
    if (_c == QMetaObject::InvokeMetaMethod) {
        switch (_id) {
        case 0: _t->networkInfoUpdated((*reinterpret_cast<std::add_pointer_t<NetworkDiagnostics>>(_a[1]))); break;
        case 1: _t->gatewayLatencyMeasured((*reinterpret_cast<std::add_pointer_t<int>>(_a[1]))); break;
        case 2: _t->publicIpDiscovered((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 3: _t->onGatewayPingFinished((*reinterpret_cast<std::add_pointer_t<int>>(_a[1])),(*reinterpret_cast<std::add_pointer_t<QProcess::ExitStatus>>(_a[2]))); break;
        case 4: _t->onPublicIpCheckFinished(); break;
        default: ;
        }
    }
    if (_c == QMetaObject::IndexOfMethod) {
        if (QtMocHelpers::indexOfMethod<void (NetworkInfoManager::*)(const NetworkDiagnostics & )>(_a, &NetworkInfoManager::networkInfoUpdated, 0))
            return;
        if (QtMocHelpers::indexOfMethod<void (NetworkInfoManager::*)(int )>(_a, &NetworkInfoManager::gatewayLatencyMeasured, 1))
            return;
        if (QtMocHelpers::indexOfMethod<void (NetworkInfoManager::*)(const QString & )>(_a, &NetworkInfoManager::publicIpDiscovered, 2))
            return;
    }
}

const QMetaObject *NetworkInfoManager::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *NetworkInfoManager::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_staticMetaObjectStaticContent<qt_meta_tag_ZN18NetworkInfoManagerE_t>.strings))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int NetworkInfoManager::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 5)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 5;
    }
    if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 5)
            *reinterpret_cast<QMetaType *>(_a[0]) = QMetaType();
        _id -= 5;
    }
    return _id;
}

// SIGNAL 0
void NetworkInfoManager::networkInfoUpdated(const NetworkDiagnostics & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 0, nullptr, _t1);
}

// SIGNAL 1
void NetworkInfoManager::gatewayLatencyMeasured(int _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 1, nullptr, _t1);
}

// SIGNAL 2
void NetworkInfoManager::publicIpDiscovered(const QString & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 2, nullptr, _t1);
}
QT_WARNING_POP
