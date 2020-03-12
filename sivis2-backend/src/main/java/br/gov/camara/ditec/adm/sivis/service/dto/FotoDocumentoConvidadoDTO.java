package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;

import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FotoDocumentoConvidadoDTO implements Serializable{

	private static final long serialVersionUID = 1941887517794272301L;

	private Integer id;
	
	@NotNull
	private String fotoDocumentoFrente;
	
	private String fotoDocumentoVerso;
	
	//private DocumentoConvidadoDTO documentoConvidadoDTO;
	
	@Tolerate
	public FotoDocumentoConvidadoDTO() {
		super();
	}
}
