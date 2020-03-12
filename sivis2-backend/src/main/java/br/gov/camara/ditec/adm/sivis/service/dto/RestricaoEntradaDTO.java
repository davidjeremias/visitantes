package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.TipoRestricao;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class RestricaoEntradaDTO {
	
	private Integer id;

	private TipoRestricao tipoRestricao;

	private VisitanteDTO visitanteDTO;

	@NotBlank
	@NotNull
	private String numCPF;

	@NotBlank
	@NotNull
	private String nomeCivil;

	@NotBlank
	@NotNull
	private String motivoRestricao;

	@NotNull
	private LocalDate dataInicioRestricao;

	private LocalDate dataFinalRestricao;

	@NotBlank
	@NotNull
	private String pontoCadastrador;

	private LocalDateTime dataCadastro;
	
	private FotoRestricaoEntradaDTO fotoRestricaoEntradaDTO;
	
	private Integer qtdTentativasEntrada;

	
	@Tolerate
	public RestricaoEntradaDTO() {
		super();
	}
}
