<template>
  <div class="col-md-12">
    <div class="page-header">
      <h1>Agendamento de convidados</h1>
    </div>
    <painel-gabinete :siglaParlamentar="this.$siglaParlamentar" :nomeParlamentar="this.$nomeParlamentar"/> 

    <div v-show="isAlert" :data-pic-alert="tipo">
      {{msg}}
      </div>

    <div class="row main-info-container">
      <div class="col-sm-2">
        <div class="input-group">
          <label for="dataInicial">Data Inicial</label>
            <input type="date" v-model="dataInicial" class="form-control" id="dataInicial" pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
        </div>
      </div>

      <div class="col-sm-2">
        	<div class="input-group">
          <label for="dataFinal">Data Final</label>
          <input type="date" v-model="dataFinal" class="form-control" id="dataFinal" pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" /> 
        </div>
      </div>

      <div class="col-sm-2">
        <div class="form-group">
          <label for="periodo">Período</label>
          <select id="periodo" v-model="periodo" class="form-control">
            <option value selected>Selecione</option>
            <option v-for="(e, key) in listarPeriodos" :value="e" :key="key" >{{ e.nome }}</option>
          </select>
        </div>
      </div>

      <div class="col-sm-2">
        <div class="form-group">
          <label for="situacao">Situação</label>
          <select id="situacao" v-model="situacao" class="form-control">
            <option value selected>Todas</option>
            <option v-for="(e, key) in listaSituacoes" :value="e" :key="key" >{{ e.nome }}</option>
          </select>
        </div>
      </div>

      <div class="col-sm-3">
        <div class="form-group">
          <label for="descricao">Descrição do Agendamento</label>
          <input type="text" v-model="descricao" class="form-control" id="descricao" />
        </div>
      </div>

      <div class="col-md-1">
        <div class="form-group">
          <button
            type="submit"
            @click="buscarAgendamentos()"
            class="btn btn-default btnSearch"
          >Buscar</button>
        </div>
      </div>
    </div>

    <div class="row margin-top-row">
      <div class="col-md-12">       
          <button type="button" class="btn btn-secondary pull-right button-router" @click="adicionarAgendamento()">
            Novo  Agendamento
          </button>       
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <hr />
      </div>
    </div>

    <section>
      <table id="table-agendamendo" class="table table-bordered" data-pic-datatable>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Período</th>
            <th>Situação</th>
            <th>Total de convidados</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in  listaAgendamentos" :key="a.id">
            <td width="5%">{{ getDate(a.dataAgendamento) }}</td>
            <td width="20%" class="">{{ a.descricaoAgendamento }}</td>
            <td width="15%">{{ a.periodo }}</td>
            <td width="10%">{{ a.situacao }}</td>
            <td width="10%">{{ a.qtdeConvidados }}</td>
            <td width="5%" class="clearfix">
              <div class="text-right clearfix">
              <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}' >
                <li>
                  <a @click="detalharAgendamento(a)" title="Detalhar Agendamento">Detalhar</a>
                </li>
              </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="espacamentoPageFinal"></div>

  </div>
</template>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: "Agendamento",
    props: {
      msg: String,
      isAlert: Boolean,
      tipo: String,
    },
    data() {
      return {
        listaAgendamentos: [],
        isListaAgendamentos: false,
        dataInicial: "",
        dataFinal: "",
        periodo: [],
        situacao: [],
        descricao: "",
        tamanho: '',
        listaSituacoes: [],
        listarPeriodos: []        
      };
    },
  created:function(){
      this.buscarSituacoes();
      this.buscarPeriodos();
      // Trazer todos os agendados ao iniciar a tela
      this.situacao = {id:1};
      this.buscarAgendamentos();
    },
    methods: {
      adicionarAgendamento(){
        this.$router.push({
          name: "novoAgendamento"
        });
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
      getDate(dataSemFormato) {
        return moment(dataSemFormato).format('DD/MM/YYYY');
      },
      getTime(stringDate) {
        var date = new Date(stringDate);
        return date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
      },
      buscarAgendamentos() {       
        let listaAgendamentosAtiva;

        let filtroConsultaAgendamentoDTO = {
          dataInicial: this.dataInicial ? this.dataInicial : null,
          dataFinal: this.dataFinal ? this.dataFinal : null,
          periodo: this.periodo ? this.periodo.id : null,
          situacao: this.situacao ? this.situacao.id : null,
          descricao: this.descricao ? this.descricao : null,
          idParlamentar: this.$idParlamentar ? this.$idParlamentar : null
        };

        this.listaAgendamentos = [];
        this.isListaAgendamentos = false;

        this.$http.post("/agendamento/buscaPorFiltro", filtroConsultaAgendamentoDTO)
          .then(
            function(response) {
              this.listaAgendamentos = response.data.content;

              if (this.listaAgendamentos) {
                this.isListaAgendamentos = true;
              } else {
                this.isListaAgendamentos = false;
              }

              listaAgendamentosAtiva = this.isListaAgendamentos;

            }.bind(this)
          )
          .catch(function(error) {
            // handle error
            console.log(error);
          })
          .then(function() {
            // always executed              
            if (listaAgendamentosAtiva) {
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

            PIC.refreshWidget('Actionsbar');
          });
      },
      converterDate(date) {
        if (date) {
          var dt = date.split("/");
          var data = new Date(dt[2], dt[1] - 1, dt[0]);
        }
        return data;
      },
      detalharAgendamento(item) {
        this.$router.push({
          name: "detalharAgendamento",
          params: { idAgendamento: item.id  }
        });
      }
    }
  };
</script>

<style scoped>
.nameScheduling {
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
}
td {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
