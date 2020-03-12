package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.FotoEmailRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoEmail;

@Service
public class FotoEmailService {

	@Autowired
	private FotoEmailRepository repository;
	
	public FotoEmail getFotoEmail() {
		List<FotoEmail> fotosEmail = repository.findAll();
		return !fotosEmail.isEmpty() || fotosEmail != null ? fotosEmail.get(fotosEmail.size() -1) : null;
	}
}
