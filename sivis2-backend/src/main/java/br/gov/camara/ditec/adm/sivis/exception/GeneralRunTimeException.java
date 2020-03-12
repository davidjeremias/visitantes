package br.gov.camara.ditec.adm.sivis.exception;

public class GeneralRunTimeException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4770109216385798977L;

	/**
     * Construtor padrão da exceção.
     * @param statusCode código de erro HTTP
     */
    public GeneralRunTimeException() {
        super();
    }

    /**
     * Construtor onde pode ser informada a mensagem a ser apresentada.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     */
    public GeneralRunTimeException(String msg) {
        super(msg);
    }

    /**
     * Construtor onde pode ser informada a causa da exceção.
     * @param statusCode código de erro HTTP
     * @param cause causa origem da exceção lançada
     */
    public GeneralRunTimeException(Throwable cause) {
        super(cause);
    }

    /**
     * Construtor onde pode ser informada a causa e a mensagem da exceção.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     * @param cause causa origem da exceção lançada
     */
    public GeneralRunTimeException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
