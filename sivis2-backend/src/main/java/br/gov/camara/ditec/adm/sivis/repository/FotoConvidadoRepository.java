package br.gov.camara.ditec.adm.sivis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;

import br.gov.camara.ditec.adm.sivis.repository.model.FotoConvidado;

@Eager
public interface FotoConvidadoRepository extends JpaRepository<FotoConvidado, Integer>{

	
	@Query(value = " SELECT "
			+ " ft FROM AgendamentoConvidado ac "
			+ " Inner join ac.convidado conv "
			+ " inner join conv.fotoConvidado ft "
			+ " WHERE ac.agendamento.id = :agendaID "
			+ " AND conv.id = :convidadoID ")
	FotoConvidado buscarFotoConvidadoPorAgendamento(@Param("convidadoID") Integer convidadoID, @Param("agendaID") Integer agendaID);
	
	@Query("SELECT fc FROM FotoConvidado fc WHERE fc.convidado.id = :convidadoID")
	FotoConvidado buscarFotoConvidadoPorIdConvidado(@Param("convidadoID") Integer convidadoID);
}
