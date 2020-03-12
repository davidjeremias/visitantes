package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Builder
@Getter
@Setter
public class FuncionalidadeDTO implements Serializable{

	@Tolerate
	public FuncionalidadeDTO() {
		super();
	}
	
	private static final long serialVersionUID = 7895925235006458739L;
	
	private Integer id;
    private String nome;
    private String alias;
    private String descricao;
    private Integer ideSistema;
}
