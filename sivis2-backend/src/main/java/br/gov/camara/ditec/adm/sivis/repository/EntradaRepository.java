package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Entrada;

@Eager
public interface EntradaRepository extends JpaRepository<Entrada, Integer> {
	
	@Query(value = "SELECT e FROM Entrada e WHERE e.pontoCadastrador = :ponto AND e.dataHoraVisita BETWEEN :dataInicio AND :dataFim ORDER BY e.dataHoraVisita DESC")
	PageImpl<Entrada> findAllEntradaWithPagination(Pageable pageable, @Param("ponto") String ponto, @Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);

	@Query(value = "SELECT MAX(e.dataHoraVisita) FROM Entrada e WHERE e.visitante.id= :id ")
	LocalDateTime buscarDataUltimaEntradaPorConvidadoID(@Param("id") Integer id);
	
	@Query("SELECT e FROM Entrada e WHERE e.visitante.id = :idVisitante AND e.agendamento.id = :idAgendamento")
	Entrada buscaEntradaAgendamento(@Param("idVisitante") Integer idVisitante, @Param("idAgendamento") Integer idAgendamento);

	@Query(value = "SELECT e FROM Entrada e WHERE e.visitante.id= :idVisitante ORDER BY e.dataHoraVisita DESC")
	List<Entrada> buscarEntradaVisitanteID(@Param("idVisitante") Integer idVisitante);

}
