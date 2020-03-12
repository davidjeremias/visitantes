package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class MensagemConvidadoDTO implements Serializable{
	
	@Tolerate
	public MensagemConvidadoDTO() {
		super();
	}
	
	private static final long serialVersionUID = 2731521392773147174L;

	private Integer qtMsgConfirmacao;
	private Integer qtMsgCancelamento;
	private Integer qtMsgAlteracao;
	private Integer idAgendamento;
	private String nomeConvidado;
	private String nomeDeputado;
	private String local;
	private String dataAgendamento;
	private String periodo;
	private String pathQrCode;
	private List<ConvidadoDTO> convidados;
	private ConvidadoDTO convidado;
	private Boolean statusEnvio;
	private String emailConvidado;
	private String tipoEmail;
	private AgendamentoConvidado agendamentoConvidado;
	private String fotoConvidado;
	private LocalDateTime dataEnvio;
}
