package br.gov.camara.ditec.adm.sivis.service;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import br.gov.camara.ditec.adm.sivis.log.Log;
import br.gov.camara.ditec.adm.sivis.service.dto.QrCodeDTO;

@Service
public class QrCodeGeneratorService {
	
	private static final String EXTENSAO = ".png";
	private static final String FORMATO = "PNG";

	public File gerarQrCode(QrCodeDTO qrCodeDTO) throws WriterException, IOException {
		File file = File.createTempFile(qrCodeDTO.getIdConvite().toString()+"qrcode", EXTENSAO);
		QRCodeWriter write = new QRCodeWriter();
		BitMatrix bitMatrix = write.encode("Código do Agendamento: "+qrCodeDTO.getIdConvite(), BarcodeFormat.QR_CODE, 200, 200);
		
		MatrixToImageWriter.writeToPath(bitMatrix, FORMATO, file.toPath());
		Log.info(this.getClass(), "QrCode criado...");
		return file;
	}
	
	public void deleteQrCode(File file) throws IOException {
		if(file.exists())
			file.deleteOnExit();
    	Log.info(this.getClass(), "QrCode deletado...");
	}
}
