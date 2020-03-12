package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Foto_Restricao_Entrada")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
public class FotoRestricaoEntrada extends Entidade{/**
	 * 
	 */
	private static final long serialVersionUID = 7941370851397161499L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_foto_restricao_entrada")
	private Integer id;
	
	@Column(name = "dat_cadastro")
	private LocalDate dataFoto;
	
	@Column(name = "img_foto")
	private String imagemFoto;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ide_restricao_entrada")
	private RestricaoEntrada restricaoEntrada;
	
	@Tolerate
	public FotoRestricaoEntrada() {
		super();
	}

}
