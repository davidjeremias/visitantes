package br.gov.camara.ditec.adm.sivis.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
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
public class DocumentoConvidadoDTO implements Serializable{

	private static final long serialVersionUID = 1345800913669023997L;

	private Integer id;
	
	private Origem origemDocumento;
	
	private TipoDocumento tipoDocumento;
	
	private Pais nomePais;
	
	private String numeroDocumento;
	
	private LocalDate dataExpedicao;
	
	private LocalDate dataVencimento;
	
	private String orgaoExpeditor;
	
	private Estado estadoEmissao;
	
	private String conselho;
	
	private Boolean isPrincipal;
		
	private String pontoCadastrador;
	
	private LocalDateTime dataCadastro;
	
	private FotoDocumentoConvidadoDTO fotoDocumentoConvidadoDTO;
	
	private Convidado convidado;
	
	@Tolerate
	public DocumentoConvidadoDTO() {
		super();
	}
}
