package br.gov.camara.ditec.adm.sivis.controller;

import java.io.IOException;
import java.util.List;

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
import br.gov.camara.ditec.adm.sivis.service.EntradaService;
import br.gov.camara.ditec.adm.sivis.service.dto.EntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroPesquisarVisitanteEntradaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.ResultadoPesquisaVisitanteEntradaDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/entrada")
@Api(value = "API REST Entrada - Sivis-Backend")
public class EntradaController extends BaseServico {

	@Autowired
	private EntradaService entradaService;
	
	@GetMapping("/buscaPorFiltros")
	public ResponseEntity<Page<EntradaDTO>> findAllFilter(WebRequest request) throws NegocioException, IOException {
		Page<EntradaDTO> retorno = entradaService.findAllByFilter(request.getParameterMap());
		return !retorno.getContent().isEmpty() ? new ResponseEntity<Page<EntradaDTO>>(retorno, HttpStatus.OK)
				:new ResponseEntity<Page<EntradaDTO>>(retorno, HttpStatus.NO_CONTENT);
	}
	
	@PostMapping("/pesquisarVisitantesEntradas")
	public ResponseEntity<List<ResultadoPesquisaVisitanteEntradaDTO>> pesquisarVisitantesEntradas(@RequestBody FiltroPesquisarVisitanteEntradaDTO filtroPesquisarVisitanteEntradaDTO) throws NegocioException{
		List<ResultadoPesquisaVisitanteEntradaDTO> retorno = entradaService.pesquisarVisitantesEntradas(filtroPesquisarVisitanteEntradaDTO);
		
		return !retorno.isEmpty() ? new ResponseEntity<List<ResultadoPesquisaVisitanteEntradaDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<ResultadoPesquisaVisitanteEntradaDTO>>(retorno, HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/buscarEntradaVisitanteID")
	public ResponseEntity<List<EntradaDTO>> buscarEntradaVisitanteID(WebRequest request) throws NegocioException, IOException{
		List<EntradaDTO> retorno = entradaService.buscarEntradaVisitanteID(request.getParameterMap());
		return retorno != null ? new ResponseEntity<List<EntradaDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);
		
	}
	
	@GetMapping("/buscarEntradaID")
	public ResponseEntity<EntradaDTO> buscarEntradaID(WebRequest request){
		EntradaDTO retorno = entradaService.buscarEntradaID(request.getParameterMap());
		return retorno != null ? new ResponseEntity<EntradaDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);
		
	}
	
	@PostMapping("/alterarEntrada")
	public ResponseEntity<EntradaDTO> alterarEntrada(@RequestBody EntradaDTO entradaDTO){
		EntradaDTO retorno = entradaService.alterarEntrada(entradaDTO);
		return retorno != null ? new ResponseEntity<EntradaDTO>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);
		
	}
	
}