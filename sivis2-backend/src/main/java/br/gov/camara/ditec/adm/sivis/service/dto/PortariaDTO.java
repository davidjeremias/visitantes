package br.gov.camara.ditec.adm.sivis.service.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class PortariaDTO {
	
	private Integer id;
	private String descricaoPortaria;
	private Boolean isHabilitado;
	private List<DestinoDTO> destinoDTO;
	
	@Tolerate
	public PortariaDTO() {
		
	}

}
