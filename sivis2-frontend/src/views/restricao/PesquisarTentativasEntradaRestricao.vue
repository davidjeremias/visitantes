<template>
  <div class="col-md-12">
    <div class="page-header">
      <h1>Pesquisar tentativas de entradas com restrição</h1>
    </div>
    <div v-show="isAlert" :data-pic-alert=tipo>
      {{msg}}
    </div>
    <div class="main-info-container row ">
      <div class="col-sm-12">
        <div class="col-md-4">
          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" v-model="nome" class="form-control" id="nome" />
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-group">
            <label for="numeroCPF">CPF</label>
            <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" class="form-control" id="numeroCPF" />
          </div>
        </div>

        <div class="col-md-2">
          <div class="form-group">
            <label for="tipoRestricao">Tipo de restrição</label>
            <select v-model="tipoRestricao" class="form-control" id="origem" name="origem">
              <option value selected>Todas</option>
              <option v-for="(e, key) in listaTipoRestricao" :key="key" :value="e">{{ e.nome }}
              </option>
            </select>
          </div>
        </div>

        <div class="col-md-4">
          <div class="form-group">
            <label for="nome">Motivo</label>
            <input type="text" v-model="motivo" class="form-control" id="motivo" />
          </div>
        </div>
      </div>

      <div class="col-sm-12">
        <div class="col-sm-3">
          <div class="input-group">
            <label for="restricaoDataInicial">Período da restrição inicial</label>
            <input type="date" v-model="restricaoDataInicial" class="form-control" id="dataInicial"
              pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
          </div>
        </div>

        <div class="col-sm-3">
          <div class="input-group">
            <label for="restricaoDataFinal">Período da restrição final</label>
            <input type="date" v-model="restricaoDataFinal" class="form-control" id="dataFinal"
              pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
          </div>
        </div>

        <div class="col-sm-3">
          <div class="input-group">
            <label for="eventoDataInicial">Período do evento inicial</label>
            <input type="date" v-model="eventoDataInicial" class="form-control" id="dataInicial"
              pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
          </div>
        </div>

        <div class="col-sm-3">
          <div class="input-group">
            <label for="eventoDataFinal">Período do evento final</label>
            <input type="date" v-model="eventoDataFinal" class="form-control" id="dataInicial"
              pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
          </div>
        </div>
      </div>

      <div class="col-sm-12 centro">
        <div class="col-md-4">
          <div class="form-group">
            <label for="portaria">Portaria</label>
            <select v-model="portaria" class="form-control" id="origem" name="origem">
              <option value selected>Todas</option>
              <option v-for="e in this.listaPortaria" :key="e.id" :value="e">{{e.descricaoPortaria}}</option>
            </select>
          </div>
        </div>

        <div class="col-md-4">
          <div class="form-group">
            <label for="autorizacao">Autorização</label>
            <select v-model="autorizacao" class="form-control" id="origem" name="origem">
              <option value selected>Todas</option>
              <option v-for="(e, key) in listarAutorizacao" :value="e" :key="key" >{{ e.nome }}</option>
            </select>
          </div>
        </div>

        <div class="col-md-1">
          <div class="buttons" style="position: relative; float: right;">
            <input id="btnAdicionar" type="button" @click="buscarTentativaEntrada()" value="Buscar"
              class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <hr />
      </div>
    </div>

    <template v-if="isListaTentativaEntrada">
      <section>
        <table id="table-restricao" class="table table-bordered" data-pic-datatable>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Tipo de restrição</th>
              <th>Motivo</th>
              <th>Data Inicial</th>
              <th>Data Final</th>
              <th>Qtd. Tentativas de Entrada</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in  listaTentativaEntrada" :key="a.id">
              <td width="10%" class="text-center">
                <template v-if="a.fotoRestricaoEntradaDTO != null">
                  <img :src="a.fotoRestricaoEntradaDTO.imagemFoto" class="molduraFotoConvidado" />
                </template>
                <template v-else>
                  <img src="/images/avatar_sem_foto.jpeg" class="imagemFotoConvidado" />
                </template>
              </td>
              <td width="20%">{{ a.nomeCivil }}</td>
              <td width="10%">{{ formataCPF(a.numCPF) }}</td>
              <td width="15%">{{ a.tipoRestricao.nome }}</td>
              <td width="15%" class="line">{{ a.motivoRestricao }}</td>
              <td width="10%">{{ getDate(a.dataInicioRestricao) }}</td>
              <td width="10%">{{ getDate(a.dataFinalRestricao) }}</td>
              <td width="8%">{{ a.qtdTentativasEntrada }}</td>
              <td width="5%">
                <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}'>
                  <li>
                    <a @click="detalharRestricao(a)">Detalhar</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
    


    <div class="espacamentoPageFinal"></div>
  </div>


