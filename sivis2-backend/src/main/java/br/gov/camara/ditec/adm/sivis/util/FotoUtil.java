package br.gov.camara.ditec.adm.sivis.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

public class FotoUtil{
	
	private static final String[] TIPO = {"fot", "doc"};
	private static final String SEPARADOR_NOME = "-";
	private static final String SEPARADOR_PATH = "/";
	private static final String FRENTE = "frente";
	private static final String VERSO = "verso";
	private static final String PATH_IMAGE = "src/main/resources/templates/imagens/";
	private static final String HEADER = "header.png";
	private static final String FOOTER = "footer.png";

	public static MultipartFile getMultiPartFile(String path) {
		final File file = new File(path);
		MultipartFile multipartFile = null;
		try {
			final DiskFileItem fileItem = new DiskFileItem("file", Files.probeContentType(file.toPath()), true, file.getName(), 100000000, file.getParentFile());
			fileItem.getOutputStream();
			multipartFile = new CommonsMultipartFile(fileItem);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return multipartFile;
	}
	
	public static String montaNomeResourceRetorno(Integer idVisitante, String nomeFoto) {
		return idVisitante+SEPARADOR_PATH+nomeFoto;
	}
	
	public static String montaNomeFotoSalvar(Integer idVisitante, String path, String nomeFoto) {
		StringBuilder nome = new StringBuilder();
		if(nomeFoto == null) {
			nome.append(SEPARADOR_PATH).append(idVisitante.toString()).append(SEPARADOR_NOME).append(TIPO[0]).append(SEPARADOR_NOME).append(1);
		}else {
			String[] arr = nomeFoto.split("-");
			Integer num = Integer.valueOf(arr[2]);
			num++;
			String nomeNovo = arr[0].concat(arr[1])+num.toString();
			nome.append(nomeNovo);
		}
		return nome.toString();
	}
	
	public static String montaNomeDocumentoFrenteSalvar(Integer idVisitante, String path, String nomeFoto, String tipoDocumento) {
		StringBuilder nome = new StringBuilder();
		if(nomeFoto == null) {
			nome.append(SEPARADOR_PATH).append(idVisitante.toString()).append(SEPARADOR_NOME).append(TIPO[1]).append(SEPARADOR_NOME).append(tipoDocumento).append(SEPARADOR_NOME).append(FRENTE).append(SEPARADOR_NOME).append(1);
		}else {
			String[] arr = nomeFoto.split("-");
			Integer num = Integer.valueOf(arr[3]);
			num++;
			String nomeNovo = arr[0].concat(arr[1]).concat(arr[2])+num.toString();
			nome.append(nomeNovo);
		}
		return nome.toString();
	}
	
	public static String montaNomeDocumentoVersoSalvar(Integer idVisitante, String path, String nomeFoto, String tipoDocumento) {
		StringBuilder nome = new StringBuilder();
		if(nomeFoto == null) {
			nome.append(SEPARADOR_PATH).append(idVisitante.toString()).append(SEPARADOR_NOME).append(TIPO[1]).append(SEPARADOR_NOME).append(tipoDocumento).append(SEPARADOR_NOME).append(VERSO).append(SEPARADOR_NOME).append(1);
		}else {
			String[] arr = nomeFoto.split("-");
			Integer num = Integer.valueOf(arr[3]);
			num++;
			String nomeNovo = arr[0].concat(arr[1]).concat(arr[2])+num.toString();
			nome.append(nomeNovo);
		}
		return nome.toString();
	}
	
	public static String GetFotoHeader() {
		Path path = FileSystems.getDefault().getPath(PATH_IMAGE+HEADER);
		return FotoUtil.converterPathToBase64Puro(path);
	}
	
	public static String GetFotoFooter() {
		Path path = FileSystems.getDefault().getPath(PATH_IMAGE+FOOTER);
		return FotoUtil.converterPathToBase64Puro(path);
	}
	
	public static String converterResourceToBase64(Resource res) {
		String encodedString = null;
		try {
			byte[] bytes = Files.readAllBytes(res.getFile().toPath());
			encodedString = Base64.getEncoder().encodeToString(bytes);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return "data:image/png;base64,"+encodedString;
	}
	
	public static String converterPathToBase64(Path path) {
		String encodedString = null;
		try {
			byte[] bytes = Files.readAllBytes(path);
			encodedString = Base64.getEncoder().encodeToString(bytes);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return "data:image/png;base64,"+encodedString;
	}
	
	public static String converterPathToBase64Puro(Path path) {
		String encodedString = null;
		try {
			byte[] bytes = Files.readAllBytes(path);
			encodedString = Base64.getEncoder().encodeToString(bytes);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		System.out.println(encodedString);
		return encodedString;
	}
	
	public static String salvaFotoVisitante(String base64, String path, Integer id, String nomeFoto){
		String[] base64Formatada = base64.split(",");
		String nome = montaNomeFotoSalvar(id, path, nomeFoto);
		File file = new File(path.concat(nome));
		byte[] decodedBytes = Base64.getDecoder().decode(base64Formatada[1]);
		try {
			Files.write(file.toPath(), decodedBytes);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return nome;
	}
	
	public static String salvaDocumentoVisitante(String base64, String path, Integer id, String nomeDoc, String tipoDocumento, String ladoDocumento){
		String[] base64Formatada = base64.split(",");
		String nome = null;
		if(ladoDocumento.equals(FRENTE)) {
			nome = montaNomeDocumentoFrenteSalvar(id, path, nomeDoc, tipoDocumento);
		}else {
			nome = montaNomeDocumentoVersoSalvar(id, path, nomeDoc, tipoDocumento);
		}
		File file = new File(path.concat(nome));
		byte[] decodedBytes = Base64.getDecoder().decode(base64Formatada[1]);
		try {
			Files.write(file.toPath(), decodedBytes);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return nome;
	}
}
