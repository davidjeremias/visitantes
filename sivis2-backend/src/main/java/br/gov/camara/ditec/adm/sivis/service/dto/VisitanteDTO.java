package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class VisitanteDTO implements Serializable {

	private static final long serialVersionUID = -7485637218165858744L;

	private Integer id;

	@NotBlank
	@NotNull
	private String nomeVisitante;

	private String cpf;

	private String telefoneVisitante;

	private String nomeMae;

	private String pontoCadastrador;

	private LocalDateTime dataCadastro;

	@NotBlank
	@NotNull
	private String fotoVisitante;

	private LocalDate dataCadFotoVisitante;

	private Boolean isDocumento;

	private List<DocumentoDTO> documentos;

	private EntradaDTO entrada;

	private RejeicaoEntradaDTO rejeicaoEntradaDTO;

	private String destino;

	private Boolean isFotoVisitanteVencida;
	
	private AgendamentoDTO agendamentoDTO;
	
	private Boolean isAlterar;
	
	private Boolean isNovoVisitante;
	
	@Tolerate
	public VisitanteDTO() {
		super();
	}

}