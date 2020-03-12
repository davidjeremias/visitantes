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
@Table(name = "Tentativa_Entrada_Restricao")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class TentativaEntradaRestricao extends Entidade {

	private static final long serialVersionUID = -7451508901185297491L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_tentativa_entrada_restricao")
	private Integer id;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_restricao_entrada")
	private RestricaoEntrada restricaoEntrada;

	@Column(name = "dat_tentativa_entrada")
	private LocalDateTime dataTentativaRestricao;

	@Column(name = "nom_equipamento")
	private String nomeEquipamento;

	@Column(name = "num_endereco_ip")
	private String numeroEnderecoIP;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_portaria")
	private Portaria portaria;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "ide_entrada")
	private Entrada entrada;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_rejeicao_entrada")
	private RejeicaoEntrada rejeicaoEntrada;

	@Column(name = "cod_ponto_avaliador")
	private String pontoAutorizador;

	@Tolerate
	public TentativaEntradaRestricao() {
		super();
	}

}
