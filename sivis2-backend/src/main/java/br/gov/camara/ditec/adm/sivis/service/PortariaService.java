package br.gov.camara.ditec.adm.sivis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.PortariaRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Portaria;

@Service
public class PortariaService {
	
	@Autowired
	private PortariaRepository repository;

	public List<Portaria> findAllPortarias(){
		List<Portaria> retorno = new ArrayList<Portaria>();
		List<Portaria> listaPortarias = repository.findAllPortarias();
		for(Portaria port: listaPortarias) {
			if(!port.getDestinos().isEmpty()) {
				retorno.add(port);
			}
		}
		return retorno;
	}
}
