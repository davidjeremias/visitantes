package br.gov.camara.ditec.adm.sivis.controller;

import java.util.EnumSet;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.AgendamentoService;
import br.gov.camara.ditec.adm.sivis.service.dto.AgendamentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroConsultaAgendamentoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/agendamento")
@Api(value = "API REST Agendamento - Sivis-Backend")
public class AgendamentoController {
	
	@Autowired
	private AgendamentoService service;

	@PostMapping
	public ResponseEntity<AgendamentoDTO> salvar(@Valid @RequestBody AgendamentoDTO agendamentoDTO){
		boolean status = agendamentoDTO.getId() == null;
		AgendamentoDTO retorno = service.salvar(agendamentoDTO);
		return retorno != null && status ? new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.CREATED) 
				: new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.OK);
	}
	
	@GetMapping("/buscaPorId")
	public ResponseEntity<AgendamentoDTO> findById(WebRequest request){
		AgendamentoDTO retorno = service.findById(request.getParameterMap());
		return retorno != null ? new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/buscaAgendamentoPorParametros")
	public ResponseEntity<List<AgendamentoDTO>> findAgendamentoByParam(WebRequest request){
		List<AgendamentoDTO> listaRetorno =  service.findAgendamentoByParam(request.getParameterMap());
		return listaRetorno != null && !listaRetorno.isEmpty() ? new ResponseEntity<List<AgendamentoDTO>>(listaRetorno, HttpStatus.OK)
				: new ResponseEntity<List<AgendamentoDTO>>(listaRetorno, HttpStatus.NO_CONTENT);
	}

	@PostMapping("/buscaPorFiltro")
	public ResponseEntity<Page<AgendamentoDTO>> buscarPorFiltro(@RequestBody FiltroConsultaAgendamentoDTO filtroConsultaAgendamentoDTO) throws NegocioException {
		Page<AgendamentoDTO> retorno = service.buscarPorFiltro(filtroConsultaAgendamentoDTO);
		return !retorno.getContent().isEmpty() ? new ResponseEntity<Page<AgendamentoDTO>>(retorno, HttpStatus.OK)
				:new ResponseEntity<Page<AgendamentoDTO>>(retorno, HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/listarSituacoes")
	public ResponseEntity<EnumSet<SituacaoEnum>>  listarSituacoes(){
		
		return new ResponseEntity<EnumSet<SituacaoEnum>>(EnumSet.of(SituacaoEnum.AGENDADO, SituacaoEnum.CANCELADO), HttpStatus.OK);
	}
	
	@GetMapping("/listarPeriodos")
	public ResponseEntity<EnumSet<PeriodoEnum>>  listarPeriodos(){
		return new ResponseEntity<EnumSet<PeriodoEnum>>(EnumSet.allOf(PeriodoEnum.class), HttpStatus.OK);
	}
	
	@GetMapping("/excluirAgendamento")
	public ResponseEntity<Integer> excluirAgendamento(WebRequest request) {
		
		  boolean retorno = service.excluirAgendamento(request.getParameterMap());
		    if (!retorno) {
		        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		    }
		    return new ResponseEntity<>(HttpStatus.OK);	
	}
}
