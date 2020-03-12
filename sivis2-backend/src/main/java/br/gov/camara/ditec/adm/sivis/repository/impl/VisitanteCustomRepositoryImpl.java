package br.gov.camara.ditec.adm.sivis.repository.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.VisitanteCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Repository
public class VisitanteCustomRepositoryImpl implements VisitanteCustomRepository {

	@PersistenceContext
	private EntityManager em;

	@Override
	public PageImpl<Visitante> findAllFilter(Pageable pageable, String nome, String numero) {

		StringBuilder queryHQL = new StringBuilder();
		StringBuilder countHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();
		StringBuilder sort = new StringBuilder();

		queryHQL.append(" SELECT DISTINCT v FROM Visitante v INNER JOIN Documento d ON v.id = d.visitante WHERE");
		countHQL.append(" SELECT COUNT(v) FROM Visitante v INNER JOIN Documento d ON v.id = d.visitante WHERE");

		where.append(" v.nomeVisitante LIKE '" + StringUtil.trataAspas(nome.trim()) + "'");
		where.append(" OR (d.numero = '" + numero + "' OR v.cpf = '" + numero + "')");

		sort.append(" ORDER BY v.id DESC");

		queryHQL.append(where);
		queryHQL.append(sort);
		countHQL.append(where);

		Query query = em.createQuery(queryHQL.toString(), Visitante.class);
		Query count = em.createQuery(countHQL.toString());

		int start = pageable.getPageSize() * (pageable.getPageNumber());

		query.setFirstResult(start);
		query.setMaxResults(pageable.getPageSize());
		Long total = (Long) count.getSingleResult();

		return new PageImpl<>(query.getResultList(), pageable, total);
	}

	
}
