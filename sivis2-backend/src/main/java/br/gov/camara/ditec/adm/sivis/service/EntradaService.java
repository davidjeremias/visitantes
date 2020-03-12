package br.gov.camara.ditec.adm.sivis.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.EntradaCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.EntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.TentativaRestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Agendamento;
import br.gov.camara.ditec.adm.sivis.repository.model.Destino;
import br.gov.camara.ditec.adm.sivis.repository.model.Entrada;
import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;
import br.gov.camara.ditec.adm.sivis.repository.model.TentativaEntradaRestricao;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.service.dto.DestinoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.EntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroPesquisarVisitanteEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.GabineteDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.ResultadoPesquisaVisitanteEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class EntradaService {

	private static final String PARAMETROS = "parametros";
	private static final String PONTO = "ponto";
	private static final String IDVISITANTE = "idVisitante";

	@Autowired
	private EntradaRepository entradaRepository;

	@Autowired
	private VisitanteService visitanteService;

	@Autowired
	private FotoVisitanteService fotoVisitanteService;

	@Autowired
	private TentativaRestricaoEntradaRepository tentativaRestricaoEntradaRepository;

	@Autowired
	private EntradaCustomRepository crepo;
	
	@Autowired
	private AgendamentoService agendamentoService;
	
	@Autowired
	private GabineteService gabineteService;
	
	@Autowired
	ModelMapper modelMapper;
	
	public Page<EntradaDTO> findAllByFilter(Map<String, String[]> filter) throws NegocioException, IOException {
		String parametros = (filter.get(PARAMETROS) != null ? filter.get(PARAMETROS)[0] : null);
		String pontoCadastrador = (filter.get(PONTO) != null ? filter.get(PONTO)[0] : null);
		String[] array = parametros.split(" ");
		String numero = null;
		String nome = "";

		for (String el : array) {
			if (StringUtil.isInteiro(StringUtil.removeMascara(el))) {
				numero = StringUtil.removeMascara(el);
			} else {
				nome = nome.concat(el).concat(" ");
			}
		}

		PageImpl<Entrada> retorno = crepo.findAllFilter(PageRequest.of(0, 50), nome, numero, pontoCadastrador);
		if (retorno.getContent() == null) {
			throw new NegocioException("Nenhum visitante encontrado!");
		}
		
		List<EntradaDTO> listaDTO = new ArrayList<>();
		listaDTO = converterListEntidadeToListDTO(retorno.getContent());
		return new PageImpl<>(listaDTO, retorno.getPageable(), retorno.getSize());
	}

	private List<EntradaDTO> converterListEntidadeToListDTO(List<Entrada> listaEntradas) throws NegocioException, IOException {
		List<EntradaDTO> listaEntradaDTO = new ArrayList<>();
		for(Entrada e : listaEntradas) {
			EntradaDTO entradaDTO = modelMapper.map(e, EntradaDTO.class);
			if(e.getIdGabinete() != null) {
				List<GabineteDTO> gabinetes = gabineteService.findGabinete();
				Supplier<Stream<GabineteDTO>>  gabineteDTO = () -> gabinetes.stream().filter(gabinete -> gabinete.getIdeCadastro().equals(e.getIdGabinete()));
				entradaDTO.setGabineteDTO(gabineteDTO.get().findAny().get());
			}else {
				
			}
			entradaDTO.setVisitanteDTO(visitanteService.buscarVisitanteDTO(e.getVisitante()));
			if(entradaDTO.getVisitanteDTO().getDocumentos().size() > 0) {
			List<DocumentoDTO> listadocumentos = entradaDTO.getVisitanteDTO().getDocumentos().stream()
					.filter(ele -> ele.getIsPrincipal() == true).collect(Collectors.toList());
			entradaDTO.getVisitanteDTO().setDocumentos(listadocumentos);
			}
			listaEntradaDTO.add(entradaDTO);
		}
		return listaEntradaDTO;
	}

	@Transactional(rollbackOn = NegocioException.class)
	public void registraEntrada(EntradaDTO entradaDTO, Visitante visitante) throws NegocioException {
		Entrada entrada = modelMapper.map(entradaDTO, Entrada.class);
		entrada.setVisitante(visitante);
		validaEntradaVisitante(entradaDTO);
		entrada.setDataHoraVisita(LocalDateTime.now());
		Entrada retornoEntrada = entradaRepository.save(entrada);

		if (entradaDTO.getExisteRestricao()) {
			if (entradaDTO.getIdRestricaoEntrada() != null) {
				TentativaEntradaRestricao tentativaRestricao = tentativaRestricaoEntradaRepository
						.buscaEntradarRestricaoPorRegistroEntradaId(entradaDTO.getIdRestricaoEntrada(), null, null)
						.get(0);
				tentativaRestricao.setPontoAutorizador(entradaDTO.getPontoAutorizador());
				tentativaRestricao.setEntrada(retornoEntrada);
				tentativaRestricaoEntradaRepository.save(tentativaRestricao);
			}
		}
	}

	@Transactional(rollbackOn = NegocioException.class)
	public void alterarRegistroEntrada(EntradaDTO entradaDTO, Visitante visitante) throws NegocioException {
		Entrada entrada = modelMapper.map(entradaDTO, Entrada.class);
		entrada.setVisitante(visitante);
		validaEntradaVisitante(entradaDTO);
		entradaRepository.save(entrada);
	}

	private void validaEntradaVisitante(EntradaDTO entradaDTO) throws NegocioException {
		if(entradaDTO.getPortaria() == null) {
			throw new NegocioException("Portaria de destino do visitante é obrigatório!");
		}
		if(entradaDTO.getIdGabinete() == null && entradaDTO.getDestino() == null ) {
			throw new NegocioException("Local ou Gabinete de destino do visitante é obrigatório!");
		}
	}
	
	private void validaEntradaVisitanteAgendamento(EntradaDTO entradaDTO) throws NegocioException {
		if(entradaDTO.getPortaria() == null) {
			throw new NegocioException("Portaria de destino do visitante é obrigatório!");
		}
	}
	
	@Transactional(rollbackOn = NegocioException.class)
	public void registroEntradaAgendamento(EntradaDTO entradaDTO, Visitante visitante, Integer idAgendamento) throws NegocioException {
		Entrada entrada = modelMapper.map(entradaDTO, Entrada.class);
		entrada.setVisitante(visitante);
		
		validaEntradaConvidadoAgendamento(entradaDTO, idAgendamento);
		entrada.setDataHoraVisita(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		Agendamento agendamento = agendamentoService.findById(idAgendamento);
		entrada.setAgendamento(agendamento);
		entrada.setIdGabinete(agendamento.getIdParlamentar());
		if(buscaEntradaAgendamento(visitante.getId(), agendamento.getId()) != null) {
			throw new NegocioException("Entrada do convidado já registrada para esse agendamento!");
		}
		entradaRepository.save(entrada);
	}

	private void validaEntradaConvidadoAgendamento(EntradaDTO entradaDTO, Integer idAgendamento)
			throws NegocioException {
		validaEntradaVisitanteAgendamento(entradaDTO);
		if(idAgendamento == null) {
			throw new NegocioException("Agendamento é obrigatório");
		}
	}

	public LocalDateTime buscarDataUltimaEntradaPorConvidadoID(Integer id) {
		return entradaRepository.buscarDataUltimaEntradaPorConvidadoID(id);
	}
	
	public Entrada buscaEntradaAgendamento(Integer idVisitante, Integer idAgendamento) {
		return entradaRepository.buscaEntradaAgendamento(idVisitante, idAgendamento);
	}

	public List<ResultadoPesquisaVisitanteEntradaDTO> pesquisarVisitantesEntradas(
			FiltroPesquisarVisitanteEntradaDTO filtroPesquisarVisitanteEntradaDTO) {

		String nomeVisitante = filtroPesquisarVisitanteEntradaDTO.getNomeVisitante() != null
				? filtroPesquisarVisitanteEntradaDTO.getNomeVisitante()
				: null;
		String numeroDocumentoVisitante = filtroPesquisarVisitanteEntradaDTO.getNumeroDocumentoVisitante() != null
				? filtroPesquisarVisitanteEntradaDTO.getNumeroDocumentoVisitante()
				: null;
		TipoRestricaoDTO tipoRestricaoDTO = filtroPesquisarVisitanteEntradaDTO.getTipoRestricaoDTO() != null
				? filtroPesquisarVisitanteEntradaDTO.getTipoRestricaoDTO()
				: null;
		// Entradas
		LocalDateTime dataEntradaInicial = filtroPesquisarVisitanteEntradaDTO.getDataEntradaInicial() != null
				? filtroPesquisarVisitanteEntradaDTO.getDataEntradaInicial()
				: null;
		LocalDateTime dataEntradaFinal = filtroPesquisarVisitanteEntradaDTO.getDataEntradaFinal() != null
				? filtroPesquisarVisitanteEntradaDTO.getDataEntradaFinal()
				: null;
		;
		LocalDateTime horaEntradaInicial = filtroPesquisarVisitanteEntradaDTO.getHoraEntradaInicial() != null
				? filtroPesquisarVisitanteEntradaDTO.getHoraEntradaInicial()
				: null;
		LocalDateTime horaEntradaFinal = filtroPesquisarVisitanteEntradaDTO.getHoraEntradaFinal() != null
				? filtroPesquisarVisitanteEntradaDTO.getHoraEntradaFinal()
				: null;

		PortariaDTO portariaDTO = filtroPesquisarVisitanteEntradaDTO.getPortariaDTO() != null
				? filtroPesquisarVisitanteEntradaDTO.getPortariaDTO()
				: null;
		DestinoDTO destinoDTO = filtroPesquisarVisitanteEntradaDTO.getDestinoDTO() != null
				? filtroPesquisarVisitanteEntradaDTO.getDestinoDTO()
				: null;

		String checkEntradas = filtroPesquisarVisitanteEntradaDTO.getCheckEntradas() != null
				? filtroPesquisarVisitanteEntradaDTO.getCheckEntradas()
				: null;

		List<Entrada> entradas = crepo.pesquisarVisitantesEntradas(nomeVisitante, numeroDocumentoVisitante,
				tipoRestricaoDTO, dataEntradaInicial, dataEntradaFinal, horaEntradaInicial, horaEntradaFinal,
				portariaDTO, destinoDTO, checkEntradas);

		List<ResultadoPesquisaVisitanteEntradaDTO> retorno = new ArrayList<>();

		for (Entrada ent : entradas) {
			ResultadoPesquisaVisitanteEntradaDTO resultadoPesquisaVisitanteEntradaDTO = new ResultadoPesquisaVisitanteEntradaDTO();

			resultadoPesquisaVisitanteEntradaDTO.setId(ent.getVisitante().getId());
			resultadoPesquisaVisitanteEntradaDTO.setFotoVisitante(fotoVisitanteService.getUltimaFotoVisitante(ent.getVisitante().getId()).getImagemFoto());
			resultadoPesquisaVisitanteEntradaDTO.setNomeVisitante(ent.getVisitante().getNomeVisitante());
			resultadoPesquisaVisitanteEntradaDTO.setNumeroDocumentoVisitante(ent.getVisitante().getCpf());

			DateTimeFormatter dataFormatada = DateTimeFormatter.ofPattern("dd/MM/yyyy");
			DateTimeFormatter horaFormatada = DateTimeFormatter.ofPattern("HH:mm:ss");

			resultadoPesquisaVisitanteEntradaDTO.setDataEntrada(ent.getDataHoraVisita().format(dataFormatada));
			resultadoPesquisaVisitanteEntradaDTO.setHoraEntrada(ent.getDataHoraVisita().format(horaFormatada));
			
			if(ent.getPortaria()!=null)
			resultadoPesquisaVisitanteEntradaDTO.setPortaria(ent.getPortaria().getDescricaoPortaria());
			if(ent.getDestino()!=null)
			resultadoPesquisaVisitanteEntradaDTO.setDestino(ent.getDestino().getNomeDestino());
			retorno.add(resultadoPesquisaVisitanteEntradaDTO);
		}
		return retorno;
	}

	public List<EntradaDTO> buscarEntradaVisitanteID(Map<String, String[]> parameterMap) throws NegocioException, IOException {
		Integer idVisitante = (parameterMap.get(IDVISITANTE) != null
				? Integer.parseInt(parameterMap.get(IDVISITANTE)[0])
				: null);
		List<Entrada> entradas = entradaRepository.buscarEntradaVisitanteID(idVisitante);
		List<EntradaDTO> retorno = converterListEntidadeToListDTO(entradas);
		return retorno.size() > 0 ? retorno : null;
	}

	public EntradaDTO buscarEntradaID(Map<String, String[]> parameterMap) {
		Integer idEntrada = (parameterMap.get(PARAMETROS) != null ? Integer.parseInt(parameterMap.get(PARAMETROS)[0]) : null);
		Optional<Entrada> entrada = entradaRepository.findById(idEntrada);
		EntradaDTO retorno = modelMapper.map(entrada.get(), EntradaDTO.class);
		return retorno;
	}

	public EntradaDTO alterarEntrada(EntradaDTO entradaDTO) {
		Destino destino = modelMapper.map(entradaDTO.getDestino(), Destino.class);
		Portaria portaria = modelMapper.map(entradaDTO.getPortaria(), Portaria.class);
		Optional<Entrada> entrada = entradaRepository.findById(entradaDTO.getId());
		entrada.get().setDestino(destino);
		entrada.get().setPortaria(portaria);
		Entrada retorno = entradaRepository.save(entrada.get());
		return modelMapper.map(retorno, EntradaDTO.class);
	}

}