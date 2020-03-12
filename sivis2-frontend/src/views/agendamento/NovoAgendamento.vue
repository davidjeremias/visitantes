<template>
  <div class="col-md-12">
    <div class="page-header">
      <h1>{{ this.isAlteracao ? 'Alterar agendamento do gabinete' : 'Incluir agendamento ao gabinete'}}</h1>
    </div>

    <painel-gabinete :siglaParlamentar="this.$siglaParlamentar" :nomeParlamentar="this.$nomeParlamentar" />

    <div v-show="isAlertError" data-pic-alert='{"type": "error"}'>
      {{msg}}
    </div>

    <div v-show="isAlertErrorList" data-pic-alert='{"type": "error"}'>
	    <p>
        Mensagem de <b>{{tipoEmail}}</b> não enviada para os convidados:
        <ul>
          <li v-for="convidado in arrError" :key=convidado>{{ convidado.nome }}</li>
        </ul>
      </p>
    </div>

<div v-show="isErrosValidacao" data-pic-alert='{"type": "error"}'>
	    <p v-if="errosValidados.length">
        <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
        <ul>
      <li v-for="error in errosValidados" :key=error>{{ error }}</li>
    </ul>
     </p>
    </div>
    <form id="novoAgendamento" >
      <div class="row main-info-container">
        <div class="col-md-12">
          <div class="form-group">
            <label for="descricao">Descrição do Agendamento</label>
            <input type="text" v-model="descricao" required oninvalid="É necessário um nome para o agendamento." class="form-control input-large" id="descricao" maxlength="200" />
          </div>
        </div>

        <div class="col-md-3">
          <div class="form-group">
            <label for="local">Local</label>
            <input id="local" v-model="local" class="form-control" disabled />
          </div>
        </div>

        <div class="col-md-3">
          <div class="form-group">
            <label for="patrocinador">Nome do Patrocinador</label>
            <input type="text" v-model="patrocinador" class="form-control" id="patrocinador" disabled/>
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-group">
            <label for="data">Data</label>
            <input type="date" v-model="dataAgendamento" required oninvalid="Informe a data do agendamento." class="form-control" id="data" @blur="verificarData();" pattern="/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/"/>
          </div>
          <div v-if="isErro" style="text-align:center;font-size:small;color:red;">{{ msgErro }}</div>
        </div>

        <div class="col-md-2">
          <div class="form-group">
            <label for="periodo">Período</label>
            <select id="periodo" v-model="periodo" required oninvalid="Informe se será manhã, tarde ou os dois períodos." class="form-control" >
              <option value selected>Selecione</option>
              <option v-for="(e, key) in listarPeriodos" :value="e" :key="key" >{{ e.nome }}</option>
            </select>
          </div>
        </div>
        <div v-if="isAlteracao" class="col-sm-2">
          <div class="form-group">
            <label for="situacao">Situação</label>
            <select id="situacao" v-model="situacao" required oninvalid="Informe se será Agendada ou Cancelada." class="form-control" >
              <option value selected>Selecione</option>
              <option v-for="(e, key) in listaSituacoes" :value="e" :key="key" >{{ e.nome }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <template v-if="!isAlteracao">
          <button type="button" @click="validarFormulario($event)" class="btn btn-primary btnCreateMarginTop pull-right" >
            Novo Agendamento
          </button>
        </template>
        <template v-if="isAlteracao">
          <button type="button" @click="prepararAlterarAgendamento()" class="btn btn-primary btnCreateMarginTop pull-right">
            Alterar Agendamento
          </button>
        </template>
      </div>
    </form>
    <div class="espacamentoPageFinal"></div>

  <!-- MODAIS -->

    <div data-pic-modal='{"title": "Confirmar Alterar Agendamento", "dialog": "default", "size": "sm"}' id="modalAlterarAgendamento">
      <form>
        <div class="col-md-12 text-center">

          <i class="fa fa-exclamation-circle" style="font-size:28px;color:red"></i>
          <template v-if="this.isPossuiConvidado">
            Os Convidados cadastrados para este Agendamento receberão uma mensagem de alteração.<br /> 
            Confirma a alteração deste Agendamento?
          </template>
          <template v-else>
            Confirma a alteração deste Agendamento?
          </template>
        </div>
        <div class="buttons">
          <button type="button" @click="fecharModal()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Não
          </button>
          <button type="button" @click="validarFormulario($event)()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Sim
          </button>

        </div>
      </form>
    </div>

<div class="espacamentoPageFinal"></div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: "NovoAgendamento",
  props: {
    agenda: Object,
    msg: String,
    isAlert: Boolean,
    idAgendamento: Number
  },

  data() {
    return {
      isAlertError: false,
      isAlertErrorList: false,
      isAlertSucess: false,
      tipoEmail: '',
      isAlteracao:false,
      dataCadastro: "",
      descricao: "",
      local: "Gabinete "+this.$siglaParlamentar,
      patrocinador: this.$nomeParlamentar,
      dataAgendamento: "",
      periodo: "",
      idParlamentar: "",
      situacao: "",
      msgErro: "",
      isErro: false,
      listaSituacoes: [],
      listarPeriodos: [],
      isErrosValidacao: false,
      errosValidados: [],
      atual_dataAgendamento: '',
      atual_periodo: '',
      atual_situacao: '',
      listaConvidados:[],
      arrayConvidados: [],
      arrError: [],
      arrSucess: [],
      isPossuiConvidado: false
    };
  },
  created: function() {

    if (this.idAgendamento) {
    this.$http
          .get("/agendamento/buscaPorId", {
            params: { idAgendamento: this.idAgendamento }
          })
          .then(
            function(response) {
              console.log(response);
              if (response.status === 200) {
                var data = response.data;
                //this.agenda = response.data;
                this.id = data.id;
                this.descricao = data.descricaoAgendamento;
                this.local = data.local;
                this.dataCadastro = data.dataCadastro;
                this.nomePatrocinador = data.nomePatrocinador;
                this.dataAgendamento = data.dataAgendamento;
                this.periodo = this.prepararPeriodo(data.periodo);
                this.situacao = this.prepararSituacao(data.situacao);
                this.isAlteracao = true;
                this.verificarSePossuiConvidados(this.id);
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

    } else {
      this.isAlteracao = false;
    }
    this.buscarSituacoes();
    this.buscarPeriodos();
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
    verificarSePossuiConvidados(idAgendamento){
      this.$http
        .get(`/convidado/listarConvidados?parametros=`+idAgendamento)
        .then(
          function(response) {
            if(response.status === 200){
              this.isPossuiConvidado = true;
            }else{
              this.isPossuiConvidado = false;
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
    },
    fecharModal() {
        pic: hide;
      },
    prepararAlterarAgendamento(){
      $('#modalAlterarAgendamento').picModal().show();
    },
    getDate(dataSemFormato) {
      return moment(dataSemFormato).format('L');
    },
    validarFormulario: function (e) {
      e.preventDefault();
      this.errosValidados = [];

      var elementsInput= document.getElementsByTagName("INPUT");
      var elementsSelect = document.getElementsByTagName("SELECT"); 
    
      var elements = [].concat(Array.from(elementsInput)).concat(Array.from(elementsSelect));

      for (var i = 0; i < elements.length; i++) {
        let campoAValidar = elements[i];

        if(campoAValidar.required){
          if(campoAValidar.value == ""){
            var attrs = campoAValidar.attributes;
            for(var j = attrs.length - 1; j >= 0; j--){
              if(attrs[j].name == 'oninvalid'){
                this.errosValidados.push(attrs[j].value)
              }
            }
          }
        }
      }

      if(!this.errosValidados.length){
          this.salvarAgendamento();
          this.isErrosValidacao = false;
      }else{
          this.isErrosValidacao = true;
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
    buscarSituacoes() {
      this.$http
        .get("/agendamento/listarSituacoes")
        .then(
          function(response) {
            this.listaSituacoes = response.data;
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
    buscarPeriodos() {
      this.$http
        .get("/agendamento/listarPeriodos")
        .then(
          function(response) {
            this.listarPeriodos = response.data;
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
    verificarData() {
      /*Data corrente ou data atual*/
      var currentDate = moment().format("YYYY-MM-DD");
      var parteDataAt = currentDate.split("-");
      var dataAtual = new Date(parteDataAt[0], parteDataAt[1], parteDataAt[2]);
      
      /*Data digitada*/
      var strData = this.dataAgendamento;
      var partesData = strData.split("-");
      var data = new Date(partesData[0], partesData[1], partesData[2]);

      const year = moment(this.dataAgendamento, "DD-MM-YYYY").year();

      if(isNaN(data.getTime())){
        this.isErro = true;
        this.msgErro = "Data invalida";

      }else{
        this.isErro = false;
        this.msgErro = "";       

        if (year.toString().length > 4) {
          this.$refs.dataPick.value = "";
          this.isErro = true;
          this.msgErro = "Entre com uma data válida.";

        } else if (data < dataAtual) {
          this.dataAgendamento = "";
          this.isErro = true;
          this.msgErro = "A data não pode ser menor que a data de hoje: " + moment().format("DD/MM/YYYY") + ".";

        } else if (data >= dataAtual) {
          this.isErro = false;
        }
      }

    },
    isAnteriorDate() {
      const currentDate = new Date();
      console.log(currentDate.toISOString().substring(0, 10));
      return currentDate.toISOString().substring(0, 10);
    },
    salvarAgendamento() {
      let agendamentoDTO = {
        id: this.id ? this.id : null,
        descricaoAgendamento: this.descricao ? this.descricao : null,
        local: this.local ? this.local : null,
        dataCadastro: this.dataCadastro ? this.dataCadastro : null,
        nomePatrocinador: this.patrocinador ? this.patrocinador : null,
        dataAgendamento: this.dataAgendamento ? this.dataAgendamento : null,
        periodo: this.periodo.nome ? this.periodo.nome : null,
        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
        idParlamentar: this.$idParlamentar ? this.$idParlamentar : null,
        situacao: this.situacao.nome ? this.situacao.nome : "Agendado"
      };
      this.$http
        .post(`/agendamento`, agendamentoDTO).then(
          function(response) {

            if (response.status === 201) {
              this.$router.push({ name: "detalharAgendamento", params: {
                  msg: `Agendamento criado com sucesso.`,
                  isAlert: true, 
                  tipo: '{"type": "success"}',
                  idAgendamento: response.data.id
                }
              });

            } else if (response.status === 200) {
                this.$router.push({ name: "detalharAgendamento", params: {
                    msg: `Agendamento alterado com sucesso.`,
                    isAlert: true,
                    tipo: '{"type": "success"}',
                    idAgendamento: response.data.id
                  }
                });
              }
          }.bind(this)
        )
        .catch(error => {
          // handle error
          console.log(error);
          this.isListaConvidados = false;
          this.listaConvidados = null;
        })
        .then(function() {
          // always executed
        });
    },
    enviarMsgAlteracaoAgendamento(idAgendamento){
        /*Busca os convidados*/
        if(this.listaConvidados.length > 0){
          this.$http.get(`/convidado/listarConvidados?parametros=`+idAgendamento).then(
              function(response) {
                this.arrayConvidados = [];
                
                if(response.status == 200){

                  response.data.content.forEach(element => {
                    if( element.mensagemConvidado.qtMsgConfirmacao > 0 || element.mensagemConvidado.qtMsgAlteracao > 0 ){
                      let convidado = {
                        id: element.id,
                        nome: element.nomeConvidado
                      };

                      this.arrayConvidados.push(convidado);
                    }
                  });

                  let mensagemConvidadoDTO = {
                    idAgendamento: idAgendamento,
                    tipoEmail: 'Alteração',
                    convidados: this.arrayConvidados
                  };

                  this.$http.post(`/mensagem`, mensagemConvidadoDTO).then(
                    function(response) {
                      if(response.status === 200){
                        response.data.forEach( e => {
                          if(e.statusEnvio){
                            let convidado = {
                              nome: e.nomeConvidado
                            }
                            this.arrSucess.push(convidado);

                            this.$router.push({
                              name: "detalharAgendamento",
                              params: {
                                msg: `Agendamento alterado com sucesso. Convidados informados por e-mail.`,
                                isAlert: true,
                                isAlertSucess: true,
                                tipo: '{"type": "success"}',
                                idAgendamento: idAgendamento,
                                arrSucess: this.arrSucess
                              }
                            });

                          }else{
                            let convidado = {
                              nome: e.nomeConvidado
                            }
                            this.arrError.push(convidado);
                            this.isAlertErrorList = true;
                          }
                        });
                      }
                    }.bind(this)

                  ).catch(function(error) {
                    // handle error
                    console.log(error);

                  }).then(function() {
                    // always executed
                  });

                }else if(response.status == 204){
                  this.$router.push({
                    name: "detalharAgendamento",
                    params: {
                      msg: `Agendamento alterado com sucesso. Não houve a necessidade de envio de e-mail aos convidados.`,
                      isAlert: true,
                      tipo: '{"type": "success"}',
                      idAgendamento: idAgendamento
                    }
                  });
                }

              }.bind(this)

          ).catch(function(error) {
              // handle error
              console.log(error);
          });
        }else{
          this.$router.push({
            name: "detalharAgendamento",
            params: {
              msg: `Agendamento alterado com sucesso.`,
              isAlert: true,
              tipo: '{"type": "success"}',
              idAgendamento: idAgendamento
            }
          });
        }
    },
    converterDate(date) {
      if (date) {
        var dt = date.split("/");
        var data = new Date(dt[2], dt[1] - 1, dt[0]);
      }
      return data;
    }
  },
  updated() {
    PIC.refreshWidget("Validation");
    //PIC.activateAllWidgets();
  }
  // updated() {
  //   //PIC.refreshWidget("Validation");
  //   PIC.activateAllWidgets();
  // }
};
</script>