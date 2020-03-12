package br.gov.camara.ditec.adm.sivis.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.service.RejeicaoEntradaService;
import br.gov.camara.ditec.adm.sivis.service.dto.RejeicaoEntradaDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/rejeicao")
@Api(value = "API REST Agendamento - Sivis-Backend")
public class RejeicaoEntradaController extends BaseServico {

	@Autowired
	private RejeicaoEntradaService service;
	
	@GetMapping("/listarEntradasRejeitadas")
	public ResponseEntity<List<RejeicaoEntradaDTO>> buscarEntradasRejeitasPorRestricaoID(WebRequest request) {
		List<RejeicaoEntradaDTO> retorno = service.buscarEntradasRejeitasPorRestricaoID(request.getParameterMap());
		return retorno != null ? new ResponseEntity<List<RejeicaoEntradaDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);

	}

	

}
