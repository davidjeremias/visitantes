package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class ConvidadoDTO implements Serializable {
	
	@Tolerate
	public ConvidadoDTO() {
		super();
	}

	private static final long serialVersionUID = 7367445687052866793L;

	private Integer id;

	@NotBlank
	@NotNull
	private String nomeConvidado;

	private String nacionalidade;

	@NotBlank
	@NotNull
	private String cpf;

	private String telefone;

	@NotBlank
	@NotNull
	private String email;

	// @NotBlank
	@NotNull
	private Integer idParlamentar;

	@NotBlank
	@NotNull
	private String pontoCadastrador;

	// @NotBlank
	//@NotNull
	private DocumentoConvidadoDTO documentosConvidadoDTO;

	// @NotBlank
	//@NotNull
	private FotoConvidadoDTO fotoConvidadoDTO;

	private LocalDateTime dataCadastro;

	private AgendamentoDTO agendamentoDTO;

	private VisitanteDTO visitanteDTO;
	
	private Integer idVisitante;

	private LocalDateTime dataUltimoAcesso;
	
	private Boolean isVisitante;
	private Boolean isConvidadoVisitante;
	private Boolean isConvidado;
	private Boolean isIniciarCadastro;
	private Boolean isAlteracao;
	private Boolean isEntrouAgendamento;
	
	private MensagemConvidadoDTO mensagemConvidado;

}
