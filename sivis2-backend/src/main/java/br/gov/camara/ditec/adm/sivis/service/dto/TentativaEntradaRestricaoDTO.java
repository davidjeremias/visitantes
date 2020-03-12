package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class TentativaEntradaRestricaoDTO {

	private Integer id;
	private RestricaoEntradaDTO restricaoEntradaDTO;
	private LocalDateTime dataTentativaRestricao;
	private String nomeEquipamento;
	private String numeroEnderecoIP;
	private PortariaDTO portariaDTO;
	private EntradaDTO entradaDTO;
	private RejeicaoEntradaDTO rejeicaoEntrada;
	private String pontoAutorizador;
	private String nomeAgenteDepol;
	private String justificativa;
	private String situacao;

	@Tolerate
	public TentativaEntradaRestricaoDTO() {
		super();
	}
}
