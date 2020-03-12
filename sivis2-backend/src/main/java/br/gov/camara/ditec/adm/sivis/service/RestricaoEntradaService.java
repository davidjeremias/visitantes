package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.FotoRestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.FotoVisitanteRepository;
import br.gov.camara.ditec.adm.sivis.repository.RestricaoEntradaCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.RestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.TentativaRestricaoEntradaRepository;
import br.gov.camara.ditec.adm.sivis.repository.VisitanteRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoRestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoVisitante;
import br.gov.camara.ditec.adm.sivis.repository.model.RestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.TentativaEntradaRestricao;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoRestricao;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.AutorizacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.EntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroRestricaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroTentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoRestricaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.RestricaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;

@Service
public class RestricaoEntradaService {

	@Autowired
	private RestricaoEntradaRepository repository;

	@Autowired
	private TentativaRestricaoEntradaRepository tentativaRestricaoEntradaRepository;

	@Autowired
	private RestricaoEntradaCustomRepository repositoryCustom;

	@Autowired
	private VisitanteRepository visitanteRepository;

	@Autowired
	private FotoVisitanteRepository FotoVisitanteRepository;
	
	@Autowired
	private FotoRestricaoEntradaRepository fotoRestricaoEntradaRepository;

	@Autowired
	private FotoVisitanteService fotoVisitanteService;

	@Autowired
	private VisitanteService visitanteService;

	@Autowired
	ModelMapper model;

	private static final String IDRESTRICAOENTRADA = "idRestricaoEntrada";
	private static final String NUMEROCPF = "numeroCPF";
	private static final String IDVISITANTE = "idVisitante";
	private static final String HOJE = "hoje";
	

	public List<TipoRestricao> buscarTiposRestricao() {
		return repository.buscarTiposRestricao();
	}

	public RestricaoEntradaDTO salvar(@Valid RestricaoEntradaDTO restricaoEntradaDTO) throws NegocioException {

		RestricaoEntrada restricaoEntrada = model.map(restricaoEntradaDTO, RestricaoEntrada.class);
		if (restricaoEntrada.getDataCadastro() == null) {
			restricaoEntrada.setDataCadastro(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));
		}

		if (restricaoEntradaDTO.getVisitanteDTO() != null) {
			if (restricaoEntradaDTO.getVisitanteDTO().getId() != null) {
				restricaoEntrada.setNumCPF(null);
				restricaoEntrada.setNomeCivil(null);
				restricaoEntrada.setFotoRestricaoEntrada(null);
			}
		} else {
			restricaoEntrada.setFotoRestricaoEntrada(
					prepararFotoRestricaoEntrada(restricaoEntradaDTO.getFotoRestricaoEntradaDTO(), restricaoEntrada));
		}

		RestricaoEntrada restricaoEntradaSalvo = repository.save(restricaoEntrada);

