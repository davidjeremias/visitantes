package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;

@Eager
public interface ConvidadoRepository extends JpaRepository<Convidado, Integer>{

	@Query("SELECT DISTINCT c "
			+ "From Convidado c "
			+ "Inner join AgendamentoConvidado ac ON ac.convidado.id=c.id "
			+ "WHERE ac.agendamento.id = :id order by c.nomeConvidado ")
	List<Convidado> buscarConvidadosPorAgendamentoById( @Param("id") Integer id);

	
	@Query("SELECT DISTINCT c "
			+ " FROM Convidado c "
			+ " LEFT JOIN AgendamentoConvidado ac ON ac.convidado.id=c.id "
			+ " WHERE c.cpf = :cpf AND ac.agendamento.id = :agendamentoID ")
	Convidado verificarExistenciaConvidadoAgendamento(@Param("cpf") String cpf, @Param("agendamentoID") Integer agendamentoID);

	@Query("SELECT DISTINCT c.cpf "
			+ "From Convidado c "
			+ "WHERE c.id = :id ")
	String buscarCPFConvidadoPorID(@Param("id") Integer id);

	@Query("SELECT DISTINCT c "
			+ "From Convidado c "
			+ "WHERE c.id = :id  ")
	Convidado buscarConvidadoID(@Param("id") Integer id);

	@Query("SELECT DISTINCT c "
			+ " FROM Convidado c "
			+ " LEFT JOIN AgendamentoConvidado ac ON ac.convidado.id=c.id "
			+ " WHERE c.id = :convidadoID AND ac.agendamento.id = :agendamentoID ")
	Convidado buscaConvidadoAgendamento(@Param("convidadoID") Integer convidadoID, @Param("agendamentoID") Integer agendamentoID);
	
	@Query("SELECT DISTINCT c FROM Convidado c "
			+ "INNER JOIN DocumentoConvidado dc ON c.id = dc.convidado.id "
			+ "INNER JOIN AgendamentoConvidado ac ON c.id = ac.convidado.id "
			+ "LEFT JOIN ac.visitante v "
			+ "LEFT JOIN v.documentos dv "
			+ "WHERE ac.agendamento.id = :idAgendamento AND (c.nomeConvidado = :param OR c.cpf = :param OR dc.numeroDocumento = :numero OR dv.numero = :numero)")
	Convidado buscaConvidadoAgendamentoPorNome(@Param("param") String param, @Param("numero") String numero, @Param("idAgendamento") Integer idAgendamento);
	
	@Query("SELECT c FROM Convidado c INNER JOIN MensagemConvidado m ON m.convidado.id = c.id WHERE m.id = :idMensagem")
	Convidado buscaConvidadoMensagemConvidadoPorId(@Param("idMensagem") Integer idMensagem);
}
