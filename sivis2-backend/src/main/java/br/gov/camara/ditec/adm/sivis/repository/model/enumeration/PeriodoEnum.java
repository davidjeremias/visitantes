package br.gov.camara.ditec.adm.sivis.repository.model.enumeration;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum PeriodoEnum {
	
	MANHA(0,"Manhã"), TARDE(1,"Tarde"), MANHA_TARDE(2, "Manhã e Tarde");
	
	private Integer id;
	private String nome;
	
	private PeriodoEnum() {}
	
	private PeriodoEnum(Integer id) {
		this.id = id;
	}
	
	private PeriodoEnum(Integer id, String nome) {
		this.nome = nome;
		this.id = id;
	}
	
	public static PeriodoEnum getEnumByName(String nome) {
		for(PeriodoEnum periodoEnum: PeriodoEnum.values()) {
			if(periodoEnum.getNome().equals(nome)) {
				return periodoEnum;
			}
		}
		return null;
	}
	
	public static String getEnumByName(Integer id) {
		for(PeriodoEnum periodoEnum: PeriodoEnum.values()) {
			if(periodoEnum.getId().equals(id)) {
				return periodoEnum.getNome();
			}
		}
		return null;
	}
	
	public static PeriodoEnum getEnumById(Integer id) {
		for(PeriodoEnum periodoEnum: PeriodoEnum.values()) {
			if(periodoEnum.getId().equals(id)) {
				return periodoEnum;
			}
		}
		return null;
	}
}
