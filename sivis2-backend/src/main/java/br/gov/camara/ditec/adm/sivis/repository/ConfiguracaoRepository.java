package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Configuracao;

@Eager
public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Integer>{

	@Query("SELECT c FROM Configuracao c WHERE c.chave = :chave")
	Configuracao buscarPorChave(@Param("chave") String chave);
	
	@Query("SELECT c FROM Configuracao c WHERE c.tipoConfiguracao.tipoConfiguracao = :tipoConfiguracao")
	List<Configuracao> buscarPorTipoConfiguracao(@Param("tipoConfiguracao") String tipoConfiguracao);
}
