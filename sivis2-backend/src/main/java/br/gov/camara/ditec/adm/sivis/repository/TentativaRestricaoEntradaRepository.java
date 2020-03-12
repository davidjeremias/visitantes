package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.TentativaEntradaRestricao;

@Eager
public interface TentativaRestricaoEntradaRepository extends JpaRepository<TentativaEntradaRestricao, Integer>{

	
	@Query("SELECT ter FROM TentativaEntradaRestricao ter "
			+ " LEFT JOIN ter.rejeicaoEntrada rejeicao "
			+ " LEFT JOIN ter.entrada entrada "
			+ " where ter.restricaoEntrada.id = :id "
			+ " AND (:dataInicio IS NULL OR (ter.dataTentativaRestricao BETWEEN :dataInicio AND :dataFim )) "
			+ " ORDER BY ter.dataTentativaRestricao DESC ")
	List<TentativaEntradaRestricao> buscaEntradarRestricaoPorRegistroEntradaId(@Param("id") Integer id, LocalDateTime dataInicio, LocalDateTime dataFim);
	
	@Query("SELECT ter FROM TentativaEntradaRestricao ter "
			+ " LEFT JOIN ter.rejeicaoEntrada rejeicao "
			+ " LEFT JOIN ter.entrada entrada "
			+ " where ter.restricaoEntrada.id = :id "
			//+ " AND (:dataInicio IS NULL OR (ter.dataTentativaRestricao BETWEEN :dataInicio AND :dataFim )) "
			+ " ORDER BY ter.dataTentativaRestricao DESC ")
	List<TentativaEntradaRestricao> buscaEntradarRestricaoPorRegistroEntradaId(@Param("id") Integer id);
	
	@Query("SELECT count(*) FROM TentativaEntradaRestricao ter "
			+ " JOIN ter.restricaoEntrada re "
			+ " where re.id = :id ")
	Integer buscarQuantidadeTentativasEntrada(@Param("id") Integer id);

}
