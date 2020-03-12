package br.gov.camara.ditec.adm.sivis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import br.gov.camara.ditec.adm.sivis.repository.model.MensagemConvidado;

@Eager
public interface MensagemRepository extends JpaRepository<MensagemConvidado, Integer>{

	@Query("SELECT COUNT(*) FROM MensagemConvidado m WHERE m.agendamento.id = :idAgendamento AND m.convidado.id = :idConvidado AND m.tipoMensagem.tipoMensagem = 'Confirmação'")
	Integer buscaQuantidadeMensagemConfirmacaoPorConvidado(@Param("idAgendamento") Integer idAgendamento, @Param("idConvidado") Integer idConvidado);
	
	@Query("SELECT COUNT(*) FROM MensagemConvidado m WHERE m.agendamento.id = :idAgendamento AND m.convidado.id = :idConvidado AND m.tipoMensagem.tipoMensagem = 'Cancelamento'")
	Integer buscaQuantidadeMensagemCancelamentoPorConvidado(@Param("idAgendamento") Integer idAgendamento, @Param("idConvidado") Integer idConvidado);
	
	@Query("SELECT COUNT(*) FROM MensagemConvidado m WHERE m.agendamento.id = :idAgendamento AND m.convidado.id = :idConvidado AND m.tipoMensagem.tipoMensagem = 'Alteração'")
	Integer buscaQuantidadeMensagemAlteracaoPorConvidado(@Param("idAgendamento") Integer idAgendamento, @Param("idConvidado") Integer idConvidado);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM Mensagem_Convidado WHERE ide_convidado = :idConvidado",nativeQuery=true)
	Integer deleteByIdConvidado(@Param("idConvidado") Integer idConvidado);
}
