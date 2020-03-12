package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class ConfiguracaoEmailDTO implements Serializable{
	
	@Tolerate
	public ConfiguracaoEmailDTO() {
		super();
	}
	
	private static final long serialVersionUID = 4476855088765390825L;

	private String host;
	private Integer port;
	private String username;
	private String password;
}
