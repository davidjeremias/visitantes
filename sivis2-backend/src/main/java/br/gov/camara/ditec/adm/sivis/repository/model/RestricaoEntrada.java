package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDate;
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

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Restricao_Entrada")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class RestricaoEntrada extends Entidade {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3806356568878611449L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_restricao_entrada")
	private Integer id;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "cod_tipo_restricao_entrada")
	private TipoRestricao tipoRestricao;

	@OneToOne(cascade = CascadeType.REFRESH, optional = true)
	@JoinColumn(name = "ide_visitante")
	private Visitante visitante;

	@Column(name = "num_cpf")
	private String numCPF;

	@Column(name = "nom_civil")
	private String nomeCivil;

	@Column(name = "des_motivo_restricao")
	private String motivoRestricao;

	@Column(name = "dat_inicio_restricao")
	private LocalDate dataInicioRestricao;

	@Column(name = "dat_fim_restricao")
	private LocalDate dataFinalRestricao;

	@Column(name = "cod_ponto_cadastrador")
	private String pontoCadastrador;

	@Column(name = "dat_cadastro")
	private LocalDateTime dataCadastro;

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "restricaoEntrada", orphanRemoval = true)
	private FotoRestricaoEntrada fotoRestricaoEntrada;

	@Tolerate
	public RestricaoEntrada() {
		super();
	}

}
