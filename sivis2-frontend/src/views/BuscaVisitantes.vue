<template>
  <span>
    <div class="page-header">
      <h1>Visitantes</h1>
    </div>

    <div v-show="isSalvoSuccess" data-pic-alert='{"type": "success"}'>
      {{mensagem}}
    </div>

    <div class="col-md-6 col-md-offset-3">
      <div class="col-md-11">
        <input type="text" :disabled="!$auth('PESQUISA_BASICA_DE_VISITANTES')" class="form-control" @keyup="clearAlert" v-on:keyup.enter="buscaVisitantes()" v-model="parametros" />
      </div>

      <div class="col-md-1">
        <button type="submit" :disabled="!$auth('PESQUISA_BASICA_DE_VISITANTES')" @click="buscaVisitantes()" class="btn btn-default">Buscar</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <router-link to="/ultimasEntradas">
          <button type="button" v-if="$auth('LISTAR_ULTIMAS_ENTRADAS')" class="btn btn-secondary pull-right button-busca-sivis-home button-router">Últimas Entradas</button>
        </router-link>
        <button v-if="$auth('CADASTRAR_VISITANTE_E_ENTRADA')" type="submit" @click="goNovoVisitante()" class="btn btn-secondary pull-right button-router">Novo Visitante</button>
      </div>
    </div>

    <div v-show="isLista" class="col-md-12 tableContainerSearch">
      <div data-pic-tabs>
        <ul class="tab-list">
          <li>
            <a href="#visitantes">Visitantes</a>
          </li>
          <!-- <li>
            <a href="#servidores">Servidores</a>
          </li> -->
        </ul>

        <div class="tab-content">
          <div id="visitantes">
            <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="element in listaVisitantes" :key="element.id">
                  <td v-for="e in element.documentos" :key="e.id" width="90%">
                    <div class="row" v-if="e.isPrincipal">
                      <template v-if="element.fotoVisitante != null">
                        <div class="col-md-2 text-center">
                          <span class="avatarImage" @click="showPhoto(element)" data-toggle="modal" data-target="#photoAvatar">
                            <img class="avatar-sivis" :src="element.fotoVisitante" alt="Avatar"/>
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="col-md-1 text-center">
                          <img class="avatar-sivis" src="../../public/images/avatar.png" alt="Avatar"/>
                        </div>
                      </template>

                      <div class="col-md-10">
                        <div class="row">
                          <div class="col-md-12 title-visitant">
                            <a @click="preparaUpdate(element)">{{element.nomeVisitante}}</a>
                          </div>
                        </div>

                        <template v-if="element.cpf != null">
                          <div class="row">
                            <div class="col-md-12">                              
                                <span class="subtitle-visitant">
                                  CPF:
                                </span>
                                <span>
                                  {{formataCPF(element.cpf)}}
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
                  <td width="10%">
                    <div class="text-right clearfix" v-if="$auth('REGISTRAR_ENTRADA_DE_VISITANTE')">
                      <button type="submit" @click="preparaUpdate(element)" class="btn btn-primary">Registrar Entrada</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="servidores">
            <table class="table table-bordered" data-pic-datatable='{"paginate": [50,100,150]}'>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Agendamento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width="85%">
                    <div class="row">
                      <div class="col-md-2 text-center">
                        <img src="../../public/images/avatar.png" class="avatar-sivis" alt="Avatar" />
                      </div>

                      <div class="col-md-10">
                        <div class="row">
                          <div class="col-md-12 title-visitant">
                            <a href>Antônio de Tal da Silva</a>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-12 subtitle-visitant-item">
                            <span class="subtitle-visitant">Tipo do Documento:</span> 000.000.000-00
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td width="12%">Não</td>
                  <td width="3%">
                    <div class="text-right clearfix">
                      <button type="button" class="btn btn-primary">Visualizar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="terceirizados">Terceirizados</div>
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
import {mask} from 'vue-the-mask'
export default {
  name: "BuscaVisitantes",  
  directives: {mask},
  props: {
      msg: String,
      isSalvo: {
        type: Boolean,
        default: false
      }
    },
  data() {
    return {
      listaVisitantes: [],
      parametros: '',
      mensagem: this.msg,
      isSalvoSuccess: this.isSalvo,
      isLista: '',
      photoAvatar: ''
    };
  },
  methods: {
    buscaVisitantes() {
      this.isSalvoSuccess = false;
      this.listaVisitantes = [];
      this.parametros = this.removeEspacoString(this.parametros);
      this.$http
        .get(`/visitante/buscaPorFiltros?parametros=${this.parametros}`)
        .then(
          function(response) {
            this.listaVisitantes = response.data.content;
            if(this.listaVisitantes){
              this.isLista = true;  
            }else{
              this.isLista = true;  
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
    removeEspacoString(string){
      return string.replace(/( )+/g, ' ');
    },
    goNovoVisitante(){
      this.$router.push({ name: 'novoVisitante', params: { parametros: this.parametros}});
    },
    clearAlert(){
      this.isSalvoSuccess = false;
    },
    formataCPF(cpf){
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");
    //realizar a formatação...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },
    preparaUpdate(item){
      this.$router.push({ name: 'novoVisitante', params: { idVisitante: item.id, isIncluir: true}});
    },
    showPhoto(photo) {
      this.photoAvatar = photo.fotoVisitante;
    }
  },
  mounted() {
    setTimeout( () => { 
      // PIC.refreshWidget('Alert');
    }, 1);
  },
  updated() {
    if(this.listaVisitantes){
      if(this.listaVisitantes.length > 0){      
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
    }
  }
};
</script>