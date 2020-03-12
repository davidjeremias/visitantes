package br.gov.camara.ditec.adm.sivis.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.Entrada;
import br.gov.camara.ditec.adm.sivis.service.dto.DestinoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.PortariaDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.TipoRestricaoDTO;

@Repository
public interface EntradaCustomRepository {

	PageImpl<Entrada> findAllFilter(Pageable pageable, String nome, String documento, String pontoCadastrador);

	List<Entrada> pesquisarVisitantesEntradas(String nomeVisitante, String numeroDocumentoVisitante,
			TipoRestricaoDTO tipoRestricaoDTO, LocalDateTime dataEntradaInicial, LocalDateTime dataEntradaFinal,
			LocalDateTime horaEntradaInicial, LocalDateTime horaEntradaFinal, PortariaDTO portariaDTO,
			DestinoDTO destinoDTO, String checkEntradas);
}
