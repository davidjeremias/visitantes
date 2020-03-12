package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Documento;

@Eager
public interface DocumentoRepository extends JpaRepository<Documento, Integer>{
	
	@Query("SELECT d FROM Documento d WHERE d.visitante.id = :idVisitante")
	List<Documento> findDocumentoByIdVisitante(@Param("idVisitante") Integer idVisitante);
}
