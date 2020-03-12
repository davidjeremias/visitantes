package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.RejeicaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.TentativaRestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.RejeicaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.TentativaEntradaRestricao;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.RejeicaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;

@Service
public class RejeicaoEntradaService {

	@Autowired
	private RejeicaoEntradaRepository repository;

	@Autowired
	private TentativaRestricaoEntradaRepository tentativaRestricaoEntradaRepository;

	@Autowired
	ModelMapper model;
	
	private static final String IDRESTRICAOENTRADA = "idRestricaoEntrada";

	public void registrarRejeicao(RejeicaoEntradaDTO rejeicaoEntradaDTO, Visitante visitante) throws NegocioException {
		model.getConfiguration().setAmbiguityIgnored(true);
		RejeicaoEntrada rejeicaoEntrada = model.map(rejeicaoEntradaDTO, RejeicaoEntrada.class);
		rejeicaoEntrada.setVisitante(visitante);

		if (rejeicaoEntradaDTO.getPortariaDTO() == null || rejeicaoEntradaDTO.getDestinoDTO() == null) {
			throw new NegocioException("Portaria ou Destino do visitante é obrigatório!");
		}
		rejeicaoEntrada.setDataRejeicao(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));

		RejeicaoEntrada retornoRejeicaoEntrada = repository.save(rejeicaoEntrada);

		if (rejeicaoEntradaDTO.getExisteRestricao()) {
			if (rejeicaoEntradaDTO.getIdRestricaoEntrada() != null) {

				TentativaEntradaRestricao tentativaRestricao = tentativaRestricaoEntradaRepository.buscaEntradarRestricaoPorRegistroEntradaId(rejeicaoEntradaDTO.getIdRestricaoEntrada()).get(0);
				tentativaRestricao.setPontoAutorizador(rejeicaoEntradaDTO.getPontoAutorizador());
				tentativaRestricao.setRejeicaoEntrada(retornoRejeicaoEntrada);

				tentativaRestricaoEntradaRepository.save(tentativaRestricao);
			}
		}

	}

	public List<RejeicaoEntradaDTO> buscarEntradasRejeitasPorRestricaoID(Map<String, String[]> parameterMap) {
		Integer id = (parameterMap.get(IDRESTRICAOENTRADA) != null ? Integer.parseInt(parameterMap.get(IDRESTRICAOENTRADA)[0]) : null);
		
		List<RejeicaoEntrada> rejeicaoEntradaList = repository.buscarEntradasRejeitasPorRestricaoID(id);
			
		List<RejeicaoEntradaDTO> rejeicaoEntradaDTO = new ArrayList<RejeicaoEntradaDTO>();
		PortariaDTO portariaDTO = new PortariaDTO();
		for (RejeicaoEntrada rej : rejeicaoEntradaList) {
			if(rej != null) {
				portariaDTO = model.map(rej.getPortaria(), PortariaDTO.class);
				RejeicaoEntradaDTO rejeicao	=	model.map(rej, RejeicaoEntradaDTO.class);
				rejeicao.setPortariaDTO(portariaDTO);
				rejeicaoEntradaDTO.add(rejeicao);
			}
			
			
		}
		
		
		return rejeicaoEntradaDTO;
	}

}
