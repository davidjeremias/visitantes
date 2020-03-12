package br.gov.camara.ditec.adm.sivis.repository.model;


import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Foto_Visitante")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper=false)
public class FotoVisitante extends Entidade {

	private static final long serialVersionUID = 145450902428145027L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ide_foto_visitante")
    private Integer id;

    @Column(name = "dat_foto")
    private LocalDate dataFoto;

    @Column(name = "img_foto", unique = true, nullable = true)
    private String imagemFoto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="ide_visitante")
    private Visitante visitante;

    @Tolerate
    public FotoVisitante() {
    	super();
    }

}
