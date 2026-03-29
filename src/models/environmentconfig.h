#ifndef ENVIRONMENTCONFIG_H
#define ENVIRONMENTCONFIG_H

#include <QString>

enum class Environment {
    UAT,
    PROD
};

class EnvironmentConfig
{
public:
    static EnvironmentConfig& instance();
    
    Environment environment() const { return m_environment; }
    void setEnvironment(Environment env) { m_environment = env; }
    
    QString getSipEndpoint() const;
    QString getVoipProxyEndpoint() const;
    QString getTcpPortCheckEndpoint() const;
    QString getSipDomain() const;
    
    QString environmentName() const;
    
private:
    EnvironmentConfig();
    Environment m_environment;
};

#endif
