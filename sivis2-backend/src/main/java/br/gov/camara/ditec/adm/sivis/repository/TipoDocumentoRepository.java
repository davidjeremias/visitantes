package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.TipoDocumento;

@Eager
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Integer>{

	@Query("SELECT t FROM TipoDocumento t WHERE t.origem.descOrigem = :descOrigem")
	List<TipoDocumento> findAllTipoDocumentoByOrigem(@Param("descOrigem") String descOrigem);
}
