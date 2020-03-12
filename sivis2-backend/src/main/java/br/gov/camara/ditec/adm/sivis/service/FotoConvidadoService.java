package br.gov.camara.ditec.adm.sivis.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.repository.FotoConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoConvidado;
import br.gov.camara.ditec.adm.sivis.service.dto.FotoConvidadoDTO;

@Service
public class FotoConvidadoService {
	
	@Autowired
	private FotoConvidadoRepository fotoConvidadoRepository;
	
	@Autowired
	ModelMapper model;

	public void salvar(FotoConvidado fotoConvidado) {
		// TODO Auto-generated method stub
		
	}

	public FotoConvidadoDTO getFotoConvidado(Integer idConvidado, Integer idAgendamento) {
		FotoConvidado foto = fotoConvidadoRepository.buscarFotoConvidadoPorAgendamento(idConvidado,idAgendamento);
		return model.map(foto, FotoConvidadoDTO.class);
	}
	
	public FotoConvidado buscarFotoConvidadoPorIdConvidado(Integer idConvidado) {
		return fotoConvidadoRepository.buscarFotoConvidadoPorIdConvidado(idConvidado);
	}
}
