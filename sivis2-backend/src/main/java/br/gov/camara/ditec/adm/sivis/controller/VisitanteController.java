package br.gov.camara.ditec.adm.sivis.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.service.VisitanteService;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/visitante")
@Api(value = "API REST Visitante - Sivis-Backend")
public class VisitanteController extends BaseServico {

	@Autowired
	private VisitanteService visitanteService;

	@GetMapping(value = "/buscaPorFiltros", produces = "application/json")
	public ResponseEntity<Page<VisitanteDTO>> findAllFilter(WebRequest request) throws NegocioException {
		Page<VisitanteDTO> retorno = visitanteService.findAllByFilter(request.getParameterMap());
		return !retorno.getContent().isEmpty() ? new ResponseEntity<Page<VisitanteDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<Page<VisitanteDTO>>(retorno, HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/buscaPorAgendamento")
	public ResponseEntity<VisitanteDTO> findVisitanteByAgendamento(WebRequest request) throws NegocioException {
		VisitanteDTO retorno = visitanteService.buscaVisitantePorAgendamento(request.getParameterMap());
		return retorno != null ? new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.OK)
				:new ResponseEntity<VisitanteDTO>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/validaCPF")
	public ResponseEntity<VisitanteDTO> findVisitanteByCpf(WebRequest request) throws NegocioException {
		VisitanteDTO retorno = visitanteService.findVisitanteByCpf(request.getParameterMap());
		return retorno != null ? new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.NO_CONTENT);
	}

	@PostMapping
	public ResponseEntity<VisitanteDTO> inserir(@Valid @RequestBody VisitanteDTO visitanteDTO) throws Exception {
		VisitanteDTO retorno = visitanteService.salvar(visitanteDTO);
		if (retorno != null) {
			if (visitanteDTO.getEntrada() != null) {
				return new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.CREATED);
			} else if (visitanteDTO.getRejeicaoEntradaDTO() != null) {
				return new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.OK);
			}
		}
		return new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.BAD_REQUEST);
	}

	@PutMapping
	public ResponseEntity<VisitanteDTO> alterar(@Valid @RequestBody VisitanteDTO visitanteDTO) throws NegocioException {
		VisitanteDTO retorno = visitanteService.alterar(visitanteDTO);
		return retorno != null ? new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.CREATED)
				: new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.BAD_REQUEST);
	}

	@GetMapping("/buscarVisitantePorID")
	public ResponseEntity<VisitanteDTO> buscarVisitantePorID(WebRequest request) throws NegocioException {
		VisitanteDTO retorno = visitanteService.buscarVisitantePorID(request.getParameterMap());
		return retorno != null ? new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<VisitanteDTO>(retorno, HttpStatus.NO_CONTENT);
	}

}