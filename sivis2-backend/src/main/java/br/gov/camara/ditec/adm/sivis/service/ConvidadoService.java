package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;
import javax.validation.Valid;

import br.gov.camara.ditec.adm.sivis.repository.model.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.ConvidadoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.ConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.service.dto.AgendamentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroConfirmarConvidadoAgendadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoDocumentoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.MensagemConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class ConvidadoService {
	private static final String PARAMETROS = "parametros";
	private static final String CPF = "numeroCPF";
	private static final String AGENDAID = "agendaID";
	private static final String AGENDAMENTOID = "idAgendamento";
	private static final String PARLAMENTARID = "parlamentarID";
	private static final String CONVIDADOID = "convidadoID";
	private static final String ID_AGENDAMENTO = "idAgendamento";

	@Autowired
	private ConvidadoRepository repository;
	
	@Autowired
	private ConvidadoCustomRepository convidadoRepo;

	@Autowired
	private VisitanteService visitanteService;

	@Autowired
	private AgendamentoConvidadoService agendamentoConvidadoService;

	@Autowired
	private EntradaService entradaService;
	
	@Autowired
	private AgendamentoCustomRepository agendamentoCustomRepository;

	@Autowired
	private AgendamentoConvidadoRepository agendamentoConvidadoRepository;
	
	@Autowired
	private MensagemService mensagemService;

	@Autowired
	private FotoVisitanteService fotoVisitanteService;

	@Autowired
	private AgendamentoService agendamentoService;

	@Autowired
	ModelMapper model;

	@Transactional(rollbackOn = NegocioException.class)
	public AgendamentoDTO salvar(@Valid ConvidadoDTO convidadoDTO) throws NegocioException {
		
		model.getConfiguration().setAmbiguityIgnored(true);

		Convidado convidado = model.map(convidadoDTO, Convidado.class);
		if(convidadoDTO.getDataCadastro() == null)
		convidado.setDataCadastro(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		
		if (convidadoDTO.getFotoConvidadoDTO() != null)
			convidado.setFotoConvidado(prepararFotoConvidado(convidadoDTO.getFotoConvidadoDTO(), convidado));
		if (convidadoDTO.getDocumentosConvidadoDTO() != null)
			convidado.setDocumentosConvidado(prepararDocumentos(convidadoDTO.getDocumentosConvidadoDTO(), convidado));

		Convidado convidadoExistente = repository.buscarConvidadoID(convidadoDTO.getId());
		
		if(convidadoDTO.getId()!=null) {
			if(convidadoExistente.equals(convidado)) {}
		}

		AgendamentoConvidado agendamentoConvidado = null;
		Convidado convidadoSalvo = repository.save(convidado);
		
			agendamentoConvidado = agendamentoConvidadoRepository.buscarAgendaConvidado(convidado.getId(),convidadoDTO.getAgendamentoDTO().getId());
			if(agendamentoConvidado == null) {
				agendamentoConvidado =  new AgendamentoConvidado();
			}

		agendamentoConvidado.setAgendamento(model.map(convidadoDTO.getAgendamentoDTO(), Agendamento.class));
		agendamentoConvidado.setConvidado(convidadoSalvo);
		if (convidadoDTO.getIdVisitante() != null) {
			agendamentoConvidado.setVisitante(visitanteService.buscaPorId(convidadoDTO.getIdVisitante()));
		}
		
		AgendamentoConvidado agendaConvidadoRetorno = agendamentoConvidadoService.salvar(agendamentoConvidado);
		
//		if(convidadoDTO.getIdVisitante() != null) {
//			Visitante visitante = visitanteService.buscaPorId(convidadoDTO.getIdVisitante());
//			agendamentoConvidadoService.setVisitanteAgendamentoConvidado(agendaConvidadoRetorno.getConvidado().getId(), agendaConvidadoRetorno.getAgendamento().getId(), visitante);
//		}
		
		return model.map(agendaConvidadoRetorno.getAgendamento(), AgendamentoDTO.class);
	}

	private DocumentoConvidado prepararDocumentos(DocumentoConvidadoDTO documentosConvidadoDTO, Convidado convidado) {
		documentosConvidadoDTO.setIsPrincipal(true);
		DocumentoConvidado docConvidado = model.map(documentosConvidadoDTO, DocumentoConvidado.class);

		docConvidado.setDataCadastro(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		docConvidado.setConvidado(convidado);
		docConvidado.setFotoDocumentoConvidado(prepararFotosDocumentos(documentosConvidadoDTO.getFotoDocumentoConvidadoDTO()));
		return docConvidado;
	}

	private FotoDocumentoConvidado prepararFotosDocumentos(FotoDocumentoConvidadoDTO fotoDocumentoConvidadoDTO) {
		FotoDocumentoConvidado fotoDocumentoConvidado = new FotoDocumentoConvidado();
		fotoDocumentoConvidado.setId(fotoDocumentoConvidadoDTO.getId());
		fotoDocumentoConvidado.setFotoDocumentoFrente(fotoDocumentoConvidadoDTO.getFotoDocumentoFrente());
		fotoDocumentoConvidado.setFotoDocumentoVerso(fotoDocumentoConvidadoDTO.getFotoDocumentoVerso());

		return fotoDocumentoConvidado;
	}

	private FotoConvidado prepararFotoConvidado(FotoConvidadoDTO fotoConvidadoDTO, Convidado convidado) {
		FotoConvidado fotoConvidado = new FotoConvidado();
		fotoConvidado.setId(fotoConvidadoDTO.getId());
		fotoConvidado.setConvidado(convidado);
		fotoConvidado.setImagemFoto(fotoConvidadoDTO.getImagemFoto());
		fotoConvidado.setDataFoto(LocalDate.now(ZoneId.of(DateUtil.getZoneId())));

		return fotoConvidado;
	}

	public void validaExistenciaCPF(String cpf) throws NegocioException {
		if (visitanteService.findVisitanteByCpf(cpf) != null) {
			throw new NegocioException("Pessoa já cadastrada com esse número de cpf!");
		}
	}

	@SuppressWarnings("null")
	public Page<ConvidadoDTO> buscarConvidadosPorAgendamentoById(Map<String, String[]> parameterMap)
			throws NegocioException {
		Integer idAgendamento = (parameterMap.get(PARAMETROS) != null ? Integer.parseInt(parameterMap.get(PARAMETROS)[0]) : null);
		List<Convidado> convidadoList = repository.buscarConvidadosPorAgendamentoById(idAgendamento);

		if (convidadoList == null || convidadoList.isEmpty()) {
			throw new NegocioException("Nenhum visitante encontrado!");
		}

		List<ConvidadoDTO> listaDTO = new ArrayList<>();
		Agendamento agendamento = agendamentoService.findById(idAgendamento);
		AgendamentoDTO agendamentoDTO = model.map(agendamento, AgendamentoDTO.class);  ;

		if (convidadoList != null || !convidadoList.isEmpty()) {
			for (Convidado conv : convidadoList) {
				model.getConfiguration().setAmbiguityIgnored(true);

				if (conv != null) {
					ConvidadoDTO retorno = model.map(conv, ConvidadoDTO.class);
					retorno.setMensagemConvidado(mensagemService.buscaQuantidadeMensagemPorConvidado(conv.getId(), idAgendamento));

					if (conv.getFotoConvidado() != null) {
						FotoConvidadoDTO fotoConvidadoDTO = model.map(conv.getFotoConvidado(), FotoConvidadoDTO.class);
						retorno.setFotoConvidadoDTO(fotoConvidadoDTO);
					}

					AgendamentoConvidado ac = agendamentoConvidadoService.buscarAgendamentoConvidado(conv.getId(), idAgendamento);

					if(ac.getVisitante() != null){
						Entrada entrada = entradaService.buscaEntradaAgendamento(ac.getVisitante().getId(), ac.getAgendamento().getId());
						retorno.setDataUltimoAcesso(entrada != null ? entrada.getDataHoraVisita() : null );
					}

					retorno.setAgendamentoDTO(agendamentoDTO);
					listaDTO.add(retorno);
				}
			}
		}

		Long total = Long.valueOf(listaDTO.size());
		return new PageImpl<>(listaDTO, PageRequest.of(0, 5), total);
	}

	public ConvidadoDTO verificarConvidadoPorCPF(Map<String, String[]> parameterMap) throws NegocioException {
		String cpf = (parameterMap.get(CPF) != null ? StringUtil.removeMascara(parameterMap.get(CPF)[0]) : null);
		Integer agendamentoID = (parameterMap.get(AGENDAMENTOID) != null ? Integer.parseInt(parameterMap.get(AGENDAMENTOID)[0]) : null);
		Integer idParlamentar = (parameterMap.get(PARLAMENTARID) != null ? Integer.parseInt(parameterMap.get(PARLAMENTARID)[0]) : null);
		ConvidadoDTO convidadoDTO = null;
		
		if (verificarExistenciaConvidadoAgendamento(cpf, agendamentoID)) {
			convidadoDTO = agendamentoCustomRepository.verificarSituacaoConvidado(cpf, agendamentoID, idParlamentar);
		}
		return convidadoDTO;
	}

	private boolean verificarExistenciaConvidadoAgendamento(String cpf, Integer agendamentoID) throws NegocioException {
		if (repository.verificarExistenciaConvidadoAgendamento(cpf, agendamentoID) != null) {
			return false;
		}
		return true;
	}

	public String excluirConvidadoAgendamento(Map<String, String[]> map) {
		Integer convidadoID = (map.get(CONVIDADOID) != null ? Integer.parseInt(map.get(CONVIDADOID)[0]) : null);
		Integer agendaID = (map.get(AGENDAID) != null ? Integer.parseInt(map.get(AGENDAID)[0]) : null);
		Integer idRelacionamentoAgendaConvidado = agendamentoConvidadoRepository.buscarRelacionamentoAgendaConvidado(convidadoID, agendaID);
		MensagemConvidadoDTO recebeuMensagem = mensagemService.buscaQuantidadeMensagemPorConvidado(convidadoID, agendaID);
		Convidado convidado = repository.buscaConvidadoAgendamento(convidadoID, agendaID);
		if (idRelacionamentoAgendaConvidado != null) {
			try {
				if(recebeuMensagem.getQtMsgConfirmacao() > 0) {
					MensagemConvidadoDTO mensagemConvidadoDTO = new MensagemConvidadoDTO();
					mensagemConvidadoDTO.setIdAgendamento(agendaID);
					mensagemConvidadoDTO.setTipoEmail("Cancelamento");
					mensagemConvidadoDTO.setQtMsgConfirmacao(recebeuMensagem.getQtMsgConfirmacao());
					mensagemConvidadoDTO.setQtMsgAlteracao(recebeuMensagem.getQtMsgAlteracao());
					mensagemConvidadoDTO.setQtMsgCancelamento(recebeuMensagem.getQtMsgCancelamento());
					ConvidadoDTO convidadoDTO = model.map(convidado, ConvidadoDTO.class);
					convidadoDTO.setMensagemConvidado(mensagemConvidadoDTO);
					mensagemConvidadoDTO.setConvidados(Arrays.asList(convidadoDTO));
					mensagemService.sendEmailCamara(mensagemConvidadoDTO);
					mensagemService.excluir(convidadoID);
				}
			} catch (Exception e) {
				e.getCause();
			}
			// Excluir somente o relacionamento, mantendo o convidado
			agendamentoConvidadoRepository.apagarSomenteRelacionamentoAgendaConvidado(idRelacionamentoAgendaConvidado);
			return convidado.getNomeConvidado();
		}
		return null;
	}

	public ConvidadoDTO alterarConvidadoAgendado(Map<String, String[]> map) {
		Integer convidadoID = (map.get(CONVIDADOID) != null ? Integer.parseInt(map.get(CONVIDADOID)[0]) : null);
		Integer agendaID = (map.get(AGENDAMENTOID) != null ? Integer.parseInt(map.get(AGENDAMENTOID)[0]) : null);
		Integer idParlamentar = (map.get(PARLAMENTARID) != null ? Integer.parseInt(map.get(PARLAMENTARID)[0]) : null);
		ConvidadoDTO convidadoDTO = agendamentoCustomRepository.buscarConvidadoParaAlterar(convidadoID, agendaID,idParlamentar);
		AgendamentoConvidado agendamentoConvidado = agendamentoConvidadoService.buscarAgendamentoConvidado(convidadoID,agendaID);

		if(agendamentoConvidado.getVisitante() != null){
			Entrada entrada = entradaService.buscaEntradaAgendamento(agendamentoConvidado.getVisitante().getId(), agendaID);
			convidadoDTO.setDataUltimoAcesso(entrada != null ? entrada.getDataHoraVisita() : null);
			convidadoDTO.setIsEntrouAgendamento(entrada != null ? true : false);
		}else {
			convidadoDTO.setIsEntrouAgendamento(false);
		}

		return convidadoDTO;
	}


	
	public List<ConvidadoDTO> buscaConvidadosPorParametros(Map<String, String[]> param){
		Integer idAgendamento = RequisicaoUtil.extrairParametroInteiro(param, ID_AGENDAMENTO);
		String parametro = RequisicaoUtil.extrairParametro(param, PARAMETROS);
		List<Convidado> listaConvidados = convidadoRepo.buscaConvidadosPorParametros(StringUtil.removeMascara(parametro), idAgendamento);
		List<ConvidadoDTO> retorno = new ArrayList<>();
		listaConvidados.forEach(convidado -> {
			if (convidado != null) {
				ConvidadoDTO dto = model.map(convidado, ConvidadoDTO.class);
				DocumentoConvidadoDTO documentoConvidadoDTO = null;
				if(convidado.getDocumentosConvidado() != null) {
					documentoConvidadoDTO = model.map(convidado.getDocumentosConvidado(), DocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setConvidado(null);
					dto.setDocumentosConvidadoDTO(documentoConvidadoDTO);
					FotoDocumentoConvidadoDTO fotoDocumentoConvidadoDTO = model.map(convidado.getDocumentosConvidado().getFotoDocumentoConvidado(), FotoDocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setFotoDocumentoConvidadoDTO(fotoDocumentoConvidadoDTO);
				}
				VisitanteDTO visitante = visitanteService.buscaVisitantePorAgendamento(convidado.getId(), idAgendamento);
				if(visitante != null) {
					dto.setIsVisitante(true);
				}
				else {
					dto.setIsVisitante(false);
				}
				if (convidado.getFotoConvidado() != null) {
					FotoConvidadoDTO fotoConvidadoDTO = model.map(convidado.getFotoConvidado(), FotoConvidadoDTO.class);
					dto.setFotoConvidadoDTO(fotoConvidadoDTO);
				}
				dto.setIsEntrouAgendamento(validaEntradaConvidado(idAgendamento, convidado));
				retorno.add(dto);
			}
		});
		return retorno;
	}

	private Boolean validaEntradaConvidado(Integer idAgendamento, Convidado convidado) {
		Boolean isEntrou = false;
		AgendamentoConvidado ag = agendamentoConvidadoService.buscarAgendamentoConvidado(convidado.getId(), idAgendamento);
		if(ag.getVisitante() != null) {
			Entrada entrada = entradaService.buscaEntradaAgendamento(ag.getVisitante().getId(), idAgendamento);
			if(entrada != null) {
				isEntrou = true;
			}
		}
		return isEntrou;
	}
	
	public Convidado buscaPorId(Integer idConvidado) {
		return repository.findById(idConvidado).get();
	}
	
	public ConvidadoDTO buscaConvidadoDeAgendamentoPorNome(String param, String numero, Integer idAgendamento) {
		ConvidadoDTO dto = null;
		Convidado convidado = repository.buscaConvidadoAgendamentoPorNome(param, numero, idAgendamento);
		if(convidado != null)
			dto = model.map(convidado, ConvidadoDTO.class);
		return dto;
	}


	public List<ConvidadoDTO> listarConvidadosRecepcao(FiltroConfirmarConvidadoAgendadoDTO filtroConfirmarConvidadoAgendadoDTO) {
		List<ConvidadoDTO> retorno = new ArrayList<>();
		String param = null;

		if (filtroConfirmarConvidadoAgendadoDTO.getParametros() != null) {
			String[] array = filtroConfirmarConvidadoAgendadoDTO.getParametros().split(" ");
			String numero = null;
			String nome = "";

			for (String el : array) {
				if (StringUtil.isInteiro(StringUtil.removeMascara(el))) {
					numero = StringUtil.removeMascara(el);
				} else {
					nome = nome.concat(el).concat(" ");
				}
			}
			param = numero != null ? numero : nome;
		}

		List<Convidado> convidados = convidadoRepo.buscaConvidadosPorParametros(param, filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID());

		convidados.forEach(convidado -> {
			if (convidado != null) {
				ConvidadoDTO convidadoDTO = model.map(convidado, ConvidadoDTO.class);
				DocumentoConvidadoDTO documentoConvidadoDTO = null;

				if(convidado.getDocumentosConvidado() != null) {
					documentoConvidadoDTO = model.map(convidado.getDocumentosConvidado(), DocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setConvidado(null);
					convidadoDTO.setDocumentosConvidadoDTO(documentoConvidadoDTO);
					FotoDocumentoConvidadoDTO fotoDocumentoConvidadoDTO = model.map(convidado.getDocumentosConvidado().getFotoDocumentoConvidado(), FotoDocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setFotoDocumentoConvidadoDTO(fotoDocumentoConvidadoDTO);
				}

				VisitanteDTO visitanteDTO = visitanteService.buscaVisitantePorAgendamento(convidado.getId(), filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID());
				convidadoDTO.setIsVisitante(visitanteDTO != null ? true : false);
				FotoConvidadoDTO fotoConvidadoDTO = null;
				FotoVisitante fotoVisitante = null;
				if(visitanteDTO != null) {
					fotoVisitante = fotoVisitanteService.getUltimaFotoVisitante(visitanteDTO.getId());
				}

				if(fotoVisitante != null){
					fotoConvidadoDTO = new FotoConvidadoDTO();
					fotoConvidadoDTO.setImagemFoto(fotoVisitante.getImagemFoto());
					fotoConvidadoDTO.setDataFoto(fotoVisitante.getDataFoto());
					fotoConvidadoDTO.setId(fotoVisitante.getId());
					convidadoDTO.setFotoConvidadoDTO(fotoConvidadoDTO);
				}
				else {
					fotoConvidadoDTO = model.map(convidado.getFotoConvidado(), FotoConvidadoDTO.class);
					convidadoDTO.setFotoConvidadoDTO(fotoConvidadoDTO);
				}

				convidadoDTO.setIsEntrouAgendamento(validaEntradaConvidado(filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID(), convidado));
				retorno.add(convidadoDTO);
			}
		});

		//ordenando por nome
		retorno.stream().sorted(Comparator.comparing(ConvidadoDTO::getNomeConvidado));
		//ordenando por entrada registrada
		retorno.sort(Comparator.comparing(ConvidadoDTO::getIsEntrouAgendamento));


		return retorno;
	}

	public List<ConvidadoDTO> buscaConvidadosPorParametros(FiltroConfirmarConvidadoAgendadoDTO filtroConfirmarConvidadoAgendadoDTO) {
		List<ConvidadoDTO> retorno = new ArrayList<>();
		String param = null;
		
		if (filtroConfirmarConvidadoAgendadoDTO.getParametros() != null) {
			String[] array = filtroConfirmarConvidadoAgendadoDTO.getParametros().split(" ");
			String numero = null;
			String nome = "";

			for (String el : array) {
				if (StringUtil.isInteiro(StringUtil.removeMascara(el))) {
					numero = StringUtil.removeMascara(el);
				} else {
					nome = nome.concat(el).concat(" ");
				}
			}
			param = numero != null ? numero : nome;
		}

		List<Convidado> listaConvidados = convidadoRepo.buscaConvidadosPorParametros(param, filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID());
		
		listaConvidados.forEach(convidado -> {
			if (convidado != null) {
				ConvidadoDTO convidadoDTO = model.map(convidado, ConvidadoDTO.class);
				DocumentoConvidadoDTO documentoConvidadoDTO = null;

				if(convidado.getDocumentosConvidado() != null) {
					documentoConvidadoDTO = model.map(convidado.getDocumentosConvidado(), DocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setConvidado(null);
					convidadoDTO.setDocumentosConvidadoDTO(documentoConvidadoDTO);
					FotoDocumentoConvidadoDTO fotoDocumentoConvidadoDTO = model.map(convidado.getDocumentosConvidado().getFotoDocumentoConvidado(), FotoDocumentoConvidadoDTO.class);
					documentoConvidadoDTO.setFotoDocumentoConvidadoDTO(fotoDocumentoConvidadoDTO);
				}

				VisitanteDTO visitante = visitanteService.buscaVisitantePorAgendamento(convidado.getId(), filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID());
				convidadoDTO.setIsVisitante(visitante != null ? true : false);

				if (convidado.getFotoConvidado() != null) {
					FotoConvidadoDTO fotoConvidadoDTO = model.map(convidado.getFotoConvidado(), FotoConvidadoDTO.class);
					convidadoDTO.setFotoConvidadoDTO(fotoConvidadoDTO);
				}

				convidadoDTO.setIsEntrouAgendamento(validaEntradaConvidado(filtroConfirmarConvidadoAgendadoDTO.getAgendamentoID(), convidado));
				retorno.add(convidadoDTO);
			}
		});
		
		//ordenando por nome
		retorno.stream().sorted(Comparator.comparing(ConvidadoDTO::getNomeConvidado));
		//ordenando por entrada registrada
		retorno.sort(Comparator.comparing(ConvidadoDTO::getIsEntrouAgendamento));
		
		
		return retorno;
	}
	

	public ConvidadoDTO buscaConvidadoMensagemConvidadoPorId(Integer idMensagem) {
		return model.map(repository.buscaConvidadoMensagemConvidadoPorId(idMensagem), ConvidadoDTO.class);
	}

}
