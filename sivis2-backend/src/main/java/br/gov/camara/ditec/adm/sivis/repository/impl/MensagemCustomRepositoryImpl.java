package br.gov.camara.ditec.adm.sivis.repository.impl;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.MensagemCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.MensagemConvidado;

@Repository
public class MensagemCustomRepositoryImpl implements MensagemCustomRepository {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public List<MensagemConvidado> buscaPorParametros(String nome, LocalDateTime dataInicio, LocalDateTime dataFim, Integer idTipoMensagem, Integer idAgendamendo) {
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();

		queryHQL.append(" SELECT m FROM MensagemConvidado m WHERE");
		where.append(" m.agendamento.id ='"+idAgendamendo+"'");
		
		if(nome != null) {
			where.append(" AND m.convidado.nomeConvidado = '"+nome+"'");
		}
		
		if(dataInicio != null && dataFim == null) {
			where.append(" AND m.dataEnvio BETWEEN '"+dataInicio+"' AND '"+dataInicio.withHour(23)+"'");
		}
		
		if(dataFim != null && dataInicio == null) {
			where.append(" AND m.dataEnvio BETWEEN '"+dataFim.withHour(0)+"' AND '"+dataFim+"'");
		}
		
		if(dataInicio != null && dataFim != null) {
			where.append(" AND m.dataEnvio BETWEEN '"+dataInicio+"' AND '"+dataFim+"'");
		}
		
		if(idTipoMensagem != null) {
			where.append(" AND m.tipoMensagem.id = '"+idTipoMensagem+"'");
		}

		queryHQL.append(where);
		Query query = em.createQuery(queryHQL.toString(), MensagemConvidado.class);

		return query.getResultList();
	}

}
