package br.gov.camara.ditec.adm.sivis.controller.servico;

import java.net.Proxy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class BaseServico {

    @Value("${spring.profiles.active}") 
    private String ambiente;

	@Value("${config.url.servico.autorizador}")
	private String urlServicoAutorizador;	
	
	@Value("${config.url.servico.parlamentarWS}")
	protected String urlServicoParlamentarInfoleg;
	
	public static final String SIGLA_SISTEMA_GABINETE_DIGITAL = "GABINETEDIGITAL";

	/**
	 * Retorna um objeto RestTemplate sem proxy configurado
	 */
	public RestTemplate getRestTemplateSemProxy(){
		
	    Proxy proxy = Proxy.NO_PROXY;
		
	    SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
	    requestFactory.setProxy(proxy);	    
	    
	    RestTemplate restTemplate = new RestTemplate(requestFactory);
		List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
		messageConverters.add(converter);
		restTemplate.setMessageConverters(messageConverters);	    
	    
	    return restTemplate;
	}

}
