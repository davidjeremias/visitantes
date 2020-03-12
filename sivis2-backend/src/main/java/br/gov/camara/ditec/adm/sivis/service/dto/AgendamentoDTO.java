package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class AgendamentoDTO implements Serializable{

	private static final long serialVersionUID = 5516357847142826178L;

	private Integer id;
	
	@NotBlank
	@NotNull
	private String descricaoAgendamento;
	
	@NotNull
	private Integer idParlamentar;
	
	@NotBlank
	@NotNull
	private String nomePatrocinador;
	
	@NotBlank
	@NotNull
	private String local;
	
	@NotNull
	private LocalDate dataAgendamento;
	
	@NotNull
	private String periodo;
	
	@NotBlank
	@NotNull
	private String pontoCadastrador;
	
	@NotNull
	private String situacao;
	
	private LocalDateTime dataCadastro;
	
	private Integer qtdeConvidados;
	
	private List<Convidado> convidados;
	
	private ConvidadoDTO convidadoDTO;
	
	private VisitanteDTO visitanteDTO;
	
	@Tolerate
	public AgendamentoDTO() {
		super();
	}
}
