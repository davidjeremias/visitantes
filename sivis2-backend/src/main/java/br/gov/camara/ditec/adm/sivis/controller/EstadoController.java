package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.repository.model.Estado;
import br.gov.camara.ditec.adm.sivis.service.EstadoService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value= "/estado")
@Api(value = "API REST Estados - Sivis-Backend")
public class EstadoController extends BaseServico{

	@Autowired
	private EstadoService service;
	
	@GetMapping
	public ResponseEntity<List<Estado>> findAll(){
		List<Estado> retorno = service.findAll();
		return retorno.isEmpty() ? new ResponseEntity<List<Estado>>(retorno,HttpStatus.NO_CONTENT)
				: new ResponseEntity<List<Estado>>(retorno, HttpStatus.OK);
	}
}
