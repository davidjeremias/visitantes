<template>
  <span>
    <div class="page-header">
      <h1>Últimas entradas do dia {{ getDate() }}</h1>
    </div>

    <div class="col-md-6 col-md-offset-3">
      <div class="col-md-11">
        <input type="text" class="form-control" v-on:keyup.enter="buscaEntradas()" v-model="parametros" />
      </div>

      <div class="col-md-1">
        <button type="submit" @click="buscaEntradas()" class="btn btn-default">Buscar</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <router-link to="/novoVisitante"><button type="button" class="btn btn-secondary pull-right button-router">Novo Visitante</button></router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        
      </div>
    </div>

    <div class="col-md-12 tableContainerSearch">
      <div data-pic-tabs>
        <ul class="tab-list">
          <li>
            <a href="#visitantes">Visitantes</a>
          </li>
        </ul>

        <div class="tab-content">
          <div id="visitantes">
            <table id="lista-ultimas-entradas" class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Horário da entrada</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="element in listaEntradas" :key="element.id">
                  <template v-if="element.visitanteDTO.documentos.length > 0">
                    <td v-for="e in element.visitanteDTO.documentos" :key="e.id" width="85%">
                    <div class="row">
                      <template v-if="element.visitanteDTO.fotoVisitante != null">
                        <div class="col-md-2 text-center">
                          <span class="avatarImage" @click="showPhoto(element)" data-toggle="modal" data-target="#photoAvatar">
                            <img class="avatar-sivis" :src="element.visitanteDTO.fotoVisitante" alt="Avatar"/>
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="col-md-2 text-center">
                          <img class="avatar-sivis" src="../../public/images/avatar.png" alt="Avatar"/>
                        </div>
                      </template>

                      <div class="col-md-10">
                        <div class="row">
                          <div class="col-md-12 title-visitant">
                            <a @click="preparaUpdate(element)">{{element.visitanteDTO.nomeVisitante}}</a>
                          </div>
                        </div>

                        <template v-if="element.visitanteDTO.cpf != null">
                          <div class="row">
                            <div class="col-md-12">                              
                                <span class="subtitle-visitant">
                                  CPF
                                </span>
                                <span>
                                  : {{formataCPF(element.visitanteDTO.cpf)}}
                                </span>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="row">
                            <div class="col-md-12">                              
                                <span class="subtitle-visitant">
                                  CPF:
                                </span>
                                <span>
                                  Não informado
                                </span>
                            </div>
                          </div>
                        </template>

                        <template v-if="e.isPrincipal == true">
                          <div class="row">
                            <div class="col-md-12">                                
                              <span class="subtitle-visitant">
                                {{e.tipoDocumento.descTipoDocumento.toUpperCase()}}
                              </span>
                              <span class="subtitle-principal">(Principal)</span>
                              <span v-if="e.numero">
                                : {{e.numero}}
                              </span>                                
                            </div>
                          </div>
                        </template>

                        <template v-if="e.isPrincipal != true">
                          <div class="row">
                            <div class="col-md-12">                                
                              <span class="subtitle-visitant">
                                {{e.tipoDocumento.descTipoDocumento.toUpperCase()}}
                              </span>
                              <span v-if="e.numero">
                                : {{e.numero}}
                              </span>                                
                            </div>
                          </div>
                        </template>   
                      </div>
                    </div>
                  </td>
                  </template>

                  <template v-else>
                    <td width="85%">
                    <div class="row">
                      <template v-if="element.visitanteDTO.fotoVisitante != null">
                        <div class="col-md-2 text-center">
                          <span class="avatarImage" @click="showPhoto(element)" data-toggle="modal" data-target="#photoAvatar">
                            <img class="avatar-sivis" :src="element.visitanteDTO.fotoVisitante" alt="Avatar"/>
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="col-md-2 text-center">
                          <img class="avatar-sivis" src="../../public/images/avatar.png" alt="Avatar"/>
                        </div>
                      </template>

                      <div class="col-md-10">
                        <div class="row">
                          <div class="col-md-12 title-visitant">
                            <a @click="preparaUpdate(element)">{{element.visitanteDTO.nomeVisitante}}</a>
                          </div>
                        </div>

                        <template v-if="element.visitanteDTO.cpf != null">
                          <div class="row">
                            <div class="col-md-12">                              
                                <span class="subtitle-visitant">
                                  CPF
                                </span>
                                <span>
                                 : {{formataCPF(element.visitanteDTO.cpf)}}
                                </span>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="row">
                            <div class="col-md-12">                              
                                <span class="subtitle-visitant">
                                  CPF:
                                </span>
                                <span>
                                  Não informado
                                </span>
                            </div>
                          </div>
                        </template>

                    
                        <div class="row">
                          <div class="col-md-12">                                
                            <span class="subtitle-visitant">
                              Sem Documento
                            </span>    
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  </template>
                  <td width="12%">
                    {{getTime(element.dataHoraVisita)}}
                  </td>
                  <td width="3%">
                    <div class="text-right clearfix" v-if="$auth('ATUALIZAR_INFORMACOES_DO_REGISTRO_DE_ENTRADA_PELO_CADASTRADOR') || $auth('ATUALIZAR_INFORMACOES_DO_VISITANTE_PELO_CADASTRADOR')">
                      <button type="submit" @click="preparaUpdate(element)" class="btn btn-primary">Atualizar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>

    <!-- MODAIS -->

    <div data-pic-modal='{"title": "Foto Ampliada"}' id="photoAvatar">
      <div class="row">
        <div class="col-md-12 text-center">
          <img :src="this.photoAvatar" alt="Avatar" />
        </div>
      </div>
    </div>

  </span>
