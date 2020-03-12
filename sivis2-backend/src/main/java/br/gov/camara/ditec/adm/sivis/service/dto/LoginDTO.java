package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Builder
@Getter
@Setter
public class LoginDTO implements Serializable{
	
	@Tolerate
	public LoginDTO() {
		super();
	}
	
	private static final long serialVersionUID = -949634996108966827L;

	@NotBlank
	@NotNull
	private String ponto;
	@NotBlank
	@NotNull
	private String senha;
	@NotBlank
	@NotNull
	private String sigla;
}
