package br.gov.camara.ditec.adm.sivis.config;

import java.util.ArrayList;
import java.util.Collection;

import org.keycloak.adapters.spi.KeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class UsuarioSessao extends KeycloakAuthenticationToken {

	private static final long serialVersionUID = 8024842951138119487L;

	private String nome;
	private String nomeContexto;
	private String idContexto;
	
    public static final String PREFIXO_PONTO_DEPUTADO = "D_";
    public static final String PREFIXO_PONTO_FUNCIONARIO = "P_";
    public static final String PREFIXO_PONTO_EXTERNO = "E_";
	
	public UsuarioSessao(KeycloakAccount account, Collection<? extends GrantedAuthority> authorities) {
		super(account, authorities);
	}

	public UsuarioSessao(KeycloakAccount account) {
		super(account);
	}

	public String getPonto() {
		return super.getName();
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getNomeContexto() {
		return nomeContexto;
	}

	public void setNomeContexto(String nomeContexto) {
		this.nomeContexto = nomeContexto;
	}

	public String getIdContexto() {
		return idContexto;
	}

	public void setIdContexto(String idContexto) {
		this.idContexto = idContexto;
	}

	public String[] getPerfis() {
		ArrayList<String> perfis = new ArrayList<String>();
		for (GrantedAuthority ga : this.getAuthorities())
			perfis.add(ga.getAuthority());
		
		return perfis.toArray(new String[0]);
	}
	
	public Integer getIdDeputado() {
		return Integer.valueOf(this.idContexto.substring("DEPUTADO/".length()));
	}

	@Override
	public String toString() {
		return "[" + this.getName() + " - Roles: <" + this.getAuthorities() + ">]";
	}
}
