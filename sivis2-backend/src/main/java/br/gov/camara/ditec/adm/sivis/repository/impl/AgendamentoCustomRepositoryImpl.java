package br.gov.camara.ditec.adm.sivis.repository.impl;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.AgendamentoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.ConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Agendamento;
import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import br.gov.camara.ditec.adm.sivis.repository.model.DocumentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.SituacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoDocumentoConvidadoDTO;

@Repository
public class AgendamentoCustomRepositoryImpl implements AgendamentoCustomRepository {

	@PersistenceContext
	private EntityManager em;

	@Autowired
	private ConvidadoRepository repositoryConvidado;

	@SuppressWarnings("unchecked")
	@Override
	public PageImpl<Agendamento> buscarPorFiltro(LocalDate dataInicial, LocalDate dataFinal,
			PeriodoEnum periodo, SituacaoEnum situacao, String descricao, Integer idParlamentar) {

		StringBuilder queryHQL = new StringBuilder();
		StringBuilder countHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();
		StringBuilder sort = new StringBuilder();

		queryHQL.append(" SELECT DISTINCT a FROM Agendamento a WHERE ");
		countHQL.append(" SELECT COUNT(a) FROM Agendamento a  WHERE ");

		where.append(" a.idParlamentar=" + idParlamentar + " ");

		if (situacao != null) {
			where.append(" AND a.situacao = " + situacao.getId() + "");
		} else {
			where.append(" AND a.situacao in ( " + SituacaoEnum.AGENDADO.getId() + ", "+ SituacaoEnum.CANCELADO.getId()+ ") ");
		}

		if (dataInicial != null && dataFinal == null) {
			where.append(" AND (a.dataAgendamento >= '" + dataInicial + "')");
		} else if (dataInicial == null && dataFinal != null) {
			where.append(" AND (a.dataAgendamento <= '" + dataFinal + "')");
		} else if (dataInicial != null && dataFinal != null) {
			where.append(" AND a.dataAgendamento BETWEEN '" + dataInicial + "' AND '" + dataFinal + "'");
		}

		if (periodo != null) {
			where.append(" AND a.periodo = " + periodo.getId() + " ");
		}

		if (descricao != null) {
			where.append(" AND a.descricaoAgendamento LIKE '%" + descricao + "%'");
		}

		sort.append(" ORDER BY a.dataAgendamento ASC");

		queryHQL.append(where);
		queryHQL.append(sort);
		countHQL.append(where);

		Query query = em.createQuery(queryHQL.toString(), Agendamento.class);
		//Query count = em.createQuery(countHQL.toString());

//		int start = pageable.getPageSize() * (pageable.getPageNumber());
//		
//		query.setFirstResult(start);
//		query.setMaxResults(pageable.getPageSize());
//		Long total = (Long) count.getSingleResult();

		return new PageImpl<>(query.getResultList());
	}

	
	@SuppressWarnings("unchecked")
	public ConvidadoDTO verificarSituacaoConvidado(String cpf, Integer agendamentoID, Integer idParlamentar) {
		StringBuilder queryHQLConvidado = new StringBuilder();
		StringBuilder queryHQLVisitante = new StringBuilder();
		StringBuilder queryHQLConvidadoAgendadoMesmoGabinete = new StringBuilder();

		ConvidadoDTO convidadoRetornoDTO = new ConvidadoDTO();
		// verificar se é um convidado
		queryHQLConvidado.append(" SELECT c FROM Convidado c ");
		queryHQLConvidado.append(" WHERE c.cpf = '" + cpf + "' AND c.idParlamentar=" + idParlamentar + "");

		// verificar se é um convidado de um gabinete e nunca foi visitante
		queryHQLConvidadoAgendadoMesmoGabinete.append(" SELECT DISTINCT c " + " FROM AgendamentoConvidado ac "
				+ " JOIN  ac.convidado c " + " JOIN  c.fotoConvidado f " + " JOIN  c.documentosConvidado doc "
				+ " WHERE c.cpf = '" + cpf + "' " + " AND ac.visitante IS NULL " + " AND c.idParlamentar = "
				+ idParlamentar + "" + " ORDER BY c.dataCadastro DESC ");

		queryHQLVisitante.append(" SELECT v FROM Visitante v WHERE v.cpf = '" + cpf + "' ");

		Query queryConvidado = em.createQuery(queryHQLConvidado.toString(), Convidado.class);
		Query queryVisitante = em.createQuery(queryHQLVisitante.toString(), Visitante.class);
		Query queryConvidadoAgendadoMesmoGabinete = em.createQuery(queryHQLConvidadoAgendadoMesmoGabinete.toString(),
				Convidado.class);

		Convidado resultConvidado = (Convidado) queryConvidado.getResultList().stream().findFirst().orElse(null);
		Visitante resultVisitante = (Visitante) queryVisitante.getResultList().stream().findFirst().orElse(null);
		Convidado resultConvidadoAgendadoMesmoGabinete = (Convidado) queryConvidadoAgendadoMesmoGabinete.getResultList()
				.stream().findFirst().orElse(null);

		convidadoRetornoDTO = verificarCenarioConvidado(cpf, convidadoRetornoDTO, resultConvidado, resultVisitante,
				resultConvidadoAgendadoMesmoGabinete);

		return convidadoRetornoDTO;
	}

