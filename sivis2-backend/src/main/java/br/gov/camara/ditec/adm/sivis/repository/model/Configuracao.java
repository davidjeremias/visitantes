package br.gov.camara.ditec.adm.sivis.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Configuracao")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper=false)
public class Configuracao extends Entidade{

	@Tolerate
	public Configuracao() {
		super();
	}
	
	private static final long serialVersionUID = -1450839039698603585L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_configuracao")
	private Integer id;
	
	@Column(name ="nom_chave")
	private String chave;
	
	@Column(name ="des_valor")
	private String valor;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ide_tipo_configuracao")
	private TipoConfiguracao tipoConfiguracao;
}
