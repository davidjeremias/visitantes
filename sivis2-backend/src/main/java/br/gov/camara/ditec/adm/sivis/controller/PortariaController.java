package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;
import br.gov.camara.ditec.adm.sivis.service.PortariaService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/portaria")
@Api(value = "API REST Portaria - Sivis-Backend")
public class PortariaController {
	
	@Autowired
	private PortariaService service;

	@GetMapping
	public ResponseEntity<List<Portaria>> findAllPortarias(){
		List<Portaria> retorno = service.findAllPortarias();
		return !retorno.isEmpty() ? new ResponseEntity<List<Portaria>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<Portaria>>(retorno, HttpStatus.NO_CONTENT);
	}
}
