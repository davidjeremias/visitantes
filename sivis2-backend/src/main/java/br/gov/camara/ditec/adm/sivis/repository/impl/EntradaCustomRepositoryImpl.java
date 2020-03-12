package br.gov.camara.ditec.adm.sivis.repository.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.EntradaCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Entrada;
import br.gov.camara.ditec.adm.sivis.service.dto.DestinoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.util.StringUtil;

@Repository
public class EntradaCustomRepositoryImpl implements EntradaCustomRepository{
	
	@PersistenceContext
	private EntityManager em;

	@Override
	public PageImpl<Entrada> findAllFilter(Pageable pageable, String nome, String numero, String pontoCadastrador) {
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder countHQL = new StringBuilder();
		StringBuilder sql = new StringBuilder();
		StringBuilder sort = new StringBuilder();

		queryHQL.append(" SELECT DISTINCT e FROM Entrada e LEFT JOIN Documento d ON e.visitante = d.visitante WHERE");
		countHQL.append(" SELECT COUNT(e) FROM Entrada e LEFT JOIN Documento d ON e.visitante = d.visitante WHERE");

		sql.append(" (e.pontoCadastrador = '"+pontoCadastrador+"' AND (CAST(e.dataHoraVisita as date) BETWEEN CONVERT(date, SYSDATETIME()) and CONVERT(date, SYSDATETIME())) )");

		if (!nome.equals(" ") && !nome.equals("")) {
			sql.append(" AND (e.visitante.nomeVisitante LIKE '"+StringUtil.trataAspas(nome.trim())+"')");
		}
		if (numero != null) {
			sql.append(" AND (d.numero = '"+numero+"' OR e.visitante.cpf = '"+numero+"')");
		}
		if(nome.equals(" ") && nome.equals("") && numero == null) {
			sql.append(" AND (e.visitante.nomeVisitante LIKE '"+StringUtil.trataAspas(nome.trim())+"' AND (d.numero = '"+numero+"' OR e.visitante.cpf = '"+numero+"'))");
		}

		sort.append(" ORDER BY e.id DESC");

		queryHQL.append(sql);
		queryHQL.append(sort);
		countHQL.append(sql);

		Query query = em.createQuery(queryHQL.toString(), Entrada.class);
		Query count = em.createQuery(countHQL.toString());

		int start = pageable.getPageSize() * (pageable.getPageNumber());

		query.setFirstResult(start);
		query.setMaxResults(pageable.getPageSize());
		Long total = (Long) count.getSingleResult();

		return new PageImpl<>(query.getResultList(), pageable, total);
	}

	@Override
	public List<Entrada> pesquisarVisitantesEntradas(String nomeVisitante, String numeroDocumentoVisitante,
			TipoRestricaoDTO tipoRestricaoDTO, LocalDateTime dataEntradaInicial, LocalDateTime dataEntradaFinal,
			LocalDateTime horaEntradaInicial, LocalDateTime horaEntradaFinal, PortariaDTO portariaDTO,
			DestinoDTO destinoDTO, String checkEntradas) {
		
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();
		StringBuilder sort = new StringBuilder();
		
		queryHQL.append(" SELECT DISTINCT e FROM Entrada e "
				+ " INNER JOIN Documento d ON e.visitante = d.visitante "
				+ " LEFT JOIN RestricaoEntrada res ON res.visitante = e.visitante "
				//+ " INNER JOIN res.tipoRestricaoEntrada "
				
				+ " WHERE e.visitante.dataCadastro is not null ");
		
		
		
		
		if(tipoRestricaoDTO != null) {
			if(tipoRestricaoDTO.getId() != null) {
			where.append(" AND res.tipoRestricao.id = "+ tipoRestricaoDTO.getId()+ "");}
		}
		
		if (checkEntradas.equals("recente")) {
			where.append(" AND e.dataHoraVisita = (SELECT MAX(e2.dataHoraVisita) FROM Entrada e2 WHERE e2.visitante= e.visitante )");
		}

		if (nomeVisitante != null) {
			where.append(" AND e.visitante.nomeVisitante LIKE '%" + StringUtil.trataAspas(nomeVisitante.trim()) + "%'");
		}
		if (numeroDocumentoVisitante != null) {
			where.append(" AND (d.numero = '" + numeroDocumentoVisitante + "' OR e.visitante.cpf = '" + numeroDocumentoVisitante.replaceAll("[.-]", "")
					+ "')");
		}
		

		if (dataEntradaInicial != null && dataEntradaFinal == null) {
			where.append(" AND (e.dataHoraVisita >= '" + dataEntradaInicial + "')");
		} else if (dataEntradaInicial == null && dataEntradaFinal != null) {
			where.append(" AND (e.dataHoraVisita <= '" + dataEntradaFinal + "')");
		} else if (dataEntradaInicial != null && dataEntradaFinal != null) {
			where.append(
					" AND e.dataHoraVisita BETWEEN '" + dataEntradaInicial + "' AND '" + dataEntradaFinal + "'");
		}

		if (horaEntradaInicial != null && horaEntradaFinal == null) {
			where.append(" AND (e.dataHoraVisita >= '" + horaEntradaInicial + "')");
		} else if (horaEntradaInicial == null && horaEntradaFinal != null) {
			where.append(" AND (e.dataHoraVisita <= '" + horaEntradaFinal + "')");
		} else if (horaEntradaInicial != null && horaEntradaFinal != null) {
			where.append(
					" AND e.dataHoraVisita BETWEEN '" + horaEntradaInicial + "' AND '" + horaEntradaFinal + "'");
		}

		if (portariaDTO.getId() != null) {
			where.append("  AND e.portaria.id = " + portariaDTO.getId() + " ");
		}

		if (destinoDTO.getId() != null) {
			where.append(" AND e.destino.id =" + destinoDTO.getId() + " ");
		}

		sort.append(" ORDER BY e.id DESC");;

		queryHQL.append(where);
		queryHQL.append(sort);

		Query query = em.createQuery(queryHQL.toString(), Entrada.class);

		List<Entrada> retorno = query.getResultList();
		

		return retorno;
	}

	private LocalDateTime getDataEntradaMaisRecente(String numeroDocumentoVisitante) {
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();
		queryHQL.append(" SELECT MAX(e.dataHoraVisita) FROM Entrada e INNER JOIN Documento d ON e.visitante = d.visitante ") ;
		where.append(" AND (d.numero = '"+numeroDocumentoVisitante+"' OR e.visitante.cpf = '"+numeroDocumentoVisitante+"')");
		
		queryHQL.append(where);
		
		Query query = em.createQuery(queryHQL.toString(), LocalDateTime.class);
		
		return (LocalDateTime) query.getResultList().get(0);
	}
}
