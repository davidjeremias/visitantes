package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.TipoMensagemRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoMensagem;

@Service
public class TipoMensagemService {

	@Autowired
	private TipoMensagemRepository repository;
	
	public List<TipoMensagem> findAll(){
		return repository.findAll();
	}

	public TipoMensagem salvar(TipoMensagem tipoMensagem) {
		return repository.save(tipoMensagem);
	}
	
	public TipoMensagem findByName(String tipoMensagem) {
		return repository.findByName(tipoMensagem);
	}
}
