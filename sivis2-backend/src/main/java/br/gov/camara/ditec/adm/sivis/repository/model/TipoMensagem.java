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
@Table(name = "Tipo_Mensagem")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class TipoMensagem extends Entidade{
	
	@Tolerate
	public TipoMensagem() {
		super();
	}
	
	private static final long serialVersionUID = -804711030541144582L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_tipo_mensagem")
	private Integer id;
	
	@Column(name = "des_tipo_mensagem")
	private String tipoMensagem;
}
