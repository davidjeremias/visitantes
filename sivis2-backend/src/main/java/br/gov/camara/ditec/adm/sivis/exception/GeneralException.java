package br.gov.camara.ditec.adm.sivis.exception;

public abstract class GeneralException extends Exception{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3079993329414961050L;

	/**
     * Construtor padrão da exceção.
     * @param statusCode código de erro HTTP
     */
    public GeneralException() {
        super();
    }

    /**
     * Construtor onde pode ser informada a mensagem a ser apresentada.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     */
    public GeneralException(String msg) {
        super(msg);
    }

    /**
     * Construtor onde pode ser informada a causa da exceção.
     * @param statusCode código de erro HTTP
     * @param cause causa origem da exceção lançada
     */
    public GeneralException(Throwable cause) {
        super(cause);
    }

    /**
     * Construtor onde pode ser informada a causa e a mensagem da exceção.
     * @param statusCode código de erro HTTP
     * @param msg mensagem do erro
     * @param cause causa origem da exceção lançada
     */
    public GeneralException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
