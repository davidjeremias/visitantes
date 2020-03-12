package br.gov.camara.ditec.adm.sivis.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.keycloak.OAuth2Constants;
import org.keycloak.representations.AccessTokenResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.service.dto.ContextoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.LoginDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.LotacaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PerfilDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.UsuarioDTO;
import br.gov.camara.ditec.adm.sivis.util.SecurityUtil;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Service
public class AuthenticationService {
	
	private static final String ENDPOINT = "/autenticacao/sistema/";
	
	private static String USERNAME = "username";
	
	private static String PASSWORD = "password";
	
	@Value("${spring.urlIntegraIdeaHom}")
	private String urlIntegraIdea;
	
	@Value("${spring.tokenSivisHom}")
	private String token;
   
	@Value("${keycloak.realm}")
	String realm;
	
    @Value("${keycloak.resource}")
    String clientId;
   
    @Value("${keycloak.credentials.secret}")
    String clientSecret;

    @Value("${keycloak.auth-server-url}")
    String serverUrl;
    
    @Value("${config.keycloak.url-refresh-token}")
    String serverUrlToken;
	
	@Autowired
	RestTemplate restTemplate;
	
	@Autowired
	private AuthorizationService auth;
	
	private Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
	
	public UsuarioDTO logon(LoginDTO loginDTO) throws NegocioException {		
		ResponseEntity<UsuarioDTO> response = null;

		try {
			response = validarUsuarioIDEAN(loginDTO);
			if(response.getBody() != null) {
				response.getBody().setFuncionalidades(auth.findFuncionalidades(loginDTO.getPonto(), loginDTO.getSigla()));

				PerfilDTO perfil = auth.findPerfilPeloGrupo(response.getBody().getGrupos());
				
				response.getBody().setGeral(true);
				response.getBody().setContexto(false);
				List<ContextoDTO> listaContextos = auth.findContextos(loginDTO.getPonto(), loginDTO.getSigla());
				response.getBody().setPerfil(perfil);
				
				if(!listaContextos.isEmpty()) {
					LotacaoDTO lotacao = auth.findLotacao(loginDTO.getPonto());
					
					response.getBody().setLotacao(lotacao);
					response.getBody().setGeral(false);
					response.getBody().setContexto(true);
					
					List<String> temp = new ArrayList<>();
					listaContextos.forEach(contexto -> {
						contexto.getFuncionaldades().forEach(funcionalidade -> {
							temp.add(funcionalidade);
						});
					});
					response.getBody().setFuncionalidades(temp);
				}
			}
		} catch (HttpStatusCodeException e) {
			return new ResponseEntity<UsuarioDTO>(HttpStatus.NO_CONTENT).getBody();
		}
		
		return response.getBody();
	}

	private ResponseEntity<UsuarioDTO> validarUsuarioIDEAN(LoginDTO loginDTO) {
		ResponseEntity<UsuarioDTO> response = null;
		try {
			response = restTemplate.exchange(
					urlIntegraIdea+ENDPOINT+loginDTO.getSigla(),
					HttpMethod.GET,
					new HttpEntity<Object>(SecurityUtil.createHeadersSecurityToken(token, loginDTO.getPonto(), loginDTO.getSenha())),
					UsuarioDTO.class);
			AccessTokenResponse accessToken = autenticacaoKeycloak(loginDTO);
			response.getBody().setAccessTokenResponse(accessToken);
		} catch (Exception e) {
			response = new ResponseEntity<UsuarioDTO>(HttpStatus.NO_CONTENT);
		}
		return response;
	}

	private AccessTokenResponse autenticacaoKeycloak(LoginDTO loginDTO) throws NegocioException {
		AccessTokenResponse accessToken =  getNewAccessTokenClientPassword(
				StringUtil.converterBase64ToString(loginDTO.getPonto()), 
				StringUtil.converterBase64ToString(loginDTO.getSenha()));
		if(accessToken == null) {
			throw new NegocioException("Usuário não authenticado");
		}
		return accessToken;
	}

	public UsuarioDTO verificarUsuarioAgenteAutorizador(@Valid LoginDTO loginDTO) throws NegocioException {
		UsuarioDTO usuarioDTO = logon(loginDTO);
		PerfilDTO perfil = auth.findPerfilPeloGrupo(usuarioDTO.getGrupos());
		usuarioDTO.setPerfil(perfil);
		
		return usuarioDTO;
	}
	
	public AccessTokenResponse getNewAccessTokenClientPassword(String ponto, String senha) throws NegocioException {
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
	    headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
	    headers.setBasicAuth(clientId, clientSecret);
        
	    final MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
	    body.set(OAuth2Constants.GRANT_TYPE, OAuth2Constants.PASSWORD);
	    body.set(OAuth2Constants.CLIENT_ID, clientId);
	    body.set(USERNAME, ponto);
	    body.set(PASSWORD, senha);
	    
	    AccessTokenResponse accessTokenResponse = null;
	    try {
	    	ResponseEntity<AccessTokenResponse> response = restTemplate.postForEntity(serverUrlToken, new HttpEntity<>(body, headers), AccessTokenResponse.class);
	    	if(response != null) {
	    		accessTokenResponse = response.getBody();
	    	}
		} catch (Exception e) {
			throw new NegocioException("Falha na requisção do token "+e.getMessage());
		}
	    return accessTokenResponse;
	}
	
	public AccessTokenResponse getNewAccessTokenRefreshToken(String refreshToken) {
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
	    headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
	    headers.setBasicAuth(clientId, clientSecret);
        
	    final MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
	    body.set(OAuth2Constants.GRANT_TYPE, OAuth2Constants.REFRESH_TOKEN);
	    body.set(OAuth2Constants.REFRESH_TOKEN, refreshToken);
	    
	    AccessTokenResponse accessTokenResponse = null;
	    try {
	    	ResponseEntity<AccessTokenResponse> response = restTemplate.postForEntity(serverUrlToken, new HttpEntity<>(body, headers), AccessTokenResponse.class);
	    	logger.info("accessToken =: "+ response.getBody().getToken());
	    	if(response != null) {
	    		accessTokenResponse = response.getBody();
	    	}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	    return accessTokenResponse;
	}
}
