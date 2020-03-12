package br.gov.camara.ditec.adm.sivis.config.seguranca;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;

/**
 * Classe que habilita configuração de segurança declarativa nos métodos/classes.
 * 
 * @author P_6690
 */
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig extends GlobalMethodSecurityConfiguration 
{
	@Autowired
	private BaseServico baseServico; 
	
    @Override
    protected MethodSecurityExpressionHandler createExpressionHandler() 
    {
        DefaultMethodSecurityExpressionHandler expressionHandler =  new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setPermissionEvaluator(new CustomPermissionEvaluator(baseServico));
        return expressionHandler;
    }
}
