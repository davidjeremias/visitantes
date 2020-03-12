package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.PaisRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Pais;

@Service
public class PaisService {
	
	private static final String ARGENTINA = "ARGENTINA";
	private static final String PARAGUAI = "PARAGUAI";
	private static final String URUGUAI = "URUGUAI";
	private static final String VENEZUELA = "VENEZUELA";
	private static final String MERCOSUL = " (Mercosul)";
	
	@Autowired
	private PaisRepository repository;
	
	public List<Pais> findBrasil() {
		return repository.findBrasil();
	}
	
	public List<Pais> findAllMercosul(){
		return repository.findAllMercosul();
	}
	
	public List<Pais> findAllEstrageiro(){
		List<Pais> listaPaisesEstrangeiros = repository.findAllEstrageiro();
		listaPaisesEstrangeiros.forEach(e -> {
			if(e.getNamePais().equals(ARGENTINA) || e.getNamePais().equals(PARAGUAI) || e.getNamePais().equals(URUGUAI) || e.getNamePais().equals(VENEZUELA)) {
				e.setNamePais((e.getNamePais().concat(MERCOSUL)));
			}
		});
		return listaPaisesEstrangeiros;
	}
	
	public List<Pais> findAll(){
		return repository.findAll();
	}
}
