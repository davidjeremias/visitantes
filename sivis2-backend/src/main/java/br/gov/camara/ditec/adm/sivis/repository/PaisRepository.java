package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Pais;

@Eager
public interface PaisRepository extends JpaRepository<Pais, Integer>{

	@Query("SELECT p FROM Pais p WHERE p.siglaPais IN ('BR') AND p.icAtivo = '1'")
	List<Pais> findBrasil();
	
	@Query("SELECT p FROM Pais p WHERE p.siglaPais IN ('AR','PY', 'UY', 'VE') AND p.icAtivo = '1'")
	List<Pais> findAllMercosul();
	
	@Query("SELECT p FROM Pais p WHERE p.siglaPais NOT IN ('BR') AND p.icAtivo = '1'")
	List<Pais> findAllEstrageiro();
	
	@Query("SELECT p FROM Pais p WHERE p.namePais = :nomePais")
	Pais findByNomePais(@Param("nomePais") String nomePais);
}
