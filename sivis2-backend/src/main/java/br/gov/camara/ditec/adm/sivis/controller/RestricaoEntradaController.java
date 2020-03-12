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

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoRestricao;
import br.gov.camara.ditec.adm.sivis.service.RestricaoEntradaService;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroRestricaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroTentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.RestricaoEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TentativaEntradaRestricaoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/restricao")
@Api(value = "API REST Agendamento - Sivis-Backend")
public class RestricaoEntradaController extends BaseServico {

	@Autowired
	private RestricaoEntradaService service;

	@GetMapping("/listarTipoRestricao")
	public ResponseEntity<List<TipoRestricao>> listarTiposRestricao() {
		List<TipoRestricao> retorno = service.buscarTiposRestricao();
		return !retorno.isEmpty() ? new ResponseEntity<List<TipoRestricao>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<TipoRestricao>>(retorno, HttpStatus.NO_CONTENT);
	}

	@PostMapping
	public ResponseEntity<RestricaoEntradaDTO> salvar(@Valid @RequestBody RestricaoEntradaDTO restricaoEntradaDTO)
			throws NegocioException, SQLException {
		RestricaoEntradaDTO retorno = new RestricaoEntradaDTO();
		if (service.verificarRegras(restricaoEntradaDTO)) {
			retorno = service.salvar(restricaoEntradaDTO);
			if (restricaoEntradaDTO.getId() != null) {
				return new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.OK);
			} else {
				return new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.CREATED);
			}
		} else {
			return new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.NO_CONTENT);
		}

	}

	@PostMapping("/buscaPorFiltro")
	public ResponseEntity<Page<RestricaoEntradaDTO>> buscarPorFiltro(
			@RequestBody FiltroRestricaoEntradaDTO filtroRestricaoEntradaDTO) throws NegocioException {
		Page<RestricaoEntradaDTO> retorno = service.buscarPorFiltro(filtroRestricaoEntradaDTO);
		return !retorno.getContent().isEmpty() ? new ResponseEntity<Page<RestricaoEntradaDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<Page<RestricaoEntradaDTO>>(retorno, HttpStatus.NO_CONTENT);
	}

	@GetMapping("/buscaPorId")
	public ResponseEntity<RestricaoEntradaDTO> buscaPorId(WebRequest request) {
		RestricaoEntradaDTO retorno = service.buscaPorId(request.getParameterMap());
		return retorno != null ? new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.NO_CONTENT);
	}

	@GetMapping("/listarEntradasRestricao")
	public ResponseEntity<List<TentativaEntradaRestricaoDTO>> buscaEntradarRestricaoPorRegistroEntradaId(
			WebRequest request) {

		List<TentativaEntradaRestricaoDTO> retorno = service.buscaEntradarRestricaoPorRegistroEntradaId(request.getParameterMap());

		return retorno != null ? new ResponseEntity<List<TentativaEntradaRestricaoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<TentativaEntradaRestricaoDTO>>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/excluirRestricaoEntrada")
	public ResponseEntity<Integer> excluirRestricaoEntrada(WebRequest request) {

		boolean retorno = service.excluirRestricaoEntrada(request.getParameterMap());
		if (!retorno) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/verificarRestricaoEntradaVisitante")
	public ResponseEntity<RestricaoEntradaDTO> verificarRestricaoEntradaVisitantePorCPF(WebRequest request) {
		RestricaoEntradaDTO retorno = service.verificarRestricaoEntradaVisitantePorCPF(request.getParameterMap());
		return retorno != null ? new ResponseEntity<RestricaoEntradaDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);

	}

	@GetMapping("/buscarRestricaoEntradaVisitanteID")
	public ResponseEntity<List<RestricaoEntradaDTO>> buscarRestricaoEntradaVisitanteID(WebRequest request) {
		List<RestricaoEntradaDTO> retorno = service.buscarRestricaoEntradaVisitanteID(request.getParameterMap());
		return retorno != null ? new ResponseEntity<List<RestricaoEntradaDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);

	}
	
	@PostMapping("/buscarRestricaoEntradaTentativas")
	public ResponseEntity<Page<RestricaoEntradaDTO>> buscarRestricaoEntradaTentativas(@RequestBody FiltroTentativaEntradaRestricaoDTO filtroTentativaEntradaRestricaoDTO) throws NegocioException, SQLException {

		Page<RestricaoEntradaDTO>  retorno = service.buscarRestricaoEntradaTentativas(filtroTentativaEntradaRestricaoDTO);
		
		return retorno.getContent().size() > 0 ? new ResponseEntity<Page<RestricaoEntradaDTO>> (retorno, HttpStatus.OK)
				: new ResponseEntity<Page<RestricaoEntradaDTO>> ( HttpStatus.NO_CONTENT);

	}

}
