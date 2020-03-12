package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FilterDTO implements Serializable{

	private static final long serialVersionUID = 8077770561050247870L;
	
	private String nome;
	private String cpf;
	private String numero;
	private String parametros;

	@Tolerate
	public FilterDTO() {
		super();
	}
}
