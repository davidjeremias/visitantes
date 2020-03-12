package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import br.gov.camara.ditec.sisivs.converter.PeriodoConverter;
import br.gov.camara.ditec.sisivs.converter.SituacaoConverter;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Agendamento")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class Agendamento extends Entidade{

	private static final long serialVersionUID = 3116077927166154830L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_agendamento")
	private Integer id;
	
	@Column(name = "des_agendamento")
	private String descricaoAgendamento;

	@Column(name = "ide_parlamentar", nullable = false)
	private Integer idParlamentar;
	
	@Column(name = "nom_patrocionador")
	private String nomePatrocinador;
	
	@Column(name = "nom_local")
	private String local;
	
	@Column(name = "dat_agendamento", nullable = false)
	private LocalDate dataAgendamento;
	
	@Column(name = "cod_periodo")
	@Convert(converter = PeriodoConverter.class)
	private PeriodoEnum periodo;
	
	@Column(name = "cod_ponto_cadastrador")
	private String pontoCadastrador;
	
	@Column(name = "ind_cancelado")
	@Convert(converter = SituacaoConverter.class)
	private SituacaoEnum  situacao;
	
	@Column(name = "dat_cadastramento")
	private LocalDateTime dataCadastro;
	
	@Tolerate
	public Agendamento() {
		super();
	}
}
