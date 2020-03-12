package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FiltroPesquisarVisitanteEntradaDTO {
	
	//visitantes
	private String nomeVisitante;
	private String numeroDocumentoVisitante;
	private TipoRestricaoDTO tipoRestricaoDTO;
	//Entradas
	private LocalDateTime dataEntradaInicial;
	private LocalDateTime dataEntradaFinal;
	private LocalDateTime horaEntradaInicial;
	private LocalDateTime horaEntradaFinal;
	private String local;
	private PortariaDTO portariaDTO;
	private DestinoDTO destinoDTO;
	
	private String checkEntradas;
	
	
	
	@Tolerate
	public FiltroPesquisarVisitanteEntradaDTO() {
		super();
	}
	
	
	

}
