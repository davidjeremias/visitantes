<template>
  <div class="col-md-12 marginContainerBottom">
    <div class="page-header">
      <h1>Encaminhar mensagens a convidados de agendamento</h1>
    </div>
    <painel-gabinete :siglaParlamentar="this.$siglaParlamentar" :nomeParlamentar="this.$nomeParlamentar"/>

    <div v-show="isAlertError" data-pic-alert='{"type": "error"}'>
	        {{msg}}
    </div>

    <div v-show="isAlertSucess" data-pic-alert='{"type": "success"}'>
	    <p>
        Mensagem de <b>{{tipoEmail}}</b> enviada com sucesso para o(s) convidado(s).
        <ul>
          <li v-for="convidado in arrSucess" :key=convidado>{{ convidado.nome }}</li>
        </ul>
      </p>
    </div>

    <div v-show="isAlertErrorList" data-pic-alert='{"type": "error"}'>
	    <p>
        Mensagem de <b>{{tipoEmail}}</b> não enviada para os convidados:
        <ul>
          <li v-for="convidado in arrError" :key=convidado>{{ convidado.nome }}</li>
        </ul>
      </p>
    </div>

    <div class="row main-info-container">
      <div class="col-md-12">
        <div class="form-group">
          <label for="descricao">Descrição do Agendamento</label>
          <input type="text" v-model="descricao" class="form-control input-large" id="descricao" disabled />
        </div>
      </div>

      <div class="col-md-3">
        <div class="form-group">
          <label for="local">Local</label>
          <input type="text" id="local" v-model="local" class="form-control" disabled />
        </div>
      </div>

      <div class="col-md-3">
        <div class="form-group">
          <label for="patrocinador">Nome do Patrocinador</label>
          <input type="text" v-model="patrocinador" class="form-control" id="patrocinador" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="data">Data</label>
          <input type="date" v-model="dataAgendamento" class="form-control" id="data" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="periodo">Período</label>
          <input type="text" id="periodo" v-model="periodo" class="form-control" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="situacao">Situação</label>
          <input type="text" id="situacao" v-model="situacao" class="form-control" disabled />
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div class="buttons">
          <a href="#" @click="enviaMensagem('Confirmação')" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            <span class="buttonWithIcon">E-mail de confirmação</span>
          </a>
          <a href="#" @click="enviaMensagem('Cancelamento')" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            <span class="buttonWithIcon">E-mail de cancelamento</span>
          </a>
          <a @click="abrirPesquisaMensagens()" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            <span class="buttonWithIcon">Pesquisar Mensagens</span>
          </a>

          <a @click="voltar" class="btn btn-primary btnCreateMarginTop pull-right">
            <span class="buttonWithIcon">Voltar</span>
          </a>
      </div>
    </div>

    <div class="col-md-12"> <hr> </div>

    <div class="col-md-12">
      <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
        <thead>
          <tr>
            <td class="text-center"><input id="todos" type="checkbox" v-model="selectAll" @click="select"></td>
            <th>Foto</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Identificação</th>
            <th>Qtd. Confirmação </th>
            <th>Qtd. Canceladas </th>
            <th>Enviadas</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="element in listaConvidados" :key="element.id">
            <td width="3%" class="text-center">
              <input type="checkbox" :value="element.id" v-model="listaConvidadosSelecionados">
            </td>
            <td width="5%" class="text-center">
                <template v-if="element.fotoConvidadoDTO != null">
                  <img :src="element.fotoConvidadoDTO.imagemFoto"  class="molduraFotoConvidado"/>
                </template>
                <template v-else>
                 <img src="images/avatar_sem_foto.jpeg" alt="Foto do convidado"  class="imagemFotoConvidado" />
                </template>
              
            </td>
            <td width=""><span>{{element.nomeConvidado}}</span></td>
            <td width=""><span>{{formataFone(element.telefone)}}</span></td>
            <td width=""><span>{{formataCPF(element.cpf)}}</span></td>
            <td width=""><span>{{element.mensagemConvidado.qtMsgConfirmacao + element.mensagemConvidado.qtMsgAlteracao}}</span></td>
            <td width=""><span>{{element.mensagemConvidado.qtMsgCancelamento}}</span></td>
            <td width=""><span>{{element.mensagemConvidado.qtMsgCancelamento + element.mensagemConvidado.qtMsgConfirmacao + element.mensagemConvidado.qtMsgAlteracao}}</span></td>
            <td width="7%" class="clearfix">
                  <div class="text-left clearfix">
                  <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}' >
                    <li>
                      <a @click="detalharConvidadoAgendado(element.id, element.agendamentoDTO.id)" title="Detalhar Convidado Agendado">Detalhar</a>
                    </li>
                  </ul>
                  </div>
                </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {mask} from 'vue-the-mask'

  export default {
      name: "EncaminharMensagem",
      directives: {mask},
      props: {
        idAgendamento: Number,
      },
      data() {
          return {
              isListaConvidados: null,
              isDetalhar: true,
              // CABEÇALHO
              id: '',
              descricao: '',
              local: '',
              patrocinador: '',
              dataAgendamento: '',
              periodo: '',
              situacao: '',
              // TABELA
              avatar: '../../images/avatar_sem_foto.png',
              listaConvidados: [],
              listaConvidadosSelecionados: [],
              msg: '',
              tipoEmail: '',
              isAlertSucess: false,
              isAlertError: false,
              isAlertErrorList: false,
              convidadosEmail: [],
              selectAll: false,
              arr: [],
              arrError: [],
              arrSucess: []
          };
      },
      created: function() {
        if(this.idAgendamento){
          this.$http
            .get("/agendamento/buscaPorId", {
              params: { 
                idAgendamento: this.idAgendamento 
              }
            })
            .then(
              function(response) {
                console.log(response);
                if (response.status === 200) {

                  this.isListaConvidados = true;

                  var data = response.data;
                  //this.agenda = response.data;
                  this.id = data.id;
                  this.descricao = data.descricaoAgendamento;
                  this.local = data.local;
                  this.patrocinador = data.nomePatrocinador;
                  this.dataAgendamento = data.dataAgendamento;
                  this.periodo = this.prepararPeriodo(data.periodo).nome;
                  this.situacao = this.prepararSituacao(data.situacao).nome;
                  this.buscarConvidados(this.id);
                }else{
                  this.isListaConvidados = false;
                }
              }
              .bind(this)
              )
              .catch(function(error) {
              // handle error
              console.log(error);
            });
        }
      },
      watch:{
        isAlertSucess(novo, antigo){
          setTimeout(() => {
            this.isAlertSucess = false;
          }, 7000);
        },
        isAlertError(novo, antigo){
          setTimeout(() => {
            this.isAlertError = false;
          }, 7000);
        },
        isAlertErrorList(novo, antigo){
          setTimeout(() => {
            this.isAlertError = false;
          }, 7000);
        }
      },
      methods: {
        voltar(){
          window.history.back();
        },
        buscarConvidados(idAgendamento){
          this.$http
            .get(`/convidado/listarConvidados?parametros=`+idAgendamento)
            .then(
              function(response) {
                this.listaConvidados = response.data.content;
              }.bind(this)
            )
            .catch(function(error) {
              // handle error
              console.log(error);
            })
            .then(function() {
              // always executed
            });
        },
        select() {
          this.listaConvidadosSelecionados = [];
          if (!this.selectAll) {
            for (let i in this.listaConvidados) {
              this.listaConvidadosSelecionados.push(this.listaConvidados[i].id);
            }
          }
        },
        enviaMensagem(tipoEmail){
          this.arr = [];
          this.arrSucess = [];
          this.arrError = [];

          this.listaConvidados.forEach( el => {
            this.listaConvidadosSelecionados.forEach( e => {
              if(e == el.id){
                let convidado = {
                  id: el.id,
                  nome: el.nomeConvidado,
                  mensagemConvidado: {
                    qtMsgConfirmacao: el.mensagemConvidado.qtMsgConfirmacao
                  }
                };
                this.arr.push(convidado);
              }
            });
          });

          let mensagemConvidadoDTO = {
            idAgendamento: this.idAgendamento ? this.idAgendamento: null,
            tipoEmail: tipoEmail,
            convidados: this.arr
          };

          if(this.listaConvidadosSelecionados.length > 0){
            this.$http
            .post(`/mensagem`, mensagemConvidadoDTO)
            .then(
              function(response) {
                if(response.status === 200){
                  response.data.forEach( e => {
                    if(e.statusEnvio){
                      let convidado = {
                        nome: e.nomeConvidado
                      }
                      this.arrSucess.push(convidado);
                      this.isAlertSucess = true;
                    }else{
                      let convidado = {
                        nome: e.nomeConvidado
                      }
                      this.arrError.push(convidado);
                      this.isAlertErrorList = true;
                    }
                  });
                  this.tipoEmail = tipoEmail;
                  this.buscarConvidados(this.id);
                  this.listaConvidadosSelecionados = [];
                  this.selectAll = false;
                }
              }.bind(this)
            )
            .catch(function(error) {
              // handle error
              console.log(error);
            })
            .then(function() {
              // always executed
            });
          }else{
            this.isAlertError = true;
            this.msg = 'Selecione algum participante para enviar a mensagem.'
          }
          
        },
        prepararSituacao(situacaoNome){
          switch (situacaoNome) {  
              case 'Agendado': 
              case 'AGENDADO': return {id:1,nome:"Agendado" };
              case 'Cancelado':
              case 'CANCELADO': return {id:0,nome:"Cancelado"}; 
          } 
        },
        prepararPeriodo(periodo){
          switch (periodo) {  
            case 'Manhã': 
            case 'MANHA':return {id:0,nome:"Manhã" };
            case 'Tarde':
            case 'TARDE': return {id:1,nome:"Tarde"};
            case 'Manhã e Tarde':
            case 'MANHA_TARDE':return {id:2,nome:"Manhã e Tarde"};
          }
        },
        formataFone(fone){
          if(fone != null){
          //retira os caracteres indesejados...
          fone = fone.replace(/[^\d]/g, "");
          //realizar a formatação...
          fone=fone.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
          fone=fone.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
          fone.replace(/(\d)(\d{4})$/,"$1-$2");
          }else{
            return null;
          }
          return fone;
        },
        formataCPF(cpf) {
          //retira os caracteres indesejados...
          cpf = cpf.replace(/[^\d]/g, "");
          //realizar a formatação...
          return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        },
        abrirPesquisaMensagens(){
          this.$router.push({
            name: "pesquisarMensagens",
            params: { idAgendamento: this.idAgendamento }
          });
        },
        detalharConvidadoAgendado(convidadoID,agendaID){
          this.$router.push({
            name: "adicionarConvidado",
            params: {convidadoID: convidadoID, idAgendamento: agendaID ,isDetalhar: true}
          });
        },
      },
      updated(){
        PIC.refreshWidget('Actionsbar');

        if(this.isListaConvidados){      
          var elem1 = document.querySelector('.zeroRecords');
          var elem2 = document.querySelector('.dataTables_info');
          if(elem1 != null && elem2 != null){
            elem1.style.display = 'none';
            elem2.style.display = 'none';
          }
        
        } else {
          var elem1 = document.querySelector('.zeroRecords');
          var elem2 = document.querySelector('.dataTables_info');
          if(elem1 != null && elem2 != null){
            elem1.style.display = 'block';
            elem2.style.display = 'block';
          }
        }  
        //PIC.activateWidget('Actionsbar'); 
      }
  };
</script>