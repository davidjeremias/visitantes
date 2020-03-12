package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.AgendamentoConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;

@Service
public class AgendamentoConvidadoService {
	
	@Autowired
	private AgendamentoConvidadoRepository repository;

	public AgendamentoConvidado salvar(AgendamentoConvidado agendamentoConvidado) {
		return repository.save(agendamentoConvidado);
	}
	
	public AgendamentoConvidado buscarAgendamentoConvidado(Integer idConvidado, Integer idAgendamento) {
		return repository.buscarAgendamentoConvidado(idConvidado, idAgendamento);
	}
	
	public List<AgendamentoConvidado> buscarAgendamentoConvidadoPorAgendamento(Integer idAgendamento) {
		return repository.buscarAgendamentoConvidadoPorAgendamento(idAgendamento);
	}
	
	public void setVisitanteAgendamentoConvidado(Integer idConvidado, Integer idAgendamento, Visitante visitante) {
		AgendamentoConvidado agendamentoConvidado = buscarAgendamentoConvidado(idConvidado, idAgendamento);
		agendamentoConvidado.setVisitante(visitante);
		salvar(agendamentoConvidado);
	}
	
	public AgendamentoConvidado buscarAgendaConvidadoPorNome(String nome, Integer idAgendamento) {
		return repository.buscarAgendaConvidadoPorNome(nome, idAgendamento);
	}
}
