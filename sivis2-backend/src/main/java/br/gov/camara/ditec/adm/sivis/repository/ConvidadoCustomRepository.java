package br.gov.camara.ditec.adm.sivis.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;

@Repository
public interface ConvidadoCustomRepository {
	List<Convidado> buscaConvidadosPorParametros(String param, Integer idAgendamento);
}
