package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Agendamento;

@Eager
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {

	@Query(value = "SELECT COUNT(*) FROM AgendamentoConvidado WHERE agendamento.id = :id")
	Integer buscarQuantidadeVisitante(@Param("id") Integer id);
	
	@Query("SELECT DISTINCT a FROM Agendamento a INNER JOIN AgendamentoConvidado ac ON a.id = ac.agendamento "
			+ "WHERE (a.dataAgendamento = :dataHoje) "
			+ "AND (a.descricaoAgendamento = :descricao OR a.local = :local OR a.nomePatrocinador = :nomePatrocinador OR ac.convidado.nomeConvidado = :nomeConvidado OR ac.convidado.documentosConvidado.numeroDocumento = :numeroDocumento OR a.id = :idAgendamento)")
	List<Agendamento> findAgendamentoByParam(
			@Param("descricao") String descricao, 
			@Param("local") String local, 
			@Param("nomePatrocinador") String nomePatrocinador,
			@Param("nomeConvidado") String nomeConvidado,
			@Param("numeroDocumento") String numeroDocumento,
			@Param("idAgendamento") Integer idAgendamento,
			@Param("dataHoje") LocalDate dataHoje);
	
	@Query("SELECT DISTINCT a FROM Agendamento a INNER JOIN AgendamentoConvidado ac ON a.id = ac.agendamento WHERE a.dataAgendamento = :dataHoje")	
	List<Agendamento> findAgendamentoSemParametros(@Param("dataHoje") LocalDate dataHoje);
}
