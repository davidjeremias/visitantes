package br.gov.camara.ditec.adm.sivis.service.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class GruposDTO {
	
	private String grupo;

	@Tolerate
	public GruposDTO() {
		super();
	}
}
