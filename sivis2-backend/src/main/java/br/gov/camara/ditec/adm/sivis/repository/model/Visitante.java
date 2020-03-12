package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Visitante")
@Builder
@Getter
@Setter
@EqualsAndHashCode(callSuper=false)
public class Visitante extends Entidade {
	
	private static final long serialVersionUID = -5952570856463948337L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_visitante")
	private Integer id;

	@Column(name = "nom_visitante", nullable = false, length = 200)
	private String nomeVisitante;
	
	@Column(name = "num_cpf", nullable = false)
	private String cpf;

	@Column(name = "des_telefone", nullable = true, length = 30)
	private String telefoneVisitante;
	
	@Column(name = "cod_ponto_cadastrador", nullable = false)
	private String pontoCadastrador;
	
	@Column(name = "dat_cadastro", nullable = false)
	private LocalDateTime dataCadastro;
	
	@OneToMany(mappedBy = "visitante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<FotoVisitante> fotosVisitante;
	
	@OneToMany(mappedBy = "visitante", fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
	private List<Documento> documentos;

	@Tolerate
	public Visitante() {
		super();
	}
}
