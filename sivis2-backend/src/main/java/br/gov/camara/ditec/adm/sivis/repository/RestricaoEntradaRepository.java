package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.RejeicaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.RestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoRestricao;

@Eager
public interface RestricaoEntradaRepository extends JpaRepository<RestricaoEntrada, Integer>{

	@Query("SELECT tr FROM TipoRestricao tr WHERE tr.isHabilitado = true ORDER BY tr.nome ASC")
	List<TipoRestricao> buscarTiposRestricao();

	@Query("SELECT res FROM RestricaoEntrada res "
			+ " LEFT JOIN res.visitante vis "
			+ " JOIN res.tipoRestricao tres "
			
			+ " WHERE ((res.numCPF = :cpf) OR (vis.cpf = :cpf)) "
			+ " AND (:idTipoRestricao IS NULL OR tres.id = :idTipoRestricao) "
//			+ " AND res.dataFinalRestricao = "
//			+ " (Select MAX(re.dataFinalRestricao) "
//			+ " from RestricaoEntrada re where re.id = res.id )"
			+ "")
	List<RestricaoEntrada> buscarRestricaoPorCPF(@Param("cpf")  String numeroCPF, @Param("idTipoRestricao") Integer idTipoRestricao);

	@Query("SELECT res FROM RestricaoEntrada res WHERE res.visitante.id = :idVisitante")
	List<RestricaoEntrada> buscarRestricaoPorVisitanteID(@Param("idVisitante") Integer idVisitante);

	
	

}
