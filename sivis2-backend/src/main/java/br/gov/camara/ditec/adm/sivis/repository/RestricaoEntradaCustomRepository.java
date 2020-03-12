package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDate;

import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.RestricaoEntrada;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.AutorizacaoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;

@Repository
public interface RestricaoEntradaCustomRepository {

	PageImpl<RestricaoEntrada> buscarPorFiltro(LocalDate dataInicial, LocalDate dataFinal, String restricao, String cpf,
			String nome, String motivo, Boolean isSomenteEntrada);

	PageImpl<RestricaoEntrada> buscarRestricaoEntradaTentativas(LocalDate restricaoDataInicial,
			LocalDate restricaoDataFinal, LocalDate eventoDataInicial, LocalDate eventoDataFinal,
			TipoRestricaoDTO restricao, String cpf, String nome, String motivo, PortariaDTO portariaDTO,
			AutorizacaoEnum autorizacao);

	
	
	
}
