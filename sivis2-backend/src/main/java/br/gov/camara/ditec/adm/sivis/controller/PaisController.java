package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.repository.model.Pais;
import br.gov.camara.ditec.adm.sivis.service.PaisService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/paises")
@Api(value = "API REST Paises - Sivis-Backend")
public class PaisController {
	
	@Autowired
	private PaisService service;
	
	@GetMapping("/brasileiro")
	public ResponseEntity<List<Pais>> findBrasil(){
		return new ResponseEntity<List<Pais>>(service.findBrasil(), HttpStatus.OK);
	}
	
	@GetMapping("/mercosul")
	public ResponseEntity<List<Pais>> findAllMercosul(){
		return new ResponseEntity<List<Pais>>(service.findAllMercosul(), HttpStatus.OK);
	}
	
	@GetMapping("/estrangeiro")
	public ResponseEntity<List<Pais>> findAllEstrangeiro(){
		return new ResponseEntity<List<Pais>>(service.findAllEstrageiro(), HttpStatus.OK);
	}
	
	@GetMapping
	public ResponseEntity<List<Pais>> busca(){
		List<Pais> retorno = service.findAll();
		return retorno.isEmpty() ? new ResponseEntity<>(retorno, HttpStatus.NO_CONTENT)
				: new ResponseEntity<>(retorno, HttpStatus.OK);
	}
}
