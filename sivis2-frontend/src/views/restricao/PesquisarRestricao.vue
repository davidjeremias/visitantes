<template>
  <div class="col-md-12">
    <div class="page-header">
      <h1>Pesquisar restrições de entrada</h1>
    </div>
    <div v-show="isAlert" :data-pic-alert=tipo>
      {{msg}}
    </div>
    <div class="row main-info-container">
      <div class="col-sm-12">
        <div class="col-sm-2">
          <div class="input-group">
            <label for="dataInicial">Período da restrição inicial</label>
            <input type="date" v-model="dataInicial" class="form-control" id="dataInicial"
              pattern="/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/" />
          </div>
        </div>

        <div class="col-sm-2">
          <div class="input-group">
            <label for="dataFinal">Período da restrição final</label>
            <input type="date" v-model="dataFinal" class="form-control" id="dataFinal"
              @blur="verificarData();" pattern="/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/"
              :min="dataInicial" />
          </div>
          <div v-if="isErro" style="text-align:center;font-size:small;color:red;">{{ msgErro }}</div>
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
        <div class="col-md-2">
          <div class="form-group">
            <label for="numeroCPF">CPF</label>
            <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" class="form-control" id="numeroCPF" />
          </div>
        </div>

        <div class="col-md-3">
          <div class="form-group">
            <div class="checkbox" style="margin-top: 3rem;">
              <label>
                <input type="checkbox" v-model="isSomenteEntrada">Exibir apenas restrições com tentativas de entrada
              </label>
            </div>
          </div>
        </div>

        <div class="row margin-top-row">
          <div class="col-md-12">
            <div class="col-md-5">
              <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" v-model="nome" class="form-control" id="nome" />
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group">
                <label for="nome">Motivo</label>
                <input type="text" v-model="motivo" class="form-control" id="motivo" />
              </div>
            </div>

            <div class="col-md-1">
              <div class="buttons" style="position: relative; float: right;">
                <input id="btnAdicionar" type="button" @click="buscarRestricaoEntrada()" value="Buscar"
                  class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
              </div>
            </div>


          </div>
        </div>

      </div>

    </div>
    <div class="row margin-top-row">
      <div class="col-md-12">
        <button type="button" class="btn btn-secondary pull-right button-router" @click="adicionarRestricaoEntrada()">
          Nova Restrição</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <hr />
      </div>
    </div>

    <template v-if="isListaRestricaoEntrada">
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
            <tr v-for="a in  listaRestricaoEntrada" :key="a.id">
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
    name: "PesquisaRestricao",
    directives: { mask },
    props: {
      msg: String,
      isAlert: Boolean,
      tipo: String,
    },

    data() {
      return {
        listaRestricaoEntrada: [],
        isListaRestricaoEntrada: false,


        listaTipoRestricao: "",

        dataInicial: "",
        dataFinal: "",
        tipoRestricao: "",
        numeroCPF: "",
        nome: "",
        motivo: "",
        isSemTermino: "",
        isSomenteEntrada: "",

        pesquisaVazia:false,
        isErro: false,
      };
    },
    created: function () {
      this.buscarTiposRestricao();
    },
    methods: {
      verificarData() {
      /*Data corrente ou data atual*/
      var currentDate = this.dataInicial;
      var parteDataAt = currentDate.split("-");
      var dataAtual = new Date(parteDataAt[0], parteDataAt[1], parteDataAt[2]);
      
      /*Data digitada*/
      var strData = this.dataFinal;
      var partesData = strData.split("-");
      var data = new Date(partesData[0], partesData[1], partesData[2]);

      const year = moment(this.dataFinal, "DD-MM-YYYY").year();

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
          this.msgErro = "A data Período da restrição final, não pode ser menor que a data Período da restrição inicial"

        } else if (data >= dataAtual) {
          this.isErro = false;
        }
      }

    },
      detalharRestricao(item) {
        this.$router.push({
          name: "detalharRestricao",
          params: { idRestricaoEntrada: item.id, isDetalhar: true }
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

      buscarRestricaoEntrada() {

        this.isAlert = false;

        let filtroRestricaoEntradaDTO = {
          dataInicial: this.dataInicial ? this.dataInicial : null,
          dataFinal: this.dataFinal ? this.dataFinal : null,
          tipoRestricao: this.tipoRestricao ? this.tipoRestricao.nome : null,
          cpf: this.numeroCPF ? this.numeroCPF : null,
          nome: this.nome ? this.nome : null,
          motivo: this.motivo ? this.motivo : null,
          somenteComRestricaoEntrada: this.isSomenteEntrada ? this.isSomenteEntrada : null
        };

        this.listaRestricaoEntrada = null;
        this.$http
          .post("/restricao/buscaPorFiltro", filtroRestricaoEntradaDTO)
          .then(
            function (response) {
              this.listaRestricaoEntrada = response.data.content;

              if (this.listaRestricaoEntrada) {
                this.isListaRestricaoEntrada = true;
              } else {
                this.isListaRestricaoEntrada = false;
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
      if (this.isListaRestricaoEntrada) {
        PIC.activateWidget("Actionsbar");
        PIC.activateWidget("Datatable");
        if (this.isListaRestricaoEntrada) {
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
        if (this.listaRestricaoEntrada === null) {
          this.pesquisaVazia = true;
          this.isListaRestricaoEntrada = false;
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
</style>