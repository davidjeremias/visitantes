package br.gov.camara.ditec.adm.sivis;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import br.gov.camara.ditec.adm.sivis.util.PropertiesLogger;

@SpringBootApplication(scanBasePackages = { "br.gov.camara.ditec.adm.sivis" })
public class SivisBackendApplication {

	public static void main(String[] args) {
		SpringApplicationBuilder builder = new SpringApplicationBuilder().sources(SivisBackendApplication.class);
		builder.application().addListeners(new PropertiesLogger());
		builder.run(args);		
	}
}
