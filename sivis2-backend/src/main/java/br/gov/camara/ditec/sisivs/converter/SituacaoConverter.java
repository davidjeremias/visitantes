package br.gov.camara.ditec.sisivs.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;

@Converter(autoApply = true)
public class SituacaoConverter implements AttributeConverter<SituacaoEnum, Integer>{

	@Override
	public Integer convertToDatabaseColumn(SituacaoEnum situacaoEnun) {
		return situacaoEnun.getId();
	}

	@Override
	public SituacaoEnum convertToEntityAttribute(Integer dbData) {
		return SituacaoEnum.getEnumById(dbData);
	}

	
	
}


