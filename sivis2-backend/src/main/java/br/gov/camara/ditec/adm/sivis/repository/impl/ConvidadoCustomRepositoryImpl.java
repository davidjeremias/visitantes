package br.gov.camara.ditec.adm.sivis.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.ConvidadoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;

@Repository
public class ConvidadoCustomRepositoryImpl implements ConvidadoCustomRepository{

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public List<Convidado> buscaConvidadosPorParametros(String param, Integer idAgendamento) {
		StringBuilder sb = new StringBuilder();

		sb.append(" SELECT c FROM Convidado c ");
		sb.append(" INNER JOIN AgendamentoConvidado ac ON ac.convidado.id = c.id");
		sb.append(" LEFT JOIN DocumentoConvidado dc ON dc.convidado.id = c.id ");
		sb.append(" WHERE ac.agendamento.id ='"+idAgendamento+"'");
		
		if(param != null) {
			sb.append(" AND (c.nomeConvidado LIKE '%" + param.trim() + "%' OR c.cpf ='"+param+"' OR dc.numeroDocumento ='"+param+"')");
		}

		sb.append(" ORDER BY c.nomeConvidado");
		Query query = em.createQuery(sb.toString(), Convidado.class);

		return query.getResultList();
	}

}
