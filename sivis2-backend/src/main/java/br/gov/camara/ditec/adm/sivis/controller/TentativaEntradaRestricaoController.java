package br.gov.camara.ditec.adm.sivis.controller;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;
import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.service.TentativaEntradaRestricaoService;
import br.gov.camara.ditec.adm.sivis.service.dto.FiltroTentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.VisitanteDTO;
import io.swagger.annotations.Api;

@RestController
@RequestMapping(value = "/tentativaEntrada")
@Api(value = "API REST Agendamento - Sivis-Backend")
public class TentativaEntradaRestricaoController extends BaseServico {

	@Autowired
	private TentativaEntradaRestricaoService service;

	@Autowired
	private HttpServletRequest request;

	@PostMapping
	public ResponseEntity<TentativaEntradaRestricaoDTO> salvar(
			@RequestBody @Valid TentativaEntradaRestricaoDTO tentativaEntradaRestricaoDTO)
			throws NegocioException, SQLException {

		String xfHeader = request.getHeader("X-Forwarded-For");
		if (xfHeader == null) {
			System.out.println(request.getRemoteAddr());
		}

		return new ResponseEntity<TentativaEntradaRestricaoDTO>(service.salvar(tentativaEntradaRestricaoDTO),
				HttpStatus.CREATED);

	}

	
}
