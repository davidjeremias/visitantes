package br.gov.camara.ditec.adm.sivis.controller;

import java.sql.SQLException;
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
import br.gov.camara.ditec.adm.sivis.service.ConvidadoService;
import br.gov.camara.ditec.adm.sivis.service.dto.AgendamentoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroConfirmarConvidadoAgendadoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/convidado")
@Api(value = "API REST Convidado - Sivis-Backend")
public class ConvidadoController {

	@Autowired
	private ConvidadoService service;

	@PostMapping
	public ResponseEntity<AgendamentoDTO> salvar(@Valid @RequestBody ConvidadoDTO convidadoDTO)
			throws NegocioException, SQLException {
		AgendamentoDTO retorno = service.salvar(convidadoDTO);
		if (convidadoDTO.getId() != null) {
			return new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.OK);
		} else {
			return new ResponseEntity<AgendamentoDTO>(retorno, HttpStatus.CREATED);
		}
	}

	@GetMapping("/listarConvidados")
	public ResponseEntity<Page<ConvidadoDTO>> listarConvidados(WebRequest request) throws NegocioException {
		Page<ConvidadoDTO> retorno = service.buscarConvidadosPorAgendamentoById(request.getParameterMap());
		return !retorno.getContent().isEmpty() ? new ResponseEntity<Page<ConvidadoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<Page<ConvidadoDTO>>(HttpStatus.NO_CONTENT);
	}

	@PostMapping(path = "/listarConvidadosPorParametros", produces = "application/json")
	public ResponseEntity<List<ConvidadoDTO>> buscaConvidadosPorParametros(
			@RequestBody FiltroConfirmarConvidadoAgendadoDTO filtroConfirmarConvidadoAgendadoDTO)
			throws NegocioException {
		List<ConvidadoDTO> retorno = service.buscaConvidadosPorParametros(filtroConfirmarConvidadoAgendadoDTO);
		return retorno != null && !retorno.isEmpty() ? new ResponseEntity<List<ConvidadoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<ConvidadoDTO>>(HttpStatus.NO_CONTENT);
	}

	@PostMapping(path = "/listarConvidadosRecepcao", produces = "application/json")
	public ResponseEntity<List<ConvidadoDTO>> listarConvidadosRecepcao(
			@RequestBody FiltroConfirmarConvidadoAgendadoDTO filtroConfirmarConvidadoAgendadoDTO)
			throws NegocioException {
		List<ConvidadoDTO> retorno = service.listarConvidadosRecepcao(filtroConfirmarConvidadoAgendadoDTO);
		return retorno != null && !retorno.isEmpty() ? new ResponseEntity<List<ConvidadoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<ConvidadoDTO>>(HttpStatus.NO_CONTENT);
	}



	@GetMapping("/verificarConvidadoPorCPF")
	public ResponseEntity<ConvidadoDTO> verificarConvidadoPorCPF(WebRequest request) throws NegocioException {
		ConvidadoDTO retorno = service.verificarConvidadoPorCPF(request.getParameterMap());
		return retorno != null ? new ResponseEntity<ConvidadoDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<ConvidadoDTO>(retorno, HttpStatus.NO_CONTENT);
	}

	@GetMapping("/excluirConvidadoAgendamento")
	public ResponseEntity<String> excluirConvidadoAgendamento(WebRequest request) {
		String retorno = service.excluirConvidadoAgendamento(request.getParameterMap());
		return retorno != null ? new ResponseEntity<String>(retorno, HttpStatus.OK): new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@GetMapping("/alterarConvidadoAgendado")
	public ResponseEntity<ConvidadoDTO> alterarConvidadoAgendado(WebRequest request) throws NegocioException {
		ConvidadoDTO retorno = service.alterarConvidadoAgendado(request.getParameterMap());
		return retorno != null ? new ResponseEntity<ConvidadoDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<ConvidadoDTO>(retorno, HttpStatus.NO_CONTENT);
	}

}
