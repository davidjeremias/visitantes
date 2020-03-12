package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.Agendamento;
import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;

@Repository
public interface AgendamentoCustomRepository {

	PageImpl<Agendamento> buscarPorFiltro(LocalDate dataInicial, LocalDate dataFinal, PeriodoEnum periodo,
			SituacaoEnum situacao, String descricao, Integer idParlamentar);

	ConvidadoDTO verificarSituacaoConvidado(String cpf, Integer agendamentoID, Integer idParlamentar);

	ConvidadoDTO buscarConvidadoParaAlterar(Integer convidadoID, Integer agendaID, Integer idParlamentar);

	List<Agendamento> findAgendamentoByParam(String param, String numero, LocalDate dataHoje);

	AgendamentoConvidado buscarAgendamentoConvidado(Integer id, Integer idAgendamento);

}
