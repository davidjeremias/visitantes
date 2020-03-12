package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Entrada")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class Entrada extends Entidade {

	private static final long serialVersionUID = 339228961795605069L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_entrada")
	private Integer id;

	@Column(name = "tim_entrada", nullable = false)
	private LocalDateTime dataHoraVisita;

	@Column(name = "des_hostname", nullable = false, length = 40)
	private String hostname;

	@Column(name = "cod_ponto_cadastrador", nullable = false)
	private String pontoCadastrador;

	@Column(name = "cod_ponto_camara")
	private String pontoCamara;

	@JoinColumn(name = "ide_visitante", referencedColumnName = "ide_visitante")
	@ManyToOne(cascade = CascadeType.REFRESH, optional = false, fetch = FetchType.EAGER)
	private Visitante visitante;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_portaria")
	private Portaria portaria;

	@OneToOne(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
	@JoinColumn(name = "ide_destino", nullable = true)
	private Destino destino;
	
	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_agendamento")
	private Agendamento agendamento;
	
	@Column(name = "ide_cadastro_parlamentar")
	private Integer idGabinete;

	@Column(name = "cod_ponto_autorizador_entrada_inexistencia_documento")
	private String pontoAutorizador;

	@Column(name = "ind_inexistencia_documento")
	private Boolean inexistenciaDocumento;

	@Tolerate
	public Entrada() {
		super();
	}
}
