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
@Table(name = "Tipo_Restricao_Entrada")
@Getter
@Setter
@Builder
@EqualsAndHashCode(callSuper = false)
public class TipoRestricao extends Entidade{/**
	 * 
	 */
	private static final long serialVersionUID = -5502664606843155281L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cod_tipo_restricao_entrada")
	private Integer id;
	
	@NotNull
	@Column(name = "nom_tipo_restricao_entrada", length=60)
	private String nome;
	
	@Column(name = "ind_habilitado")
	private Boolean isHabilitado;
	
	@Tolerate
	public TipoRestricao() {
		super();
	}
}
