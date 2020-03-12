package br.gov.camara.ditec.adm.sivis.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import br.gov.camara.ditec.adm.sivis.log.Log;

@ResponseStatus(value=HttpStatus.UNPROCESSABLE_ENTITY)
public class NegocioException extends GeneralException{

	
	private static final long serialVersionUID = -524905763221133710L;
	
	/**
     * Construtor padrão da exceção.
     * @param statusCode código de erro HTTP
     */
    public NegocioException() {
        super();
    }

    /**
     * Construtor onde pode ser informada a mensagem a ser apresentada.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     */
    public NegocioException(String msg) {
        super(msg);
    }

    /**
     * Construtor onde pode ser informada a causa da exceção.
     * @param statusCode código de erro HTTP
     * @param cause causa origem da exceção lançada
     */
    public NegocioException(Throwable cause) {
        super(cause);
        Log.error(getClass(),"Exception {} has occurred" , new Exception(cause));
    }

    /**
     * Construtor onde pode ser informada a causa e a mensagem da exceção.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     * @param cause causa origem da exceção lançada
     */
    public NegocioException(String msg, Throwable cause) {
        super(msg, cause);
        Log.error(getClass(),"Exception {} has occurred" , new Exception(cause));
    }

}
