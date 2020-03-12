package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class DestinoDTO implements Serializable{

	private static final long serialVersionUID = 4625884500945940702L;
	
	private Integer id;
	private String nomeDestino;
	private Boolean isHabilitado;
	
	@Tolerate
	public DestinoDTO() {
		
	}
}
