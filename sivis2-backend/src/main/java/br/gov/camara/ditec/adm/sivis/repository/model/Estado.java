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
@Table(name = "Estado")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class Estado extends Entidade {

	private static final long serialVersionUID = 5126336175963024620L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_estado")
	private Integer id;

	@Column(name = "nom_estado")
	private String estado;

	@Column(name = "des_sigla")
	private String uf;

	@Tolerate
	public Estado() {
		super();
	}
}
