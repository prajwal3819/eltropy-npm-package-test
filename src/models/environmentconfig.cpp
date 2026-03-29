#include "environmentconfig.h"

EnvironmentConfig::EnvironmentConfig()
    : m_environment(Environment::PROD)
{
}

EnvironmentConfig& EnvironmentConfig::instance()
{
    static EnvironmentConfig instance;
    return instance;
}

QString EnvironmentConfig::getSipEndpoint() const
{
    switch (m_environment) {
        case Environment::UAT:
            return "voip.uateltropy.com";
        case Environment::PROD:
            return "voip.eltropy.com";
    }
    return "voip.eltropy.com";
}

QString EnvironmentConfig::getVoipProxyEndpoint() const
{
    switch (m_environment) {
        case Environment::UAT:
            return "voipproxy.uateltropy.com";
        case Environment::PROD:
            return "voipproxy.eltropy.com";
    }
    return "voipproxy.eltropy.com";
}

QString EnvironmentConfig::getTcpPortCheckEndpoint() const
{
    switch (m_environment) {
        case Environment::UAT:
            return "voipproxy.uateltropy.com";
        case Environment::PROD:
            return "voipproxy.eltropy.com";
    }
    return "voipproxy.eltropy.com";
}

QString EnvironmentConfig::getSipDomain() const
{
    switch (m_environment) {
        case Environment::UAT:
            return "fusionpbx-api.uateltropy.com";
        case Environment::PROD:
            return "fusionpbx-api.eltropy.com";
    }
    return "fusionpbx-api.eltropy.com";
}

QString EnvironmentConfig::environmentName() const
{
    switch (m_environment) {
        case Environment::UAT:
            return "UAT";
        case Environment::PROD:
            return "PROD";
    }
    return "PROD";
}
