package br.gov.camara.ditec.adm.sivis.repository.model;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.gov.camara.ditec.adm.sivis.repository.model.impl.Entidade;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Tolerate;

@Entity
@Table(name = "Convidado")
@Getter
@Setter
@Builder
//@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Convidado extends Entidade {

	private static final long serialVersionUID = -3724725488163456446L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ide_convidado")
	//@EqualsAndHashCode.Include
	private Integer id;

	@Column(name = "nom_convidado")
	private String nomeConvidado;

	@Column(name = "num_cpf")
	private String cpf;

	@Column(name = "des_telefone")
	private String telefone;

	@Column(name = "des_email")
	private String email;

	@Column(name = "ide_parlamentar")
	private Integer idParlamentar;

	@Column(name = "cod_ponto_cadastrador")
	private String pontoCadastrador;

	@Column(name = "dat_cadastramento")
	private LocalDateTime dataCadastro;

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "convidado", fetch = FetchType.EAGER ,optional = false)
	private DocumentoConvidado documentosConvidado;

	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "convidado", fetch = FetchType.EAGER, optional = false)
	private FotoConvidado fotoConvidado;

	@Tolerate
	public Convidado() {
		super();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Convidado other = (Convidado) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	
}
