package br.gov.camara.ditec.adm.sivis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import br.gov.camara.ditec.adm.sivis.service.dto.MensagemConvidadoDTO;

@Service
public class MailContentBuilder {
	
	private TemplateEngine templateEngine;
	 
    @Autowired
    public MailContentBuilder(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }
	
	public String buildEmailConfirmacao(MensagemConvidadoDTO mensagemConvidadoDTO) {
        Context context = new Context();
        context.setVariable("convidado", mensagemConvidadoDTO.getNomeConvidado());
        context.setVariable("convidado", mensagemConvidadoDTO.getNomeConvidado());
        context.setVariable("deputado", mensagemConvidadoDTO.getNomeDeputado());
        context.setVariable("local", mensagemConvidadoDTO.getLocal());
        context.setVariable("data", mensagemConvidadoDTO.getDataAgendamento());
        context.setVariable("periodo", mensagemConvidadoDTO.getPeriodo());
        context.setVariable("qrCode", mensagemConvidadoDTO.getPathQrCode());
        return templateEngine.process("emailAgendamentoConfirmarcao", context);
    }
	
	public String buildEmailCancelamento(MensagemConvidadoDTO mensagemConvidadoDTO) {
        Context context = new Context();
        context.setVariable("convidado", mensagemConvidadoDTO.getNomeConvidado());
        context.setVariable("deputado", mensagemConvidadoDTO.getNomeDeputado());
        context.setVariable("local", mensagemConvidadoDTO.getLocal());
        context.setVariable("data", mensagemConvidadoDTO.getDataAgendamento());
        context.setVariable("periodo", mensagemConvidadoDTO.getPeriodo());
        return templateEngine.process("emailAgendamentoCancelamento", context);
    }
}