	private ConvidadoDTO verificarCenarioConvidado(String cpf, ConvidadoDTO convidadoRetornoDTO,
			Convidado resultConvidado, Visitante resultVisitante, Convidado resultConvidadoAgendadoMesmoGabinete) {

		convidadoRetornoDTO.setCpf(cpf);
		

		// redmine [#49706]
		// cenario 01
		if (resultVisitante != null && resultConvidadoAgendadoMesmoGabinete == null && resultConvidado == null) {
			convidadoRetornoDTO.setNomeConvidado(resultVisitante.getNomeVisitante());
			convidadoRetornoDTO.setIsVisitante(true);
			convidadoRetornoDTO.setIdVisitante(resultVisitante.getId());
			convidadoRetornoDTO.setIsConvidadoVisitante(false);
			convidadoRetornoDTO.setIsConvidado(false);

			// cenário 02
		} else if (resultVisitante != null && resultConvidadoAgendadoMesmoGabinete != null && resultConvidado == null) {
			convidadoRetornoDTO.setNomeConvidado(resultVisitante.getNomeVisitante());
			convidadoRetornoDTO.setEmail(resultConvidadoAgendadoMesmoGabinete.getEmail());
			convidadoRetornoDTO.setId(resultConvidadoAgendadoMesmoGabinete.getId());
			convidadoRetornoDTO.setIsVisitante(true);
			convidadoRetornoDTO.setIdVisitante(resultVisitante.getId());
			convidadoRetornoDTO.setIsConvidadoVisitante(true);
			convidadoRetornoDTO.setIsConvidado(false);
		}
		// cenario 3
		else if (resultVisitante == null && resultConvidadoAgendadoMesmoGabinete != null && resultConvidado != null) {
			convidadoRetornoDTO = prepararDadosConvidado(resultConvidadoAgendadoMesmoGabinete);
			convidadoRetornoDTO.setId(resultConvidadoAgendadoMesmoGabinete.getId());
			convidadoRetornoDTO.setIsIniciarCadastro(true);
			
			convidadoRetornoDTO.setIsConvidadoVisitante(false);
			convidadoRetornoDTO.setIsConvidado(false);
			convidadoRetornoDTO.setIsVisitante(false);
			// cenario 4
		} else if (resultVisitante == null && resultConvidadoAgendadoMesmoGabinete == null && resultConvidado != null) {
			convidadoRetornoDTO = prepararDadosConvidado(resultConvidado);
			convidadoRetornoDTO.setId(resultConvidado.getId());
			convidadoRetornoDTO.setDataCadastro(resultConvidado.getDataCadastro());
			convidadoRetornoDTO.setIsIniciarCadastro(true);
			
			convidadoRetornoDTO.setIsConvidadoVisitante(false);
			convidadoRetornoDTO.setIsConvidado(true);
			convidadoRetornoDTO.setIsVisitante(false);
			

		} else if (resultVisitante == null && resultConvidadoAgendadoMesmoGabinete == null && resultConvidado == null) {
			convidadoRetornoDTO.setIsIniciarCadastro(true);
			convidadoRetornoDTO.setIsVisitante(false);
			convidadoRetornoDTO.setIsConvidadoVisitante(false);
			convidadoRetornoDTO.setIsConvidado(false);
		} else if (resultVisitante != null && resultConvidadoAgendadoMesmoGabinete != null && resultConvidado != null) {
			convidadoRetornoDTO.setNomeConvidado(resultVisitante.getNomeVisitante());
			convidadoRetornoDTO.setEmail(resultConvidadoAgendadoMesmoGabinete.getEmail());
			convidadoRetornoDTO.setId(resultConvidado.getId());
			convidadoRetornoDTO.setDataCadastro(resultConvidado.getDataCadastro());
			convidadoRetornoDTO.setIsVisitante(true);
			convidadoRetornoDTO.setIdVisitante(resultVisitante.getId());
			
			convidadoRetornoDTO.setIsConvidadoVisitante(true);
			convidadoRetornoDTO.setIsConvidado(true);
			convidadoRetornoDTO.setIsVisitante(true);
			
		}else if(resultVisitante != null && resultConvidadoAgendadoMesmoGabinete == null && resultConvidado != null){
			convidadoRetornoDTO.setNomeConvidado(resultVisitante.getNomeVisitante());
			convidadoRetornoDTO.setEmail(resultConvidado.getEmail());
			convidadoRetornoDTO.setId(resultConvidado.getId());
			convidadoRetornoDTO.setDataCadastro(resultConvidado.getDataCadastro());
			convidadoRetornoDTO.setIsVisitante(true);
			convidadoRetornoDTO.setIdVisitante(resultVisitante.getId());
			
			convidadoRetornoDTO.setIsConvidadoVisitante(false);
			convidadoRetornoDTO.setIsConvidado(true);
			convidadoRetornoDTO.setIsVisitante(true);
		}
		return convidadoRetornoDTO;
	}

