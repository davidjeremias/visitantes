package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import br.gov.camara.ditec.adm.sivis.repository.model.Estado;
import br.gov.camara.ditec.adm.sivis.repository.model.Origem;
import br.gov.camara.ditec.adm.sivis.repository.model.Pais;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoDocumento;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class DocumentoDTO implements Serializable{

	private static final long serialVersionUID = -1051447735418869509L;

	private Integer id;
	
	private Origem origemDocumento;
	
	private Pais pais;
	
	private TipoDocumento tipoDocumento;
	
	private String numero;
	
	private String cpf;
	
	private LocalDate dataExpedicao;
	
	private LocalDate dataVencimento;
	
	private String orgaoExpeditor;
	
	private Estado estadoEmissao;
	
	private String conselho;
	
	private LocalDateTime dataCadastro;
	
	@NotBlank
	@NotNull
	private Boolean isPrincipal;
	
	private String pontoCadastrador;
	
	private String fotoDocumentoFrente;
	
	private String fotoDocumentoVerso;
	
	@Tolerate
	public DocumentoDTO() {
		super();
	}
}
