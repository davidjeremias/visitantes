package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.Destino;
import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class EntradaDTO implements Serializable {

	private static final long serialVersionUID = 7488565368559992863L;

	private Integer id;

	@NotNull
	@NotBlank
	private LocalDateTime dataHoraVisita;

	@NotNull
	@NotBlank
	private String hostname;

	@NotNull
	@NotBlank
	private String pontoCadastrador;

	@NotBlank
	private String pontoCamara;

	private VisitanteDTO visitanteDTO;

	@NotNull
	@NotBlank
	private Portaria portaria;
	
	private Integer idGabinete;

	private Destino destino;

	private String pontoAutorizador;

	private Boolean inexistenciaDocumento;

	private Boolean existeRestricao;

	private Integer idRestricaoEntrada;
	
	private GabineteDTO gabineteDTO;

	@Tolerate
	public EntradaDTO() {
		super();
	}

}