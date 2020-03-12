package br.gov.camara.ditec.adm.sivis.repository.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class AccessTokenResponse {

	private String access_token;
	private String token_type;
	private String refresh_token;
	private Long expires_in;
	private String scope;
	private String jti;
}
