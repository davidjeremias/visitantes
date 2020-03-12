package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Documento")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class Documento extends Entidade{
	
	private static final long serialVersionUID = -2176533437041033818L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_documento")
	private Integer id;
	
	@Column(name = "nom_pais", nullable = false)
	private String nomePais;
	
	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_tipo_documento", nullable = false)
	private TipoDocumento tipoDocumento;
	
	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_origem", nullable = false)
	private Origem origemDocumento;
	
	@Column(name = "num_documento")
	private String numero;
	
	@Column(name = "dat_expedicao")
	private LocalDate dataExpedicao;
	
	@Column(name = "dat_vencimento_documento")
	private LocalDate dataVencimento;
	
	@Column(name = "nom_orgao_expeditor")
	private String orgaoExpeditor;
	
	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_estado", nullable = true)
	private Estado estadoEmissao;
	
	@Column(name = "nom_conselho_responsavel")
	private String conselho;
	
	@Column(name = "ind_documento_principal")
	private Boolean isPrincipal;
	
	@Column(name = "cod_ponto_cadastrador", nullable = false)
	private String pontoCadastrador;
	
	@Column(name = "dat_cadastro", nullable = false)
	private LocalDateTime dataCadastro;
	
	@OneToMany(mappedBy = "documento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<FotoDocumento> fotosDocumento;
	
	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name="ide_visitante", nullable = false)
    private Visitante visitante;
	
	@Tolerate
	public Documento() {
		super();
	}
}
