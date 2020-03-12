package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FotoRestricaoEntradaDTO implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 2945361696880771609L;
	private Integer id;
	private LocalDate dataFoto;
	private String imagemFoto;
	private RestricaoEntradaDTO restricaoEntradaDTO;
	
	@Tolerate
	public FotoRestricaoEntradaDTO() {
		super();
		
	}

}