		return model.map(restricaoEntradaSalvo, RestricaoEntradaDTO.class);
	}

	private FotoRestricaoEntrada prepararFotoRestricaoEntrada(FotoRestricaoEntradaDTO fotoRestricaoEntradaDTO,
			RestricaoEntrada restricaoEntrada) {

		FotoRestricaoEntrada fotoRestricaoEntrada = new FotoRestricaoEntrada();
		fotoRestricaoEntrada
				.setDataFoto(fotoRestricaoEntradaDTO.getDataFoto() != null ? fotoRestricaoEntradaDTO.getDataFoto()
						: LocalDate.now());
		fotoRestricaoEntrada.setImagemFoto(fotoRestricaoEntradaDTO.getImagemFoto());
		fotoRestricaoEntrada.setRestricaoEntrada(restricaoEntrada);

		return fotoRestricaoEntrada;
	}

	public Page<RestricaoEntradaDTO> buscarPorFiltro(FiltroRestricaoEntradaDTO filtroConsultaAgendamentoDTO) {

		LocalDate dataInicial = filtroConsultaAgendamentoDTO.getDataInicial() != null
				? filtroConsultaAgendamentoDTO.getDataInicial()
				: null;
		LocalDate dataFinal = filtroConsultaAgendamentoDTO.getDataFinal() != null
				? filtroConsultaAgendamentoDTO.getDataFinal()
				: null;
		String restricao = filtroConsultaAgendamentoDTO.getTipoRestricao() != null
				? filtroConsultaAgendamentoDTO.getTipoRestricao()
				: null;
		String cpf = filtroConsultaAgendamentoDTO.getCpf() != null ? filtroConsultaAgendamentoDTO.getCpf() : null;
		if(cpf != null)
		cpf = cpf.trim().replace(".", "").replace("-", "");
		String nome = filtroConsultaAgendamentoDTO.getNome() != null ? filtroConsultaAgendamentoDTO.getNome() : null;
		String motivo = filtroConsultaAgendamentoDTO.getMotivo() != null ? filtroConsultaAgendamentoDTO.getMotivo()
				: null;
		Boolean somenteComRestricaoEntrada = filtroConsultaAgendamentoDTO.getSomenteComRestricaoEntrada() != null
				? filtroConsultaAgendamentoDTO.getSomenteComRestricaoEntrada()
				: false;

		PageImpl<RestricaoEntrada> retorno = repositoryCustom.buscarPorFiltro(dataInicial, dataFinal, restricao, cpf,
				nome, motivo, somenteComRestricaoEntrada);

		List<RestricaoEntradaDTO> listaDTO = new ArrayList<>();

		listaDTO = converterListEntidadeToListDTO(retorno.getContent());

		return new PageImpl<>(listaDTO, retorno.getPageable(), retorno.getSize());
	}

	private List<RestricaoEntradaDTO> converterListEntidadeToListDTO(List<RestricaoEntrada> listaRestricaoEntrada) {

		List<RestricaoEntradaDTO> listaRestricaoEntradaDTO = new ArrayList<>();
		for (RestricaoEntrada re : listaRestricaoEntrada) {
			RestricaoEntradaDTO restricaoEntradaDTO = model.map(re, RestricaoEntradaDTO.class);

			FotoRestricaoEntrada fotoRestricaoEntrada =fotoRestricaoEntradaRepository.buscarFotoRestricaoEntradaID(re.getId());
			if(fotoRestricaoEntrada !=null) {
				restricaoEntradaDTO.setFotoRestricaoEntradaDTO(prepararFotoRestricaoEntradaDTO(fotoRestricaoEntrada));
			}

			if (re.getVisitante() != null) {
				if (re.getVisitante().getId() != null) {
					Optional<Visitante> visitante = visitanteRepository.findById(re.getVisitante().getId());

					restricaoEntradaDTO.setNomeCivil(visitante.get().getNomeVisitante());
					restricaoEntradaDTO.setNumCPF(visitante.get().getCpf());
					restricaoEntradaDTO.setFotoRestricaoEntradaDTO(
							prepararFotoVisitante(visitante.get().getFotosVisitante().get(0).getImagemFoto()));
				}
			}
			restricaoEntradaDTO.setQtdTentativasEntrada(
					tentativaRestricaoEntradaRepository.buscarQuantidadeTentativasEntrada(restricaoEntradaDTO.getId()));

			listaRestricaoEntradaDTO.add(restricaoEntradaDTO);
		}
		return listaRestricaoEntradaDTO;

	}

	private FotoRestricaoEntradaDTO prepararFotoVisitante(String imagemFoto) {
		FotoRestricaoEntradaDTO fotoRestricaoEntradaDTOVisitante = new FotoRestricaoEntradaDTO();
		fotoRestricaoEntradaDTOVisitante.setImagemFoto(imagemFoto);
		return fotoRestricaoEntradaDTOVisitante;
	}

	private FotoRestricaoEntradaDTO prepararFotoRestricaoEntradaDTO(FotoRestricaoEntrada fotoRestricaoEntrada) {

		FotoRestricaoEntradaDTO fotoRestricaoEntradaDTO = new FotoRestricaoEntradaDTO();

		fotoRestricaoEntradaDTO.setId(fotoRestricaoEntrada.getId());
		fotoRestricaoEntradaDTO.setDataFoto(fotoRestricaoEntrada.getDataFoto());
		fotoRestricaoEntradaDTO.setImagemFoto(fotoRestricaoEntrada.getImagemFoto());

		return fotoRestricaoEntradaDTO;
	}

	public RestricaoEntradaDTO buscaPorId(Map<String, String[]> parameterMap) {
		Integer id = (parameterMap.get(IDRESTRICAOENTRADA) != null
				? Integer.parseInt(parameterMap.get(IDRESTRICAOENTRADA)[0])
				: null);
		Optional<RestricaoEntrada> retorno = repository.findById(id);

		RestricaoEntradaDTO restricaoEntradaDTO = null;
		if (retorno.isPresent()) {

			restricaoEntradaDTO = model.map(retorno.get(), RestricaoEntradaDTO.class);
			if(retorno.get().getFotoRestricaoEntrada() != null) {
				
			restricaoEntradaDTO.setFotoRestricaoEntradaDTO(
					prepararFotoRestricaoEntradaDTO(retorno.get().getFotoRestricaoEntrada()));
			}
			if (retorno.get().getVisitante() != null) {
				if (retorno.get().getVisitante().getId() != null) {
					Optional<Visitante> visitante = visitanteRepository.findById(retorno.get().getVisitante().getId());

					VisitanteDTO visitanteDTO = model.map(visitante.get(), VisitanteDTO.class);
					visitanteDTO.setFotoVisitante(buscarFotoVisitante(retorno.get().getVisitante().getId()));

					restricaoEntradaDTO.setVisitanteDTO(visitanteDTO);

				}
			}
		}
		return restricaoEntradaDTO;
	}

	private String buscarFotoVisitante(Integer id) {
		FotoVisitante fotoVisitante = fotoVisitanteService.getUltimaFotoVisitante(id);
		return fotoVisitante.getImagemFoto();
	}

	public List<TentativaEntradaRestricaoDTO> buscaEntradarRestricaoPorRegistroEntradaId(
			Map<String, String[]> parameterMap) {

		Integer id = (parameterMap.get(IDRESTRICAOENTRADA) != null
				? Integer.parseInt(parameterMap.get(IDRESTRICAOENTRADA)[0])
				: null);
		String hoje = (parameterMap.get(HOJE) != null ? parameterMap.get(HOJE)[0] : null);
		
		
		List<TentativaEntradaRestricao> tentativasEntradaRestricao = new ArrayList<TentativaEntradaRestricao>();
		if(hoje != null) {
			LocalDateTime dataInicio = LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())).withHour(0);
			LocalDateTime dataFim = LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())).withHour(23);
			
			tentativasEntradaRestricao = buscaEntradarRestricaoPorRegistroEntradaId(id,dataInicio,dataFim);
		}else {
			tentativasEntradaRestricao = buscaEntradarRestricaoPorRegistroEntradaId(id);
		}

		List<TentativaEntradaRestricaoDTO> listaDTO = new ArrayList<>();

		listaDTO = converterListTentativaEntradaRestricaoToListDTO(tentativasEntradaRestricao);

		return listaDTO;
	}

	private List<TentativaEntradaRestricao> buscaEntradarRestricaoPorRegistroEntradaId(Integer id,
			LocalDateTime dataInicio, LocalDateTime dataFim) {
		return tentativaRestricaoEntradaRepository.buscaEntradarRestricaoPorRegistroEntradaId(id, dataInicio,dataFim);
		
	}

	private List<TentativaEntradaRestricaoDTO> converterListTentativaEntradaRestricaoToListDTO(
			List<TentativaEntradaRestricao> listaTentativasEntradaRestricao) {

		List<TentativaEntradaRestricaoDTO> listaTentativaEntradaRestricaoDTO = new ArrayList<>();
		
		
		for (TentativaEntradaRestricao tre : listaTentativasEntradaRestricao) {
			TentativaEntradaRestricaoDTO tentativaEntradaRestricaoDTO = model.map(tre,TentativaEntradaRestricaoDTO.class);
			
			if(tre.getPortaria() !=null) {
			PortariaDTO portariaDTO = model.map(tre.getPortaria(), PortariaDTO.class);
			tentativaEntradaRestricaoDTO.setPortariaDTO(portariaDTO);
			}
			if(tre.getEntrada()!=null) {
			EntradaDTO entradaDTO = model.map(tre.getEntrada(), EntradaDTO.class);
			tentativaEntradaRestricaoDTO.setEntradaDTO(entradaDTO);
			}
			
			
			
			if(tentativaEntradaRestricaoDTO.getRejeicaoEntrada() == null && tentativaEntradaRestricaoDTO.getEntradaDTO() == null) {
				tentativaEntradaRestricaoDTO.setSituacao("Não avaliada");
			}else if(tentativaEntradaRestricaoDTO.getRejeicaoEntrada() != null && tentativaEntradaRestricaoDTO.getEntradaDTO() == null) {
				tentativaEntradaRestricaoDTO.setSituacao("Rejeitada");
				tentativaEntradaRestricaoDTO.setJustificativa(tentativaEntradaRestricaoDTO.getRejeicaoEntrada().getMotivo());
				
			}else if(tentativaEntradaRestricaoDTO.getRejeicaoEntrada() == null && tentativaEntradaRestricaoDTO.getEntradaDTO() != null) {
				tentativaEntradaRestricaoDTO.setSituacao("Permetida");
			}

			listaTentativaEntradaRestricaoDTO.add(tentativaEntradaRestricaoDTO);
		}

		return listaTentativaEntradaRestricaoDTO;
	}

	private List<TentativaEntradaRestricao> buscaEntradarRestricaoPorRegistroEntradaId(Integer id) {
		return tentativaRestricaoEntradaRepository.buscaEntradarRestricaoPorRegistroEntradaId(id, null, null);
	}

	public boolean excluirRestricaoEntrada(Map<String, String[]> parameterMap) {
		Integer id = (parameterMap.get(IDRESTRICAOENTRADA) != null ? Integer.parseInt(parameterMap.get(IDRESTRICAOENTRADA)[0]) : null);

		List<TentativaEntradaRestricao> tentativasEntradaRestricao = buscaEntradarRestricaoPorRegistroEntradaId(id);

		if (tentativasEntradaRestricao.isEmpty() && tentativasEntradaRestricao.size() == 0) {
			repository.deleteById(id);
			return true;
		} else {
			return false;
		}

	}

	public boolean verificarRegras(RestricaoEntradaDTO restricaoEntradaDTO) {

		String numeroCPF = restricaoEntradaDTO.getNumCPF() != null ? restricaoEntradaDTO.getNumCPF()
				: restricaoEntradaDTO.getVisitanteDTO().getCpf();

		List<RestricaoEntrada> restricaoExistente = repository.buscarRestricaoPorCPF(numeroCPF,
				restricaoEntradaDTO.getTipoRestricao().getId());

		if (restricaoEntradaDTO.getId() != null) {
			if (restricaoEntradaDTO.getDataFinalRestricao() == null) {
				return true;
			} else if (restricaoEntradaDTO.getDataFinalRestricao()
					.isAfter(restricaoEntradaDTO.getDataInicioRestricao())) {
				return true;
			}

		} else {

			if (restricaoExistente != null) {
				for (RestricaoEntrada rest : restricaoExistente) {
					if (rest.getDataFinalRestricao() == null) {
						return false;
					}
					if (verificarDatas(restricaoEntradaDTO, rest)) {
						return false;
					}
				}

			}
		}
		return true;
	}

	private boolean verificarDatas(RestricaoEntradaDTO restricaoEntradaDTO, RestricaoEntrada restricaoExistente) {

		if (restricaoEntradaDTO.getDataInicioRestricao().isBefore(restricaoExistente.getDataFinalRestricao())) {
			return true;
		}

		return false;
	}

	public RestricaoEntradaDTO verificarRestricaoEntradaVisitantePorCPF(Map<String, String[]> parameterMap) {
		String cpf = (parameterMap.get(NUMEROCPF) != null ? parameterMap.get(NUMEROCPF)[0] : null);
		cpf = cpf.trim().replace(".", "").replace("-", "");
		List<RestricaoEntrada> restricaoEntradaList = repository.buscarRestricaoPorCPF(cpf, null);

		List<RestricaoEntrada> restricoesTipoAlertaLIst = new ArrayList<RestricaoEntrada>();
		List<RestricaoEntrada> restricoesTipoRestricaoEntradaList = new ArrayList<RestricaoEntrada>();

		RestricaoEntrada retornar = null;

		for (RestricaoEntrada re : restricaoEntradaList) { // tipo: Alertas

			if (re.getTipoRestricao().getId() == 1) {
				restricoesTipoAlertaLIst.add(re);
			} else if (re.getTipoRestricao().getId() == 2) { // tipo: Restrição de entrada
				restricoesTipoRestricaoEntradaList.add(re);
			}
		}

		// primeiro dar prioridade as restrições do tipo: Restriçoes de entrada
		if (!restricoesTipoRestricaoEntradaList.isEmpty() && restricoesTipoRestricaoEntradaList.size() > 0)
			for (RestricaoEntrada re : restricoesTipoRestricaoEntradaList) {
				if (verificarDataRestricaoEntrada(re.getDataInicioRestricao(), re.getDataFinalRestricao())) {
					retornar = re;
					break;
				}

			}

		// primeiro dar prioridade as restrições do tipo: Alerta
		if (retornar == null) {
			if (!restricoesTipoAlertaLIst.isEmpty() && restricoesTipoAlertaLIst.size() > 0) {
				for (RestricaoEntrada re : restricoesTipoAlertaLIst) {
					if (verificarDataRestricaoEntrada(re.getDataInicioRestricao(), re.getDataFinalRestricao())) {
						retornar = re;
						break;
					}
				}
			}
		}

		
		return retornar != null ? model.map(retornar, RestricaoEntradaDTO.class): null;
	}

	private boolean verificarDataRestricaoEntrada(LocalDate dataInicioRestricao, LocalDate dataFinalRestricao) {
		LocalDate dataAtual = LocalDate.now();
		boolean ok = false;

		if (dataFinalRestricao == null) {
			ok = true;
		} else if (dataFinalRestricao.isEqual(dataAtual)) {
			ok = true;

		} else if (dataFinalRestricao.isBefore(dataAtual)) {
			ok = false;
		} else if (dataAtual.isAfter(dataFinalRestricao)) {
			ok = true;
		}

		return ok;
	}

	public List<RestricaoEntradaDTO> buscarRestricaoEntradaVisitanteID(Map<String, String[]> parameterMap) {
		Integer idVisitante = (parameterMap.get(IDVISITANTE) != null ? Integer.parseInt(parameterMap.get(IDVISITANTE)[0]) : null);
		
		List<RestricaoEntrada> restricaoEntradas = repository.buscarRestricaoPorVisitanteID(idVisitante);
		
		
		List<RestricaoEntradaDTO> retorno = converterListEntidadeToListDTO(restricaoEntradas);
		
		
		return retorno.size() > 0 ? retorno : null;
	}

	public Page<RestricaoEntradaDTO> buscarRestricaoEntradaTentativas(FiltroTentativaEntradaRestricaoDTO filtroTentativaEntradaRestricaoDTO) {

			LocalDate restricaoDataInicial = filtroTentativaEntradaRestricaoDTO.getRestricaoDataInicial() != null ? filtroTentativaEntradaRestricaoDTO.getRestricaoDataInicial() : null;
			LocalDate restricaoDataFinal = filtroTentativaEntradaRestricaoDTO.getRestricaoDataFinal() != null ? filtroTentativaEntradaRestricaoDTO.getRestricaoDataFinal() : null;
			LocalDate eventoDataInicial = filtroTentativaEntradaRestricaoDTO.getEventoDataInicial() != null ? filtroTentativaEntradaRestricaoDTO.getEventoDataInicial() : null;
			LocalDate eventoDataFinal = filtroTentativaEntradaRestricaoDTO.getEventoDataFinal() != null ? filtroTentativaEntradaRestricaoDTO.getEventoDataFinal() : null;
			TipoRestricaoDTO tipoRestricao = filtroTentativaEntradaRestricaoDTO.getTipoRestricaoDTO() != null ? filtroTentativaEntradaRestricaoDTO.getTipoRestricaoDTO()  : null;
			String cpf = filtroTentativaEntradaRestricaoDTO.getNumeroCPF() != null ? filtroTentativaEntradaRestricaoDTO.getNumeroCPF() : null;
			if(cpf != null)
			cpf = cpf.trim().replace(".", "").replace("-", "");
			String nome = filtroTentativaEntradaRestricaoDTO.getNome() != null ? filtroTentativaEntradaRestricaoDTO.getNome() : null;
			String motivo = filtroTentativaEntradaRestricaoDTO.getMotivo() != null ? filtroTentativaEntradaRestricaoDTO.getMotivo() : null;
			PortariaDTO portariaDTO = filtroTentativaEntradaRestricaoDTO.getPortariaDTO() != null ? filtroTentativaEntradaRestricaoDTO.getPortariaDTO() : null;
			AutorizacaoEnum autorizacao = filtroTentativaEntradaRestricaoDTO.getAutorizacao() != null ? filtroTentativaEntradaRestricaoDTO.getAutorizacao() : null;
			
			PageImpl<RestricaoEntrada> retorno = repositoryCustom.buscarRestricaoEntradaTentativas(restricaoDataInicial, restricaoDataFinal, eventoDataInicial, eventoDataFinal,
					tipoRestricao, cpf, nome,motivo,portariaDTO,autorizacao);

			List<RestricaoEntradaDTO> listaDTO = new ArrayList<>();

			listaDTO = converterListEntidadeToListDTO(retorno.getContent());
	
			return new PageImpl<>(listaDTO, retorno.getPageable(), retorno.getSize());
			

	}

}
