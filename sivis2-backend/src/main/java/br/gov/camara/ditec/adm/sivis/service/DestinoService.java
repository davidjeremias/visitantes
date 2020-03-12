package br.gov.camara.ditec.adm.sivis.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.DestinoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Destino;
import br.gov.camara.ditec.adm.sivis.service.dto.DestinoDTO;

@Service
public class DestinoService {

	@Autowired
	private DestinoRepository repository;
	
	public List<DestinoDTO> findAllDestinos(){
		ModelMapper model = new ModelMapper();
		List<Destino> listaRetorno = repository.findAllDestinos();
		List<DestinoDTO> listaDTO = new ArrayList<>();
		listaRetorno.forEach(e -> {
			DestinoDTO dto = model.map(e, DestinoDTO.class);
			listaDTO.add(dto);
		});
		return listaDTO;
	}
}
