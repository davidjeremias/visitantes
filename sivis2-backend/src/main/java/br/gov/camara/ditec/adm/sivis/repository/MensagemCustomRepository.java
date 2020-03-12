package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.MensagemConvidado;

@Repository
public interface MensagemCustomRepository {

	List<MensagemConvidado> buscaPorParametros(String nome, LocalDateTime dataInicio, LocalDateTime dataFim, Integer idTipoMensagem, Integer idAgendamendoConvidado);
}
