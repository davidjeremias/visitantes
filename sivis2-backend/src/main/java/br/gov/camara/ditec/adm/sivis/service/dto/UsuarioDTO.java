package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.util.List;

import org.keycloak.representations.AccessTokenResponse;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Builder
@Getter
@Setter
public class UsuarioDTO implements Serializable{
	 
	@Tolerate
	public UsuarioDTO() {
		super();
	}
	
	private static final long serialVersionUID = -949634996108966827L;
	
	private String ponto;
	private String nome;
	private String primeiroNome;
	private String email;
	private String telefone;
	private Boolean contexto;
	private Boolean geral;
	private LotacaoDTO lotacao;
	private List<String> funcionalidades;
	private PerfilDTO perfil;
	private List<GruposDTO> grupos;
	private AccessTokenResponse accessTokenResponse;
}
