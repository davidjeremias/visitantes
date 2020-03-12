package br.gov.camara.ditec.adm.sivis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.FotoRestricaoEntrada;

@Eager
public interface FotoRestricaoEntradaRepository extends JpaRepository<FotoRestricaoEntrada, Integer>{

	@Query("SELECT f FROM FotoRestricaoEntrada f WHERE f.restricaoEntrada.id = :idRestricaoEntrada")
	FotoRestricaoEntrada buscarFotoRestricaoEntradaID(@Param("idRestricaoEntrada")  Integer idRestricaoEntrada);

}
