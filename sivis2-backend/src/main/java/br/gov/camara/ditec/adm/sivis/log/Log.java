package br.gov.camara.ditec.adm.sivis.log;

import java.util.logging.Level;
import java.util.logging.Logger;

import br.gov.camara.ditec.adm.sivis.exception.GeneralRunTimeException;

public abstract class Log {

	 public static void log(Class<?> clazz, Level level, String msg, Exception ex) {

	        if(clazz == null) {
	            throw new GeneralRunTimeException("Parâmetro clazz não pode ser nulo", ex);
	        }

	        if(level == null) {
	            throw new GeneralRunTimeException("Parâmetro level não pode ser nulo", ex);
	        }

	        if(msg == null && ex == null) {
	            throw new GeneralRunTimeException("É necessário informar uma mensagem ou uma exception", ex);
	        }
	        
	        if(msg == null) {
	            Logger.getLogger(clazz.getName()).log(level, ex.getMessage(), ex);

	        } else if(ex == null) {
	            Logger.getLogger(clazz.getName()).log(level, msg);

	        } else {
	            Logger.getLogger(clazz.getName()).log(level, msg, ex);
	        }

	    }

	    public static void log(Class<?> clazz, Level level, Exception ex) {
	        log(clazz, level, null, ex);
	    }

	    public static void log(Class<?> clazz, Level level, String msg) {
	        log(clazz, level, msg, null);
	    }

	    public static void info(Class<?> clazz, String msg, Exception ex) {
	        log(clazz, Level.INFO, msg, ex);
	    }

	    public static void info(Class<?> clazz, Exception ex) {
	        log(clazz, Level.INFO, null, ex);
	    }

	    public static void info(Class<?> clazz, String msg) {
	        log(clazz, Level.INFO, msg);
	    }

	    public static void error(Class<?> clazz, String msg, Exception ex) {
	        log(clazz, Level.SEVERE, msg, ex);
	    }

	    public static void error(Class<?> clazz, Exception ex) {
	        log(clazz, Level.SEVERE, null, ex);
	    }

	    public static void error(Class<?> clazz, String msg) {
	        log(clazz, Level.SEVERE, msg, null);
	    }

	    public static void warn(Class<?> clazz, String msg, Exception ex) {
	        log(clazz, Level.WARNING, msg, ex);
	    }

	    public static void warn(Class<?> clazz, Exception ex) {
	        log(clazz, Level.WARNING, null, ex);
	    }

	    public static void warn(Class<?> clazz, String msg) {
	        log(clazz, Level.WARNING, msg, null);
	    }

	    public static void debug(Class<?> clazz, String msg, Exception ex) {
	        log(clazz, Level.CONFIG, msg, ex);
	    }

	    public static void debug(Class<?> clazz, Exception ex) {
	        log(clazz, Level.CONFIG, null, ex);
	    }

	    public static void debug(Class<?> clazz, String msg) {
	        log(clazz, Level.CONFIG, msg, null);
	    }
}
