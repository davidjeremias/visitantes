package br.gov.camara.ditec.adm.sivis.util;

import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;

public class PageableUtil {
	
	private static final String PAGE = "page";
	private static final String SIZE = "size";
	
	public static Pageable getPageableParans(Map<String, String[]> params, Direction direction, String orderBy) {
		int page = Integer.parseInt(RequisicaoUtil.extrairParametro(params, PAGE));
		int size = Integer.parseInt(RequisicaoUtil.extrairParametro(params, SIZE));
		return PageRequest.of(page, size, direction, orderBy);
	}
}
