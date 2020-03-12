package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FiltroRestricaoEntradaDTO {
	
	private LocalDate dataInicial;
	private LocalDate dataFinal;
	private String tipoRestricao;
	private String cpf;
	private String nome;
	private String motivo;
	private Boolean somenteComRestricaoEntrada;

	
	@Tolerate
	public FiltroRestricaoEntradaDTO() {
		super();
	}
}
