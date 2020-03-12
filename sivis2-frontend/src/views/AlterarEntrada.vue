<template>

<div class="col-md-12">
   <div class="page-header">
      <template >
        <h1>Alterar Entrada</h1>
      </template>
      
    </div>
<div class="col-md-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h2>Destino Anterior</h2>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                              <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="portaria">Portaria<span class="requiredLabel">*</span></label>
                                        <input type="text" :value="this.entradaDTO.portaria.descricaoPortaria">
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="local">Local<span class="requiredLabel">*</span></label>
                                        <input type="text" :value="this.entradaDTO.destino.nomeDestino">
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
</div>

<div class="col-md-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h2>Novo Destino</h2>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="portaria">Portaria<span class="requiredLabel">*</span></label>
                                        <select v-model="selectedPortaria" @change="onChangeDestino()" class="form-control" id="portaria" >
                                            <option v-for="e in this.listaPortaria" :key="e.id" :value="e" >{{e.descricaoPortaria}}</option></select>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="local">Local<span class="requiredLabel">*</span></label>
                                        <select v-model="selectedDestino" class="form-control" id="local"> 
                                            <option v-for="e in this.listaDestino" :key="e.id" :value="e">{{e.nomeDestino}}</option></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
                <template>
                  <button id="btnAlterar" @click="preparaAlterarEntrada()" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">Alterar</button>
                  <button id="btnVoltar" @click="voltarPesquisaVisitanteEntrada()" class="btn btn-primary btnCreateMarginTop pull-right">Voltar</button>
                </template>
</div>
</template>

<script>
    // import Tabs from '../components/Tabs.vue';
    import { mask } from 'vue-the-mask'
    export default {
        name: "AlterarEntrada",
        directives: { mask },
        props: {
            idEntrada: Number,
            idVisitante : Number
        },
        data() {
           return {
            
            listaPortaria: [],
            listaDestino: [],
            entradaDTO: [],
            selectedDestino: {
              id: null
            },
            selectedPortaria: {
              id: null
            },
            selecionar: {
              id: null,
              descricaoPortaria: "Selecione"
            },
            selecionarDestinos: {
              id: null,
              nomeDestino: "Selecione"
            },
            
           }
        },
        created: function () {
          this.buscarRegistroEntrada();
          this.buscarPortaria();
        },
        methods:{
        voltarPesquisaVisitanteEntrada(){
          this.$router.push({
          name: "pesquisarVisitanteEntradas"
          });
        },

        preparaAlterarEntrada(){
          let entradaDTO = {
            id : this.idEntrada ? this.idEntrada : null,
            portaria: this.selectedPortaria ? this.selectedPortaria : null,
            destino: this.selectedDestino ? this.selectedDestino : null,
            }

          this.$http
            .post("/entrada/alterarEntrada", entradaDTO )
            .then(
                function (response) {
                 if(response.status === 200){

                  this.$router.push({
                    name: "detalharVisitante",
                    params: {
                    msg: "Entrada Alterada com sucesso.",
                    isAlert: true,
                    idVisitante: this.idVisitante,                            
                    isDetalhar: true
                }
              });
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
          buscarRegistroEntrada(){ 
            this.$http
            .get(`/entrada/buscarEntradaID?parametros=${this.idEntrada}`)
            .then(
                function (response) {
                 let data = response.data;
                 this.prepararEntrada(data);
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
           prepararEntrada(data){
             let portaria = {
               id: data.portaria ? data.portaria.id  : null,
               descricaoPortaria : data.portaria ? data.portaria.descricaoPortaria : null
             }
             
             let destino = {
               id: data.destino ? data.destino.id : null,
               nomeDestino : data.destino ? data.destino.nomeDestino : null
             }
               
               this.entradaDTO = {
               id: data.id ? data.id : null,
               portaria: portaria,
               destino: destino,
             }
            
             
           },
           buscarPortaria(){
              this.$http
                .get(`/portaria`)
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
           
           onChangeDestino() {
                if (this.selectedPortaria.descricaoPortaria == 'Selecione') {
                    this.listaDestino.unshift(this.selecionarDestinos);
                    this.selectedDestino = this.listaDestino[0];
                } else {
                    this.listaDestino = this.selectedPortaria.destinos;
                    this.listaDestino.unshift(this.selecionarDestinos);
                    this.listaDestino.sort(function (a, b) {
                        if (a.nomeDestino != 'Selecione' && b.nomeDestino != 'Selecione') {
                            if (a.nomeDestino > b.nomeDestino) {
                                return 1;
                            }
                            if (a.nomeDestino < b.nomeDestino) {
                                return -1;
                            }
                        }
                        return 0;
                    });
                    this.selectedDestino = this.listaDestino[0];
                }
                
            },
          }
        

    }
        </script>
<style>
    
</style>