package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Destino;

@Eager
public interface DestinoRepository extends JpaRepository<Destino, Integer>{
	
	@Query("FROM Destino d WHERE d.isHabilitado = 1 ORDER BY d.nomeDestino ASC")
	List<Destino> findAllDestinos();
	
	@Query("FROM Destino d WHERE d.nomeDestino = :nomeDestino")
	Destino findByNome(@Param("nomeDestino") String nomeDestino);
}
