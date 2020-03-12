package br.gov.camara.ditec.adm.sivis.config.seguranca;

import java.io.Serializable;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;

import br.gov.camara.ditec.adm.sivis.controller.servico.BaseServico;

/**
 * Classe que customiza o tratador de permissões declarativas utilizado nos métodos/classes.
 * 
 * @author P_6690
 */
public class CustomPermissionEvaluator implements PermissionEvaluator {

	private BaseServico baseServico;

	public CustomPermissionEvaluator(BaseServico baseServico) {
		this.baseServico = baseServico;
	}

	@Override
	public boolean hasPermission(Authentication authentication, 
			Object targetDomainObject, Object permission) 
	{
		return false;
	}

	@Override
	public boolean hasPermission(Authentication usuario, 
			Serializable ideCadastroDeputadoRepresentacao, 
			String siglaSistema, Object permissoes) 
	{
		return false;
	}

}
