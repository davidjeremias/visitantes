package br.gov.camara.ditec.adm.sivis.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import com.google.zxing.WriterException;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.service.MensagemService;
import br.gov.camara.ditec.adm.sivis.service.dto.MensagemConvidadoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/mensagem")
@Api(value = "API REST Mensagem - Sivis-Backend")
public class MensagemController extends BaseServico{

	@Autowired
	private MensagemService service;
	
	@PostMapping
	public ResponseEntity<List<MensagemConvidadoDTO>> sendEmailConfirmacao(@RequestBody MensagemConvidadoDTO mensagemConvidadoDTO) throws IOException, WriterException{
		List<MensagemConvidadoDTO> retorno = service.sendEmailCamara(mensagemConvidadoDTO);
		return retorno != null && !retorno.isEmpty() ? new ResponseEntity<List<MensagemConvidadoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<List<MensagemConvidadoDTO>>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping
	public ResponseEntity<List<MensagemConvidadoDTO>> buscaPorParametros(WebRequest request){
		List<MensagemConvidadoDTO> retorno = service.buscaPorParametros(request.getParameterMap());
		return !retorno.isEmpty() && retorno != null ? new ResponseEntity<List<MensagemConvidadoDTO>>(retorno, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
