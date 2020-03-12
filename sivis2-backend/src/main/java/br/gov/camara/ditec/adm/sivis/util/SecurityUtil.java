package br.gov.camara.ditec.adm.sivis.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class SecurityUtil {
	
	private static final String AUTHORIZATION = "Authorization";
	private static final String USUARIO = "usuario";
	private static final String SENHA = "senha";

	public static HttpHeaders createHeadersSecurityToken(String token, String ponto, String senha) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set(AUTHORIZATION, token);
		headers.set(USUARIO, ponto);
		headers.set(SENHA, senha);
		return headers;
	}
	
	public static HttpHeaders createHeadersSecurityToken(String token, String ponto) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set(AUTHORIZATION, token);
		headers.set(USUARIO, ponto);
		return headers;
	}
}
