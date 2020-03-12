package br.gov.camara.ditec.adm.sivis.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.repository.DocumentoRepository;
import br.gov.camara.ditec.adm.sivis.repository.PaisRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.Documento;
import br.gov.camara.ditec.adm.sivis.repository.model.Estado;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoDocumento;
import br.gov.camara.ditec.adm.sivis.repository.model.Pais;
import br.gov.camara.ditec.adm.sivis.repository.model.Visitante;
import br.gov.camara.ditec.adm.sivis.service.dto.DocumentoDTO;
import br.gov.camara.ditec.adm.sivis.util.CpfCnpjUtils;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;

@Service
public class DocumentoService {

	private static final String PARAMETROS = "parametros";
	private static final String PASSAPORTE = "passaporte";
	private static final String CRNM = "crnm";

	@Autowired
	private DocumentoRepository documentoRepository;
	
	@Autowired
	private PaisRepository paisRepository;
	
	@Autowired
	ModelMapper model;
	
	@Transactional(rollbackOn = NegocioException.class)
	public List<Documento> salvaDocumentos(List<DocumentoDTO> listaDocumentoDTO, Visitante visitante) throws NegocioException {
		List<Documento> listaDocumentos = new ArrayList<>();
		int i = 0;
		for(DocumentoDTO e: listaDocumentoDTO) {
			Documento documento = model.map(e, Documento.class);
			documento.setNomePais(e.getPais().getNamePais());
			documento.setVisitante(visitante);
			if(documento.getDataCadastro() == null) {
				documento.setDataCadastro(LocalDateTime.now());
			}
			i = validaDocumentoPrincipal(i, e);
			if(e.getTipoDocumento().getId().equals(1) || e.getTipoDocumento().getId().equals(3)) {
				documento.setEstadoEmissao(criaEstadoEmissao(e));
			}
			documento.setFotosDocumento(Arrays.asList(criaFotoDocumento(e, documento)));
			if(documento.getId() == null) {
				validaDataExpiracaoDocumento(documento);
			}
			listaDocumentos.add(documentoRepository.save(documento));
		};
		return listaDocumentos;
	}

	private int validaDocumentoPrincipal(int i, DocumentoDTO e) throws NegocioException {
		if(e.getIsPrincipal()) {
			i++;
		}
		if(i > 1) {
			throw new NegocioException("Apenas um documento deve ser o principal");
		}
		return i;
	}

	private Estado criaEstadoEmissao(DocumentoDTO e) {
		Estado estado = new Estado();
		if(e.getEstadoEmissao() != null) {
			estado.setEstado(e.getEstadoEmissao().getEstado());
			estado.setId(e.getEstadoEmissao().getId());
			estado.setUf(e.getEstadoEmissao().getUf());
		}
		return estado;
	}

	private FotoDocumento criaFotoDocumento(DocumentoDTO e, Documento documento) {
		FotoDocumento fotoDocumento = new FotoDocumento();
		fotoDocumento.setFotoDocumentoFrente(e.getFotoDocumentoFrente());
		fotoDocumento.setFotoDocumentoVerso(e.getFotoDocumentoVerso());
		fotoDocumento.setDocumento(documento);
		return fotoDocumento;
	}
	
	private void validaDataExpiracaoDocumento(Documento documento) throws NegocioException{
		if(documento.getTipoDocumento().getDescTipoDocumento().equals(PASSAPORTE) || documento.getTipoDocumento().getDescTipoDocumento().equals(CRNM)) {
			if(documento.getDataVencimento().isBefore(LocalDate.now(ZoneId.of(DateUtil.getZoneId())))) {
				throw new NegocioException("Documento com data de vigência expirada");
			}
		}
	}
	
	@Transactional(rollbackOn = NegocioException.class)
	private String validaCpf(String cpf) throws NegocioException {
		if(!CpfCnpjUtils.isValid(cpf)) {
			throw new NegocioException("CPF inválido");
		}
		return cpf;
	}

	public List<DocumentoDTO> findDocumentoByIdVisitante(Map<String, String[]> filter) {
		String parametros = (filter.get(PARAMETROS) != null ? filter.get(PARAMETROS)[0] : null);
		Integer idVisitante = parametros != null ? Integer.valueOf(parametros) : null;
		List<Documento> listaDocumentos = documentoRepository.findDocumentoByIdVisitante(idVisitante);
		List<DocumentoDTO> listaDocumentosDTO = new ArrayList<>();
		for(Documento e : listaDocumentos) {
			DocumentoDTO documentoDTO = model.map(e, DocumentoDTO.class);
			Pais pais = paisRepository.findByNomePais(e.getNomePais());
			documentoDTO.setPais(pais);
			FotoDocumento fotoDocumento = e.getFotosDocumento().get(e.getFotosDocumento().size() -1);
			documentoDTO.setFotoDocumentoFrente(fotoDocumento.getFotoDocumentoFrente());
			documentoDTO.setFotoDocumentoVerso(fotoDocumento.getFotoDocumentoVerso());
			if (documentoDTO.getIsPrincipal() && listaDocumentosDTO.size() > 0) {
				listaDocumentosDTO.add(0, documentoDTO);
			} else {
				listaDocumentosDTO.add(documentoDTO);
			}
		}
		return listaDocumentosDTO;
	}
	
	public List<DocumentoDTO> findDocumentoByIdVisitante(Integer idVisitante) {
		List<Documento> listaDocumentos = documentoRepository.findDocumentoByIdVisitante(idVisitante);
		List<DocumentoDTO> listaDocumentosDTO = new ArrayList<>();
		for(Documento e : listaDocumentos) {
			DocumentoDTO documentoDTO = model.map(e, DocumentoDTO.class);
			Pais pais = paisRepository.findByNomePais(e.getNomePais());
			documentoDTO.setPais(pais);
			FotoDocumento fotoDocumento = e.getFotosDocumento().get(e.getFotosDocumento().size() -1);
			documentoDTO.setFotoDocumentoFrente(fotoDocumento.getFotoDocumentoFrente());
			documentoDTO.setFotoDocumentoVerso(fotoDocumento.getFotoDocumentoVerso());
			if (documentoDTO.getIsPrincipal() && listaDocumentosDTO.size() > 0) {
				listaDocumentosDTO.add(0, documentoDTO);
			} else {
				listaDocumentosDTO.add(documentoDTO);
			}
		}
		return listaDocumentosDTO;
	}
	
	public List<DocumentoDTO> getListaDocumentoDTO(List<Documento> listaDocumentos) {
		List<DocumentoDTO> listaDocDTO = new ArrayList<>();
		for(Documento e : listaDocumentos) {
			if(e.getIsPrincipal()) {
				DocumentoDTO documentoDTO = model.map(e, DocumentoDTO.class);
				if(!e.getFotosDocumento().isEmpty()) {
					FotoDocumento fotoDocumento = e.getFotosDocumento().get(e.getFotosDocumento().size() -1);
					documentoDTO.setFotoDocumentoFrente(fotoDocumento.getFotoDocumentoFrente());
					documentoDTO.setFotoDocumentoVerso(fotoDocumento.getFotoDocumentoVerso());
				}
				Pais pais = paisRepository.findByNomePais(e.getNomePais());
				documentoDTO.setPais(pais);
				listaDocDTO.add(documentoDTO);
			}
		}
		return listaDocDTO;
	}
}
