<template>
  <div class="col-md-12">
    <div class="page-header">
      <h1>Pesquisar visitantes e entradas</h1>
    </div>
    <div class="row">
      <div class="col-md-4">
        <div class="col-md-12 main-info-container">
          <h4>Visitantes</h4>
          <div class="col-md-8">
            <div class="form-group">
              <label for="nome">Nome</label>
              <input type="text" v-model="nome" class="form-control" id="nome" />
            </div>
          </div>
          <div class="col-md-4">
            <label for="nDocumento">Nº documento</label>
            <input type="text" v-model="nDocumento" class="form-control" id="documento" />
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="tipoRestricao">Tipo de restrição</label>
              <select v-model="selectTipoRestricao" class="form-control" id="tipoRestricao" name="tipoRestricao">
                <option value selected>Todas</option>
                <option v-for="(e, key) in listaTipoRestricao" :key="key" :value="e">{{ e.nome }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="col-md-12 main-info-container">
          <h4>Entradas</h4>
          <div class="col-md-3">
            <div class="form-group">
              <label for="dataInicial">Data Inicial</label>
              <input type="date" v-model="dataInicial" class="form-control" id="dataInicial"
                pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" />
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-group">
              <label for="dataFinal">Data Final</label>
              <input type="date" v-model="dataFinal" class="form-control" id="dataFinal"
                pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" :min="this.dataInicial"/>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-group">
              <label for="horaInicial">Hora Inicial</label>
              <input type="time" v-model="horaInicial" class="form-control" id="horaInicial" />
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-group">
              <label for="horaFinal">Hora Final</label>
              <input type="time" v-model="horaFinal" class="form-control" id="horaFinal" />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="portaria">Portaria</label>
              <select v-model="selectedPortaria" @change="onChangeDestino()" class="form-control" id="portaria"
                name="portaria">
                <option value selected>Todas</option>
                <option v-for="e in this.listaPortaria" :key="e.id" :value="e">{{e.descricaoPortaria}}</option>
              </select>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="local">Destino</label>
              <select v-model="selectedDestino" class="form-control" id="local" name="local">
                <option>Todas</option>
                <option v-for="e in this.listaDestino" :key="e.id" :value="e">{{e.nomeDestino}}</option>
              </select>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-group">
              <div class="checkbox">
                <input type="radio" v-model="isEntradas" value="todas" /> Exibir todas as entradas
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <div class="checkbox">
                <input type="radio" v-model="isEntradas" value="recente" /> Somente a entrada mais recente
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-buscar">
      <input id="btnBuscar" @click="buscarVisitanteEntradas()" value="Buscar" type="button" class="btn btn-primary" />
    </div>

    <!-- Table -->
    <template v-if="isListaVisitante">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2>Visitantes e entradas</h2>
        </div>
        <br />
        <table id="table-restricao" class="table table-bordered" data-pic-datatable='{"paginate": false}'>
          <thead>
            <tr>
              <th data-pic-datatable-config='nosort'>Foto</th>
              <th >Nome</th>
              <th data-pic-datatable-config='nosort'>CPF</th>
              <th>Tipo de restrição</th>
              <th>Data entrada</th>
              <th>Hora</th>
              <th data-pic-datatable-config='nosort'>Portaria</th>
              <th data-pic-datatable-config='nosort'>Local</th>
              <th data-pic-datatable-config='nosort'>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in  listaVisitante" :key="v.id">
              <td width="10%" class="text-center">
                <img :src="v.fotoVisitante" class="molduraFotoConvidado" />
              </td>
              <td>{{ v.idEntrada +"-"+ v.nomeVisitante }}</td>
              <td>{{ formataCPF(v.numeroDocumentoVisitante) }}</td>
              <td>{{ v.tipoRestricao }}</td>
              <td>{{ v.dataEntrada }}</td>
              <td>{{ v.horaEntrada }}</td>
              <td>{{ v.portaria }}</td>
              <td>{{ v.destino }}</td>
              <td>
                <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}'>
                  <li>
                    <a @click="detalharVisitante(v)"> Detalhar</a>
                  </li>
                  <li>
                     <div v-if="$auth('ATUALIZAR_INFORMACOES_DO_REGISTRO_DE_ENTRADA_PELO_CADASTRADOR') || $auth('ATUALIZAR_INFORMACOES_DO_VISITANTE_PELO_CADASTRADOR')">
                      <a @click="preparaUpdate(v)" >Registrar Entrada</a>
                    </div>
                    
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-if="pesquisaVazia">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2>Visitantes e entradas</h2>
        </div>
        <br />
        <span class="center">
          <p>Não existe nenhum registro de visitante ou entrada com os filtros informados.</p>
        </span>
      </div>
    </template>
    <div class="espacamentoPageFinal"></div>
  </div>

