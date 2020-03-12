<template>
  <div class="col-md-12">
    <div class="page-header">
      <template v-if="this.isAlteracao">
        <h1>Alterar restrição de entrada</h1>
       
      </template>
      <template v-if="this.isDetalhar && !this.isMostrarRejeicao">
        <h1>Detalhar restrição de entrada</h1>
      </template>

       <template v-if="this.isDetalhar && this.isMostrarRejeicao">
        <h1>Detalhar evento de restrição de entrada</h1>
      </template>


      <template v-if="this.isIncluir">
        <h1>Incluir restrição de entrada</h1>
      </template>
    </div>

    <div v-show="isErrosValidacao" data-pic-alert='{"type": "error"}'>
      <p v-if="errosValidados.length">
        <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
        <ul>
          <li v-for="error in errosValidados" :key=error>{{ error }}</li>
        </ul>
      </p>
    </div>

    <div v-show="isAlert" data-pic-alert>
      {{msg}}
    </div>

    <form id="novaRestricao">
       <input type="hidden" v-model="idRestricaoEntrada" id="idRestricaoEntrada">
      <div class="col-md-12">
        <div class="row main-info-container">
          <div class="col-md-12">
            <div class="col-md-2" v-if="isIniciarCadastro">
             
              <template>
                <div class="row">
                  <div class="col-md-12 text-center " v-if="this.avatar">
                    <img id="avatar" :src="this.avatar" alt="" class="molduraFotoConvidado" />
                  </div>
                  <div class="col-md-12 text-center " v-else>
                    <input type="hidden" v-model="idVisitante" id="idVisitante">
                    <img id="avatar" :src="visitanteDTO != null ?  visitanteDTO.fotoVisitante : this.avatar" alt=""
                      class="imagemFotoConvidado" :disabled=isVisitante>

                  </div>
                  <div class="col-md-12 text-center" style="margin-top: 1rem">
                    <button type="button" class="btn btn-primary" @click="$refs.fileInputAvatar.click()"
                      :disabled="isDetalhar || isVisitante">

                      <span>{{ this.avatar ? "Alterar Foto":"Adicionar Foto" }}</span>
                    </button>
                    <input id="fileInputAvatar" name="fileInputAvatar" style="display: none" ref="fileInputAvatar"
                      type="file" @change="onFileChange($event)" enctype="multipart/form-data" />
                    <p></p>

                  </div>
                </div>
              </template>
            </div>
            <div class="col-md-10">
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label for="numeroCPF">CPF</label>
                    <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @change="verificarVisitante"
                      class="form-control" id="numeroCPF" required oninvalid="É necessário um cpf para o convidado."
                      :disabled="isHabilitarCPF" />
                    <span class="validacao" v-show="!isValid">CPF Inválido</span>
                  </div>
                </div>
                <div class="col-md-6" v-if="isIniciarCadastro || isVisitante">
                  <div class="form-group required">
                    <label for="nome">Nome</label>
                    <input type="text" data-rules="required|alpha|min:3" v-model="nome" class="form-control" id="nome"
                      required oninvalid="É necessário um Nome para a restrição."
                      :disabled="isVisitante || isDetalhar" />
                  </div>
                </div>

              </div>
              <div class="row" v-if="isIniciarCadastro">
                <div class="col-md-2">
                  <div class="form-group required">
                    <label for="tipoRestricao">Tipo de restrição</label>
                    <select v-model="selectTipoRestricao" class="form-control" id="tipoRestricao" required
                      oninvalid="É necessário selecionar o Tipo de Restrição." :disabled=isDetalhar>
                      <option v-for="(e, key) in listaTipoRestricao" :key="key" :value="e" selected>{{ e.nome }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group required">
                    <label for="dataInicioRestricao">Período de Restrição inicial</label>
                    <input type="date" v-model="dataInicioRestricao" class="form-control" id="dataInicioRestricao"
                      required oninvalid="É necessário um Período de Restrição inicial." :disabled=isDetalhar />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="dataFinalRestricao">Período de Restrição final</label>
                    <input type="date" v-model="dataFinalRestricao" class="form-control" id="dataFinalRestricao"
                      :disabled=isDetalhar />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 2rem;" v-if="isIniciarCadastro">
        <div class="col-md-12">
          <div class="form-group required">
            <label for="motivo">Motivo da restrição</label>
            <textarea v-model="motivo" class="form-control" id="motivo" rows="5" cols="10" required
              maxlength="600" oninvalid="É necessário informar o Motivo da Restrição." :disabled=isDetalhar>
                                </textarea>
          </div>
        </div>
      </div>

    </form>

    <div class="row" v-if="isIniciarCadastro">
      <div class="col-md-12" v-if="!isDetalhar">
        <div class="buttons">
          <template>
            <button id="btnAdicionar" @click="validarFormulario($event)"
              class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">Salvar</button>
            <button id="btnVoltar" @click="voltarPesquisaRestricaoEntrada()"
              class="btn btn-primary btnCreateMarginTop pull-right">Voltar</button>
          </template>

        </div>
      </div>
      <div class="col-md-12" v-else>
        <div class="buttons">
          <template>
            <button id="btnAlterar" @click="preparaAlterarRestricao()"
              class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">Alterar</button>
            <button type="button" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left"
              data-toggle="modal" data-target="#modalExcluirRestricaoEntrada">
              Excluir</button>
            <button id="btnVoltar" @click="voltarPesquisaRestricaoEntrada()"
              class="btn btn-primary btnCreateMarginTop pull-right">Voltar</button>
          </template>
        </div>
      </div>
    </div>
    <div class="dados-ponto" v-if="isDetalhar">
      <div class="dados-ponto-title">
        <h4><b>Cadastrador</b></h4>
      </div>
      <div class="dados-ponto-content">
        <div class="item">
          <p><b>Data de cadastro:</b></p>
          <p>{{ getDate(this.dataCadastro) }}</p>
        </div>
        <div class="item">
          <p><b>Ponto:</b></p>
          <p>{{ this.pontoCadastrador }}</p>
        </div>
        <div class="item">
          <p><b>Nome:</b></p>
          <p>{{ this.nomeCadastrador }}</p>
        </div>
      </div>
    </div>
    <template >
<template v-if=" isDetalhar || isMostrarRejeicao"> 
      <div class="panel panel-default" v-if="islistaTentativasEntrada ">
        <div class="panel-heading">
          <h2>Tentativas de entrada</h2>
        </div>
        <br />
        <table class="table table-bordered" data-pic-datatable id="table-restricao">
          <thead>
            <tr>
              <th align="center" data-pic-datatable-config='desc'>Data</th>
              <th align="center">Hora</th>
              <th align="center">Portaria</th>
              <th align="center">Equipamento</th>
              <th align="center">IP</th>
              <th align="center" data-pic-datatable-config='filter'>Situação</th>
              <th align="center">Ponto</th>
              <th align="center">Agente DEPOL</th>
              <th align="center">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ter in listaTentativasEntrada" :key="ter.id">
              <td width="10%" class="text-center">{{ getDate(ter.dataTentativaRestricao) }}</td>
              <td width="10%" class="text-center">{{ getTime(ter.dataTentativaRestricao) }}</td>
              <td width="10%">{{ ter.portariaDTO.descricaoPortaria }}</td>
              <td width="10%">{{ ter.nomeEquipamento }}</td>
              <td width="10%">{{ ter. numeroEnderecoIP }}</td>
              <td width="10%">{{ ter.situacao }}</td>
              <td width="10%">{{ ter.pontoAutorizador }}</td>
              <td width="10%">{{ ter.nomeAgenteDepol }} </td>
              <td width="10%">{{ ter.justificativa }}</td>
            </tr>
          </tbody>
        </table>
      </div>
</template>
      <div>
      </div>
  <!-- Entradas rejeitadas -->
  <template v-if="isMostrarRejeicao">
    
  
      <div class="panel panel-default" v-if="islistaEntradaRejeitada ">
        <div class="panel-heading">
          <h2>Entradas Rejeitada</h2>
        </div>
        <br />
        <table class="table table-bordered" data-pic-datatable id="table-rejeitadas">
          <thead>
            <tr>
              <th align="center" data-pic-datatable-config='desc'>data</th>
              <th align="center">Hora</th>
              <th align="center">Portaria</th>
              <th align="center">Equipamento</th>
              <th align="center">IP</th>
              <th align="center" data-pic-datatable-config='filter'>Situação</th>
              <th align="center">ponto</th>
              <th align="center">Agente DEPOL</th>
              <th align="center">Justificativa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rej in listaEntradaRejeitada" :key="rej.id">
              <td width="10%" class="text-center">{{ getDate(rej.dataRejeicao) }} </td>
              <td width="10%" class="text-center">{{ getTime(rej.dataRejeicao) }}</td>
              <td width="10%">{{ rej.portariaDTO.descricaoPortaria }}</td>
              <td width="10%">{{ rej.nomeEquipamento }}</td>
              <td width="10%">{{ rej. numeroEnderecoIP }}</td>
              <td width="10%"></td>
              <td width="10%">{{ rej.pontoAutorizador }}</td>
              <td width="10%">{{ rej.nomeAgenteDepol }} </td>
              <td width="10%">{{ rej.justificativa }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </template>
      <div>
      </div>


    </template>
    <div class="espacamentoPageFinal"></div>




    <div data-pic-modal='{"title": "Exclusão", "dialog": "default", "size": "sm"}' id="modalExcluirRestricaoEntrada">
      <form>
        <div class="col-md-12 text-center">

          <i class="fa fa-exclamation-circle" style="font-size:28px;color:red"></i>
          Deseja realmente excluir a restrição de entrada?
        </div>
        <div class="buttons">
          <button type="button" @click="fecharModal()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Não
          </button>
          <button type="button" @click="excluirRestricaoEntrada()"
            class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
            Sim
          </button>

        </div>
      </form>
    </div>

  </div>

</template>

<script>
  import { mask } from "vue-the-mask";
  import moment from 'moment'
  export default {
    name: "NovaRestricao",
    directives: { mask },
    props: {
      idRestricaoEntrada: Number,
      msg: String,
      isAlert: Boolean,
      tipo: String,
      isMostrarRejeicao : Boolean


    },

    data() {
      return {

        isErrosValidacao: false,
        errosValidados: [],

        listaTipoRestricao: "",

        //isAlteracao: Boolean,
        //isDetalhar: Boolean,
        isValid: Boolean,
        isIniciarCadastro: Boolean,
        isVisitante: Boolean,
        isHabilitarCPF: Boolean,
        //isIncluir: Boolean,

        isAlteracao: this.$route.params.isAlteracao,
        isIncluir: this.$route.meta.isIncluir,
        isDetalhar: this.$route.params.isDetalhar,


        avatar: null,
        nome: "",
        numeroCPF: "",
        selectTipoRestricao: "",
        dataInicioRestricao: "",
        dataFinalRestricao: "",
        isSemTermino: "",
        motivo: "",
        dataCadastro: null,
        pontoCadastrador: null,
        nomeCadastrador: 'Falta o serviço pra buscar este nome',

        listaTentativasEntrada: [],
        islistaTentativasEntrada: false,

        listaEntradaRejeitada: [],
        islistaEntradaRejeitada: false,

        idVisitante: null,
        isPossuiRestricao: Boolean,

        visitanteDTO: []

      };
    },
    created: function () {
      if (this.idRestricaoEntrada != null) {
        this.$http
          .get("/restricao/buscaPorId", {
            params: { idRestricaoEntrada: this.idRestricaoEntrada }
          })
          .then(
            function (response) {
              console.log(response);
              if (response.status === 200) {
                var data = response.data;
                this.prepararRestricaoDTO(data);
                this.buscarEntradasRestricao(data.id);
                this.buscarEntradasRejeitadas(data.id)
                this.desabilitarElementos();
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
      } else {
        this.isHabilitarCPF = false;
        this.isIncluir = true;

        this.isDetalhar = false;
        this.isAlteracao = false;
        this.isIniciarCadastro = false;
        this.isVisitante = false;

      }
      this.buscarTiposRestricao();

    },
    methods: {
      getDate(dataSemFormato) {
        return dataSemFormato ? moment(dataSemFormato).format('DD/MM/YYYY') : null;
      },
      getTime(stringDate) {
        var date = new Date(stringDate);
        return date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
      },
      onFileChange(e) {

        var fileInputId = e.target.id;
        var file = '';
        switch (fileInputId) {

          case 'fileInputAvatar':
            file = e.target.files[0];
            //this.avatar = null;
            if (!file.type.includes("image/")) {
              this.isNoImagem = true;
            } else {
              $("#avatar").attr("src", file);
              let reader = new FileReader();
              let vm = this;
              reader.onload = (e) => {
                vm.avatar = e.target.result
              }
              reader.readAsDataURL(file)
              this.isNoImagem = false;
            }
            break;
        }//fim case
      },
      preparaAlterarRestricao() {

         this.isAlteracao = true;
         this.isDetalhar = false;
         this.isIncluir = false;

         if(this.isVisitante){
           this.isHabilitarCPF = true;
         }else{
           this.isHabilitarCPF = false;
         }
        
         
        this.$router.push({
          name: "alterarRestricao",
          params: { idRestricaoEntrada: this.idRestricaoEntrada, isHabilitarCPF: this.isHabilitarCPF }
        });

        
      },

      chamarModalExcluirRestricaoEntrada() {

        PIC.activateWidget('Modal', '#modalExcluirRestricaoEntrada');
        $('#modalExcluirRestricaoEntrada').picModal().show();

      },
      excluirRestricaoEntrada() {
        //console.log(this.idRestricaoEntrada);
        if (this.islistaTentativasEntrada) {
          this.isAlert = true;
          this.msg = "Impossível excluir a Restrição de Entrada, pois já possui registro de tentativa de entrada vinculada.";
          this.tipo = "error";

        }
        this.$http
          .get("/restricao/excluirRestricaoEntrada", {
            params: { idRestricaoEntrada: this.idRestricaoEntrada }
          })
          .then(
            function (response) {
              if (response.status === 200) {
                this.$router.push({
                  name: "pesquisarRestricao",
                  params: {
                    msg: "Restrição de Entrada excluída com sucesso.",
                    isAlert: true,
                    tipo: '{"type": "success"}'
                  }
                });
              } else {
                his.$router.push({
                  name: 'novaRestricao',
                  params: {
                    msg: "Impossível excluir a Restrição de Entrada, pois já possui registro de tentativa de entrada vinculada.",
                    isAlert: true,
                    tipo: '{"type": "success"}'
                  }
                });
              }
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });

      },
        buscarEntradasRejeitadas(idRestricaoEntrada) {

        this.$http
          .get("/rejeicao/listarEntradasRejeitadas", {
            params: { idRestricaoEntrada: this.idRestricaoEntrada }
          })
          .then(
            function (response) {
              if (response.status === 200) {

                this.listaEntradaRejeitada = response.data;

                if (this.listaEntradaRejeitada.length > 0) {
                  this.islistaEntradaRejeitada = true;
                } else {
                  this.islistaEntradaRejeitada = false;
                }
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



      },

      buscarEntradasRestricao(idRestricaoEntrada) {

        this.$http
          .get("/restricao/listarEntradasRestricao", {
            params: { idRestricaoEntrada: this.idRestricaoEntrada }
          })
          .then(
            function (response) {
              if (response.status === 200) {

                this.listaTentativasEntrada = response.data;

                if (this.listaTentativasEntrada.length > 0) {
                  this.islistaTentativasEntrada = true;
                } else {
                  this.islistaTentativasEntrada = false;
                }
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



      },
      voltarPesquisaRestricaoEntrada() {
         history.back();
      },

      prepararRestricaoDTO(data) {

        this.idRestricaoEntrada = data.id ? data.id : null;

        if (data.visitanteDTO == null) {

          this.nome = data.nomeCivil ? data.nomeCivil : null;
          this.numeroCPF = data.numCPF ? data.numCPF : null;

        } else {

          this.nome = data.visitanteDTO.nomeVisitante ? data.visitanteDTO.nomeVisitante : null;
          this.numeroCPF = data.visitanteDTO.cpf ? data.visitanteDTO.cpf : null;

        }

        let fotoRestricaoEntradaDTO = null;
        fotoRestricaoEntradaDTO = {
          id: data.fotoRestricaoEntradaDTO ? data.fotoRestricaoEntradaDTO.id : null,
          dataFoto: data.fotoRestricaoEntradaDTO ? data.fotoRestricaoEntradaDTO.dataFoto : null,
          imagemFoto: data.fotoRestricaoEntradaDTO ? data.fotoRestricaoEntradaDTO.imagemFoto : null

        }

        this.selectTipoRestricao = data.tipoRestricao ? data.tipoRestricao : null;
        this.dataInicioRestricao = data.dataInicioRestricao ? data.dataInicioRestricao : null;
        this.dataFinalRestricao = data.dataFinalRestricao ? data.dataFinalRestricao : null;
        this.motivo = data.motivoRestricao ? data.motivoRestricao : null;
        this.dataCadastro = data.dataCadastro ? data.dataCadastro : null;
        this.pontoCadastrador = data.pontoCadastrador ? data.pontoCadastrador : null;
        this.avatar = data.fotoRestricaoEntradaDTO ? data.fotoRestricaoEntradaDTO.imagemFoto : null;
        this.visitanteDTO = data.visitanteDTO ? data.visitanteDTO : null;
        this.fotoRestricaoEntradaDTO = fotoRestricaoEntradaDTO ? fotoRestricaoEntradaDTO : null;

      },
      desabilitarElementos() {
        this.isDetalhar = true;
        this.isAlteracao = false;
        this.isIncluir = false;
        this.isVisitante = false;

        if (this.visitanteDTO != null) {
          this.isVisitante = true;
        }

  console.log(this.isVisitante);
      }, habilitarElementos() {

        this.isDetalhar = false;
        this.isAlteracao = true;
        this.isIncluir = false;

        this.isVisitante = false;
        if (this.visitanteDTO != null) {
          this.isVisitante = true;
        }
      },


      verificarCPF(cpf) {
        if (
          cpf.length != 11 ||
          cpf == "00000000000" ||
          cpf == "11111111111" ||
          cpf == "22222222222" ||
          cpf == "33333333333" ||
          cpf == "44444444444" ||
          cpf == "55555555555" ||
          cpf == "66666666666" ||
          cpf == "77777777777" ||
          cpf == "88888888888" ||
          cpf == "99999999999"
        )
          return false;

        // Valida 1o digito
        var soma;
        var resto;

        soma = 0;
        for (let i = 0; i < 9; i++)
          soma += parseInt(cpf.charAt(i)) * (10 - i);
        resto = 11 - (soma % 11);
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.charAt(9))) return false;

        // Valida 2o digito
        soma = 0;
        for (let i = 0; i < 10; i++)
          soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto == 10 || resto == 11) resto = 0;
        if (resto != parseInt(cpf.charAt(10))) return false;
        return true;
      },
      verificarVisitante() {
        this.isValid = true;
        let cpf = this.numeroCPF;
        this.isAlert = false;

        if (cpf != null) {
          cpf = cpf.replace(/[^\d]+/g, "");
        }

        if (this.verificarCPF(cpf)) {
          this.$http
            .get("/visitante/validaCPF?parametros=" + cpf)
            .then(
              function (response) {
                if (response.status === 200) {
                  let data = response.data;

                  this.visitanteDTO = data;

                  this.numeroCPF = data.cpf;
                  this.nome = data.nomeVisitante;
                  this.avatar = data.fotoVisitante;


                  this.isIniciarCadastro = true;
                  
                  this.idVisitante = data.id;
                  this.isVisitante = true;
                  this.isHabilitarCPF = true;
                } else {
                  this.isIniciarCadastro = true;
                  this.habilitarElementos();
                  this.isIncluir = true;
                  this.isAlteracao = false;
                  this.isSemTermino = false;
                  this.isVisitante = false;
                   this.isHabilitarCPF = false;
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
        } else {
          this.isValid = false;
          this.isIniciarCadastro = false;
        }
      },

      SalvarRestricao() {

        let tipoRestricaoDTO = null;
        tipoRestricaoDTO = {
          id: this.selectTipoRestricao ? this.selectTipoRestricao.id : null,
          nome: this.selectTipoRestricao ? this.selectTipoRestricao.nome : null
        }

        let visitanteDTO = null;
        if (this.isVisitante) {
          visitanteDTO = {
            id: this.visitanteDTO ? this.visitanteDTO.id : null
          }
        }


        let fotoRestricaoEntradaDTO = null;
        if(this.avatar != null ){
        fotoRestricaoEntradaDTO = {
          id: this.idFotoRestricao ? this.idFotoRestricao : null,
          imagemFoto: this.avatar ? this.avatar : null,
         }
        }

        let restricaoEntradaDTO = {
          id: this.idRestricaoEntrada ? this.idRestricaoEntrada : null,
          numCPF: this.numeroCPF ? this.numeroCPF.replace(/[^\d]+/g, "") : null,
          nomeCivil: this.nome ? this.nome : null,
          motivoRestricao: this.motivo ? this.motivo : null,
          dataInicioRestricao: this.dataInicioRestricao ? this.dataInicioRestricao : null,
          dataFinalRestricao: this.dataFinalRestricao ? this.dataFinalRestricao : null,
          pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
          dataCadastro: this.dataCadastro ? this.dataCadastro : null,
          tipoRestricao: tipoRestricaoDTO ? tipoRestricaoDTO : null,
          visitanteDTO: visitanteDTO ? visitanteDTO : null,
          fotoRestricaoEntradaDTO: fotoRestricaoEntradaDTO ? fotoRestricaoEntradaDTO : null

        }

        this.$http
          .post('/restricao', restricaoEntradaDTO)
          .then(function (response) {
            if (response.status === 201) {
              this.$router.push({ name: 'pesquisarRestricao', params: { msg: `Restrição de entrada adicionado com sucesso.`, isAlert: true, tipo: '{"type": "success"}' } });
            } else if (response.status === 200) {
              this.$router.push({ name: 'pesquisarRestricao', params: { msg: `Restrição de entrada alterado com sucesso.`, isAlert: true, tipo: '{"type": "success"}' } });
            } else if (response.status === 204) {
              this.isAlert = true;
              this.msg = "Já possui uma restrição de entrada para este CPF.";
              this.tipo = "error"
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






      },

      validarFormulario: function (e) {
        e.preventDefault();
        this.errosValidados = [];

        var elementsInput = document.getElementsByTagName("INPUT");
        var elementsSelect = document.getElementsByTagName("SELECT");
        //var elementsImg = document.getElementsByTagName("IMG")
        var elementsText = document.getElementsByTagName("TEXTAREA")
        var elements = []
          .concat(Array.from(elementsInput))
          .concat(Array.from(elementsSelect))
          .concat(Array.from(elementsText));

        for (var i = 0; i < elements.length; i++) {
          let campoAValidar = elements[i];
          if (campoAValidar.required) {
            if (campoAValidar.value == "") {
              var attrs = campoAValidar.attributes;
              for (var j = attrs.length - 1; j >= 0; j--) {
                if (attrs[j].name == 'oninvalid') {
                  this.errosValidados.push(attrs[j].value)
                }
              }
            }
          }
        }

        if (moment(this.dataInicioRestricao).isAfter(this.dataFinalRestricao)) {
          this.errosValidados.push('Data de restrição final tem que ser maior que data de restrição inicial')
        }
        //  if(moment(this.dataInicioRestricao).isBefore(this.dataFinalRestricao)){
        //    this.errosValidados.push('Data de restrição Inicial tem que ser maior que data de restrição final')

        // }
        if (!this.errosValidados.length) {
          this.SalvarRestricao();
          this.isErrosValidacao = false;
        } else {
          this.isErrosValidacao = true;
        }
      },

      buscarTiposRestricao() {
        this.$http
          .get("/restricao/listarTipoRestricao")
          .then(
            function (response) {
              this.listaTipoRestricao = response.data;
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
    updated() {
      var elemento = document.getElementById("table-restricao");
      if (elemento !== null) {
        PIC.activateWidget("Datatable");
        PIC.activateWidget('Actionsbar');

         if (this.listaTentativasEntrada) {
          var elem1 = document.querySelector(".zeroRecords");
          var elem2 = document.querySelector(".dataTables_info");
          if (elem1 != null && elem2 != null) {
            elem1.style.display = "none";
            elem2.style.display = "none";
          }
        } else {
          var elem1 = document.querySelector(".zeroRecords");
          var elem2 = document.querySelector(".dataTables_info");
          if (elem1 != null && elem2 != null) {
            elem1.style.display = "block";
            elem2.style.display = "block";
          }
        }




      }
    }

  };
</script>
<style scoped>
  td {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dados-ponto-content {
    display: flex;
  }

  .dados-ponto-content .item {
    margin-right: 30px
  }

</style>