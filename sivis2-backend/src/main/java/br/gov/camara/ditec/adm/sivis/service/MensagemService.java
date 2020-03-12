package br.gov.camara.ditec.adm.sivis.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.zxing.WriterException;

import br.gov.camara.ditec.adm.sivis.exception.NegocioException;
import br.gov.camara.ditec.adm.sivis.log.Log;
import br.gov.camara.ditec.adm.sivis.repository.AgendamentoCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.MensagemCustomRepository;
import br.gov.camara.ditec.adm.sivis.repository.MensagemRepository;
import br.gov.camara.ditec.adm.sivis.repository.model.AgendamentoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.Convidado;
import br.gov.camara.ditec.adm.sivis.repository.model.FotoConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.MensagemConvidado;
import br.gov.camara.ditec.adm.sivis.repository.model.TipoMensagem;
import br.gov.camara.ditec.adm.sivis.repository.model.enumeration.PeriodoEnum;
import br.gov.camara.ditec.adm.sivis.service.dto.ConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.MensagemConvidadoDTO;
import br.gov.camara.ditec.adm.sivis.service.dto.QrCodeDTO;
import br.gov.camara.ditec.adm.sivis.util.DateUtil;
import br.gov.camara.ditec.adm.sivis.util.EmailUtil;
import br.gov.camara.ditec.adm.sivis.util.FotoUtil;
import br.gov.camara.ditec.adm.sivis.util.RequisicaoUtil;
import br.leg.camara.carteiro.Anexo;
import br.leg.camara.carteiro.CarteiroException;
import br.leg.camara.carteiro.ClienteCarteiro;
import br.leg.camara.carteiro.Contato;
import br.leg.camara.carteiro.Mensagem;
import br.leg.camara.carteiro.RequisicaoEnvioEmail;

@Service
public class MensagemService {
	
	private static final String ASSUNTO_CONFIRMACAO = "Câmara dos Deputados - Agendamento de reunião";
	private static final String ASSUNTO_ALTERACAO = "Câmara dos Deputados - Atualização de agendamento de reunião";
	private static final String ASSUNTO_CANCELAMENTO = "Câmara dos Deputados - Cancelamento de agendamento de reunião";
	private static final String TIPO_EMAIL_CONFIRMACAO = "Confirmação";
	private static final String TIPO_EMAIL_CANCELAMENTO = "Cancelamento";
	private static final String DATA_INICIO = "dataInicio";
	private static final String DATA_FIM = "dataFim";
	private static final String TIPO_EMAIL = "tipoEmail";
	private static final String NOME = "nome";
	private static final String ID_AGENDAMENTO = "idAgendamento";
	private static final String HEADER = "header.png";
	private static final String FOOTER = "footer.png";
	private static final String TIPO_EMAIL_ALTERACAO = "Alteração";
	
	@Autowired
	private MensagemRepository repository;
	
	@Autowired
	private MensagemCustomRepository crepo;
	
	@Autowired
	private AgendamentoCustomRepository agendamentoCustomRepository;
	
	@Autowired
	ClienteCarteiro cliente;
	
	@Autowired
	private MailContentBuilder mailBuilder;
	
	@Autowired
	private QrCodeGeneratorService qrCodeGeneratorService;
	
	@Autowired
	private AgendamentoConvidadoService agendamentoConvidadoService;
	
	@Autowired
	private TipoMensagemService tipoMensagemService;
	
	@Autowired
	private FotoConvidadoService fotoConvidadoService;
	
	@Autowired
	private FotoEmailService fotoEmailService;
	
	@Autowired
	private ConvidadoService convidadoService;
	
	@Autowired
	ModelMapper model;
	
