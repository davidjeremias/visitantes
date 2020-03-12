package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.OrigemRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Origem;

@Service
public class OrigemService {

	@Autowired
	private OrigemRepository repository;
	
	public List<Origem> findAll(){
		return repository.findAll();
	}
	
	public Origem salvar(Origem origem) {
		return repository.save(origem);
	}
}
