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
@Table(name = "viw_Pais")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class Pais extends Entidade{
	
	private static final long serialVersionUID = 3266550626196775059L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_pais")
	private Integer id;
	
	@Column(name = "nom_pais", length=100)
	private String namePais;
	
	@Column(name = "sig_pais_alfa2", length=2)
	private String siglaPais;
	
	@Column(name = "ind_ativo")
	private Boolean icAtivo;
	
	@Tolerate
	public Pais() {
		
	}

}
