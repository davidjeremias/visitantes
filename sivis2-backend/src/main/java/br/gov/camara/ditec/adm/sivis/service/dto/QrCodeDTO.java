package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class QrCodeDTO implements Serializable{
	
	@Tolerate
	public QrCodeDTO() {
		super();
	}
	
	private static final long serialVersionUID = 8352538469806146520L;
	
	private Integer idConvite;

}
