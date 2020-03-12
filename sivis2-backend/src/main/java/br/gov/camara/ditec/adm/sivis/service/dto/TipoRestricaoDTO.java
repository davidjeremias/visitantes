package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class TipoRestricaoDTO implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2435694406266597196L;

	@Tolerate
	public TipoRestricaoDTO() {
		super();
	}
	
	private Integer id;
	private String nome;

}