</template>

<script>
  import { mask } from "vue-the-mask";
  import moment from 'moment'
  export default {
    name: "PesquisaTentativasDeEntradaRestricao",
    directives: { mask },
    props: {
      msg: String,
      isAlert: Boolean,
      tipo: String,
    },

    data() {
      return {
        listaTentativaEntrada: [],
        isListaTentativaEntrada: false,
        listaTipoRestricao: "",

        //form
        restricaoDataInicial: "",
        restricaoDataFinal: "",
        eventoDataInicial: "",
        eventoDataFinal: "",
        tipoRestricao: "",
        numeroCPF: "",
        nome: "",
        motivo: "",
        portaria: "",
        listaPortaria: [],
        listarAutorizacao: [],
         


        pesquisaVazia: false
      };
    },
    created: function () {
      this.buscarTiposRestricao();
      this.buscarPortaria();
      this.buscarAutorizacao();
    },
    methods: {
      buscarAutorizacao() {
        this.$http
          .get("/restricao/listarAutorizacao")
          .then(
            function(response) {
              this.listarAutorizacao = response.data;
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
      buscarPortaria() {
        this.$http
          .get("/portaria")
          .then(
            function (response) {
              this.listaPortaria = response.data;
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
      detalharRestricao(item) {
        this.$router.push({
          name: "novaRestricao",
          params: { idRestricaoEntrada: item.id, isDetalhar: true, isMostrarRejeicao: true }
        });
      },
      adicionarRestricaoEntrada() {
        this.$router.push({
          name: "novaRestricao"
        });
      },
      getDate(dataSemFormato) {
        return dataSemFormato ? moment(dataSemFormato).format('DD/MM/YYYY') : null;
      },
      formataCPF(cpf) {
        //retira os caracteres indesejados...
        cpf = cpf.replace(/[^\d]/g, "");
        //realizar a formatação...
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      },

      buscarTentativaEntrada() {

        let tipoRestricaoDTO = null
        if(this.tipoRestricao !=null){
        tipoRestricaoDTO = {
          id: this.tipoRestricao.id ? this.tipoRestricao.id : null,
          nome: this.tipoRestricao.nome ? this.tipoRestricao.nome : null
        }
      }

        let portariaDTO = null;
        portariaDTO = {
          id: this.portaria.id ? this.portaria.id : null,
          descricaoPortaria: this.portaria.descricaoPortaria ? this.portaria.descricaoPortaria : null
        }

        let FiltroTentativaEntradaRestricaoDTO = {
          restricaoDataInicial: this.restricaoDataInicial ? this.restricaoDataInicial : null,
          restricaoDataFinal: this.restricaoDataFinal ? this.restricaoDataFinal : null,
          eventoDataInicial: this.eventoDataInicial ? this.eventoDataInicial : null,
          eventoDataFinal: this.eventoDataFinal ? this.eventoDataFinal : null,
          tipoRestricaoDTO: tipoRestricaoDTO ? tipoRestricaoDTO : null,
          numeroCPF: this.numeroCPF ? this.numeroCPF : null,
          nome: this.nome ? this.nome : null,
          motivo: this.motivo ? this.motivo : null,
          portariaDTO: this.portaria ? this.portaria : null,
          autorizacao: this.autorizacao ? this.autorizacao.nome : null
        };

        this.listaTentativaEntrada = null;
        this.$http
          .post("/restricao/buscarRestricaoEntradaTentativas", FiltroTentativaEntradaRestricaoDTO)
          .then(
            function (response) {
              if (response.status === 200) {
                this.listaTentativaEntrada = response.data.content;
                this.isListaTentativaEntrada = true;
              } else {
                this.isListaTentativaEntrada = false;
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
        //console.log(this.listaRestricaoEntrada);

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
      if (this.isListaTentativaEntrada) {
        PIC.activateWidget("Actionsbar");
        PIC.activateWidget("Datatable");
        if (this.isListaTentativaEntrada) {
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
        if (this.listaTentativaEntrada === null) {
          this.pesquisaVazia = true;
          this.isListaTentativaEntrada = false;
        }
      }
      }
    }
</script>

<style scoped>
  td.line {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .centro {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
</style>