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
import org.springframework.web.context.request.WebRequest;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoDocumento;
import br.gov.camara.ditec.adm.sivis.service.TipoDocumentoService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/tipoDocumento")
@Api(value = "API REST Tipo Documento - Sivis-Backend")
public class TipoDocumentoController extends BaseServico{

	@Autowired
	private TipoDocumentoService service;
	
	@GetMapping
	public ResponseEntity<List<TipoDocumento>> findAllTipoDocumentoByOrigem(WebRequest request){
		List<TipoDocumento> listaRetorno = service.findAllTipoDocumentoByOrigem(request.getParameterMap());
		return listaRetorno.isEmpty() ? new ResponseEntity<List<TipoDocumento>>(listaRetorno, HttpStatus.NO_CONTENT)
				: new ResponseEntity<List<TipoDocumento>>(listaRetorno, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<TipoDocumento> salvar(@RequestBody @Valid TipoDocumento tipoDocumento) {
		return new ResponseEntity<TipoDocumento>(service.salvar(tipoDocumento), HttpStatus.CREATED);
	}
}
