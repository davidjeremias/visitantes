package br.gov.camara.ditec.adm.sivis.repository.impl;

import java.time.LocalDate;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.RestricaoEntradaCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.RestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.AutorizacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TentativaEntradaRestricaoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;

@Repository
public class RestricaoEntradaCustomRepositoryImpl implements RestricaoEntradaCustomRepository {

	@PersistenceContext
	private EntityManager em;

	@SuppressWarnings("unchecked")
	@Override
	public PageImpl<RestricaoEntrada> buscarPorFiltro(LocalDate dataInicial, LocalDate dataFinal, String restricao,
			String cpf, String nome, String motivo, Boolean somenteComRestricaoEntrada) {

		StringBuilder queryHQL = new StringBuilder();

		StringBuilder sort = new StringBuilder();
		StringBuilder where = new StringBuilder();

		if(!somenteComRestricaoEntrada) {
			
		queryHQL.append(" SELECT DISTINCT rest FROM RestricaoEntrada rest " 
		+ " JOIN rest.tipoRestricao tpre ");
		
		}else {
			queryHQL.append(" SELECT DISTINCT rest FROM TentativaEntradaRestricao ter"
					+ " JOIN ter.restricaoEntrada rest " 
					+ " JOIN rest.tipoRestricao tpre ");
		}
		
		

		where.append(" WHERE rest.dataCadastro is not null ");

		if (dataInicial != null && dataFinal == null) {
			where.append(" AND (rest.dataInicioRestricao >= '" + dataInicial + "')");
		} else if (dataInicial == null && dataFinal != null) {
			where.append(" AND (rest.dataFinalRestricao <= '" + dataFinal + "')");
		} else if (dataInicial != null && dataFinal != null) {
			where.append(" AND (rest.dataInicioRestricao >= '" + dataInicial + "' AND  rest.dataFinalRestricao <= '"
					+ dataFinal + "') ");
		}

		if (restricao != null) {
			where.append(" AND tpre.nome = '" + restricao + "' ");
		}

		if (cpf != null) {
			where.append(" AND rest.numCPF = '" + cpf + "' ");
		}

		if (nome != null) {
			where.append(" AND rest.nomeCivil LIKE '%" + nome + "%' ");
		}

		if (motivo != null) {
			where.append(" AND rest.motivoRestricao LIKE '%" + motivo + "%' ");
		}

		sort.append(" ORDER BY rest.dataCadastro ASC ");

		queryHQL.append(where);
		queryHQL.append(sort);

		Query query = em.createQuery(queryHQL.toString(), RestricaoEntrada.class);

		return new PageImpl<>(query.getResultList());
	}

	@SuppressWarnings("unchecked")
	@Override
	public PageImpl<RestricaoEntrada> buscarRestricaoEntradaTentativas(LocalDate restricaoDataInicial,
			LocalDate restricaoDataFinal, LocalDate eventoDataInicial, LocalDate eventoDataFinal,
			TipoRestricaoDTO tipoRestricao, String cpf, String nome, String motivo, PortariaDTO portariaDTO,
			AutorizacaoEnum autorizacao) {
		

		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();
		StringBuilder sort = new StringBuilder();
		
		queryHQL.append(" SELECT DISTINCT rest FROM TentativaEntradaRestricao ter"
				+ " JOIN ter.restricaoEntrada rest " 
				+ " JOIN rest.tipoRestricao tpre "
				+ " LEFT JOIN ter.rejeicaoEntrada rejeicao "
				+ " LEFT JOIN ter.entrada entrada ");
		
		
		where.append(" WHERE rest.dataCadastro is not null ");
		
		if (restricaoDataInicial != null && restricaoDataFinal == null) {
			where.append(" AND (rest.dataInicioRestricao >= '" + restricaoDataInicial + "')");
		} else if (restricaoDataInicial == null && restricaoDataFinal != null) {
			where.append(" AND (rest.dataFinalRestricao <= '" + restricaoDataFinal + "')");
		} else if (restricaoDataInicial != null && restricaoDataFinal != null) {
			where.append(" AND (rest.dataInicioRestricao >= '" + restricaoDataInicial + "' AND  rest.dataFinalRestricao <= '"
					+ restricaoDataFinal + "') ");
		}
		
		if (eventoDataInicial != null && eventoDataFinal == null) {
			where.append(" AND (ter.dataTentativaRestricao >= '" + eventoDataInicial + "')");
		} else if (eventoDataInicial == null && eventoDataFinal != null) {
			where.append(" AND (ter.dataTentativaRestricao <= '" + restricaoDataFinal + "')");
		} else if (eventoDataInicial != null && eventoDataFinal != null) {
			where.append(" AND (ter.dataTentativaRestricao >= '" + eventoDataInicial + "' AND  ter.dataTentativaRestricao <= '"
					+ eventoDataFinal + "') ");
		}
		
		if (nome != null) {
			where.append(" AND rest.nomeCivil LIKE '%" + nome + "%' ");
		}

		if (motivo != null) {
			where.append(" AND rest.motivoRestricao LIKE '%" + motivo + "%' ");
		}
		
		if (cpf != null) {
			where.append("  AND (rest.numCPF = '" + cpf + "' OR rest.visitante.cpf = '" + cpf + "')");
		}
		
		if (tipoRestricao != null) {
			if(tipoRestricao.getId() != null)
			where.append(" AND tpre.id = '" + tipoRestricao.getId() + "' ");
		}
		
		
		if(portariaDTO != null) {
			if(portariaDTO.getId()!= null)
			where.append(" AND ter.portaria.id = '" + portariaDTO.getId() + "' ");
		}
		
		if(autorizacao != null) {
			if(autorizacao.equals(AutorizacaoEnum.REJEITADA)) {
				where.append(" AND tpre.rejeicaoEntrada IS NOT NULL AND tpre.entrada IS NULL ");
			}else if(autorizacao.equals(AutorizacaoEnum.PERMETIDA)) {
				where.append(" AND tpre.rejeicaoEntrada IS NULL AND tpre.entrada IS NOT NULL ");
			}else if(autorizacao.equals(AutorizacaoEnum.SEM_PROVIDENCIA)) {
				where.append(" AND tpre.rejeicaoEntrada IS NULL AND tpre.entrada IS sNULL ");
			}
		}
		
		sort.append(" ORDER BY rest.dataCadastro ASC ");
		
		queryHQL.append(where);
		queryHQL.append(sort);

		Query query = em.createQuery(queryHQL.toString(), RestricaoEntrada.class);

		return new PageImpl<>(query.getResultList());
		
		
	}
	

}
