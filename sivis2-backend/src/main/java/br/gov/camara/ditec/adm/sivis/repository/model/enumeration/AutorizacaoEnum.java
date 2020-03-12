package br.gov.camara.ditec.adm.sivis.repository.model.enumeration;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;

@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AutorizacaoEnum {

	REJEITADA(0, "Entrada Rejeitada"), PERMETIDA(1, "Entrada Permetida"), SEM_PROVIDENCIA(2, "Sem providência");

	private Integer id;
	private String nome;

	private AutorizacaoEnum() {
	}

	private AutorizacaoEnum(Integer id) {
		this.id = id;
	}

	private AutorizacaoEnum(Integer id, String nome) {
		this.nome = nome;
		this.id = id;
	}

	public static AutorizacaoEnum getEnumByName(String nome) {
		for (AutorizacaoEnum autorizacaoEnum : AutorizacaoEnum.values()) {
			if (autorizacaoEnum.getNome().equals(nome)) {
				return autorizacaoEnum;
			}
		}
		return null;
	}

	public static AutorizacaoEnum getEnumById(Integer id) {
		for (AutorizacaoEnum autorizacaoEnum : AutorizacaoEnum.values()) {
			if (autorizacaoEnum.getId().equals(id)) {
				return autorizacaoEnum;
			}
		}
		return null;
	}
}
