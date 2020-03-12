package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.VisitanteCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.VisitanteRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.Documento;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoVisitante;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import br.gov.camara.ditec.adm.sivis.util.CpfCnpjUtils;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class VisitanteService {

	private static final String PARAMETROS = "parametros";
	private static final String ID_CONVIDADO = "idConvidado";
	private static final String ID_AGENDAMENTO = "idAgendamento";
	private static final String IDVISITANTE = "idVisitante";

	@Autowired
	private VisitanteRepository visitanteRepository;

	@Autowired
	private DocumentoService documentoService;

	@Autowired
	private EntradaService entradaService;

	@Autowired
	private RejeicaoEntradaService rejeicaoEntradaService;

	@Autowired
	private FotoVisitanteService fotoVisitanteService;

	@Autowired
	private VisitanteCustomRepository crepo;
	
	@Autowired
	private AgendamentoConvidadoService agendamentoConvidadoService;
	
	@Autowired
	ModelMapper modelMapper;

	public Page<VisitanteDTO> findAllByFilter(Map<String, String[]> filter) throws NegocioException {
		String parametros = (filter.get(PARAMETROS) != null ? filter.get(PARAMETROS)[0] : null);
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
		PageImpl<Visitante> retorno = crepo.findAllFilter(PageRequest.of(0, 50), nome, numero);
		if (retorno.getContent() == null) {
			throw new NegocioException("Nenhum visitante encontrado!");
		}
		List<VisitanteDTO> listaDTO = new ArrayList<>();
		listaDTO = converterListEntidadeToListDTO(retorno.getContent());
		return new PageImpl<>(listaDTO, retorno.getPageable(), retorno.getSize());
	}

	private List<VisitanteDTO> converterListEntidadeToListDTO(List<Visitante> listaRetorno) throws NegocioException {
		List<VisitanteDTO> listaDTO = new ArrayList<>();
		for(Visitante e: listaRetorno){
			VisitanteDTO visitanteDTO = modelMapper.map(e, VisitanteDTO.class);
			if(!e.getFotosVisitante().isEmpty()) {
				FotoVisitante fotoVisitante = fotoVisitanteService.getUltimaFotoVisitante(e.getId());
				visitanteDTO.setFotoVisitante(fotoVisitante.getImagemFoto());
				visitanteDTO.setDataCadFotoVisitante(fotoVisitante.getDataFoto());
				if(LocalDate.now().isAfter(fotoVisitante.getDataFoto().plusDays(90))) {
					visitanteDTO.setIsFotoVisitanteVencida(true);
				} else {
					visitanteDTO.setIsFotoVisitanteVencida(false);
				}
			}
			visitanteDTO.setTelefoneVisitante(StringUtil.mascaraTelefone(e.getTelefoneVisitante()));
			visitanteDTO.setDocumentos(documentoService.getListaDocumentoDTO(e.getDocumentos()));
			listaDTO.add(visitanteDTO);
		}
		;
		return listaDTO;
	}

	@Transactional(rollbackOn = NegocioException.class)
	public VisitanteDTO salvar(VisitanteDTO visitanteDTO) throws NegocioException {
		Visitante visitante = modelMapper.map(visitanteDTO, Visitante.class);
		if (visitanteDTO.getTelefoneVisitante() != null) {
			visitante.setTelefoneVisitante(StringUtil.removeMascara(visitanteDTO.getTelefoneVisitante()));
		}
		if (visitanteDTO.getCpf() != null) {
			visitante.setCpf(validaCpf(visitanteDTO.getCpf(), visitanteDTO.getIsNovoVisitante()));
		}
		List<FotoVisitante> listaFotosVisitante = new ArrayList<>();
		LocalDate dataFoto = LocalDate.now();
		FotoVisitante fotoVisitante = FotoVisitante.builder().imagemFoto(visitanteDTO.getFotoVisitante())
				.dataFoto(dataFoto).visitante(visitante).build();
		listaFotosVisitante.add(fotoVisitante);
		visitante.setFotosVisitante(listaFotosVisitante);
		if(visitanteDTO.getDataCadastro() == null) {
			visitante.setDataCadastro(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		}
		Visitante retorno = visitanteRepository.save(visitante);
		documentoService.salvaDocumentos(visitanteDTO.getDocumentos(), retorno);
		
		if(visitanteDTO.getAgendamentoDTO() != null) {
			agendamentoConvidadoService.setVisitanteAgendamentoConvidado(visitanteDTO.getAgendamentoDTO().getConvidadoDTO().getId(), visitanteDTO.getAgendamentoDTO().getId(), retorno);
			entradaService.registroEntradaAgendamento(visitanteDTO.getEntrada(), retorno, visitanteDTO.getAgendamentoDTO().getId());
		}
		if (!visitanteDTO.getIsAlterar()) {
			if (visitanteDTO.getEntrada() != null) {
				entradaService.registraEntrada(visitanteDTO.getEntrada(), retorno);
			} else if (visitanteDTO.getRejeicaoEntradaDTO() != null) {
				rejeicaoEntradaService.registrarRejeicao(visitanteDTO.getRejeicaoEntradaDTO(), retorno);
			}
		}
		return modelMapper.map(retorno, VisitanteDTO.class);
	}

	@Transactional(rollbackOn = NegocioException.class)
	private String validaCpf(String cpf, Boolean isNovoVisitante) throws NegocioException {
		String cpfSemMascara = StringUtil.removeMascara(cpf);
		if (!CpfCnpjUtils.isValid(cpfSemMascara)) {
			throw new NegocioException("CPF inválido");
		}
		if(isNovoVisitante) {
			Visitante visitante = visitanteRepository.findByCpf(cpfSemMascara);
			if(visitante != null) {
				throw new NegocioException("CPF já cadastrado");
			}
		}
		return cpfSemMascara;
	}

	@Transactional(rollbackOn = NegocioException.class)
	public VisitanteDTO alterar(VisitanteDTO visitanteDTO) throws NegocioException {
		List<Documento> listaDocumentos = new ArrayList<>();
		List<FotoVisitante> listaFotoVisitante = new ArrayList<>();
		Visitante visitante = modelMapper.map(visitanteDTO, Visitante.class);
		
		if (visitanteDTO.getTelefoneVisitante() != null) {
			visitante.setTelefoneVisitante(StringUtil.removeMascara(visitanteDTO.getTelefoneVisitante()));
		}
		if (visitanteDTO.getCpf() != null) {
			visitante.setCpf(validaCpf(visitanteDTO.getCpf(), visitanteDTO.getIsNovoVisitante()));
		}
		visitante.setFotosVisitante(listaFotoVisitante);
		visitante.setDataCadastro(LocalDateTime.now());
		
		FotoVisitante fotoVisitante = FotoVisitante.builder().dataFoto(LocalDate.now())
				.imagemFoto(visitanteDTO.getFotoVisitante()).visitante(visitante).build();
		listaFotoVisitante.add(fotoVisitante);
		
		Visitante retornoVisitante = visitanteRepository.save(visitante);
		
		List<Documento> retornoDocumentoList = documentoService.salvaDocumentos(visitanteDTO.getDocumentos(), retornoVisitante);
		listaDocumentos.addAll(retornoDocumentoList);
		
		visitante.setDocumentos(listaDocumentos);
		
		if(visitanteDTO.getAgendamentoDTO() != null) {
			entradaService.registroEntradaAgendamento(visitanteDTO.getEntrada(), retornoVisitante, visitanteDTO.getAgendamentoDTO().getId());
			if(visitanteDTO.getAgendamentoDTO() != null) {
				agendamentoConvidadoService.setVisitanteAgendamentoConvidado(visitanteDTO.getAgendamentoDTO().getConvidadoDTO().getId(), visitanteDTO.getAgendamentoDTO().getId(), retornoVisitante);
			}
		}else {
			entradaService.alterarRegistroEntrada(visitanteDTO.getEntrada(), retornoVisitante);
		}
		return modelMapper.map(retornoVisitante, VisitanteDTO.class);
	}

	public VisitanteDTO buscarVisitanteDTO(Visitante visitante) throws NegocioException {
		VisitanteDTO visitanteDTO = modelMapper.map(visitante, VisitanteDTO.class);
		visitanteDTO.setFotoVisitante(fotoVisitanteService.getUltimaFotoVisitante(visitante.getId()).getImagemFoto());
		if(visitante.getTelefoneVisitante() != null) {
			visitanteDTO.setTelefoneVisitante(StringUtil.mascaraTelefone(visitante.getTelefoneVisitante()));
		}
		return visitanteDTO;
	}

	public VisitanteDTO findVisitanteByCpf(Map<String, String[]> filter) throws NegocioException {
		String cpf = filter.get(PARAMETROS) != null ? StringUtil.removeMascara(filter.get(PARAMETROS)[0]) : null;
		Visitante retorno = visitanteRepository.findByCpf(cpf);
		VisitanteDTO visitanteDTO = null;
		if (retorno != null) {
			FotoVisitante fotoVisitante = retorno.getFotosVisitante().get(0);
			visitanteDTO = modelMapper.map(retorno, VisitanteDTO.class);
			visitanteDTO.setFotoVisitante(fotoVisitante.getImagemFoto());
		}
		return visitanteDTO;
	}

	public VisitanteDTO findVisitanteByCpf(String cpf) throws NegocioException {
		Visitante retorno = visitanteRepository.findByCpf(cpf);
		VisitanteDTO visitanteDTO = null;
		if(retorno != null) {
			visitanteDTO = modelMapper.map(retorno, VisitanteDTO.class);
		}		
		return visitanteDTO;
	}

	public Visitante converterDTOToEntidade(VisitanteDTO visitanteDTO) {
		return modelMapper.map(visitanteDTO, Visitante.class);
	}
	
	public VisitanteDTO buscaVisitantePorAgendamento(Map<String, String[]> filter) throws NegocioException {
		Integer idConvidado = RequisicaoUtil.extrairParametroInteiro(filter, ID_CONVIDADO);
		Integer idAgendamento = RequisicaoUtil.extrairParametroInteiro(filter, ID_AGENDAMENTO);
		AgendamentoConvidado agendamentoConvidado = agendamentoConvidadoService.buscarAgendamentoConvidado(idConvidado, idAgendamento);
		VisitanteDTO visitanteDTO = null;

		if(agendamentoConvidado.getVisitante() != null) {
			visitanteDTO = modelMapper.map(agendamentoConvidado.getVisitante(), VisitanteDTO.class);
			FotoVisitante fotoVisitante = fotoVisitanteService.getUltimaFotoVisitante(agendamentoConvidado.getVisitante().getId());

			if(fotoVisitante == null) {
				throw new NegocioException("Foto visitante não encontrada");
			}

			List<DocumentoDTO> listaDocumentos = documentoService.findDocumentoByIdVisitante(agendamentoConvidado.getVisitante().getId());
			if(!listaDocumentos.isEmpty()) {
				visitanteDTO.setDocumentos(listaDocumentos);
			}

		visitanteDTO.setFotoVisitante(fotoVisitante.getImagemFoto());

		}

		return visitanteDTO;
	}
	
	public VisitanteDTO buscaVisitantePorAgendamento(Integer idConvidado, Integer idAgendamento) {
		AgendamentoConvidado ag = agendamentoConvidadoService.buscarAgendamentoConvidado(idConvidado, idAgendamento);
		VisitanteDTO dto = null;
		if(ag.getVisitante() != null) {
			dto = modelMapper.map(ag.getVisitante(), VisitanteDTO.class);
		}
		return dto;
	}
	
	public Visitante buscaPorId(Integer id) {
		Optional<Visitante> retorno = visitanteRepository.findById(id);
		return retorno.isPresent() ? retorno.get() : null;
	}


	public VisitanteDTO buscarVisitantePorID(Map<String, String[]> parameterMap) throws NegocioException {
		Integer idVisitante = (parameterMap.get(IDVISITANTE) != null ? Integer.parseInt(parameterMap.get(IDVISITANTE)[0]) : null);
		Visitante visitante = visitanteRepository.buscarVisitantePorID(idVisitante);
		VisitanteDTO retorno = converterEntidadeToDTO(visitante);
		return retorno != null ? retorno : null;
	}

	private VisitanteDTO converterEntidadeToDTO(Visitante visitante) throws NegocioException {
		VisitanteDTO visitanteDTO = modelMapper.map(visitante, VisitanteDTO.class);
		if (visitanteDTO.getFotoVisitante() == null) {
			FotoVisitante fotoVisitante = fotoVisitanteService.getUltimaFotoVisitante(visitanteDTO.getId());
			visitanteDTO.setDataCadFotoVisitante(fotoVisitante.getDataFoto());
			if (LocalDate.now().isAfter(fotoVisitante.getDataFoto().plusDays(90))) {
				visitanteDTO.setIsFotoVisitanteVencida(true);
			} else {
				visitanteDTO.setIsFotoVisitanteVencida(false);
			}
			visitanteDTO.setFotoVisitante(fotoVisitante.getImagemFoto());
		}
		visitanteDTO.setTelefoneVisitante(StringUtil.mascaraTelefone(visitante.getTelefoneVisitante()));

		//usado para aproveitar o método
		String[] parametros = new String[1];
		parametros[0] = visitanteDTO.getId().toString();

		Map<String, String[]> mapParametros = new HashMap<>();
		mapParametros.put("parametros", parametros);

		visitanteDTO.setDocumentos(documentoService.findDocumentoByIdVisitante(mapParametros));
		return visitanteDTO;
	}
	
	public VisitanteDTO buscaVisitanteDeAgendamentoPorNome(String param, Integer idAgendamento) {
		VisitanteDTO dto = null;
		Visitante visitante = visitanteRepository.buscaVisitanteAgendamentoPorNome(param, idAgendamento);
		if(visitante != null)
			dto = modelMapper.map(visitante, VisitanteDTO.class);
		return dto;
	}

}