	private ConvidadoDTO prepararDadosConvidado(Convidado resultConvidado) {
		ModelMapper model = new ModelMapper();

		ConvidadoDTO retorno = model.map(resultConvidado, ConvidadoDTO.class);

		if(resultConvidado.getFotoConvidado()!=null) {
			retorno.setFotoConvidadoDTO(model.map(resultConvidado.getFotoConvidado(), FotoConvidadoDTO.class));
		}
		if(resultConvidado.getDocumentosConvidado()!=null) {
		retorno.setDocumentosConvidadoDTO(prepararDocumentos(resultConvidado.getDocumentosConvidado()));
		}
		retorno.setIsConvidado(true);
		retorno.setIsConvidadoVisitante(false);
		retorno.setIsVisitante(false);
		retorno.setIsIniciarCadastro(true);

		return retorno;
	}

	private DocumentoConvidadoDTO prepararDocumentos(DocumentoConvidado documentosConvidado) {
		ModelMapper model = new ModelMapper();

		DocumentoConvidadoDTO docConvidado = model.map(documentosConvidado, DocumentoConvidadoDTO.class);
		docConvidado.setFotoDocumentoConvidadoDTO(
				model.map(documentosConvidado.getFotoDocumentoConvidado(), FotoDocumentoConvidadoDTO.class));

		return docConvidado;
	}

	@Override
	public ConvidadoDTO buscarConvidadoParaAlterar(Integer convidadoID, Integer agendaID, Integer parlamentarID) {
		String cpf = repositoryConvidado.buscarCPFConvidadoPorID(convidadoID);
		return verificarSituacaoConvidado(cpf,agendaID,parlamentarID);
	}
	
	@Override
	public List<Agendamento> findAgendamentoByParam(String param, String numero, LocalDate dataHoje) {
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();

		queryHQL.append(" SELECT DISTINCT a FROM AgendamentoConvidado ac  "
				+ " INNER JOIN ac.agendamento a "
				+ " LEFT JOIN ac.convidado c "
				+ " LEFT JOIN c.documentosConvidado dc"
				+ " LEFT JOIN ac.visitante v "
				+ " LEFT join v.documentos dv ");
		
		where.append(" WHERE a.dataAgendamento ='"+dataHoje+"' AND a.situacao ="+ SituacaoEnum.AGENDADO.getId() +" ");
		
		if(param != null) {
			where.append(" AND (a.descricaoAgendamento ='"+param+"' OR a.local ='"+param+"' OR a.nomePatrocinador ='"+param+"' OR ac.convidado.nomeConvidado ='"+param+"' OR ac.convidado.cpf ='"+param+"')");
		}
		
		if(numero != null) {
			where.append(" AND (a.id ='"+numero+"' OR dv.numero = '"+numero+"' OR dc.numeroDocumento = '"+numero+"')");
		}

		queryHQL.append(where);
		Query query = em.createQuery(queryHQL.toString(), Agendamento.class);

		return query.getResultList();
	}


	@SuppressWarnings("unchecked")
	public AgendamentoConvidado buscarAgendamentoConvidado(Integer idConvidado, Integer idAgendamento) {
		StringBuilder queryHQL = new StringBuilder();
		StringBuilder where = new StringBuilder();

		queryHQL.append(" SELECT ac FROM AgendamentoConvidado ac "
				+ " JOIN ac.agendamento agendamento "
				+ " JOIN FETCH ac.convidado convidado ");
		
		where.append(" WHERE agendamento.id ='"+idAgendamento+"' AND convidado.id ='"+idConvidado+"' ");
		
		queryHQL.append(where);
		
		Query query = em.createQuery(queryHQL.toString(), AgendamentoConvidado.class);

		return (AgendamentoConvidado) query.getResultList().stream().findFirst().orElse(null);
	}
}
