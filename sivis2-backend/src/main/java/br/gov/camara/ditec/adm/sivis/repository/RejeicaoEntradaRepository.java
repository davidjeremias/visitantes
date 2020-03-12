package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.RejeicaoEntrada;

@Eager
public interface RejeicaoEntradaRepository extends JpaRepository<RejeicaoEntrada, Integer>{

	@Query("SELECT DISTINCT rejeicao FROM TentativaEntradaRestricao ter "
			+ " LEFT JOIN ter.rejeicaoEntrada rejeicao "
			+ " LEFT JOIN ter.entrada entrada "
			+ " where ter.restricaoEntrada.id = :id " 
			)
	List<RejeicaoEntrada> buscarEntradasRejeitasPorRestricaoID(@Param("id") Integer id);



}
