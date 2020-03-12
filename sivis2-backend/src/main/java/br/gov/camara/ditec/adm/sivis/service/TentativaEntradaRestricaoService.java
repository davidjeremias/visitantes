package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.RestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.TentativaEntradaRestricaoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;
import br.gov.camara.ditec.adm.sivis.repository.model.RestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.TentativaEntradaRestricao;
import br.gov.camara.ditec.adm.sivis.service.dto.TentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;

@Service
public class TentativaEntradaRestricaoService {

	@Autowired
	private TentativaEntradaRestricaoRepository repository;
	
	@Autowired
	private RestricaoEntradaRepository restricaoEntradaRepository;
	

	@Autowired
	ModelMapper model;

	public TentativaEntradaRestricaoDTO salvar(TentativaEntradaRestricaoDTO tentativaEntradaRestricaoDTO) throws NegocioException {

		TentativaEntradaRestricao tentativaEntradaRestricao = prepararTentativaEntrada(tentativaEntradaRestricaoDTO);

		TentativaEntradaRestricao retorno = repository.save(tentativaEntradaRestricao);

		return model.map(retorno, TentativaEntradaRestricaoDTO.class);
	}

	private TentativaEntradaRestricao prepararTentativaEntrada(	TentativaEntradaRestricaoDTO tentativaEntradaRestricaoDTO) {

		Portaria portaria = model.map(tentativaEntradaRestricaoDTO.getPortariaDTO(), Portaria.class);
		
		Optional<RestricaoEntrada> restricaoEntrada = restricaoEntradaRepository.findById(tentativaEntradaRestricaoDTO.getRestricaoEntradaDTO().getId());
		model.getConfiguration().setAmbiguityIgnored(true);
		TentativaEntradaRestricao tentativaEntradaRestricao = model.map(tentativaEntradaRestricaoDTO, TentativaEntradaRestricao.class);
		tentativaEntradaRestricao.setDataTentativaRestricao(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		tentativaEntradaRestricao.setPortaria(portaria);
		tentativaEntradaRestricao.setRestricaoEntrada(restricaoEntrada.get());
		tentativaEntradaRestricao.setEntrada(null);
		
		
		return tentativaEntradaRestricao;
	}

	
	

}
 