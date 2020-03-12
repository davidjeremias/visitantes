package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDate;

import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.AutorizacaoEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class FiltroTentativaEntradaRestricaoDTO {
	
	private LocalDate restricaoDataInicial;
	private LocalDate restricaoDataFinal;
	private LocalDate eventoDataInicial;
	private LocalDate eventoDataFinal;
	private TipoRestricaoDTO tipoRestricaoDTO;
    private String numeroCPF;
    private String nome;
    private String motivo;
    private PortariaDTO portariaDTO;
    private AutorizacaoEnum autorizacao;
    

	
	@Tolerate
	public FiltroTentativaEntradaRestricaoDTO() {
		super();
	}
}
