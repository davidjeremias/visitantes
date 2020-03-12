package br.gov.camara.ditec.adm.sivis.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.gov.camara.ditec.adm.sivis.service.dto.GabineteDTO;

@Service
public class GabineteService {

	private static final String SEPARADOR_LABEL = " - ";
	private static final String ANEXO = "Anexo: ";
	private static final String ANDAR = " Andar: ";
	private static final String GABINETE = " Gabinete: ";
	private static final String DEFAULT = "Ed. Principal Gabinete ";

	@Value("${spring.urlGabinete}")
	private String urlGabinete;

	@Autowired
	RestTemplate rest;

	public List<GabineteDTO> findGabinete() throws IOException {

		ResponseErrorHandler myErrorHandler = new DefaultResponseErrorHandler();
		rest.setErrorHandler(myErrorHandler);
		ResponseEntity<String> str = rest.getForEntity(urlGabinete, String.class);

		ObjectMapper mapper = new ObjectMapper();
		JsonNode jsonNodes = mapper.readTree(str.getBody());

		List<GabineteDTO> listaRetorno = new ArrayList<GabineteDTO>();

		if (jsonNodes == null) {
			return null;
		}

		jsonNodes.forEach(
				jsonNode -> listaRetorno.add(new GabineteDTO(jsonNode.path("ideCadastro").asInt(), jsonNode.path("nomeParlamentar").asText(), jsonNode.path("anexo").asText(),
						jsonNode.path("andar").asText(), jsonNode.path("gabinete").asText(), jsonNode.path("value").asText(), jsonNode.path("label").asText())));

		for (GabineteDTO dto : listaRetorno) {

			if (dto.getAnexo() != null && dto.getAndar() != null) {
				dto.setLabel(dto.getNomeParlamentar() + SEPARADOR_LABEL + ANEXO + dto.getAnexo() + ANDAR + dto.getAndar() + GABINETE + dto.getGabinete());
			} else {
				dto.setLabel(dto.getNomeParlamentar() + SEPARADOR_LABEL + DEFAULT + dto.getGabinete());
			}
			dto.setValue(dto.getIdeCadastro().toString());
		}
		return listaRetorno;
	}

}
