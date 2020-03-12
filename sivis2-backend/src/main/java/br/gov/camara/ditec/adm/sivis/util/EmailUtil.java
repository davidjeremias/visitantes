package br.gov.camara.ditec.adm.sivis.util;

import java.util.List;

import br.gov.camara.ditec.adm.sivis.repository.model.Configuracao;
import br.gov.camara.ditec.adm.sivis.service.dto.ConfiguracaoEmailDTO;
import br.leg.camara.carteiro.Anexo;
import br.leg.camara.carteiro.Contato;
import br.leg.camara.carteiro.Solicitante;

public class EmailUtil {
	
	private static final String HOST = "HOST";
	private static final String PORT = "PORT";
	private static final String USERNAME = "USERNAME";
	private static final String PASSWORD = "PASSWORD";
	private static final String HEADER = "header.png";
	private static final String FOOTER = "footer.png";
	private static final String EMAIL_REMETENTE = "no-reply@camara.leg.br";
	private static final String SIGLA_SISTEMA = "sivis";
	private static final String NOME_SISTEMA = "Sistema de Identificação de Visitantes";

	public static ConfiguracaoEmailDTO getConfiguracaoEmail(List<Configuracao> listaConfiguracao) {
		ConfiguracaoEmailDTO configuracaoEmail = new ConfiguracaoEmailDTO();
		listaConfiguracao.forEach(conf -> {
			if(conf.getChave().equals(HOST))
				configuracaoEmail.setHost(conf.getValor());
			if(conf.getChave().equals(PORT))
				configuracaoEmail.setPort(Integer.valueOf(conf.getValor()));
			if(conf.getChave().equals(USERNAME))
				configuracaoEmail.setUsername(conf.getValor());
			if(conf.getChave().equals(PASSWORD))
				configuracaoEmail.setPassword(conf.getValor());
		});
		return configuracaoEmail;
	}

	public static Anexo getAnexoHeader() {
		return Anexo.builder().nome(HEADER).conteudo(FotoUtil.GetFotoHeader()).build();
	}
	
	public static Anexo getAnexoFooter() {
		return Anexo.builder().nome(FOOTER).conteudo(FotoUtil.GetFotoFooter()).build();
	}
	
	public static Contato getRemetente() {
		return Contato.builder().email(EMAIL_REMETENTE).nome(SIGLA_SISTEMA).build();
	}
	
	public static Solicitante getSolicitante() {
		return Solicitante.builder().ponto(SIGLA_SISTEMA).nome(NOME_SISTEMA).build();
	}
	
	public static String getTexto() {
		return "Email automático";
	}
	
	
}
