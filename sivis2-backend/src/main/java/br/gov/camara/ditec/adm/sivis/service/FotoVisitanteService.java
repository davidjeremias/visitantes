package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.FotoVisitanteRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoVisitante;

@Service
public class FotoVisitanteService {

	@Autowired
	private FotoVisitanteRepository fotoVisitanteRepository;
	
	public FotoVisitante getUltimaFotoVisitante(Integer idVisitante) {
		List<FotoVisitante> listaFotoVisitante = fotoVisitanteRepository.findByIdVisitante(idVisitante);
		return listaFotoVisitante.get(listaFotoVisitante.size() -1);
	}
}
