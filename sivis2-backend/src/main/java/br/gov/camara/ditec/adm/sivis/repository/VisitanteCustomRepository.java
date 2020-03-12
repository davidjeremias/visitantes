package br.gov.camara.ditec.adm.sivis.repository;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;

@Repository
public interface VisitanteCustomRepository {

	PageImpl<Visitante> findAllFilter(Pageable pageable, String nome, String numero);


}
