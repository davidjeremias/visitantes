package br.gov.camara.ditec.adm.sivis.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.leg.camara.carteiro.ClienteCarteiro;

@Configuration
public class EmailConfig {
	
	@Bean
	public ClienteCarteiro emailSenderCamara() {
		return ClienteCarteiro.builder()
                .urlCarteiro("https://carteiro-tes.camara.gov.br")  //pode ser usada url de testes também: https://carteiro-tes.camara.gov.br/ 
                .clientId("sivis")
                .secret("123456789")
                .build();
	}
}
