<template>
  <span>
    <div class="page-header">
      <h1>Pesquisar mensagens encaminhadas</h1>
    </div>

    <div id="descricao-agendamento" class="panel panel-default panel-body" style="margin-top: -5px;">
      <div class="col-md-12">
        <div class="form-group">
          <label for="descricao">Descrição do Agendamento</label>
          <input type="text" v-model="nomeAgendamento" class="form-control input-large" id="nomeAgendamento" disabled />
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
          <input type="text" v-model="nomePatrocinador" class="form-control" id="nomePatrocinador" disabled/>
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
          <input type="text" id="periodo" v-model="periodo" class="form-control" disabled />
        </div>
      </div>

      <div class="col-md-2">
        <div class="form-group">
          <label for="situacao">Situação</label>
          <input type="text" id="situacao" v-model="situacao" class="form-control" disabled />
        </div>
      </div>
    </div>

    <!-- pesquisa -->
    <div  id="pesquisa-mensagem" class="panel panel-default panel-body">
      <div class="col-sm-2">
        <div class="input-group">
          <label for="dataInicial">Data Inicial</label>
            <input type="date" v-model="dataInicial" class="form-control" id="dataInicial" pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" @blur="validarRangeDatas($event.target);"/>
        </div>
        <div v-if="isErroDtInicial" style="text-align:left;font-size:small;color:red;">{{ msgErroIni }}</div>
      </div>

      <div class="col-sm-2">
        	<div class="input-group">
          <label for="dataFinal">Data Final</label>
          <input type="date" v-model="dataFinal" class="form-control" id="dataFinal" pattern="[0-9]{2}\/[0-9]{2}\/[0-9]{4}$" @blur="validarRangeDatas($event.target);"/> 
        </div>
        <div v-if="isErroDtFinal" style="text-align:left;font-size:small;color:red;">{{ msgErroFim }}</div>
      </div>

      <div class="col-sm-2">
        <div class="form-group">
          <label for="situacao">Tipo de mensagem</label>
          <select id="situacao" v-model="tipoEmail" class="form-control">
            <option value selected>Todas</option>
            <option v-for="(e, key) in listaTipoEmail" :value="e" :key="key" >{{ e.tipoMensagem }}</option>
          </select>
        </div>
      </div>

      <div class="col-sm-5">
        <div class="form-group">
          <label for="descricao">Nome</label>
          <input type="text" v-model="nomeConvidado" class="form-control" id="descricao" />
        </div>
      </div>

      <div class="col-md-1">
        <div class="form-group">
          <button type="submit" @click="buscarMensagensAgendamento()" class="btn btn-default btnSearch">Buscar</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-10 col-md-offset-1"><hr></div>
    </div>

    <div class="row">
      <div v-if="!this.isListaMensagensEnviadas" class="col-md-12 text-center alert-registro-nao-encontrado">
        <span class="alert-danger"  style="padding: 15px;">
            <i class="glyphicon glyphicon-exclamation-sign"></i> Não foi encontrado nenhum registro com esse parâmetro informado!
        </span>
      </div>
    </div>

    <div class="clearfix"></div>

    <div id="grid-msg-envidadas" v-if="this.isListaMensagensEnviadas">
      <table id="tabela-msg-envidadas" class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": true}'>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Data de Encaminhamento</th>
              <th>Tipo</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="msg in listaMensagens" :key="msg.id">
              <td width="10%" class="text-center">
                <template v-if="msg.fotoConvidado != null">
                    <img :src="msg.fotoConvidado" class="molduraFotoConvidado" style="width:115px !important; height:100px; !important"/>
                </template>
                <template v-else>
                    <img src="images/avatar_sem_foto.jpeg" alt="Foto do convidado" class="imagemFotoConvidado"/>
                </template>            
            </td>
              <td width="">{{ msg.nomeConvidado }}</td>
              <!-- <td width="">{{ getDateTime(msg.dataEnvio) }}</td> -->
              <td width="">{{getDateTime(msg.dataEnvio)}}</td>
              <td width="">{{ msg.tipoEmail }}</td>
              <td width="8%" class="text-center clearfix">
                <div class="clearfix">
                  <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "label":"", "buttonType":"primary"}' >
                    <li>
                      <a data-toggle="modal" @click="chamarModalDetalharConteudoMsg(msg.nomeConvidado, msg.tipoEmail)" title="Detalhar">
                        Detalhar
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
    </div>

    <div class="espacamentoPageFinal"></div>

    <!-- MODAL -->

    <div data-pic-modal='{"title": "E-mail enviado ao convidado", "dialog": "default", "size":"md"}' id="ModalDetalharConteudoMsg">
      <div id="pagina" style="width:480px; margin:0.3em auto">
        <div id="top_menu" style="margin-top: 25px;">
          <div class="imagemHeaderEmail"></div>
        </div>
        <div id="corpoMsg" th:style="'display:block'">
          <p class="paragrafoEmail">
            Olá <b><span>{{this.ddEmailNome}}</span></b>
          </p>

          <template v-if="this.ddEmailTipo == 'Cancelamento'">
            <p class="paragrafoEmail">
              O(a) <b>Dep. <span> {{this.nomePatrocinador}}</span> </b> informa que nosso encontro que ocorreria na Câmara dos Deputados foi <b><font color="red">CANCELADO</font></b> por motivos maiores.
            </p>
          </template>

          <template v-if="this.ddEmailTipo != 'Cancelamento'">
            <p class="paragrafoEmail">
              O seu agendamento está <b><font color="green">CONFIRMADO</font></b>.
            </p>
            <p class="paragrafoEmail">
              O(a) <b>Dep. <span> {{this.nomePatrocinador}}</span> </b> terá a honra de recebê-la(o) na Câmara dos Deputados.
            </p>
          </template>

          <p class="paragrafoEmail">
            No local <br />
            <b><span>{{this.local}}</span></b>
          </p>
          <p class="paragrafoEmail">
            Na data <br>
            <b><span>{{this.formatarData(this.dataAgendamento)}}</span></b>
          </p>
          <p class="paragrafoEmail">
            No período <br>
            <b><span>{{this.periodo}}</span></b>
          </p>
          <p class="paragrafoEmail">
            Para participar de(a): <br>
            <b>{{this.nomeAgendamento}}</b>
          </p>
    
          <p class="paragrafoEmail">
            <i>
              <font size="2">* Gerado automaticamente pelo sistema SIVIS - Sistema de Identificação de Visitantes da Câmara dos Deputados.</font>
            </i>
          </p>
        </div>
      
      <div id="footer" th:style="'height: 90px;margin-top:0px;display:block;'">
        <div class="imagemFooterEmail"></div>
      </div>
    </div>
    </div>

  </span>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "PesquisarMensagens",
        data() {
          return {
              idAgendamento: this.$route.params.idAgendamento,
              /*Cabeçalho*/
              nomeAgendamento: '',
              local: '',
              nomePatrocinador: '',
              dataAgendamento: '',
              periodo: '',
              situacao: '',
              /*Campos pesquisa */
              isErroDtInicial: false, 
              msgErroIni: '',
              isErroDtFinal: false,
              msgErroFim: '',
              dataInicial: null,
              dataFinal: null,
              nomeConvidado: '',
              tipoEmail: null,
              listaTipoEmail: [],
              /*Grid*/
              isListaMensagensEnviadas: true,
              listaMensagens: [],
              ddEmailNome: '',
              ddEmailTipo: '',
              isMataRederPic: false
          };
        },
        created: function() {
          this.buscarMensagensAgendamento();

          this.buscarTipoEmail();

          if(this.idAgendamento){
            this.$http.get("/agendamento/buscaPorId", {
              params: { idAgendamento: this.idAgendamento }

            }).then(
              function(response) {
                if (response.status === 200) {
                  var data = response.data;
                  this.id = data.id;
                  this.nomeAgendamento = data.descricaoAgendamento;
                  this.local = data.local;
                  this.nomePatrocinador = data.nomePatrocinador;
                  this.dataAgendamento = this.formatarData(data.dataAgendamento);
                  this.periodo = this.prepararPeriodo(data.periodo).nome;
                  this.situacao = this.prepararSituacao(data.situacao).nome;
                }
              }
              .bind(this)
                //
              ).catch(function(error) {
                // handle error
                console.log(error);
              });
          };          
        },
        methods: {
          buscarTipoEmail() {
            this.$http.get("/tipoMensagem")
              .then(
                function(response) {
                  this.listaTipoEmail= response.data;

                }.bind(this)

              ).catch(function(error) {
                // handle error
                console.log(error);

              }).then(function() {
                // always executed
              });
          },
          getDateTime(dataSemFormato) {
            return dataSemFormato ? moment(dataSemFormato).format('DD/MM/YYYY HH:MM') : null;
          },
          formatarData(data) {              
            var dataFormatada = data.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
            return dataFormatada;
          },
          getTime(stringDate){
            var date = new Date(stringDate);
            return String(date.getHours()).padStart(2, "0")+":"+String(date.getMinutes()).padStart(2, "0");
          },
          buscarMensagensAgendamento(){
            this.listaMensagens = [];

            this.$http.get("/mensagem", {
              params: { 
                idAgendamento: this.idAgendamento,  
                dataInicio: this.dataInicial ? this.dataInicial: null, 
                dataFim: this.dataFinal ? this.dataFinal: null, 
                tipoEmail: this.tipoEmail ? this.tipoEmail.tipoMensagem: null, 
                nome: this.nomeConvidado  ? this.removeEspacoString(this.nomeConvidado) : null
              }}

            ).then(
                function(response) {
                  this.listaMensagens = response.data;

                  if (response.status == 200) {
                    this.isListaMensagensEnviadas = true;
                  } else {
                    this.isListaMensagensEnviadas = false;
                  }

                  this.isMataRederPic = true;

                }.bind(this)

              ).catch(function(error) {
                // handle error
                console.log(error);

              }).then(function() {
                // always executed
              });
          },
          prepararSituacao(situacaoNome){
            switch (situacaoNome) {  
                case 'Agendado': 
                case 'AGENDADO': return {id:1,nome:"Agendado" };
                case 'Cancelado':
                case 'CANCELADO': return {id:0,nome:"Cancelado"}; 
            } 
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
          chamarModalDetalharConteudoMsg(nome, tipo){
            this.ddEmailNome = nome;
            this.ddEmailTipo = tipo;

            PIC.activateWidget('Modal', '#ModalDetalharConteudoMsg');
            $('#ModalDetalharConteudoMsg').picModal().show();
          },
          verificarDataValida(element){
              var partesData = element.value.split("-");
              var dataEntrada = new Date(partesData[0], partesData[1], partesData[2]);

              if(isNaN(dataEntrada.getTime())){

                if(element.id == 'dataInicial'){
                  this.isErroDtInicial = true;
                  this.msgErroIni = 'Entre com uma data válida.'
                }else{
                  this.isErroDtFinal = true;
                  this.msgErroFim = 'Entre com uma data válida.'
                }
                
                if((this.dataInicial == null && this.dataFinal == null) || (this.dataInicial == '' && this.dataFinal == '')){
                  this.isErroDtInicial = false;
                  this.isErroDtFinal = false;
                }

                return false;

              }else{
                this.isErroDtInicial = false;
                this.isErroDtFinal = false;

                return true;
              }
          },          
          validarRangeDatas(obj){

            if(this.dataInicial != null || this.dataFinal != null){
              var resp = this.verificarDataValida(obj);            

              if(resp){
                if(this.dataInicial != null && this.dataFinal == null){
                  this.isErroDtFinal = true;
                  this.msgErroFim = 'Entre com uma data final.'
                }

                if(this.dataInicial == null && this.dataFinal != null){
                  this.isErroDtInicial = true;
                  this.msgErroFim = 'Entre com uma data inicial.'
                }

                if(this.dataInicial != null && this.dataFinal != null){

                  var strDataIni = this.dataInicial;
                  var partesDataIni = strDataIni.split("-");
                  var dataInicial = new Date(partesDataIni[0], partesDataIni[1], partesDataIni[2]);

                  var strDataFim = this.dataFinal;
                  var partesDataFim = strDataFim.split("-");
                  var dataFinal = new Date(partesDataFim[0], partesDataFim[1], partesDataFim[2]);

                  if (dataFinal < dataInicial) {
                    this.isErroDtFinal = true;
                    this.msgErroFim = "A data não pode ser menor que a data inicial: " + this.formatarData(this.dataInicial) + ".";
                  }else{
                    this.isErroDtInicial = false;
                    this.isErroDtFinal = false;
                  }
                }
              }
            }
          },
          removeEspacoString(string){
            return string.replace(/( )+/g, ' ');
          }
        },
        updated() {

          if(this.listaMensagens){
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

          if(this.isMataRederPic){
            PIC.activateWidget("Datatable");

            PIC.destroyWidget('Actionsbar');
            PIC.activateWidget('Actionsbar');
          }

          this.isMataRederPic = false;
        }
    };
</script>

<style scoped>
  .paragrafoEmail{
    margin: 3px 10px 10px;
  }

 .alert-registro-nao-encontrado {
    border-left:solid 1px #507c3f;
    height: 144px;
    margin-top:6px;
    justify-content: center;
  }
</style>