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

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoMensagem;
import br.gov.camara.ditec.adm.sivis.service.TipoMensagemService;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/tipoMensagem")
@Api(value = "API REST Tipo Mensagem - Sivis-Backend")
public class TipoMensagemController extends BaseServico{

	@Autowired
	private TipoMensagemService service;
	
	@GetMapping
	public ResponseEntity<List<TipoMensagem>> findAll(){
		List<TipoMensagem> listaRetorno = service.findAll();
		return !listaRetorno.isEmpty() ? new ResponseEntity<List<TipoMensagem>>(listaRetorno, HttpStatus.OK)
				: new ResponseEntity<List<TipoMensagem>>(HttpStatus.NO_CONTENT);
	}
	
	@PostMapping
	public ResponseEntity<TipoMensagem> salvar(@Valid @RequestBody TipoMensagem tipoMensagem){
		return new ResponseEntity<TipoMensagem>(service.salvar(tipoMensagem), HttpStatus.CREATED);
	}
}
