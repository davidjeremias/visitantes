package br.gov.camara.ditec.adm.sivis.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Origem")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class Origem extends Entidade {

	private static final long serialVersionUID = 8170133973429230048L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_origem")
	private Integer id;

	@NotNull
	@Column(name = "des_origem", length = 100)
	private String descOrigem;

	@Tolerate
	public Origem() {
		super();
	}
}
