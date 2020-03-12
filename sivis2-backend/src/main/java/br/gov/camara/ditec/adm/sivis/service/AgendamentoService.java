package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoRepository;
import br.gov.camara.ditec.adm.sivis.repository.ConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Agendamento;
import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.AgendamentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroConsultaAgendamentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class AgendamentoService {

	private static final String PARAMETROS = "parametros";
	private static final String IDAGENDAMENTO = "idAgendamento";
	
	@Autowired
	private AgendamentoRepository repository;

	@Autowired
	private AgendamentoCustomRepository agendamentoCustomRepo;
	
	@Autowired
	private ConvidadoRepository convidadoRepository;
	
	@Autowired
	private AgendamentoConvidadoRepository agendamentoConvidadoRepository;
	
	@Autowired
	private ConvidadoService convidadoService;
	
	@Autowired
	private VisitanteService visitanteService;

	@Autowired
	private MensagemService mensagemService;
	
	@Autowired
	ModelMapper model;
		
	public AgendamentoDTO salvar(AgendamentoDTO agendamentoDTO) {
		Agendamento agendamento = model.map(agendamentoDTO, Agendamento.class);
		AgendamentoDTO retorno = null;
		agendamento.setPeriodo(PeriodoEnum.getEnumByName(agendamentoDTO.getPeriodo()));
		if (agendamento.getDataCadastro() == null)
			agendamento.setDataCadastro(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())));

		if (agendamento.getId() == null) {
			agendamento.setSituacao(SituacaoEnum.AGENDADO);
		} else {
			agendamento.setSituacao(SituacaoEnum.getEnumByName(agendamentoDTO.getSituacao()));
			if (agendamento.getSituacao().equals(SituacaoEnum.AGENDADO)) {
				if (verificarAlteracaoAgendamento(agendamentoDTO)) {
					List<Convidado> convidadosAgendamento = convidadoRepository.buscarConvidadosPorAgendamentoById(agendamentoDTO.getId());
					retorno = model.map(repository.save(agendamento), AgendamentoDTO.class);
					if (convidadosAgendamento.size() > 0 && !convidadosAgendamento.isEmpty())
						mensagemService.enviarMensagemAlteracaoAgendamento(convidadosAgendamento, agendamentoDTO.getId());
					return retorno;
				}

			}
		}
		retorno = model.map(repository.save(agendamento), AgendamentoDTO.class);

		return retorno;
	}

	private boolean verificarAlteracaoAgendamento(AgendamentoDTO agendamentoDTO) {
		boolean houveAlteracao = false;
		Optional<Agendamento> agendamentoVerificar = repository.findById(agendamentoDTO.getId());

		if (!agendamentoDTO.getDataAgendamento().equals(agendamentoVerificar.get().getDataAgendamento())) {
			houveAlteracao = true;
		} else if (!PeriodoEnum.getEnumByName(agendamentoDTO.getPeriodo())
				.equals(agendamentoVerificar.get().getPeriodo())) {
			houveAlteracao = true;
		}
		return houveAlteracao;
	}

	public AgendamentoDTO findById(Map<String, String[]> map) {
		Integer id = (map.get(IDAGENDAMENTO) != null ? Integer.parseInt(map.get(IDAGENDAMENTO)[0]) : null);
		Optional<Agendamento> retorno = repository.findById(id);
		
		AgendamentoDTO agendamentoDTO = null;
		if (retorno.isPresent()) {
			agendamentoDTO = model.map(retorno.get(), AgendamentoDTO.class);
			
		}
		return agendamentoDTO;
	}
	
	public Agendamento findById(Integer idAgendamento){
		Optional<Agendamento> retorno = repository.findById(idAgendamento);
		return retorno.isPresent() ? retorno.get() : null;
	}

	public Agendamento converterDTOToEntidade(AgendamentoDTO agendamentoDTO) {
		return model.map(agendamentoDTO, Agendamento.class);
	}

	public Page<AgendamentoDTO> buscarPorFiltro(FiltroConsultaAgendamentoDTO filtroConsultaAgendamentoDTO)
			throws NegocioException {
		// Filtros Formulários
		LocalDate dataInicial = filtroConsultaAgendamentoDTO.getDataInicial() != null
				? filtroConsultaAgendamentoDTO.getDataInicial()
				: null;
		LocalDate dataFinal = filtroConsultaAgendamentoDTO.getDataFinal() != null
				? filtroConsultaAgendamentoDTO.getDataFinal()
				: null;
		PeriodoEnum periodo = filtroConsultaAgendamentoDTO.getPeriodo() != null
				? PeriodoEnum.getEnumById(filtroConsultaAgendamentoDTO.getPeriodo())
				: null;
		SituacaoEnum situacao = filtroConsultaAgendamentoDTO.getSituacao() != null
				? SituacaoEnum.getEnumById(filtroConsultaAgendamentoDTO.getSituacao())
				: null;
		String descricao = filtroConsultaAgendamentoDTO.getDescricao() != null
				? filtroConsultaAgendamentoDTO.getDescricao()
				: null;
		PageImpl<Agendamento> retorno = agendamentoCustomRepo.buscarPorFiltro( dataInicial,
				dataFinal, periodo, situacao, descricao, filtroConsultaAgendamentoDTO.getIdParlamentar());
		
		if (retorno.getContent() == null) {
			throw new NegocioException("Nenhum Agendamento encontrado!");
		}

		List<AgendamentoDTO> listaDTO = new ArrayList<>();
		
		PageRequest.of(0, 50);
		
		listaDTO = converterListEntidadeToListDTO(retorno.getContent());
		
		listaDTO.sort(Comparator.comparing(AgendamentoDTO::getDataAgendamento).reversed());
		
		return new PageImpl<>(listaDTO, retorno.getPageable(), retorno.getSize());
	}

	private List<AgendamentoDTO> converterListEntidadeToListDTO(List<Agendamento> listaAgendamentos) {
		List<AgendamentoDTO> listaAgendamentoDTO = new ArrayList<>();
		for (Agendamento a : listaAgendamentos) {
			AgendamentoDTO agendamentoDTO = model.map(a, AgendamentoDTO.class);
			agendamentoDTO.setSituacao(a.getSituacao().getNome());
			agendamentoDTO.setPeriodo(a.getPeriodo().getNome());
			agendamentoDTO.setQtdeConvidados(repository.buscarQuantidadeVisitante(a.getId()));
			listaAgendamentoDTO.add(agendamentoDTO);
		}
		return listaAgendamentoDTO;
	}

	public boolean excluirAgendamento(Map<String, String[]> map) {
		Integer idAgendamento = (map.get(PARAMETROS) != null ? Integer.parseInt(map.get(PARAMETROS)[0]) : null);
		Optional<Agendamento> agendamento = repository.findById(idAgendamento);
		List<Integer> idsAgendamentoConvidados = new ArrayList<Integer>();

		try {
			if(verificarConvidadoEntrada(idAgendamento) && agendamento.isPresent()) {	
				idsAgendamentoConvidados = agendamentoConvidadoRepository.buscarIdsRelacionamentoAgendamentoConvidado(idAgendamento);
				
				if(!idsAgendamentoConvidados.isEmpty() && idsAgendamentoConvidados.size() != 0) {
					List<Convidado> convidadosAgendamento = convidadoRepository.buscarConvidadosPorAgendamentoById(idAgendamento);
					mensagemService.enviarMensagemExclusaoAgendamento(convidadosAgendamento,idAgendamento);
					
					for(Integer ac : idsAgendamentoConvidados) {
						agendamentoConvidadoRepository.apagarSomenteRelacionamentoAgendaConvidado(ac);
					}
				}
				repository.delete(agendamento.get());
				return true;
			}
		} catch (Exception e) {
			e.getCause();
		}
		return false;
	}

	private boolean verificarConvidadoEntrada(Integer id) {
		Integer qtdeConvidadosEntrada = agendamentoConvidadoRepository.verificarConvidadoEntrada(id);
		if(qtdeConvidadosEntrada == 0) {
			return true;
		}
		return false;
	}
	
	public List<AgendamentoDTO> findAgendamentoByParam(Map<String, String[]> filter){
		String param = RequisicaoUtil.extrairParametro(filter, PARAMETROS);
		LocalDate dataHoje = LocalDate.now(ZoneId.of(DateUtil.getZoneId()));
		String numero = null;
		if(StringUtil.isCPF(param)) {
			param = StringUtil.removeMascaraCPF(param);
		}
		if(StringUtil.verificaNumero(param)) {
			numero = param;
			param = null;
		}
		List<Agendamento> listaAgendamentos = agendamentoCustomRepo.findAgendamentoByParam(param, numero, dataHoje);
		List<AgendamentoDTO> listaAgendamentoDTO = new ArrayList<>();
		for(Agendamento agendamento : listaAgendamentos){
			AgendamentoDTO dto = model.map(agendamento, AgendamentoDTO.class);
			ConvidadoDTO convidadoDTO = convidadoService.buscaConvidadoDeAgendamentoPorNome(param, numero, agendamento.getId());
			if(convidadoDTO != null) dto.setConvidadoDTO(convidadoDTO);
			VisitanteDTO visitanteDTO = visitanteService.buscaVisitanteDeAgendamentoPorNome(param, agendamento.getId());
			if(visitanteDTO != null) dto.setVisitanteDTO(visitanteDTO);
			dto.setQtdeConvidados(agendamentoConvidadoRepository.buscaQuantidadeConvidadosPorAgendamento(dto.getId()));
			listaAgendamentoDTO.add(dto);
		}
		return listaAgendamentoDTO;
	}
}
