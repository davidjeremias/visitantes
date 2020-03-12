package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDate;

import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FiltroConsultaAgendamentoDTO {
	
	private LocalDate dataInicial;
	private LocalDate dataFinal;
	private Integer periodo;
	private Integer situacao;
	private String descricao;
	
	@NotNull
	private Integer idParlamentar;
	
	
	@Tolerate
	public FiltroConsultaAgendamentoDTO() {
		super();
	}
	
	
	

}
