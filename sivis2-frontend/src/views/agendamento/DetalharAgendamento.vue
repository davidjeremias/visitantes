<template>
  <div class="col-md-12 marginContainerBottom">
    <div class="page-header">
      <h1>Agendamento de convidados ao gabinete</h1>
    </div>
    <painel-gabinete :siglaParlamentar="this.$siglaParlamentar" :nomeParlamentar="this.$nomeParlamentar" />

    <div v-show="isAlertSucess" data-pic-alert='{"type": "success"}'>
      {{msg}}
    </div>

    <div v-show="isAlertSucessUPConvidado" data-pic-alert='{"type": "success"}'>
      {{msg}}
    </div>

    <div v-show="isAlertError" data-pic-alert='{"type": "error"}'>
      {{msg}}
    </div>

    <div v-show="isAlertSucess && arrSucess.length > 0" data-pic-alert='{"type": "success"}'>
      <p>
        Mensagem de <b>{{tipoEmail}}</b> enviada com sucesso para o(s) convidado(s).
        <ul>
          <li v-for="convidado in arrSucess" :key=convidado>{{ convidado.nome }}</li>
        </ul>
      </p>
    </div>

    <div v-show="isAlertErrorList && arrError.length > 0" data-pic-alert='{"type": "error"}'>
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
          <label for="nomePatrocinador">Nome do Patrocinador</label>
          <input type="text" v-model="nomePatrocinador" class="form-control" id="nomePatrocinador" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="data">Data</label>
          <input type="text" v-model="dataAgendamento" class="form-control" id="data" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="periodo">Período</label>
          <input type="text" id="periodo" v-model="periodo.nome" class="form-control" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="situacao">Situação</label>
          <input type="text" id="situacao" v-model="situacao.nome" class="form-control" disabled />
        </div>
      </div>
    </div>

    <div class="col-md-12">
      <div class="buttons">
        <button type="button" @click="preparaIncluirConvidado()"
          class="btn btn-primary btnCreateMarginTop pull-right button-margin-left"
          :disabled="situacao.nome === 'Cancelado'">
          Adicionar Convidado
        </button>

        <div v-show="isListaConvidados">
          <button type="button" @click="preparaEncaminharMensagem()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Encaminhar mensagem
          </button>
        </div>

        <button type="button" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left"
          data-toggle="modal" data-target="#modalExcluirAgendamento">
          Excluir agendamento
        </button>

        <button type="button" @click="preparaAlterarAgendamento()"
          class="btn btn-primary btnCreateMarginTop pull-right">
          Alterar agendamento </button>
      </div>
    </div>

    <!-- MODAIS -->

    <div data-pic-modal='{"title": "Exclusão", "dialog": "default"}' id="modalExcluirAgendamento">
      <form>
        <template v-if="listaConvidados">
          <div class="col-md-12 text-center texto">

            <i class="fa fa-exclamation-circle" style="font-size:48px;color:red"></i>
            Os Convidados cadastrados para este Agendamento receberão uma mensagem de cancelamento. 
            Confirma a exclusão deste Agendamento?

          </div>
        </template>
        <template v-else>
          <div class="col-md-12 text-center texto">

            <i class="fa fa-exclamation-circle" style="font-size:48px;color:red"></i>
           Confirma a exclusão deste Agendamento?

          </div>
        </template>
        <div class="buttons">
          <button type="button" @click="fecharModal()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Não
          </button>
          <button type="button" @click="excluirAgendamento()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Sim
          </button>

        </div>
      </form>
    </div>

    <!-- MODAIS -->

    <div data-pic-modal='{"title": "Exclusão", "dialog": "default", "size": "sm"}'
      id="modalExcluirConvidadoAgendamento">
      <form>
        <div class="col-md-12 text-center">

          <i class="fa fa-exclamation-circle" style="font-size:28px;color:red"></i>
          Este convidado será excluído do agendamento.<br />
          Deseja realmente excluí-lo?
        </div>
        <div class="buttons">
          <button type="button" @click="fecharModal()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Não
          </button>
          <button type="button" @click="excluirConvidadoAgendado()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Sim
          </button>

        </div>
      </form>
    </div>

    <div class="col-md-12">
      <hr>
    </div>

    <div class="col-md-12" v-show="isListaConvidados">
      <h2>Convidados</h2>
    </div>

    <div class="col-md-12" v-show="isListaConvidados">
      <table id="tableConvidados" ref="tableConvidados" class="table table-bordered"
        data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
        <thead>
          <tr>
            <th align="center">Foto</th>
            <th align="center">Nome</th>
            <th align="center">CPF</th>
            <th align="center">E-mail</th>
            <th align="center">Telefone</th>
            <th align="center">Data da Entrada</th>
            <th align="center">Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="conv in  listaConvidados" :key="conv.idConvidado">
            <td width="5%" class="text-center">
              <template v-if="conv.fotoConvidadoDTO != null">
                <img :src="conv.fotoConvidadoDTO.imagemFoto" class="molduraFotoConvidado" />
              </template>
              <template v-else>
                <img src="images/avatar_sem_foto.jpeg" class="imagemFotoConvidado" />
              </template>
            </td>
            <td width="36%">{{ conv.nomeConvidado }}</td>
            <td width="10%">{{ formataCPF(conv.cpf) }}</td>
            <td width="15%">{{ conv.email }}</td>
            <td width="10%">{{ formataFone(conv.telefone) }}</td>
            <td width="10%"><span v-if="conv.dataUltimoAcesso">{{ getDate(conv.dataUltimoAcesso) }} - {{ getTime(conv.dataUltimoAcesso) }}</span></td>
            <td width="10%" class="clearfix">
              <div class="text-right clearfix">
                <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "label":"", "buttonType":"primary"}'>
                  <li>
                    <a @click="detalharConvidadoAgendado(conv.id, conv.agendamentoDTO.id)" title="Detalhar Convidado">
                      Detalhar
                    </a>
                  </li>

                  <!-- <li>
                    <a @click="alterarConvidadoAgendado(conv.id, conv.agendamentoDTO.id)" title="Alterar Convidado">
                      Alterar
                    </a>
                  </li>
                  <li>
                    <a data-toggle="modal" @click="chamarModalexcluirConvidadoAgendado(conv.id, conv.nomeConvidado)"
                      title="Excluir Convidado">
                      Excluir
                    </a>
                  </li> -->
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
  //import {util} from '../utils/util'

  import { mask } from 'vue-the-mask';
  import moment from 'moment';

  export default {
    name: "DetalharAgendamento",
    directives: { mask },
    props: {
      agenda: Object,
      msg: {
        type: String,
        default: ""
      },
      isAlert: Boolean,
      isAlertSucessUPConvidado: Boolean,
      tipo: String
    },
    data() {
      return {
        isRenderPIC: false,
        idAgendamento: this.$route.params.idAgendamento,
        isAlerta: false,
        isAlertError: this.$route.params.isAlertError,
        isAlertErrorList: false,
        isAlertSucess: this.$route.params.isAlertSucess,
        tipoEmail: '',
        avatar: "",
        descricao: "",
        local: "",
        nomeConvidado: "",
        nomePatrocinador: "",
        dataCadastro: "",
        dataAgendamento: "",
        periodo: "",
        situacao: "",
        listaConvidados: [],
        isListaConvidados: null,
        convidadoSelecionado: "",
        arrayConvidados: [],
        arrError: [],
        arrSucess: []
      };
    },
    created: function () {
      if (this.idAgendamento) {
        this.$http.get("/agendamento/buscaPorId", {
            params: { idAgendamento: this.idAgendamento }
          })
          .then(
            function (response) {
              console.log(response);
              if (response.status == 200) {
                var data = response.data;
                //this.agenda = response.data;
                this.id = data.id;
                this.descricao = data.descricaoAgendamento;
                this.local = data.local;
                this.dataCadastro = data.dataCadastro;
                this.nomePatrocinador = data.nomePatrocinador;
                this.dataAgendamento = this.getDate(data.dataAgendamento);
                this.periodo = this.prepararPeriodo(data.periodo);
                this.situacao = this.prepararSituacao(data.situacao);
                this.buscarConvidados(this.id);
              }
            }.bind(this)
          )
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      }
    },
    watch: {
      isAlert(novo, antigo) {
        setTimeout(() => {
          this.isAlert = false;
        }, 7000);
      },
      isAlertSucess(novo, antigo) {
        setTimeout(() => {
          this.isAlertSucess = false;
        }, 7000);
      },
      isAlertError(novo, antigo) {
        setTimeout(() => {
          this.isAlertError = false;
        }, 7000);
      },
      isAlertErrorList(novo, antigo) {
        setTimeout(() => {
          this.isAlertError = false;
        }, 7000);
      }
    },
    methods: {
      formataFone(fone) {

        if (fone != null) {
          //retira os caracteres indesejados...
          fone = fone.replace(/[^\d]/g, "");
          //realizar a formatação...
          fone = fone.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
          fone = fone.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
          fone.replace(/(\d)(\d{4})$/, "$1-$2");
        } else {
          return null;
        }
        return fone;
      },

      formatarData(dataSemFormato) {

        var data = moment(dataSemFormato, 'YYYY-MM-DD');
        return moment(data).format('DD/MM/YYYY');
      },

    getTime(stringDate){
          var date = new Date(stringDate);
          return String(date.getHours()).padStart(2, "0")+":"+String(date.getMinutes()).padStart(2, "0");
        },
      formataCPF(cpf) {
        //retira os caracteres indesejados...
        cpf = cpf.replace(/[^\d]/g, "");
        //realizar a formatação...
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      },
      prepararSituacao(situacaoNome) {
        switch (situacaoNome) {
          case 'Agendado':
          case 'AGENDADO': return { id: 1, nome: "Agendado" };
          case 'Cancelado':
          case 'CANCELADO': return { id: 0, nome: "Cancelado" };

        }

      },
      prepararPeriodo(periodo) {
        switch (periodo) {
          case 'Manhã':
          case 'MANHA': return { id: 0, nome: "Manhã" };
          case 'Tarde':
          case 'TARDE': return { id: 1, nome: "Tarde" };
          case 'Manhã e Tarde':
          case 'MANHA_TARDE': return { id: 2, nome: "Manhã e Tarde" };

        }

      },
      buscarConvidados(idAgendamento) {
        this.$http.get(`/convidado/listarConvidados?parametros=` + idAgendamento)
          .then(
            function (response) {
              console.log(response);
              if (response.status === 200) {
                this.listaConvidados = response.data.content;

                if (this.listaConvidados) {
                  this.isListaConvidados = true;
                } else {
                  this.isListaConvidados = false;
                }

                this.isRenderPIC = true;
              }

            }.bind(this)
          )
          .catch(error => {
            // handle error
            console.log(error);
            this.isListaConvidados = false;
            this.listaConvidados = null;
          })
          .then(function () {
            // always executed
          });
      },
      detalharConvidadoAgendado(convidadoID, agendaID) {
        this.$router.push({
          name: "adicionarConvidado",
          params: { convidadoID: convidadoID, idAgendamento: agendaID, isDetalhar: true }
        });
      },
      alterarConvidadoAgendado(convidadoID, agendaID) {
        this.$router.push({
          name: "adicionarConvidado",
          params: { convidadoID: convidadoID, idAgendamento: agendaID, isAlteracao: true }
        });
      },
      chamarModalexcluirConvidadoAgendado(id, nomeConvidado) {
        this.convidadoSelecionado = id;
        this.nomeConvidado = nomeConvidado;
        PIC.activateWidget('Modal', '#modalExcluirConvidadoAgendamento');
        $('#modalExcluirConvidadoAgendamento').picModal().show();
      },
      excluirConvidadoAgendado() {
        this.$http.get("/convidado/excluirConvidadoAgendamento", {
          params: {
            convidadoID: this.convidadoSelecionado,
            agendaID: this.idAgendamento
          }
        }).then(
          function (response) {
            if (response.status === 200) {
              this.msg = `Convidado ${this.nomeConvidado} foi excluído do agendamendo com sucesso.`;
              this.isAlertSucess = true;
              this.tipo = '{"type": "success"}'

            } else {
              this.msg = "Impossível excluir o convidado, pois o mesmo já possui registro de entrada vinculado a este Agendamento";
              this.isAlertError = true;
              this.tipo = '{"type": "error"}'
            }

            this.buscarConvidados(this.idAgendamento);
          }.bind(this)


        ).catch(function (error) {
          console.log(error);

        }).then(function () {
          // always executed
        });
      },
      getDate(dataSemFormato) {
        return moment(dataSemFormato).format('DD/MM/YYYY');
      },
      preparaAlterarAgendamento() {
        this.$router.push({
          name: "novoAgendamento",
          params: { idAgendamento: this.idAgendamento }
        });
      },
      preparaEncaminharMensagem() {
        this.$router.push({
          name: "encaminharMensagem",
          params: { idAgendamento: this.idAgendamento }
        });
      },
      excluirAgendamento() {
        this.$http.get(`/agendamento/excluirAgendamento?parametros=${this.id}`)
          .then(
            function (response) {
              if (response.status === 200) {
                this.$router.push({
                  name: 'agendamento',
                  params: {
                    msg: `Seu agendamento de convidado foi excluído com sucesso.`,
                    isAlert: true,
                    tipo: '{"type": "success"}'
                  }
                });
              }
            }.bind(this)

          ).catch(function (error) {
            this.$router.push({
              name: 'agendamento',
              params: {
                msg: `O agendamento não foi excluído, Ocorreu algum problema.`,
                isAlert: true,
                tipo: '{"type": "error"}'
              }
            });

            console.log(error);

          }).then(function () {
            // always executed
          });
      },
      preparaIncluirConvidado() {
        this.$router.push({
          name: "adicionarConvidado",
          params: { idAgendamento: this.idAgendamento }
        });
      },
      converterBase64ToByte(base64) {
        fetch(base64)
          .then(res => res.blob())
          .then(blob => {
            return blob;
          })
      },
      fecharModal() {
        pic: hide;
      }
    },
    updated() {
      
      if (this.isListaConvidados) {
        var elem1 = document.querySelector('.zeroRecords');
        var elem2 = document.querySelector('.dataTables_info');
        if (elem1 != null && elem2 != null) {
          elem1.style.display = 'none';
          elem2.style.display = 'none';
        }

      } else {
        var elem1 = document.querySelector('.zeroRecords');
        var elem2 = document.querySelector('.dataTables_info');
        if (elem1 != null && elem2 != null) {
          elem1.style.display = 'block';
          elem2.style.display = 'block';
        }
      }

      if(this.isRenderPIC){
        PIC.refreshWidget('Actionsbar');
      }
      this.isRenderPIC = false;

    }
  };
</script>

<style scoped>
  h2 {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
  }

  .main-info-container {
    background-color: rgb(240, 240, 240);
    padding: 1rem 0 1rem 0;
    margin-left: 0rem;
    margin-right: 0rem;
  }

  .input-large {
    height: 5rem;
    font-size: 2.5rem;
    font-weight: bold;
  }

  .buttonWithIcon {
    margin-left: 0.5rem;
    font-weight: bold;
  }

  .btnCreateMarginTop {
    margin-top: 3rem;
  }

  .marginContainerBottom {
    margin-bottom: 8rem;
  }

  .fa-close {
    margin-right: 0.5rem;
  }

  .fa-trash {
    margin-right: 0.5rem;
  }

  .fa-exclamation-circle {
    margin-right: 0.5rem;
  }

  .texto {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>