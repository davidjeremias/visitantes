package br.gov.camara.ditec.adm.sivis.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.ConfiguracaoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Configuracao;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;

@Service
public class ConfiguracaoService {

	private static final String CHAVE = "chave";
	
	@Autowired
	private ConfiguracaoRepository repository;
	
	public Configuracao buscaPorChave(Map<String, String[]> filter) {
		String chave = RequisicaoUtil.extrairParametro(filter, CHAVE);
		return repository.buscarPorChave(chave);
	}
	
	public List<Configuracao> buscarPorTipoConfiguracao(String tipoConfiguracao){
		return repository.buscarPorTipoConfiguracao(tipoConfiguracao);
	}

	public Configuracao salvar(Configuracao configuracao) {
		return repository.save(configuracao);
	}
}
