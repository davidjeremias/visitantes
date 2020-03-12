package br.gov.camara.ditec.adm.sivis.repository.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Foto_Documento")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class FotoDocumento  extends Entidade{

	private static final long serialVersionUID = -4301351044511453973L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_foto_documento")
	private Integer id;
	
	@Column(name = "img_foto_documento_frente", nullable = false)
	private String fotoDocumentoFrente;
	
	@Column(name = "img_foto_documento_verso")
	private String fotoDocumentoVerso;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name="ide_documento")
	private Documento documento;
	
	@Tolerate
	public FotoDocumento() {
		super();
	}

}
