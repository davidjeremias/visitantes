package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class ContextoDTO implements Serializable{
	
	@Tolerate
	public ContextoDTO() {
		super();
	}
	
	private static final long serialVersionUID = 89519981286646118L;
	
	private Integer id;
	private String alias;
	private String codContextoSistema;
	private String ideSistema;
	private Boolean isAtivo;
	private String nome;
	private List<String> funcionaldades;
}
