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
import br.gov.camara.ditec.adm.sivis.repository.model.Configuracao;
import br.gov.camara.ditec.adm.sivis.service.ConfiguracaoService;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/configuracao")
@Api(value = "API REST Parametro - Sivis-Backend")
public class ConfiguracaoController extends BaseServico{

	@Autowired
	private ConfiguracaoService service;
	
	@GetMapping
	public ResponseEntity<Configuracao> buscaPorChave(WebRequest request){
		Configuracao retorno = service.buscaPorChave(request.getParameterMap());
		return retorno != null ? new ResponseEntity<>(retorno, HttpStatus.OK)
				: new ResponseEntity<Configuracao>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/tipoConfiguracao")
	public ResponseEntity<List<Configuracao>> buscarPorTipoConfiguracao(WebRequest request){
		String tipoConfiguracao = RequisicaoUtil.extrairParametro(request.getParameterMap(), "tipoConfiguracao");
		List<Configuracao> listaRetorno = service.buscarPorTipoConfiguracao(tipoConfiguracao);
		return !listaRetorno.isEmpty() ? new ResponseEntity<>(listaRetorno, HttpStatus.OK)
				: new ResponseEntity<List<Configuracao>>(HttpStatus.NO_CONTENT);
	}
	
	@PostMapping
	public ResponseEntity<Configuracao> salvar(@Valid @RequestBody Configuracao configuracao){
		return new ResponseEntity<Configuracao>(service.salvar(configuracao), HttpStatus.CREATED);
	}
}
