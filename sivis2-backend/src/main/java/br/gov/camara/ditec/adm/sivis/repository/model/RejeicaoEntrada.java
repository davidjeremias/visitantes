package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDateTime;

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
@Table(name = "Rejeicao_Entrada")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class RejeicaoEntrada extends Entidade {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6478676263967951127L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_rejeicao_entrada")
	private Integer id;

	@Column(name = "dat_rejeicao")
	private LocalDateTime dataRejeicao;

	@Column(name = "cod_ponto_cadastrador", nullable = false)
	private String pontoCadastrador;

	@Column(name = "cod_ponto")
	private String pontoCamara;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_visitante")
	private Visitante visitante;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_portaria")
	private Portaria portaria;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_destino")
	private Destino destino;

	@Column(name = "ind_inexistencia_documento")
	private Boolean inexistenciaDocumento;

	@Column(name = "des_motivo_rejeicao")
	private String motivo;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_convidado")
	private Convidado convidado;

	@Column(name = "nom_equipamento")
	private String nomeEquipamento;

	@Column(name = "num_endereco_ip")
	private String numeroEnderecoIP;

	@Tolerate
	public RejeicaoEntrada() {
		super();
	}
}