</template>

<script>
  export default {
    name: "PesquisaVisitanteEntradas",
    data() {
      return {
        nome: "",
        nDocumento: "",
        listaTipoRestricao: "",
        tipoRestricao: "",
        dataInicial: "",
        dataFinal: "",
        isEntradas: "recente",
        horaInicial: "",
        horaFinal: "",
        selectTipoRestricao: "",
        selectedDestino: "",
        listaPortaria: [],
        listaDestino: [],

        selectedPortaria: "",

        listaVisitante: [],
        isListaVisitante: false,
        pesquisaVazia: false
      };
    },
    created: function () {

      this.buscarPortaria();
      this.buscarTiposRestricao();
    },
    methods: {
      formataCPF(cpf) {
        //retira os caracteres indesejados...
        if (cpf != null) {
          cpf = cpf.replace(/[^\d]/g, "");
          //realizar a formatação...
          cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        return cpf ? cpf : null;
      },
      onChangeDestino() {
        this.listaDestino = this.selectedPortaria.destinos;
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
      },
      buscarVisitanteEntradas() {

        let portariaDTO = null;
        portariaDTO = {
          id: this.selectedPortaria ? this.selectedPortaria.id : null
        }

        let tipoRestricaoDTO = null;
        tipoRestricaoDTO = {
          id: this.selectTipoRestricao ? this.selectTipoRestricao.id : null
        }

        let destinoDTO = null;
        destinoDTO = {
          id: this.selectedDestino ? this.selectedDestino.id : null
        }



        let filtroPesquisarVisitanteEntradaDTO = null;
        filtroPesquisarVisitanteEntradaDTO = {
          nomeVisitante: this.nome ? this.nome : null,
          numeroDocumentoVisitante: this.nDocumento ? this.nDocumento : null,

          dataEntradaInicial: this.dataInicial ? this.dataInicial : null,
          dataEntradaFinal: this.dataFinal ? this.dataFinal : null,
          horaEntradaInicial: this.horaInicial ? this.horaInicial : null,
          horaEntradaFinal: this.horaFinal ? this.horaFinal : null,
          local: this.selectLocal ? this.selectLocal.id : null,
          checkEntradas: this.isEntradas ? this.isEntradas : null,

          portariaDTO: portariaDTO ? portariaDTO : null,
          tipoRestricaoDTO: tipoRestricaoDTO ? tipoRestricaoDTO : null,
          destinoDTO: destinoDTO ? destinoDTO : null
        }
        this.listaVisitante = null;
        
        this.$http
          .post('/entrada/pesquisarVisitantesEntradas', filtroPesquisarVisitanteEntradaDTO)
          .then(
            function (response) {

              if (response.status === 200) {
                this.listaVisitante = response.data;
                this.isListaVisitante = true;
                this.pesquisaVazia = false;
              } else {
                this.isListaVisitante = false;
                this.pesquisaVazia = true;
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
      detalharVisitante(item) {
        this.$router.push({
          name: "detalharVisitante",
          params: { idVisitante: item.id, isDetalhar: true }
        });
      },

      preparaUpdate(item){
      this.$router.push({ name: 'novoVisitante', params: { idVisitante: item.id}});
    },

     
    },

    updated() {
      if (this.isListaVisitante) {
        PIC.activateWidget("Actionsbar");
        PIC.activateWidget("Datatable");
        if (this.isListaVisitante) {
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
        if(this.listaVisitante === null){
          this.pesquisaVazia = true;
          this.isListaVisitante = false;
        }
      }
    }
  };
</script>

<style>
  .button-buscar {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>