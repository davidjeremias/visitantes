package br.gov.camara.ditec.sisivs.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;

@Converter(autoApply = true)
public class PeriodoConverter implements AttributeConverter<PeriodoEnum, Integer>{

	@Override
	public Integer convertToDatabaseColumn(PeriodoEnum periodoEnum) {
		return periodoEnum.getId();
	}

	@Override
	public PeriodoEnum convertToEntityAttribute(Integer dbData) {
		return PeriodoEnum.getEnumById(dbData);
	}

	
	
}


