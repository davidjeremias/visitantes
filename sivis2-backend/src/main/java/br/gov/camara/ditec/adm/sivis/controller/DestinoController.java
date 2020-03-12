package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.service.DestinoService;
import br.gov.camara.ditec.adm.sivis.service.dto.DestinoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/destinos")
@Api(value = "API REST Destino - Sivis-Backend")
public class DestinoController extends BaseServico{

	@Autowired
	private DestinoService service;
	
	@GetMapping
	public ResponseEntity<List<DestinoDTO>> findAllDestinoshabilitados(){
		List<DestinoDTO> listaRetorno = service.findAllDestinos();
		return listaRetorno.isEmpty() ? new ResponseEntity<List<DestinoDTO>>(listaRetorno, HttpStatus.NO_CONTENT)
				: new ResponseEntity<List<DestinoDTO>>(listaRetorno, HttpStatus.OK);
	}
	
}
