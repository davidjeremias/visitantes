package br.gov.camara.ditec.adm.sivis.config.seguranca;

import org.keycloak.adapters.KeycloakConfigResolver;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ComponentScan(basePackageClasses = KeycloakSecurityComponents.class, 
	excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "org.keycloak.adapters.springsecurity.management.HttpSessionManager"))
@EnableWebSecurity
public class BackendSecurityConfig extends KeycloakWebSecurityConfigurerAdapter {

    //@Value("${spring.profiles.active}") 
    //private String ambiente;
	
	/***** CONFIGURANDO RESTTEMPLATE PARA LIDAR COM O TOKEN AUTOMATICAMENTE *****/
	@Autowired
	public KeycloakClientRequestFactory keycloakClientRequestFactory;

//	@Bean
//	@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
//	public KeycloakRestTemplate keycloakRestTemplate() {
//		return new KeycloakRestTemplate(keycloakClientRequestFactory);
//	}

	// Submits the KeycloakAuthenticationProvider to the AuthenticationManager
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
		keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
		auth.authenticationProvider(keycloakAuthenticationProvider);
	}

	@Bean
	public KeycloakConfigResolver KeycloakConfigResolver() {
		return new KeycloakSpringBootConfigResolver();
	}

	// Specifies the session authentication strategy
	@Bean
	@Override
	protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
		return new NullAuthenticatedSessionStrategy(); // nao guarda token na sessao
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		super.configure(http);

		http.csrf()
		.disable()
			.authorizeRequests()
			.antMatchers("/login")
			.permitAll()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.GET))
			.authenticated()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.POST))
			.authenticated()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.PUT))
			.authenticated()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.DELETE))
			.authenticated()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.PATCH))
			.permitAll()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.HEAD))
			.permitAll()
		.and()
			.authorizeRequests()
			.antMatchers((HttpMethod.OPTIONS))
			.permitAll()
		.and()
			.authorizeRequests()
			.anyRequest()
			.authenticated()
		.and()
			.sessionManagement()
		.disable();

		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // impede a criacao de sessoes http
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                   CorsRegistration reg = registry
					                          .addMapping("/**")
					                          .allowedMethods("GET", "PUT", "POST", "DELETE");
                   
               //if (ambiente.equalsIgnoreCase("prod")) {
               //    reg.allowedOrigins("https://sivis2.camara.leg.br");
               //} else {
            	   reg.allowedOrigins("*");
               //}

            }
     };

	}
}
