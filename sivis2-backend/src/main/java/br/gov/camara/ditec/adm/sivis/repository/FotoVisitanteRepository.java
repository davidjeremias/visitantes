package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.FotoVisitante;

@Eager
public interface FotoVisitanteRepository extends JpaRepository<FotoVisitante, Integer>{
	
	@Query("SELECT f FROM FotoVisitante f WHERE f.visitante.id = :idVisitante")
	List<FotoVisitante> findByIdVisitante(@Param("idVisitante") Integer idVisitante);
	
	@Query("SELECT f FROM FotoVisitante f WHERE f.visitante.id = :idVisitante AND f.dataFoto = "
			+ "(SELECT max(ft.dataFoto) FROM FotoVisitante ft WHERE ft.visitante.id = :idVisitante) ")
	FotoVisitante buscarFotoMaisRecente(@Param("idVisitante") Integer idVisitante);
}
