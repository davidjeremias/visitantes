package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;

@Eager
public interface AgendamentoConvidadoRepository extends JpaRepository<AgendamentoConvidado, Integer>{

	@Query(value = "SELECT COUNT(*) FROM Entrada ent WHERE ent.agendamento.id = :id AND ent.visitante.id is not null")
	Integer verificarConvidadoEntrada(@Param("id") Integer id);

	@Query(value = "SELECT ac.id FROM AgendamentoConvidado ac WHERE agendamento.id = :agendaID AND convidado.id = :convidadoID ")
	Integer buscarRelacionamentoAgendaConvidado(@Param("convidadoID") Integer convidadoID, @Param("agendaID") Integer agendaID);
	
	@Query(value = "SELECT ac FROM AgendamentoConvidado ac "
			+ " JOIN ac.agendamento agendamento "
			+ " JOIN FETCH ac.convidado convidado "
			+ " LEFT JOIN ac.visitante visitante "
			+ " WHERE agendamento.id = :agendaID "
			+ " AND convidado.id = :convidadoID ")
	AgendamentoConvidado buscarAgendamentoConvidado(@Param("convidadoID") Integer convidadoID, @Param("agendaID") Integer agendaID);

	@Query(value = "SELECT ac FROM AgendamentoConvidado ac WHERE agendamento.id = :agendaID")
	List<AgendamentoConvidado> buscarAgendamentoConvidadoPorAgendamento(@Param("agendaID") Integer agendaID);
	
	@Transactional
    @Modifying
	@Query(value="DELETE FROM Agendamento_Convidado WHERE ide_agendamento_convidado = :id", nativeQuery=true)
	Integer apagarSomenteRelacionamentoAgendaConvidado(@Param("id") Integer id);

	@Query(value = "SELECT ac FROM AgendamentoConvidado ac "
			+ " JOIN ac.agendamento agendamento "
			+ " JOIN FETCH ac.convidado convidado "
			+ " LEFT JOIN ac.visitante visitante "
			+ " WHERE agendamento.id = :agendaID "
			+ " AND convidado.id = :convidadoID "
			//+ " AND visitante.id is null "
			+ "")
	AgendamentoConvidado buscarAgendaConvidado(@Param("convidadoID") Integer convidadoID, @Param("agendaID") Integer agendaID);
	
	@Query("SELECT ac FROM AgendamentoConvidado ac WHERE agendamento.id = :idAgendamento AND convidado.nomeConvidado = :nome")
	AgendamentoConvidado buscarAgendaConvidadoPorNome(@Param("nome") String nome, @Param("idAgendamento") Integer idAgendamento);

	@Query(value = "SELECT ac.id FROM AgendamentoConvidado ac WHERE agendamento.id = :agendaID ")
	List<Integer> buscarIdsRelacionamentoAgendamentoConvidado(@Param("agendaID") Integer agendaID);
	
	@Query(value = "SELECT COUNT(*) FROM AgendamentoConvidado WHERE agendamento.id = :id ")
	Integer buscaQuantidadeConvidadosPorAgendamento(@Param("id") Integer id);
}