	public MensagemConvidadoDTO buscaQuantidadeMensagemPorConvidado(Integer idConvidado, Integer idAgendamento) {
		AgendamentoConvidado agConv = agendamentoConvidadoService.buscarAgendamentoConvidado(idConvidado, idAgendamento);
		MensagemConvidadoDTO mensagemConvidadoDTO = new MensagemConvidadoDTO();
		mensagemConvidadoDTO.setQtMsgConfirmacao(repository.buscaQuantidadeMensagemConfirmacaoPorConvidado(agConv.getAgendamento().getId(), agConv.getConvidado().getId()));
		mensagemConvidadoDTO.setQtMsgAlteracao(repository.buscaQuantidadeMensagemAlteracaoPorConvidado(agConv.getAgendamento().getId(), agConv.getConvidado().getId()));
		mensagemConvidadoDTO.setQtMsgCancelamento(repository.buscaQuantidadeMensagemCancelamentoPorConvidado(agConv.getAgendamento().getId(), agConv.getConvidado().getId()));
		return mensagemConvidadoDTO;
	}
	
	private MensagemConvidadoDTO preparaMensagemConvidado(ConvidadoDTO convidado, Integer idAgendamento) throws IOException{
		MensagemConvidadoDTO mensagemConvidado = null;
		AgendamentoConvidado convite = agendamentoCustomRepository.buscarAgendamentoConvidado(convidado.getId(), idAgendamento); 
		if(convite != null) {
			mensagemConvidado = new MensagemConvidadoDTO();
			QrCodeDTO qrCode = new QrCodeDTO();
			qrCode.setIdConvite(convite.getId());
			File file = null;
			try {
				file = qrCodeGeneratorService.gerarQrCode(qrCode);
			} catch (WriterException | IOException e) {
				Log.error(getClass(), e);
			}
			mensagemConvidado.setAgendamentoConvidado(convite);
			mensagemConvidado.setDataAgendamento(DateUtil.localDateToString(convite.getAgendamento().getDataAgendamento()));
			mensagemConvidado.setNomeConvidado(convite.getConvidado().getNomeConvidado());
			mensagemConvidado.setNomeDeputado(convite.getAgendamento().getNomePatrocinador());
			mensagemConvidado.setLocal(convite.getAgendamento().getLocal());
			mensagemConvidado.setPeriodo(PeriodoEnum.getEnumByName(convite.getAgendamento().getPeriodo().getId()));
			mensagemConvidado.setEmailConvidado(convite.getConvidado().getEmail());
			mensagemConvidado.setPathQrCode(FotoUtil.converterPathToBase64(file.toPath()));
		}
		return mensagemConvidado;
	}
	