</template>

<script>
// import Tabs from "./Tabs.vue";
import {mask} from 'vue-the-mask'
export default {
  name: "UltimasEntradas",
  directives: {mask},
  props: {
    msg: String
  },
  data(){
    return {
      isListaEntradas: false,
      listaEntradas: [],
      listaDocumentos: [],
      parametros: '',
      mensagem: this.msg,
      isLista: '',
      photoAvatar: ''
    };
  },
  created:function(){
      this.buscaEntradas();
      this.getDate();
  },
  methods:{
    buscaEntradas() {
      this.listaEntradas = [];
      this.isListaEntradas = false;

      let listaEntradaAtiva;
      
      this.$http.get('/entrada/buscaPorFiltros', {
          params: {
            parametros: this.parametros ? this.parametros : '',
            ponto: this.$pontoCadastrador ? this.$pontoCadastrador : null 
          }

      }).then(
          function(response) {            
            this.listaEntradas = response.data.content;

            if(this.listaEntradas.length > 0){
              this.isListaEntradas = true;

            }else{
              this.isListaEntradas = false;
            }

            listaEntradaAtiva = this.isListaEntradas;

          }.bind(this)

        ).catch(function(error) {
          // handle error
          console.log(error);

        }).then(function() {
          // always executed

          if(listaEntradaAtiva){
              var elem1 = document.querySelector('.zeroRecords');
              var elem2 = document.querySelector('.dataTables_info');
              elem1.style.display = 'none';
              elem2.style.display = 'none';

            } else {
              var elem1 = document.querySelector('.zeroRecords');
              var elem2 = document.querySelector('.dataTables_info');
              elem1.style.display = 'block';
              elem2.style.display = 'block';

            }

            PIC.refreshWidget('Actionsbar');
        });
    },
    getDate() {

      var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
        return diaF+"/"+mesF+"/"+anoF;
      
    },
    getTime(stringDate){
      var date = new Date(stringDate);
      return String(date.getHours()).padStart(2, "0")+":"+String(date.getMinutes()).padStart(2, "0");
    },
    formataCPF(cpf){
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },
    preparaUpdate(item){
      this.$router.push({ name: 'visitanteUltimasEntradas', params: { entrada: item}});
    },
    showPhoto(photo) {
      this.photoAvatar = photo.visitanteDTO.fotoVisitante;
    }
  }  
};
</script>