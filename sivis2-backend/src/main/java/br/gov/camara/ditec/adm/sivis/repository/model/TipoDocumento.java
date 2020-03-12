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
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Tipo_Documento")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class TipoDocumento extends Entidade{

	private static final long serialVersionUID = -4083738485316369342L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_tipo_documento")
	private Integer id;
	
	@NotNull
	@Column(name = "des_tipo_documento", length=60)
	private String descTipoDocumento;
	
	@OneToOne(cascade = CascadeType.REFRESH)
	@JoinColumn(name = "ide_origem")
	private Origem origem;
	
	@Tolerate
	public TipoDocumento() {
		super();
	}
}
