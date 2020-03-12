package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.TipoDocumentoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoDocumento;

@Service
public class TipoDocumentoService {

	private static final String PARAMETROS = "parametros";
	
	@Autowired
	private TipoDocumentoRepository repository;
	
	public List<TipoDocumento> findAllTipoDocumentoByOrigem(Map<String, String[]> filter){
		String parametros = (filter.get(PARAMETROS) != null ? filter.get(PARAMETROS)[0] : null);
		return repository.findAllTipoDocumentoByOrigem(parametros);
	}
	
	public TipoDocumento salvar(TipoDocumento tipoDocumento) {
		return repository.save(tipoDocumento);
	}
}
