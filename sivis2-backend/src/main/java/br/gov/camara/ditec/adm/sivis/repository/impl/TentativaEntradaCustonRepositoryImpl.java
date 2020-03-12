package br.gov.camara.ditec.adm.sivis.repository.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.gov.camara.ditec.adm.sivis.repository.TentativaEntradaCustonRepository;

@Repository
public class TentativaEntradaCustonRepositoryImpl implements TentativaEntradaCustonRepository{

	
	@PersistenceContext
	private EntityManager em;
	
	

}
