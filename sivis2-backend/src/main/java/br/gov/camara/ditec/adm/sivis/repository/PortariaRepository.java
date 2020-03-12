package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;

import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;

@Eager
public interface PortariaRepository extends JpaRepository<Portaria, Integer> {
	
	@Query("SELECT p FROM Portaria p WHERE p.isHabilitado = true ORDER BY p.descricaoPortaria ASC")
	List<Portaria> findAllPortarias();
}
