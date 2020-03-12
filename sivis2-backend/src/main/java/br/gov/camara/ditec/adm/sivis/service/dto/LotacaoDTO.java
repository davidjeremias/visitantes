package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class LotacaoDTO implements Serializable{
	
	@Tolerate
	public LotacaoDTO() {
		super();
	}
	
	private static final long serialVersionUID = 3173374324361702214L;
	
	private Integer id;
	private String codigo;
	private Integer codigoLotacaoSuperior;
	private String nome;
	private String sigla;
	private String observacao;
	private Integer idSGMDeputadoOcupante;
}
