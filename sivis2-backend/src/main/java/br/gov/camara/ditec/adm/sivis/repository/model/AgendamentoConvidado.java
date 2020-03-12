package br.gov.camara.ditec.adm.sivis.repository.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Agendamento_Convidado")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class AgendamentoConvidado extends Entidade{

	private static final long serialVersionUID = -4011347166953149227L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_agendamento_convidado")
	private Integer id;
	
	@OneToOne(cascade = {CascadeType.REFRESH})
	@JoinColumn(name = "ide_agendamento")
	private Agendamento agendamento;
	
	@OneToOne(cascade = {CascadeType.REFRESH}, optional = true)
	@JoinColumn(name = "ide_convidado")
	private Convidado convidado;
	
	@OneToOne(cascade = {CascadeType.REFRESH})
	@JoinColumn(name = "ide_visitante")
	private Visitante visitante;
	
	@Column(name = "email")
	private String email;

	@Tolerate
	public AgendamentoConvidado() {
		super();
	}
	
	
}
