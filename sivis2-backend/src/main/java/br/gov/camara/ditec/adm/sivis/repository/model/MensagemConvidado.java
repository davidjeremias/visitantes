package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Mensagem_Convidado")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class MensagemConvidado extends Entidade{
	
	@Tolerate
	public MensagemConvidado() {
		super();
	}
	
	private static final long serialVersionUID = -2478373684745561186L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_mensagem_convidado")
	private Integer id;
	
	@OneToOne
	@JoinColumn(name = "ide_agendamento")
	private Agendamento agendamento;
	
	@OneToOne
	@JoinColumn(name = "ide_convidado")
	@NotFound(action = NotFoundAction.IGNORE)
	private Convidado convidado;
	
	@OneToOne
	@JoinColumn(name = "ide_tipo_mensagem")
	private TipoMensagem tipoMensagem;
	
	@Column(name = "dat_envio", nullable = false)
	private LocalDateTime dataEnvio;

}
