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
@Table(name = "Tipo_Configuracao")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper=false)
public class TipoConfiguracao extends Entidade{
	
	@Tolerate
	public TipoConfiguracao() {
		super();
	}

	private static final long serialVersionUID = -4154527842503185274L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_tipo_configuracao")
	private Integer id;
	
	@Column(name = "nom_tipo")
	private String tipoConfiguracao;
}
