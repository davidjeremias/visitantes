package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.TipoMensagem;

@Eager
public interface TipoMensagemRepository extends JpaRepository<TipoMensagem, Integer>{

	@Query("SELECT tm FROM TipoMensagem tm WHERE tm.tipoMensagem = :tipoMensagem")
	TipoMensagem findByName(@Param("tipoMensagem") String tipoMensagem);

	@Query("SELECT tm FROM TipoMensagem tm ORDER BY tm.tipoMensagem")
	List<TipoMensagem> findAll();
	
	
}