	public List<MensagemConvidadoDTO> sendEmailCamara(MensagemConvidadoDTO mensagemConvidado) throws IOException, WriterException, CarteiroException{
		Mensagem msg = null;
		MensagemConvidadoDTO mensagemConvidadoDTO = null;
		List<MensagemConvidadoDTO> listMensagem = new ArrayList<MensagemConvidadoDTO>();
		for (ConvidadoDTO convidado: mensagemConvidado.getConvidados()) {
			try {
				mensagemConvidadoDTO = preparaMensagemConvidado(convidado, mensagemConvidado.getIdAgendamento());
				mensagemConvidadoDTO.setAgendamentoConvidado(null);
				mensagemConvidadoDTO.setConvidado(convidado);
				mensagemConvidadoDTO.setIdAgendamento(mensagemConvidado.getIdAgendamento());
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			String content = null;
			msg = new Mensagem();
	        if(mensagemConvidado.getTipoEmail().equals(TIPO_EMAIL_CONFIRMACAO) && convidado.getMensagemConvidado().getQtMsgConfirmacao() == 0) {
	        	msg.setAssunto(ASSUNTO_CONFIRMACAO);
	        	content = mailBuilder.buildEmailConfirmacao(mensagemConvidadoDTO);
	        }else if(mensagemConvidado.getTipoEmail().equals(TIPO_EMAIL_CANCELAMENTO) && convidado.getMensagemConvidado().getQtMsgConfirmacao() > 0) {
	        	msg.setAssunto(ASSUNTO_CANCELAMENTO);
	        	content = mailBuilder.buildEmailCancelamento(mensagemConvidadoDTO);
	        }else if(convidado.getMensagemConvidado().getQtMsgConfirmacao() > 0){
	        	msg.setAssunto(ASSUNTO_ALTERACAO);
	        	content = mailBuilder.buildEmailConfirmacao(mensagemConvidadoDTO);
	        }
	        
			if (content != null) {
				msg.setTexto(EmailUtil.getTexto());
				msg.setHtml(content);
				msg.setImagens(Arrays.asList(
						Anexo.builder().nome(HEADER).conteudo(fotoEmailService.getFotoEmail().getFotoHeader()).build(),
						Anexo.builder().nome(FOOTER).conteudo(fotoEmailService.getFotoEmail().getFotoFooter())
								.build()));
				msg.setRemetente(EmailUtil.getRemetente());
				msg.setPara(Collections.singletonList(new Contato(mensagemConvidadoDTO.getNomeConvidado(),
						mensagemConvidadoDTO.getEmailConvidado())));
				msg.setDataDeEnvio(new Date());
				msg.setPrioridade(1);

				RequisicaoEnvioEmail requisicao = RequisicaoEnvioEmail.builder().solicitante(EmailUtil.getSolicitante())
						.mensagem(msg).build();
				try {
					cliente.enviarEmail(requisicao);
					Log.info(this.getClass(), "Email enviado...");
					mensagemConvidadoDTO.setTipoEmail(mensagemConvidado.getTipoEmail());
					mensagemConvidadoDTO.setStatusEnvio(true);
					salvar(mensagemConvidadoDTO, convidado);
				} catch (CarteiroException e2) {
					Log.error(getClass(), e2);
					mensagemConvidadoDTO.setStatusEnvio(false);
				}
				listMensagem.add(mensagemConvidadoDTO);
			}
		}
		return listMensagem;
	}

	@Transactional(rollbackOn = NegocioException.class)
	private void salvar(MensagemConvidadoDTO mensagemConvidadoDTO, ConvidadoDTO convidadoDTO) {
		TipoMensagem tipoMensagem = tipoMensagemService.findByName(mensagemConvidadoDTO.getTipoEmail());
		AgendamentoConvidado agendamentoConvidado = agendamentoConvidadoService.buscarAgendamentoConvidado(convidadoDTO.getId(), mensagemConvidadoDTO.getIdAgendamento());
		if(tipoMensagem != null) {
			MensagemConvidado mensagem = MensagemConvidado.builder()
					.agendamento(agendamentoConvidado.getAgendamento())
					.convidado(agendamentoConvidado.getConvidado())
					.tipoMensagem(tipoMensagem)
					.dataEnvio(LocalDateTime.now(ZoneId.of(DateUtil.getZoneId())))
					.build();
			repository.save(mensagem);
		}
	}

	public List<MensagemConvidadoDTO> buscaPorParametros(Map<String, String[]> filter) {
		String dataInicio = RequisicaoUtil.extrairParametro(filter, DATA_INICIO);
		LocalDate inicio = dataInicio != null ? LocalDate.parse(dataInicio) : null;
		LocalTime hrInicio = LocalTime.now().withHour(0).withMinute(0);
		LocalDateTime dtInicio = inicio != null ? LocalDateTime.of(inicio, hrInicio) : null;
		
		String dataFim = RequisicaoUtil.extrairParametro(filter, DATA_FIM);
		LocalDate fim = dataFim != null ? LocalDate.parse(dataFim) : null;
		LocalTime hrFim = LocalTime.now().withHour(23).withMinute(0);
		LocalDateTime dtFim = fim != null ? LocalDateTime.of(fim, hrFim) : null;
		
		String tipoMensagem = RequisicaoUtil.extrairParametro(filter, TIPO_EMAIL);
		TipoMensagem tm = tipoMensagemService.findByName(tipoMensagem);
		Integer idTipoMensagem = null;
		if(tm != null)
			idTipoMensagem = tm.getId();
		String nome = RequisicaoUtil.extrairParametro(filter, NOME);
		
		Integer idAgendamento = RequisicaoUtil.extrairParametroInteiro(filter, ID_AGENDAMENTO);
		
		List<MensagemConvidado> listaMensagemConvidado = crepo.buscaPorParametros(nome, dtInicio, dtFim, idTipoMensagem, idAgendamento);
		List<MensagemConvidadoDTO> retorno = new ArrayList<>();
		
		for(MensagemConvidado msgConv : listaMensagemConvidado) {
			MensagemConvidadoDTO dto = new MensagemConvidadoDTO();
			if(msgConv != null) {
				ConvidadoDTO convidadoDTO = convidadoService.buscaConvidadoMensagemConvidadoPorId(msgConv.getId());
				dto.setConvidado(convidadoDTO);
				FotoConvidado fotoConvidado = fotoConvidadoService.buscarFotoConvidadoPorIdConvidado(convidadoDTO.getId());
				if(fotoConvidado != null) {
					dto.setFotoConvidado(fotoConvidado.getImagemFoto());
				}
				dto.setNomeConvidado(convidadoDTO.getNomeConvidado());
				dto.setDataEnvio(msgConv.getDataEnvio());
				dto.setTipoEmail(msgConv.getTipoMensagem().getTipoMensagem());
				retorno.add(dto);
			}
		}
		return retorno;
	}

	public void enviarMensagemAlteracaoAgendamento(List<Convidado> convidadosAgendamento, Integer idAgendamento) {
		MensagemConvidadoDTO mensagemConvidadoDTO = new MensagemConvidadoDTO();
		mensagemConvidadoDTO.setTipoEmail(TIPO_EMAIL_ALTERACAO);
		mensagemConvidadoDTO.setIdAgendamento(idAgendamento);
		mensagemConvidadoDTO.setConvidados(prepararListaConvidadoDTO(convidadosAgendamento,idAgendamento) );
		
		try {
			sendEmailCamara(mensagemConvidadoDTO);
		} catch (CarteiroException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private List<ConvidadoDTO> prepararListaConvidadoDTO(List<Convidado> convidadosAgendamento, Integer idAgendamento) {
		List<ConvidadoDTO> convidadoDTOList = new ArrayList<>();
		
		for(Convidado conv : convidadosAgendamento) {
			ConvidadoDTO convDTO = new ConvidadoDTO();
			convDTO = model.map(conv, ConvidadoDTO.class);
			convDTO.setMensagemConvidado(prepararQuantidadeMensagemConvidado(conv,idAgendamento));
			convidadoDTOList.add(convDTO);
		}
		return convidadoDTOList;
	}

	private MensagemConvidadoDTO prepararQuantidadeMensagemConvidado(Convidado conv, Integer idAgendamento) {
		return buscaQuantidadeMensagemPorConvidado(conv.getId(),idAgendamento);
	}

	public void enviarMensagemExclusaoAgendamento(List<Convidado> convidadosAgendamento, Integer idAgendamento) {
		
		MensagemConvidadoDTO mensagemConvidadoDTO = new MensagemConvidadoDTO();
		mensagemConvidadoDTO.setTipoEmail(TIPO_EMAIL_CANCELAMENTO);
		mensagemConvidadoDTO.setIdAgendamento(idAgendamento);
		mensagemConvidadoDTO.setConvidados(prepararListaConvidadoDTO(convidadosAgendamento, idAgendamento));
		
		try {
			sendEmailCamara(mensagemConvidadoDTO);
		} catch (CarteiroException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public void excluir(Integer idConvidado) {
		repository.deleteByIdConvidado(idConvidado);
	}
}
