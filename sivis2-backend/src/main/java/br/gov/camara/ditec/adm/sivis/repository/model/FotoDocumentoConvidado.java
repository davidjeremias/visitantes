package br.gov.camara.ditec.adm.sivis.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Foto_Documento_Convidado")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class FotoDocumentoConvidado extends Entidade{
	
	private static final long serialVersionUID = 622222738354193365L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_foto_documento_convidado")
	private Integer id;
	
	
	@Column(name = "img_foto_documento_frente", nullable = false)
	private String fotoDocumentoFrente;
	
	
	@Column(name = "img_foto_documento_verso")
	private String fotoDocumentoVerso;
//	
//	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//	@JoinColumn(name="ide_documento_convidado")
//	private DocumentoConvidado documentoConvidado;
	
	
	@Tolerate
	public FotoDocumentoConvidado() {
		super();
	}


	
}
