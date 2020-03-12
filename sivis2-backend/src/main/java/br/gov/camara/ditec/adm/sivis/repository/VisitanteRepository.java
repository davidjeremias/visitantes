package br.gov.camara.ditec.adm.sivis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;

@Eager
public interface VisitanteRepository extends JpaRepository<Visitante, Integer> {

	Visitante findByCpf(String cpf);

	@Query("SELECT DISTINCT v FROM Visitante v INNER JOIN Documento d ON v.id = d.visitante WHERE v.id = :idVisitante ")
	Visitante buscarVisitantePorID(@Param("idVisitante") Integer idVisitante);
	
	@Query("SELECT DISTINCT v FROM Visitante v INNER JOIN AgendamentoConvidado ac ON ac.visitante.id = v.id WHERE ac.agendamento.id = :idAgendamento AND (v.nomeVisitante = :param OR v.cpf = :param)")
	Visitante buscaVisitanteAgendamentoPorNome(@Param("param") String param, @Param("idAgendamento") Integer idAgendamento);
}
