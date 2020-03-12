package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.repository.model.Origem;
import br.gov.camara.ditec.adm.sivis.service.OrigemService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/origem")
@Api(value = "API REST Origem - Sivis-Backend")
public class OrigemController {

	@Autowired
	private OrigemService service;
	
	@GetMapping
	public ResponseEntity<List<Origem>> findAll(){
		List<Origem> listaRetorno = service.findAll();
		return listaRetorno.isEmpty() ? new ResponseEntity<List<Origem>>(listaRetorno, HttpStatus.NO_CONTENT)
				: new ResponseEntity<List<Origem>>(listaRetorno, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<Origem> salvar(@RequestBody @Valid Origem origem){
		return new ResponseEntity<Origem>(service.salvar(origem), HttpStatus.CREATED);
	}
}
