package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDate;
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
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Documento_Convidado")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class DocumentoConvidado extends Entidade {

	private static final long serialVersionUID = -2211875627523364314L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_documento_convidado")
	private Integer id;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_origem", nullable = false)
	private Origem origemDocumento;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_tipo_documento", nullable = false)
	private TipoDocumento tipoDocumento;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_pais")
	private Pais nomePais;

	@Column(name = "num_documento", length = 60)
	private String numeroDocumento;

	@Column(name = "dat_expedicao")
	private LocalDate dataExpedicao;

	@Column(name = "dat_vencimento")
	private LocalDate dataVencimento;

	@Column(name = "nom_orgao_expeditor")
	private String orgaoExpeditor;

	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_estado")
	private Estado estadoEmissao;

	@Column(name = "nom_conselho_responsavel", length = 100)
	private String conselho;

	@Column(name = "ind_documento_principal")
	private Boolean isPrincipal;
	
	@Column(name = "cod_ponto_cadastrador", nullable = false, length = 10)
	private String pontoCadastrador;
	
	@Column(name = "dat_cadastramento")
	private LocalDateTime dataCadastro;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "ide_convidado", nullable = false)
	private Convidado convidado;

	@MapsId
	@OneToOne(cascade = CascadeType.ALL,  fetch = FetchType.EAGER, optional = false) // , 
	@JoinColumn(name = "ide_foto_documento_convidado", nullable=false)
	private FotoDocumentoConvidado fotoDocumentoConvidado;

	

	

	@Tolerate
	public DocumentoConvidado() {
		super();
	}

}
