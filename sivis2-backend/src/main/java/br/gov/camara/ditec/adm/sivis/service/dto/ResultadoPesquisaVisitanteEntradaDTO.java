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
public class ResultadoPesquisaVisitanteEntradaDTO {

	// visitantes
	private Integer id;
	private String fotoVisitante;
	private String nomeVisitante;
	private String numeroDocumentoVisitante;
	private String tipoRestricao;
	// Entradas
	private String dataEntrada;
	private String horaEntrada;
	private String portaria;
	private String destino;
	
	
	@Tolerate
	public ResultadoPesquisaVisitanteEntradaDTO() {
		super();
	}
	
	
}
