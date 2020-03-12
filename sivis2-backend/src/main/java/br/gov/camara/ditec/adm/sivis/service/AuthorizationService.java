package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import br.gov.camara.ditec.adm.sivis.service.dto.ContextoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.GruposDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.LotacaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PerfilDTO;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import br.gov.camara.ditec.adm.sivis.util.SecurityUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class AuthorizationService {

	private static final String ENDPOINT_FUNCIONALIDADES = "funcionalidades/sistemas";
	private static final String ENDPOINT_CONTEXTOS = "contextos/sistemas";
	private static final String ENDPOINT_LOTACAO = "/lotacao";
	private static final String ENDPOINT_PERFIL = "perfis/sistemas";
	private static final String PATH_USUARIO = "usuarios";
	private static final String PATH_CONTEXTO = "contexto";
	
	@Autowired
	RestTemplate restTemplate;
	
	@Value("${spring.urlIntegraIdeaHom}")
	private String urlIntegraIdea;
	
	@Value("${spring.urlLotacao}")
	private String urlLotacao;
	
	@Value("${spring.tokenSivisHom}")
	private String token;
	
	public List<String> findFuncionalidades(String ponto, String sistema){		
		ResponseEntity<List<String>> response = null;
		try {
			response = restTemplate.exchange(
					RequisicaoUtil.montaPathRequisicao(urlIntegraIdea, ENDPOINT_FUNCIONALIDADES, sistema, PATH_USUARIO, StringUtil.converterBase64ToString(ponto)),
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, ponto)),
					new ParameterizedTypeReference<List<String>>() {});
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<List<String>>(HttpStatus.NO_CONTENT).getBody();
		}
		return response.getBody();
	}
	
	public List<ContextoDTO> findContextos(String ponto, String sistema){		
		ResponseEntity<List<ContextoDTO>> response = null;
		try {
			response = restTemplate.exchange(
					RequisicaoUtil.montaPathRequisicao(urlIntegraIdea, ENDPOINT_CONTEXTOS, sistema, PATH_USUARIO, StringUtil.converterBase64ToString(ponto)),
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, ponto)),
					new ParameterizedTypeReference<List<ContextoDTO>>() {});
			response.getBody().forEach(contexto -> {
				contexto.setFuncionaldades(findFuncionalidadesByContexto(ponto, sistema, contexto.getId()));
			});
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<List<ContextoDTO>>(HttpStatus.NO_CONTENT).getBody();
		}
		return response.getBody();
	}
	
	public List<String> findFuncionalidadesByContexto(String ponto, String sistema, Integer IdContexto){		
		ResponseEntity<List<String>> response = null;
		try {
			response = restTemplate.exchange(
					RequisicaoUtil.montaPathRequisicao(urlIntegraIdea, ENDPOINT_FUNCIONALIDADES, sistema, PATH_USUARIO, StringUtil.converterBase64ToString(ponto), PATH_CONTEXTO, IdContexto.toString()),
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, ponto)),
					new ParameterizedTypeReference<List<String>>() {});
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<List<String>>(HttpStatus.NO_CONTENT).getBody();
		}
		return response.getBody();
	}
	
	public LotacaoDTO findLotacao(String ponto){		
		ResponseEntity<LotacaoDTO> response = null;
		try {
			response = restTemplate.exchange(
					urlLotacao+StringUtil.converterBase64ToString(ponto)+ENDPOINT_LOTACAO,
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, ponto)),
					LotacaoDTO.class);
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<LotacaoDTO>(HttpStatus.NO_CONTENT).getBody();
		}
		return response.getBody();
	}

	public PerfilDTO findPerfil(String ponto) {
		ResponseEntity<PerfilDTO> response = null;
		try {
			response = restTemplate.exchange(
					urlIntegraIdea+StringUtil.converterBase64ToString(ponto)+ENDPOINT_PERFIL,
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, ponto)),
					PerfilDTO.class);
		} catch (HttpClientErrorException e) {
			return new ResponseEntity<PerfilDTO>(HttpStatus.NO_CONTENT).getBody();
		}
		return response.getBody();
	}

	public PerfilDTO findPerfilPeloGrupo(List<GruposDTO> grupos) {
		PerfilDTO perfil = new PerfilDTO();

		if (grupos != null && grupos.size() > 0) {
			for (GruposDTO g : grupos) {
				if (g.getGrupo().equals("perfilSivisAdministrador")) {
					perfil.setPerfil("Administrador");

				} else if (g.getGrupo().equals("perfilSivisRecepcionista")) {
					perfil.setPerfil("Recepcionista");
				} else if (g.getGrupo().contains("GESTORGAB.")) {
					perfil.setPerfil("Gabinete");
				}
			}
		}
		return perfil;
	}
}
