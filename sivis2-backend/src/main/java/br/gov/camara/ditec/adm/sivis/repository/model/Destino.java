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
@Table(name = "Destino")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class Destino extends Entidade{

	private static final long serialVersionUID = -7993322746650507586L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_destino")
	private Integer id;
	
	@Column(name = "nom_destino")
	private String nomeDestino;
	
	@Column(name = "ind_habilitado")
	private Boolean isHabilitado;
	
	@Tolerate
	public Destino() {
		super();
	}

}
