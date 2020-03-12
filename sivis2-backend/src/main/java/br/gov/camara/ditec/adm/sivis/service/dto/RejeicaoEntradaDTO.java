package br.gov.camara.ditec.adm.sivis.service.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Getter
@Setter
@Builder
public class RejeicaoEntradaDTO {

	private Integer id;
	private LocalDateTime dataRejeicao;
	private String pontoCadastrador;
	private String pontoCamara;
	private VisitanteDTO visitanteDTO;
	private PortariaDTO portariaDTO;
	private DestinoDTO destinoDTO;
	private Boolean inexistenciaDocumento;
	private String motivo;
	private ConvidadoDTO convidadoDTO;
	private String nomeEquipamento;
	private String numeroEnderecoIP;

	private String pontoAutorizador;
	private Boolean existeRestricao;
	private Integer idRestricaoEntrada;

	@Tolerate
	public RejeicaoEntradaDTO() {
		super();
	}
}
