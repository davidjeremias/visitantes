package br.gov.camara.ditec.adm.sivis.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Dominic Gunn
 */
@Aspect
@Component
@Order(0)
public class ReadOnlyRouteInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(ReadOnlyRouteInterceptor.class);

    @Autowired
	private Environment environment;

    @Around("@annotation(transactional)")
    public Object proceed(ProceedingJoinPoint proceedingJoinPoint, Transactional transactional) throws Throwable 
    {
        if(environment.getActiveProfiles()[0].equals("prod")) {
            try {
                if (transactional.readOnly() && environment.getActiveProfiles()[0].equals("prod")) {
                    RoutingDataSource.setReplicaRoute();
                    logger.info("Routing database call to the read replica");
                }
                return proceedingJoinPoint.proceed();
            } finally {
                RoutingDataSource.clearReplicaRoute();
            }
        }
        return proceedingJoinPoint.proceed();
    }

}