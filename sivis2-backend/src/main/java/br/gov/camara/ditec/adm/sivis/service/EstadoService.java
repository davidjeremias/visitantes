package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.EstadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Estado;

@Service
public class EstadoService {

	@Autowired
	private EstadoRepository repository;
	
	public List<Estado> findAll(){
		return repository.findAll();
	}
}
