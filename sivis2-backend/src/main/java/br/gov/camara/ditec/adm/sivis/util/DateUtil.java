package br.gov.camara.ditec.adm.sivis.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateUtil {

	private static final String ZONE_ID = "America/Sao_Paulo";
	
	public static String getZoneId() {
		return ZONE_ID;
	}
	
	public static String localDateToString(LocalDate localDate) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		return localDate.format(formatter);
	}
}
