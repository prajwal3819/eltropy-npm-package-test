/****************************************************************************
** Meta object code from reading C++ file 'connectivitymanager.h'
**
** Created by: The Qt Meta Object Compiler version 69 (Qt 6.10.2)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include "src/connectivity/connectivitymanager.h"
#include <QtCore/qmetatype.h>
#include <QtCore/QList>

#include <QtCore/qtmochelpers.h>

#include <memory>


#include <QtCore/qxptype_traits.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'connectivitymanager.h' doesn't include <QObject>."
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
struct qt_meta_tag_ZN19ConnectivityManagerE_t {};
} // unnamed namespace

template <> constexpr inline auto ConnectivityManager::qt_create_metaobjectdata<qt_meta_tag_ZN19ConnectivityManagerE_t>()
{
    namespace QMC = QtMocConstants;
    QtMocHelpers::StringRefStorage qt_stringData {
        "ConnectivityManager",
        "testStarted",
        "",
        "testName",
        "testCompleted",
        "ConnectivityResult",
        "result",
        "progressUpdate",
        "message",
        "allTestsCompleted",
        "QList<ConnectivityResult>",
        "results",
        "onTestCompleted",
        "onProgressUpdate"
    };

    QtMocHelpers::UintData qt_methods {
        // Signal 'testStarted'
        QtMocHelpers::SignalData<void(const QString &)>(1, 2, QMC::AccessPublic, QMetaType::Void, {{
            { QMetaType::QString, 3 },
        }}),
        // Signal 'testCompleted'
        QtMocHelpers::SignalData<void(const ConnectivityResult &)>(4, 2, QMC::AccessPublic, QMetaType::Void, {{
            { 0x80000000 | 5, 6 },
        }}),
        // Signal 'progressUpdate'
        QtMocHelpers::SignalData<void(const QString &)>(7, 2, QMC::AccessPublic, QMetaType::Void, {{
            { QMetaType::QString, 8 },
        }}),
        // Signal 'allTestsCompleted'
        QtMocHelpers::SignalData<void(const QList<ConnectivityResult> &)>(9, 2, QMC::AccessPublic, QMetaType::Void, {{
            { 0x80000000 | 10, 11 },
        }}),
        // Slot 'onTestCompleted'
        QtMocHelpers::SlotData<void(const ConnectivityResult &)>(12, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { 0x80000000 | 5, 6 },
        }}),
        // Slot 'onProgressUpdate'
        QtMocHelpers::SlotData<void(const QString &)>(13, 2, QMC::AccessPrivate, QMetaType::Void, {{
            { QMetaType::QString, 8 },
        }}),
    };
    QtMocHelpers::UintData qt_properties {
    };
    QtMocHelpers::UintData qt_enums {
    };
    return QtMocHelpers::metaObjectData<ConnectivityManager, qt_meta_tag_ZN19ConnectivityManagerE_t>(QMC::MetaObjectFlag{}, qt_stringData,
            qt_methods, qt_properties, qt_enums);
}
Q_CONSTINIT const QMetaObject ConnectivityManager::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN19ConnectivityManagerE_t>.stringdata,
    qt_staticMetaObjectStaticContent<qt_meta_tag_ZN19ConnectivityManagerE_t>.data,
    qt_static_metacall,
    nullptr,
    qt_staticMetaObjectRelocatingContent<qt_meta_tag_ZN19ConnectivityManagerE_t>.metaTypes,
    nullptr
} };

void ConnectivityManager::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    auto *_t = static_cast<ConnectivityManager *>(_o);
    if (_c == QMetaObject::InvokeMetaMethod) {
        switch (_id) {
        case 0: _t->testStarted((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 1: _t->testCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 2: _t->progressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        case 3: _t->allTestsCompleted((*reinterpret_cast<std::add_pointer_t<QList<ConnectivityResult>>>(_a[1]))); break;
        case 4: _t->onTestCompleted((*reinterpret_cast<std::add_pointer_t<ConnectivityResult>>(_a[1]))); break;
        case 5: _t->onProgressUpdate((*reinterpret_cast<std::add_pointer_t<QString>>(_a[1]))); break;
        default: ;
        }
    }
    if (_c == QMetaObject::IndexOfMethod) {
        if (QtMocHelpers::indexOfMethod<void (ConnectivityManager::*)(const QString & )>(_a, &ConnectivityManager::testStarted, 0))
            return;
        if (QtMocHelpers::indexOfMethod<void (ConnectivityManager::*)(const ConnectivityResult & )>(_a, &ConnectivityManager::testCompleted, 1))
            return;
        if (QtMocHelpers::indexOfMethod<void (ConnectivityManager::*)(const QString & )>(_a, &ConnectivityManager::progressUpdate, 2))
            return;
        if (QtMocHelpers::indexOfMethod<void (ConnectivityManager::*)(const QList<ConnectivityResult> & )>(_a, &ConnectivityManager::allTestsCompleted, 3))
            return;
    }
}

const QMetaObject *ConnectivityManager::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ConnectivityManager::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_staticMetaObjectStaticContent<qt_meta_tag_ZN19ConnectivityManagerE_t>.strings))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int ConnectivityManager::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 6)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 6;
    }
    if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 6)
            *reinterpret_cast<QMetaType *>(_a[0]) = QMetaType();
        _id -= 6;
    }
    return _id;
}

// SIGNAL 0
void ConnectivityManager::testStarted(const QString & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 0, nullptr, _t1);
}

// SIGNAL 1
void ConnectivityManager::testCompleted(const ConnectivityResult & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 1, nullptr, _t1);
}

// SIGNAL 2
void ConnectivityManager::progressUpdate(const QString & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 2, nullptr, _t1);
}

// SIGNAL 3
void ConnectivityManager::allTestsCompleted(const QList<ConnectivityResult> & _t1)
{
    QMetaObject::activate<void>(this, &staticMetaObject, 3, nullptr, _t1);
}
QT_WARNING_POP
