<template>
  <span>
    <div class="page-header">
      <h1>Agendamentos de visitantes para {{ getDate() }}</h1>
    </div>

    <div class="main-info-container" style="padding:3rem 0px 6rem"> 
      <div class="col-md-12 col-md-offset-1">
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="descricao" />
        </div>

        
        <div class="col-md-1" v-if="$auth('PESQUISAR_AGENDAMENTOS_DATA_CORRENTE')">
          <button type="submit" @click="buscaAgendamentoClick()" class="btn btn-default">Buscar</button>
        </div>

      </div>
        <div v-if="listaAgendamentos.length > 0" style="padding:1.5rem; margin-left:1px; font-family: 'Source Sans Pro', sans-serif;">
          <div class="col-md-8 col-md-offset-1">Há {{listaAgendamentos.length}} eventos agendados para hoje.</div>
        </div>
    </div>

    <div class="row">
      <div class="col-md-10 col-md-offset-1"><hr></div>
    </div>

    <div class="row">
      <div v-if="buscaVazia" class="col-md-12 text-center alert-registro-nao-encontrado">
        <span class="alert-danger"  style="padding: 15px;">
            <i class="glyphicon glyphicon-exclamation-sign"></i> Não foi encontrado nenhum registro com esse parâmetro informado!
        </span>
      </div>
    </div>

    <div class="clearfix"></div>

    <template v-if="isListaAgendamentos">
      <section>
          <table id="table-agendamendo" class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": true}'>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Local</th>
                <th>Patrocinador</th>
                <th>Período</th>
                <th>Situação</th>
                <th>Total</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agendamento in  listaAgendamentos" :key="agendamento.id">
                <td width="8%">{{formatarData(agendamento.dataAgendamento)}}</td>
                <td width="30%">{{agendamento.descricaoAgendamento}}</td>
                <td width="20%">{{agendamento.local}}</td>
                <td width="10%">{{agendamento.nomePatrocinador}}</td>
                <td width="10%">{{prepararPeriodo(agendamento.periodo).nome}}</td>
                <td width="10%">{{agendamento.situacao}}</td>
                <td width="3%">{{agendamento.qtdeConvidados}}</td>
                <td width="8%" class="clearfix">
                  <div class="text-right clearfix" v-if="$auth('DETALHAR_AGENDAMENTO_REFERENTE_DATA_CORRENTE')">
                    <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}' >
                      <li>
                        <a @click="ConfirmarConvidadoAgendamento(agendamento)" title="Detalhar Agendamento">Detalhar</a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
      </section>
    </template>

    <div class="espacamentoPageFinal"></div>

  </span>
</template>

<script>
    import {mask} from 'vue-the-mask'
    
    export default {
        name: "PesquisarAgendamento",
        directives: {mask},
        data() {
            return {
                isListaAgendamentos: Boolean,
                descricao: null,
                listaAgendamentos: [],
                isMataRederPic: false,
                buscaVazia: false
            };
        },
        created(){
          this.buscaAgendamento();
        },    
        methods: {
          buscaAgendamentoClick(){
            
            this.buscaAgendamento();
            if(this.isListaAgendamentos){
               this.buscaVazia = false;
            }else{
this.buscaVazia = true;
            }
           
          },
            formatarData(data) {              
              var dataFormatada = data.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
              return dataFormatada;
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
            buscaAgendamento() {     
              let isLista;

              this.$http.get("/agendamento/buscaAgendamentoPorParametros", {
                params: { 
                  parametros: this.descricao ? this.removeEspacoString(this.descricao) : null
                }
              }).then(
                  function(response) {
                    this.listaAgendamentos = response.data;

                    if (response.status == 200) {
                      this.isListaAgendamentos = true;
                    } else {
                      this.isListaAgendamentos = false;
                      
                    }

                    isLista = this.isListaAgendamentos;

                  }.bind(this)

              ).catch(function(error) {
                  // handle error
                  console.log(error);
              }).then(function(){

                  if(isLista){
                    var elem1 = document.querySelector('.zeroRecords');
                    var elem2 = document.querySelector('.dataTables_info');
                    PIC.activateWidget('Actionsbar');

                    if(elem1 != null && elem2 != null){
                      elem1.style.display = 'none';
                      elem2.style.display = 'none';
                    }

                  } else {
                    var elem1 = document.querySelector('.zeroRecords');
                    var elem2 = document.querySelector('.dataTables_info');

                    if(elem1 != null && elem2 != null){
                      elem1.style.display = 'block';
                      elem2.style.display = 'block';
                    }
                  }
              });
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
            ConfirmarConvidadoAgendamento(agendamento) {
              this.$router.push({
                name: "confirmarConvidadoAgendamento",
                params: { idAgendamento: agendamento.id, convidado: agendamento.convidadoDTO}
              });
            },
            removeEspacoString(string){
              return string.replace(/( )+/g, ' ');
            }
        },
        updated(){

        }
    };
</script>

<style scoped>
 .alert-registro-nao-encontrado {
    border-left:solid 1px #507c3f;
    height: 144px;
    margin-top:6px;
    justify-content: center;
  }
</style>