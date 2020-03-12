package br.gov.camara.ditec.adm.sivis.config;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

/**
 * @author Dominic Gunn
 */
@Configuration
public class DataSourceConfig {

    private static final String PRIMARY_DATASOURCE_PREFIX = "spring.primary.datasource";
    private static final String REPLICA_DATASOURCE_PREFIX = "spring.replica.datasource";
    private static final String OTHER_DATASOURCE_PREFIX = "spring.datasource";

    @Autowired
    private Environment environment;

    @Bean
    @Primary
    public DataSource dataSource() 
    {
        final RoutingDataSource routingDataSource = new RoutingDataSource();
        final Map<Object, Object> targetDataSources = new HashMap<>();
        if (environment.getActiveProfiles()[0].equals("prod")) {
            final DataSource primaryDataSource = buildDataSource("PrimaryHikariPool", PRIMARY_DATASOURCE_PREFIX);
            final DataSource replicaDataSource = buildDataSource("ReplicaHikariPool", REPLICA_DATASOURCE_PREFIX);
            targetDataSources.put(RoutingDataSource.Route.PRIMARY, primaryDataSource);
            targetDataSources.put(RoutingDataSource.Route.REPLICA, replicaDataSource);
            routingDataSource.setTargetDataSources(targetDataSources);
            routingDataSource.setDefaultTargetDataSource(primaryDataSource);
        } else {
            final DataSource primaryDataSource = buildDataSource("PrimaryHikariPool", OTHER_DATASOURCE_PREFIX);
            targetDataSources.put(RoutingDataSource.Route.PRIMARY, primaryDataSource);
            routingDataSource.setTargetDataSources(targetDataSources);
            routingDataSource.setDefaultTargetDataSource(primaryDataSource);
        }
        return routingDataSource;
    }

    private DataSource buildDataSource(String poolName, String dataSourcePrefix) 
    {
        final HikariConfig hikariConfig = new HikariConfig();

        hikariConfig.setPoolName(poolName);
        hikariConfig.setJdbcUrl(environment.getProperty(String.format("%s.url", dataSourcePrefix)));
        hikariConfig.setUsername(environment.getProperty(String.format("%s.username", dataSourcePrefix)));
        hikariConfig.setPassword(environment.getProperty(String.format("%s.password", dataSourcePrefix)));
        // hikariConfig.setDriverClassName(environment.getProperty(String.format("%s.driver",
        // dataSourcePrefix)));
        hikariConfig.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

        return new HikariDataSource(hikariConfig);
    }
}