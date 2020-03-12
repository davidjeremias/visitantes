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
@Table(name = "Foto_Email")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class FotoEmail extends Entidade{
	
	@Tolerate
	public FotoEmail() {
		super();
	}
	
	private static final long serialVersionUID = -5581498943835363352L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_foto_email")
	private Integer id;
	
	@Column(name = "img_foto_header")
	private String fotoHeader;
	
	@Column(name = "img_foto_footer")
	private String fotoFooter;
}
