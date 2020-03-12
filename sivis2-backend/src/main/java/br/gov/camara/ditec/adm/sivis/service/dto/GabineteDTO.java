package br.gov.camara.ditec.adm.sivis.service.dto;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
//@Builder
@EqualsAndHashCode(callSuper = false)
public class GabineteDTO extends Entidade{

	
	

	private static final long serialVersionUID = -1275654098171089655L;
	
	private Integer ideCadastro;
	private String nomeParlamentar;
	private String anexo;
	private String andar;
	private String gabinete;
	private String value;
	private String label;
	
	
	public GabineteDTO() {
		super();
	}
	
	public GabineteDTO(Integer ideCadastro, String nomeParlamentar, String anexo, String andar, String gabinete, String value, String label) {
		super();
		this.ideCadastro = ideCadastro;
		this.nomeParlamentar = nomeParlamentar;
		this.anexo = anexo;
		this.andar = andar;
		this.gabinete = gabinete;
		this.value = value;
		this.label = label;
	}
}
