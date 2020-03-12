package br.gov.camara.ditec.adm.sivis.service.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GabineteList {

	private List<GabineteDTO> gabinetes;
	
	public GabineteList() {
		gabinetes = new ArrayList<GabineteDTO>();
	}
}
