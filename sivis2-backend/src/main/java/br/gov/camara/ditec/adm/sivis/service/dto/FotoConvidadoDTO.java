package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;


@Getter
@Setter
@Builder
public class FotoConvidadoDTO implements Serializable{
	
	private static final long serialVersionUID = -7967610722286747268L;
	
	
	private Integer id;
	
	private LocalDate dataFoto;
	
	private String imagemFoto;

	private Convidado convidado;
	
	@Tolerate
	public FotoConvidadoDTO() {
		super();
	}
}
