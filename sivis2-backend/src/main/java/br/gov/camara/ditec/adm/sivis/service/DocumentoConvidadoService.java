package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.DocumentoConvidadoRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import br.gov.camara.ditec.adm.sivis.repository.model.DocumentoConvidado;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;

@Service
public class DocumentoConvidadoService {

	@Autowired
	private DocumentoConvidadoRepository repository;
	
	@Transactional(rollbackOn = NegocioException.class)
	public DocumentoConvidado salvar(DocumentoConvidadoDTO documentoDTO, Convidado convidado){
		ModelMapper modelMapper = new ModelMapper();
		DocumentoConvidado documentoConvidado = modelMapper.map(documentoDTO, DocumentoConvidado.class);
		documentoConvidado.setConvidado(convidado);
		
		return repository.save(documentoConvidado);
	}

	private List<DocumentoConvidadoDTO> trataRetorno(List<DocumentoConvidado> retorno) {
		List<DocumentoConvidadoDTO> listaDocumentoConvidado = new ArrayList<>();
		retorno.forEach(e -> {
			ModelMapper modelM = new ModelMapper();
			DocumentoConvidadoDTO dto = modelM.map(e, DocumentoConvidadoDTO.class);
//			dto.setFotoDocumentoFrente(e.getFotoDocumentoConvidado().getFotoDocumentoFrente());
//			dto.setFotoDocumentoVerso(e.getFotoDocumentoConvidado().getFotoDocumentoVerso());
			listaDocumentoConvidado.add(dto);
		});
		return listaDocumentoConvidado;
	}
}
