package br.gov.camara.ditec.adm.sivis.repository.model.enumeration;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum SituacaoEnum {
	CANCELADO(0,"Cancelado"), AGENDADO(1,"Agendado");
	private Integer id;
	private String nome;

	private SituacaoEnum(Integer id, String nome) {
		this.nome = nome;
		this.id = id;
	}
	
	
	public static SituacaoEnum getEnumByName(String nome) {
		for(SituacaoEnum situacaoEnum: SituacaoEnum.values()) {
			if(situacaoEnum.getNome().equals(nome)) {
				return situacaoEnum;
			}
		}
		return null;
	}
	
	public static SituacaoEnum getEnumById(Integer id) {
		for(SituacaoEnum situacaoEnum: SituacaoEnum.values()) {
			if(situacaoEnum.getId().equals(id)) {
				return situacaoEnum;
			}
		}
		return null;
	}
}
