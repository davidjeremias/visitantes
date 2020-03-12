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
import br.gov.camara.ditec.adm.sivis.service.DocumentoService;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/documento")
@Api(value = "API REST Documento - Sivis-Backend")
public class DocumentoController extends BaseServico{

	@Autowired
	private DocumentoService service;
	
	@GetMapping
	public ResponseEntity<List<DocumentoDTO>> findDocumentoByIdVisitante(WebRequest request){
		List<DocumentoDTO> ListaRetorno = service.findDocumentoByIdVisitante(request.getParameterMap());
		return !ListaRetorno.isEmpty() ? new ResponseEntity<List<DocumentoDTO>>(ListaRetorno, HttpStatus.OK)
				: new ResponseEntity<List<DocumentoDTO>>(ListaRetorno, HttpStatus.NO_CONTENT);
	}
}
