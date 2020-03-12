package br.gov.camara.ditec.adm.sivis.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.service.GabineteService;
import br.gov.camara.ditec.adm.sivis.service.dto.GabineteDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/gabinete")
@Api(value = "API REST Gabinete - Sivis-Backend")
public class GabineteController extends BaseServico{

	@Autowired
	private GabineteService service;
	
	@GetMapping
	public ResponseEntity<List<GabineteDTO>> findGabinete() throws IOException{
		List<GabineteDTO> retorno = service.findGabinete();
		return !retorno.isEmpty() && retorno != null ? new ResponseEntity<List<GabineteDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<GabineteDTO>>(HttpStatus.NO_CONTENT);
	}
}
