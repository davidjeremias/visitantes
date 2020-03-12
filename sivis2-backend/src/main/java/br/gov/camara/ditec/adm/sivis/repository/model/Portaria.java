package br.gov.camara.ditec.adm.sivis.repository.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Portaria")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class Portaria extends Entidade{
	
	private static final long serialVersionUID = -7298365577962382744L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_portaria")
	private Integer id;
	
	@Column(name = "des_portaria")
	private String descricaoPortaria;

	@Column(name = "ind_habilitado")
	private Boolean isHabilitado;
	
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "Portaria_Destino", joinColumns = @JoinColumn(name = "ide_portaria"), inverseJoinColumns = @JoinColumn(name = "ide_destino"))
	private List<Destino> destinos;
	
	@Tolerate
	public Portaria() {
		super();
	}
}
