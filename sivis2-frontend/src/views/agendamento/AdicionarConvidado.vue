<template>
  <div class="col-md-12 marginContainerBottom">
    <div class="page-header">
      <h1>Agendamento de convidados ao gabinete</h1>
    </div>
    <painel-gabinete :siglaParlamentar="this.$siglaParlamentar" :nomeParlamentar="this.$nomeParlamentar"/> 

    <div class="row main-info-container">
      <div class="col-md-12">
        <div class="form-group">
          <label for="descricaoAgendamento">Descrição do agendamento</label>
          <input type="text" v-model="descricao" class="form-control input-large" id="nomeAgendamento" disabled />
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
          <label for="patrocinador">Patrocinador</label>
          <input type="text" v-model="patrocinador" class="form-control" id="patrocinador" disabled />
        </div>
      </div>

      <div class="col-md-3">
        <div class="form-group">
          <label for="data">Data</label>
          <input type="text" v-model="dataAgendamento" class="form-control" id="data" disabled />
        </div>
      </div>

      <div class="col-md-3">
        <div class="form-group">
          <label for="periodo">Período </label>
          <input type="text" id="periodo" v-model="periodo.nome" class="form-control" disabled />
        </div>
      </div>
    </div>

    <div  v-show="isErrosValidacao" data-pic-alert='{"type": "error"}'>
	    <p ref="erros" v-if="errosValidados.length">
        <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
        <ul>
      <li v-for="error in errosValidados" :key=error>{{ error }}</li>
    </ul>
     </p>
    </div>

    <div v-show="isAlert" data-pic-alert='{"type": "success"}'>
	    {{ msg }}
    </div>
    
    
    <form novalidate="true">
     
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2>Convidado</h2>
        </div>
<input type="hidden" id="convidadoID" v-model="convidadoID"/>
<input type="hidden" id="fotoID" v-model="fotoID"/>
        <div class="panel-body">
          <div class="row">
      <div class="row">
        <div class="col-md-12">
            <div class="col-md-2" v-if="isIniciarCadastro">
              <template >
              <div class="row">
                  <div class="col-md-12 text-center " v-if="this.avatar">
                    <img
                      id="avatar"
                      :src="this.avatar"
                      alt=""
                      class="molduraFotoConvidado"
                      
                    />
                     
                  </div>
              <div class="col-md-12 text-center " v-else>
                 <img src="images/avatar_sem_foto.jpeg" class="imagemFotoConvidado" />

              </div>
                  <div class="col-md-12 text-center" style="margin-top: 1rem">
                    <button type="button" class="btn btn-primary" @click="$refs.fileInputAvatar.click()" :disabled="isDetalhar">
                      
                      <span >{{ this.avatar ? "Alterar Foto":"Adicionar Foto" }}</span>
                    </button>
                    <input
                      id="fileInputAvatar"
                      name="fileInputAvatar"
                      style="display: none"
                      ref="fileInputAvatar"
                      type="file"
                      @change="onFileChange($event)"
                      enctype="multipart/form-data"
                      :required="this.avatar ? false: true"
                      oninvalid="É necessário uma foto para o convidado"
                    />
                    <p></p>
                    <span class="validacao" v-show="this.isNoImagem">Arquivo Inválido</span>
                  </div>
              </div>
              </template>
            </div>
          
            <div class="col-md-10">
              <div class="row">
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="numeroCPF">CPF <span class="requiredLabel">*</span></label>
                    <input
                      type="text"
                      v-mask="'###.###.###-##'"
                      v-model="numeroCPF"
                      @change="verificarConvidado"
                      class="form-control"
                      id="numeroCPF"
                      required
                      oninvalid="É necessário um cpf para o convidado."
                    />
                    <span class="validacao" v-show="!isValid">CPF Inválido</span>
                  </div>
                </div>
                <template v-if="this.isVisitante">
                <div class="col-md-5" v-if="isIniciarCadastro || isVisitante">
                  <div class="form-group">
                    <label for="nome">Nome </label>
                    <input
                      type="text"
                      data-rules="required|alpha|min:3" 
                      v-model="nome"
                      class="form-control"
                      id="nome"
                      name=nome
                      disabled
                      required
                      oninvalid="É necessário um nome para o convidado."                     

                    />
                  </div>
                </div>
                </template>
                <template v-else>
                  <div class="col-md-5" v-if="isIniciarCadastro">
                  <div class="form-group">
                    <label for="nome">Nome <span class="requiredLabel">*</span></label>
                    <input
                      type="text"
                      data-rules="required|alpha|min:3" 
                      v-model="nome"
                      class="form-control"
                      id="nome"
                      name=nome
                      required
                      oninvalid="É necessário um nome para o convidado."                     

                    />
                  </div>
                </div>
                </template>
    </div>
    <div class="row">
                <div class="col-md-3" v-if="isIniciarCadastro">
                  <div class="form-group">
                    <label for="telefone">Telefone</label>
                    <input type="text" v-model="telefone" class="form-control" id="telefone" v-on:keyup="verificarTelefone()" v-mask="['(##) ####-####', '(##) #####-####']" required oninvalid="É necessário um telefone para o convidado."/>
                    <span class="validacao" v-show="isTelefoneInvalido">Telefone inválido</span>
                  </div>
                </div>

                <div class="col-md-5" v-if="isIniciarCadastro  || isVisitante "> 
                  <div class="form-group">
                    <label for="email">E-mail <span class="requiredLabel">*</span></label>
                    <input type="text" v-model="email" @change="validarEmailDigitado" class="form-control" id="email" required oninvalid="É necessário um email para o convidado."/>
                    <span class="validacao" v-show="isEmailValido">EMAIL Inválido</span>
                  </div>
                </div>
      </div>
            </div>
          </div>
      </div>
        </div>
      </div>
      </div>
      
        
      

       <div class="panel panel-default" v-if="isIniciarCadastro">
         <div class="panel-body">
         
         <input type="hidden" id="fotoDocumentoID" v-model="fotoDocumentoID"/>
         
           <div class="col-md-7 panel-default">
            
              <div class="panel-heading"><h2>Fotos Documentos</h2></div> 
             <br />
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6" >
                    <div class="document-webcam-title text-center" v-if="!this.isNoImagemFrente">Frente</div>
                    <div v-if="!this.isNoImagemFrente">
                         <div class="molduraFotoDocumento">
                            <img v-if="this.dataDocumentoFrente" :src="this.dataDocumentoFrente" alt="Foto Documento frente" class="imagemDocumento">
                          </div>
                          <br />
                          <div class="text-center">
                            <button type="button" class="btn btn-primary" @click="$refs.fileInputDocumentoFrente.click()" :disabled="isDetalhar">
                                   
                                    <span class="textButton">{{ this.dataDocumentoFrente ? "Alterar Frente":"Adicionar Frente" }}</span>       
                            </button>
                            <input 
                                  id="dataDocumentoFrente" 
                                  name="dataDocumentoFrente" 
                                  style="display: none" 
                                  ref="fileInputDocumentoFrente" 
                                  type="file" 
                                  @change="onFileChange($event)" 
                                  enctype="multipart/form-data"
                                  v-if="isIniciarCadastro"
                                  :required="this.dataDocumentoFrente ? false: true"
                                  oninvalid="É necessário uma imagem da frente do documento."/>
                          </div>
                    </div>
                  </div>
                  <div class="col-md-6" >
                    <div class="document-webcam-title text-center" v-if="!this.isNoImagemVerso">Verso</div>
                      <div v-if="!this.isNoImagemVerso">
                          <div class="molduraFotoDocumento" >
                              <img v-if="this.dataDocumentoVerso" :src="this.dataDocumentoVerso" alt="Foto Documento Verso" class="imagemDocumento"/>
                          </div>
                          <br />
                          <div class="text-center">
                            <button  type="button" class="btn btn-primary" @click="$refs.fileInputDocumentoVerso.click()" :disabled="isDetalhar">
                              
                              <span class="textButton">{{ this.dataDocumentoVerso ? "Alterar Verso":"Adicionar Verso" }}</span>       
                            </button>
                            <input id="dataDocumentoVerso" 
                            name="dataDocumentoVerso" 
                            style="display: none" 
                            ref="fileInputDocumentoVerso" 
                            type="file" 
                            @change="onFileChange($event)" 
                            enctype="multipart/form-data"
                            v-if="isIniciarCadastro">
                          </div>
                      </div>
                  </div>

                </div>
              </div>
              
           </div>      
           <div class="col-md-5 panel-default">
              <div class="panel-heading"><h2>Dados Documentos</h2></div> 
              <br />
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input type="hidden" id="documentoID" v-model="documentoID">
                      <label for="origem">Origem</label>
                      <select 
                        v-model="selectedOrigem"
                        @change="onChangePaises(); catchEvent($event); "
                        class="form-control"
                        id="origem"
                        name="origem"
                        required
                        oninvalid="Informe a origem do documento."
                        v-if="isIniciarCadastro">
                        <option
                          v-for="(e, key) in listaOrigem"
                          :key="key"
                          :value="e"
                          selected
                        >{{e.descOrigem.toUpperCase()}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="pais">País</label>
                      <select
                        v-model="selectedPais"
                        @change="catchEventCountry($event)"
                        class="form-control"
                        id="pais"
                        name="pais"
                        required
                        oninvalid="Informe o País do documento."
                        v-if="isIniciarCadastro"
                      >
                        <!--<option selected>Selecione</option>-->
                        <option v-for="(e, key) in listaPaises" :key="key" selected :value="e">{{e.namePais}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <template>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="tipoDocumento">Tipo do documento</label>
                          <select v-model="selectedTipoDocumento" v-if="isIniciarCadastro" class="form-control" id="tipo-do-documento" @change="catchEvent($event)" required oninvalid="Informe o tipo do documento.">
                            <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key" >
                              {{ e.descTipoDocumento.toUpperCase() }}
                            </option>
                          </select>
                      </div>
                    </div>
                  </template>
                  <template v-if="tipoDocumentoSelecionado === 'RG'">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="numero-rg-sivis">Identificação</label>
                        <input
                          type="text"
                          v-mask="'#################################'"
                          v-model="numero"
                          class="form-control"
                          id="numero-rg-sivis"
                          required
                          oninvalid="Informe a identificação do documento."
                          v-if="isIniciarCadastro"
                        />
                      </div>
                    </div>
                      
                    <div class="col-md-2">
                      <div class="form-group">
                        <label for="uf-rg-sivis">UF</label>
                        <select v-model="selectedEstado" class="form-control" id="uf-rg-sivis" 
                        required
                        oninvalid="Informe a UF do documento."
                        v-if="isIniciarCadastro"
                        >
                          <option
                            v-for="(e, key) in listaEstados"
                            :value="e"
                            :key="key"
                          >{{ e.uf.toUpperCase() }}</option>
                        </select>
                      </div>
                    </div>

                    
            </template>

            <template v-else-if="tipoDocumentoSelecionado === 'CNH'">
              
            </template>

            <template v-else-if="tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-carteira-de-trabalho-sivis">Identificação</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-carteira-de-trabalho-sivis"
                    required
                    oninvalid="Informe a Identificação do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-2">
                <div class="form-group">
                  <label for="estado-carteira-de-trabalho-sivis">Estado</label>

                  <select
                    v-model="selectedEstado"
                    class="form-control"
                    id="estado-carteira-de-trabalho-sivis"
                    required
                    oninvalid="Informe a UF do documento."
                    v-if="isIniciarCadastro"
                  >
                    <option
                      v-for="(e, key) in listaEstados"
                      :value="e"
                      :key="key"
                    >{{ e.uf.toUpperCase() }}</option>
                  </select>
                </div>
              </div>

              
            </template>


            <template v-else-if="tipoDocumentoSelecionado === 'PASSAPORTE' || tipoOrigemSelecionado === 'MERCOSUL' || tipoOrigemSelecionado === 'ESTRANGEIRO'"            >
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-passaporte-sivis">Identificação</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-passaporte-sivis"
                    required
                    oninvalid="Informe a Identificação do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                  <input
                    type="date"
                    v-model="dataExpedicao"
                    class="form-control"
                    id="numero-data-expedicao-sivis"
                    :max="dataVencimento"
                    required
                    @change="validaData"
                    oninvalid="Informe a data de expedição do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                  <input
                    type="date"
                    v-model="dataVencimento"
                    class="form-control"
                    id="numero-data-vencimento-sivis"
                    max="9999-12-31"
                    :min="dataExpedicao"
                    required
                    @change="validaData"
                    oninvalid="Informe a data de vencimento do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>
            </template>

             <template v-else-if="tipoDocumentoSelecionado === 'CRNM'">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-passaporte-sivis">Identificação</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-crnm"
                    required
                    oninvalid="Informe a Identificação do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                  <input
                    type="date"
                    v-model="dataExpedicao"
                    class="form-control"
                    id="numero-data-expedicao-sivis"
                    :max="dataVencimento"
                    required
                    @change="validaData"
                    oninvalid="Informe a data de expedição do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                  <input
                    type="date"
                    v-model="dataVencimento"
                    class="form-control"
                    id="numero-data-vencimento-sivis"
                    max="9999-12-31"
                    :min="dataExpedicao"
                    required
                    @change="validaData"
                    oninvalid="Informe a data de vencimento do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>
            </template>

            <template v-else-if="tipoDocumentoSelecionado === 'OAB'">
              
            </template>
            <template v-else-if="tipoDocumentoSelecionado === 'TITULO DE ELEITOR'">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-inscricao-sivis">Identificação</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-inscricao-sivis"
                    required
                    oninvalid="Informe a Identificação do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>
            </template>


            <template v-else-if="tipoDocumentoSelecionado === 'DNI'">
              
            </template>

            <template v-else-if="tipoDocumentoSelecionado === 'CONSELHO DE CLASSE'">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-conselho-de-classe-sivis">Identificação</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-conselho-de-classe-sivis"
                    required
                    oninvalid="Informe a Identificação do documento."
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="estado-conselho-responsavel-sivis">Conselho Responsável</label>
                  <select
                    class="form-control"
                    v-model="selectedConselho"
                    id="estado-conselho-responsavel-sivis"
                    required
                    oninvalid="Informe um conselho responsável."
                    v-if="isIniciarCadastro"
                  >
                    <option value="conselho1">Conselho 1</option>
                  </select>
                </div>
              </div>

              <div class="col-md-2">
                <div class="form-group">
                  <label for="estado-conselh0-sivis">Estado</label>
                  <select v-model="selectedEstado" class="form-control" id="estado-conselho-sivis"
                  required
                  oninvalid="Informe a UF do documento."
                    v-if="isIniciarCadastro"
                  >
                    <option
                      v-for="(e, key) in listaEstados"
                      :value="e"
                      :key="key"
                    >{{ e.uf.toUpperCase() }}</option>
                  </select>
                </div>
              </div>
            </template>

            <template v-else-if="tipoDocumentoSelecionado === 'OUTROS'">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="numero-identificador-sivis">Identificador</label>
                  <input
                    type="text"
                    v-mask="'#################################'"
                    v-model="numero"
                    class="form-control"
                    id="numero-identificador-sivis"
                    required
                    oninvalid="Informe a Identificação do documento." 
                    v-if="isIniciarCadastro"
                  />
                </div>
              </div>
            </template>

                </div>
              </div>
           </div>
           
         </div>
       </div>
      

<!-- MODAIS -->

    <div data-pic-modal='{"title": "Exclusão", "dialog": "default"}' id="modalExcluirConvidadoAgendamento">                
        <form>
            <div class="col-md-12 text-center texto">

               <i class="fa fa-exclamation-circle" style="font-size:48px;color:red"></i>
               Este convidado será excluído do agendamento.<br />
                Deseja realmente excluí-lo?
            </div>
            <div class="buttons"> 
                <button type="button" @click="fecharModal()" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
                 Não
                </button>
                <button type="button" @click="excluirConvidadoAgendado()" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
                 Sim
                </button>
                
            </div>
        </form>
    </div>



      <div class="row">
      <div class="col-md-12" v-if="!isDetalhar">
                <template v-if="!isAlteracao">
                   <input id="btnAdicionar" type="button" @click="validarFormulario($event)" value="Adicionar Convidado" class="btn btn-primary btnCreateMarginTop pull-right">

                </template>
                <template v-if="isAlteracao">
                    <input id="btnAlterar" type="button" @click="validarFormulario($event)" value="Alterar Convidado" class="btn btn-primary btnCreateMarginTop pull-right">
                </template>
            </div>
      </div>

<template v-if="this.isDetalhar">
  
    <div class="panel panel-default">
        <div class="panel-heading">
          <h2>Mensagens encaminhadas</h2>
        </div>
      <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
        <thead>
          <tr>
            <th align="center">data de envio</th>
            <th align="center">email do destinatário</th>
            <th align="center">assunto</th>
            <th align="center">conteúdo da mensagem</th>
          </tr>
        </thead>
        <tbody>
            <tr>
            <td width="10%" class="text-center"> data de envio</td>
            <td width="20%">email do destinatário</td>
            <td width="30%">assunto</td>
            <td width="40%">conteúdo da mensagem</td>
          </tr>
        </tbody>
      </table>
    </div>
 <div>
 </div> 

<div class="panel panel-default">
        <div class="panel-heading">
          <h2>Entradas registradas para o convidado </h2>
        </div>
        <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
        <thead>
          <tr>
            <th align="center">data /hora de entrada</th>
            <th align="center">Local</th>
            <th align="center">Portaria</th>
          </tr>
        </thead>
        <tbody>
         
            <tr>
            <td width="10%" class="text-center"> data de envio</td>
            <td width="20%">email do destinatário</td>
            <td width="30%">assunto</td>
          </tr>
        </tbody>
      </table>
</div> 

<div class="row">
  <div class="col-md-12">
    <div v-if="!isEntrouAgendamento" class="buttons">
      <button id="btnExcluir" type="button" @click="chamarModalexcluirConvidadoAgendado(idConvidado)" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
        Excluir Convidado
      </button>

      <button id="btnAlterar" type="button" @click="alterarConvidadoAgendado()" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
        Alterar Convidado
      </button>
    </div>
  </div>
</div>
  </template>


    </form>

  </div>

  
</template>

<script>
import { mask } from "vue-the-mask";
import moment from 'moment'
export default {
  name: "AdicionarConvidado",
  directives: { mask },
  props: {
    idAgendamento: Number,
    tipo: String,
    convidadoID: Number,
    isAlteracao :Boolean,
    isDetalhar : Boolean

  },
  data() {
    return {
      avatar: "",
      descricaoAgendamento: "",
      local: "",
      patrocinador: "",
      dataAgendamento: "",
      periodo: "",
      numeroCPF: "",
      nome: "",
      telefone: "",
      email: "",
      isValid: Boolean,
      descricao: "",
      origem: "",
      tipoDocumento: "",
      numero: "",
      pais: "",
      idParlamentar: "",
      isEmailValido: false,
      isAlert: false,
      msg: "",
      isNoImagem: false,
      isNoImagemFrente: false,
      isNoImagemVerso: false,
      listaOrigem: "",
      listaPaises: "",
      tipoDocumentoSelecionado: "",
      listaTipoDocumento: "",
      listaEstados: "",
      listaDocumentos: new Array(),
      dataDocumentoFrente: "",
      dataDocumentoVerso: "",
      documentosConvidado: [],
      agenda: [],
      
      isVisitante: false,
      isConvidadoVisitante: false,
      isConvidado: false,
      isIniciarCadastro: false,
      isErrosValidacao: false,
      errosValidados: [],
      imagemFoto: "",

      fotoID:"",
      fotoDocumentoID: "",
      documentoID:"",
      idVisitante: null,
      dataCadastro: "",
      isTelefoneInvalido: false,
      isEntrouAgendamento: false,
      listaMensagem: [],
      listaEntradas: []

    };
  },
  created: function() {
    this.$http
      .get("/agendamento/buscaPorId", {
        params: { idAgendamento: this.idAgendamento }
      })
      .then(
        function(response) {
          if (response.status === 200) {
            var data = response.data;
            this.agenda = response.data;
            this.dataCadastro = response.dataCadastro;
            this.id = data.id;
            this.descricao = data.descricaoAgendamento;
            this.local = data.local;
            this.patrocinador = data.nomePatrocinador;
            this.dataAgendamento = this.formatarData(data.dataAgendamento);
            this.periodo = this.prepararPeriodo(data.periodo);
            this.situacao = this.prepararSituacao(data.situacao);
            //this.isAlteracao = true;
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


      if(this.isAlteracao || this.isDetalhar ){
        this.$http
            .get("/convidado/alterarConvidadoAgendado", {
              params: { idAgendamento: this.idAgendamento,convidadoID: this.convidadoID, parlamentarID : this.$idParlamentar}
            })
            .then(
              function(response) {
                if (response.status === 200) {
                  var data = response.data;
                  this.prepararConvidadoDTO(data);
                  
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
      }
  },
  methods: {
    verificarTelefone(){
        this.isRegistraEntrada = true;
        let numeroFone = this.telefone.replace(/[^0-9]+/g,'');;
        if(numeroFone.length > 0 && numeroFone.length < 10){
            this.isTelefoneInvalido = true;
            this.isRegistraEntrada = false;
            
        }else{
            this.isTelefoneInvalido = false;
        }
    },
    converterDate(date) {
      if (date) {
        var dt = date.split("/");
        var data = new Date(dt[2], dt[1] - 1, dt[0]);
      }
      return data;
    
    },
    alterarConvidadoAgendado(){
      this.isAlteracao = true;
      this.isDetalhar =false;
      this.habilitarElementos();
    },
    formatarData(dataSemFormato) {
      return moment(dataSemFormato).format('DD/MM/YYYY');
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
    fecharModal(){
      pic:hide;
    },
    chamarModalexcluirConvidadoAgendado(id){
      this.convidadoSelecionado = id ? id : this.convidadoID;
      PIC.activateWidget('Modal', '#modalExcluirConvidadoAgendamento');
      $('#modalExcluirConvidadoAgendamento').picModal().show();

    },
    excluirConvidadoAgendado(){
      this.$http
            .get("/convidado/excluirConvidadoAgendamento", {
            params: { convidadoID: this.convidadoSelecionado, agendaID: this.agenda.id }
            })
            .then(
                function(response) {
                  if(response.status === 200){
                    this.$router.push({
                       name: 'detalharAgendamento', 
                       params: { msg: "Convidado " +response.data+" excluído com sucesso", agenda: this.agenda,
                       isAlertSucess: true 
                       }});
                  }else{
                      his.$router.push({
                       name: 'detalharAgendamento', 
                       params: { msg: `Impossível excluir o convidado, pois o mesmo já possui registro de entrada vinculado a este Agendamento`, agenda: this.agenda,
                       isAlertError: true
                      }});
                  }
                    
                    
            }.bind(this)
            )   
            .catch(function(error) {
            console.log(error);
            })
            .then(function() {
            // always executed
            });

    },
    desabilitarElementos(){
      var e = this.$event;

      var elementsInput= document.getElementsByTagName("INPUT");
      var elementsSelect = document.getElementsByTagName("SELECT"); 
      var elementsImg = document.getElementsByTagName("IMG")
      var elements = []
                        .concat(Array.from(elementsInput))
                        .concat(Array.from(elementsSelect))
                        .concat(Array.from(elementsImg));

      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = true;

        
      }

    },
    habilitarElementos(){
      if(!this.isVisitante){
        var e = this.$event;

        var elementsInput= document.getElementsByTagName("INPUT");
        var elementsSelect = document.getElementsByTagName("SELECT"); 
        var elementsImg = document.getElementsByTagName("IMG")

        var elements = [].concat(Array.from(elementsInput)).concat(Array.from(elementsSelect)).concat(Array.from(elementsImg));

        let removerAtributosAgendamento = [0,1,2,3,4]

        elements = elements.splice(5);

        for (var i = 0; i < elements.length; i++) {
          elements[i].disabled = false;
        }

      }else{
        document.getElementById('email').disabled = false;
      }
    },
    validarFormulario: function (e) {
      e.preventDefault();
      this.errosValidados = [];
    
      var elementsInput= document.getElementsByTagName("INPUT");
      var elementsSelect = document.getElementsByTagName("SELECT"); 
      var elementsImg = document.getElementsByTagName("IMG")
      var elements = []
                        .concat(Array.from(elementsInput))
                        .concat(Array.from(elementsSelect))
                        .concat(Array.from(elementsImg));

      for (var i = 0; i < elements.length; i++) {
        let campoAValidar = elements[i];
        if(campoAValidar.required){
          if(campoAValidar.value == ""){
            var attrs = campoAValidar.attributes;
            for(var j = attrs.length - 1; j >= 0; j--){
              if(attrs[j].name == 'oninvalid'){
                this.errosValidados.push(attrs[j].value)
              }
            }
          }
        }
      }
      if(moment(this.dataExpedicao).isAfter(this.dataVencimento)){
        this.errosValidados.push('Data de Expedição maior que data de Vencimento')
        }
      if(moment(this.dataVencimento).isBefore(this.dataExpedicao)){
        this.errosValidados.push('Data de Vencimento menor que data de Expedição')
      
      }
      if(!this.errosValidados.length){
          this.SalvarConvidado();
          this.isErrosValidacao = false;
      }else{
          this.isErrosValidacao = true;
      }
    },
    SalvarConvidado(){

      let fotoConvidado = null;
      if(!this.isVisitante){
        fotoConvidado ={
          imagemFoto: this.avatar ? this.avatar : null,
          id : this.fotoID ? this.fotoID :null
        }
      }

      let fotoDocumentoConvidado = null;
      if(!this.isVisitante){
        fotoDocumentoConvidado = {
          fotoDocumentoFrente: this.dataDocumentoFrente ? this.dataDocumentoFrente : null,
          id: this.fotoDocumentoID ? this.fotoDocumentoID : null,
          fotoDocumentoVerso: this.dataDocumentoVerso ? this.dataDocumentoVerso : null,
        }
      }

      let documentoDTO = null;
      if(!this.isVisitante){
        documentoDTO = {
          id: this.documentoID ? this.documentoID : null,
          origemDocumento: this.selectedOrigem ? this.selectedOrigem : null,
          nomePais: this.selectedPais ? this.selectedPais : null,
          orgaoExpeditor: this.orgaoExpeditor ? this.orgaoExpeditor : null,
          tipoDocumento: this.selectedTipoDocumento ? this.selectedTipoDocumento : null,
          fotoDocumentoConvidadoDTO :  fotoDocumentoConvidado ? fotoDocumentoConvidado : null,
          numeroDocumento: this.numero ? this.numero : null,
          cpf: this.numeroCPF ? this.numeroCPF.replace(/[^\d]+/g, "") : null,
          dataVencimento: this.dataVencimento ? this.dataVencimento : null,
          dataExpedicao: this.dataExpedicao ? this.dataExpedicao : null,
          isPrincipal: this.isPrincipal ? this.isPrincipal : false,
          estadoEmissao: this.selectedEstado ? this.selectedEstado : null,
          conselho: this.selectedConselho ? this.selectedConselho : null,
          pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador: null
        };        
      }      
        
      let convidadoDTO = {
        id: this.convidadoID ? this.convidadoID : null,
        dataCadastro: this.dataCadastro ? this.dataCadastro : null,
        fotoConvidadoDTO: fotoConvidado ? fotoConvidado : null,
        nomeConvidado: this.nome ? this.nome : null,
        cpf:this.numeroCPF ? this.numeroCPF.replace(/[^\d]+/g, "") : null,
        telefone:this.telefone ? this.telefone.replace(/\D+/g, '') : null,
        email:this.email ? this.email : null,
        idParlamentar:this.$idParlamentar ? this.$idParlamentar: null,
        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador: null,
        documentosConvidadoDTO: documentoDTO ? documentoDTO : null,
        agendamentoDTO: this.agenda ? this.agenda : null,
        idVisitante: this.idVisitante ? this.idVisitante : null,
        isAlteracao: this.isAlteracao ? this.isAlteracao : false
      }

      this.$http.post(`/convidado`, convidadoDTO).then(
        function(response) {
          if(response.status === 201){
              this.$router.push({ name: 'detalharAgendamento', 
                params: { 
                  msg: `Convidado, ${this.nome} adicionado com sucesso.`, 
                  isAlertSucess: true, 
                  agenda: response.data 
                }
              });
          }else if(response.status === 200) {
              if(this.isAlteracao){
                this.$router.push({ name: 'detalharAgendamento', 
                  params: { 
                    msg: `Convidado, ${this.nome} alterado com sucesso.`,
                    isAlertSucessUPConvidado: true,
                    agenda: response.data 
                  }
                });
              }else{
                this.$router.push({ name: 'detalharAgendamento', 
                  params: {
                    msg: `Convidado, ${this.nome} adicionado com sucesso.`, 
                    isAlertSucess: true, 
                    agenda: response.data 
                  }
                });
              }
          }
        }.bind(this)

      ).catch(function(error) {
        // handle error
        console.log(error);

      }).then(function() {
        // always executed
      });

    },
    verificarConvidado() {
      this.isValid = true;
      let cpf = this.numeroCPF;
      this.isAlert = false;

      if (cpf != null) {
        cpf = cpf.replace(/[^\d]+/g, "");
      }

      if (this.verificarCPF(cpf)) {
        this.$http
          .get("/convidado/verificarConvidadoPorCPF", {
            params: { numeroCPF: cpf, idAgendamento: this.idAgendamento , parlamentarID: this.$idParlamentar}
          })
          .then(
            function(response) {
              if (response.status === 200) {
                  this.prepararConvidadoDTO(response.data);
              }else if(response.status === 204){
                this.msg = "Convidado já cadastrado neste agendamento com esse número de cpf!";
                this.isAlert = true;
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
      } else {
        this.isValid = false;
      }
    },
    prepararConvidadoDTO(data){
      
      this.convidadoID = data.id ? data.id : null;
      this.avatar = data.fotoConvidadoDTO ? data.fotoConvidadoDTO.imagemFoto :null;
      this.fileInputAvatar = data.fotoConvidadoDTO ? data.fotoConvidadoDTO.imagemFoto : null;
      this.fotoID = data.fotoConvidadoDTO ? data.fotoConvidadoDTO.id : null;
      this.dataCadastro = data.dataCadastro ? data.dataCadastro : null;
      
      //dados convidados
      this.numeroCPF = data.cpf ?data.cpf : null;
      this.nome = data.nomeConvidado? data.nomeConvidado:null;
      this.telefone = data.telefone ? data.telefone : null;      
      this.email = data.email ? data.email : null;
      this.isEntrouAgendamento = data.isEntrouAgendamento;

      //Documentos    
      this.documentoID = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.id : null;
     
      //dados visitante
      if(data.isVisitante){
        this.idVisitante = data.idVisitante;
      }
     
      this.selectedOrigem = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.origemDocumento : null;
      this.selectedPais = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.nomePais : null;

      //this.pais = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.nomePais.namePais : null;
      this.orgaoExpeditor = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.orgaoExpeditor : null;
      this.selectedTipoDocumento = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.tipoDocumento : null;
      this.tipoDocumentoSelecionado = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.tipoDocumento.descTipoDocumento.toUpperCase() : "RG";
      this.tipoOrigemSelecionado = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.origemDocumento.descOrigem.toUpperCase() : "BRASILEIRO";
      this.numero = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.numeroDocumento : null;
      this.dataVencimento = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.dataVencimento : null;
      this.dataExpedicao = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.dataExpedicao : null;
      this.isPrincipal = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.isPrincipal : null;
      this.selectedEstado = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.estadoEmissao : null;
      this.selectedConselho =data.documentosConvidadoDTO ? data.documentosConvidadoDTO.conselho : null;

      this.dataDocumentoFrente =data.documentosConvidadoDTO ? data.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoFrente : null;
      this.dataDocumentoVerso =data.documentosConvidadoDTO ? data.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoVerso : null;
      this.fotoDocumentoID = data.documentosConvidadoDTO ? data.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.id : this.dataDocumentoVerso;

      this.isIniciarCadastro = data.isIniciarCadastro;
      this.isConvidado = data.isConvidado;
      this.isConvidadoVisitante = data.isConvidadoVisitante;
      this.isVisitante = data.isVisitante;
      

      this.montaComboOrigem();
      this.popularEstados();
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
    validarEmailDigitado() {
      let email = this.email;
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email)) {
        document.getElementById("btnAlterar").disabled = false;
        this.isEmailValido = false;
      } else {
        document.getElementById("btnAlterar").disabled = true;
        this.isEmailValido = true;
      }
    },
    onFileChange(e) {

      var fileInputId = e.target.id;
      var file = '';
      switch (fileInputId){

        case 'fileInputAvatar':
              file = e.target.files[0];
              //this.avatar = null;
              if (!file.type.includes("image/")) {
                this.isNoImagem = true;
              }else {
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
        case 'dataDocumentoFrente' :

              file = e.target.files[0];
              this.fotoDocumentoFrente = null;
              if (!file.type.includes("image/")) {
                this.isNoImagemFrente = true;
              }else {
                let reader = new FileReader();
                let vm = this;
                reader.onload = (e) => {
                 vm.dataDocumentoFrente = e.target.result
                }
                reader.readAsDataURL(file)
                this.isNoImagemFrente = false;
               //this.dataDocumentoFrente = reader.result;
              }
            break;
        case 'dataDocumentoVerso' :
              file =  e.target.files[0];
              this.fotoDocumentoVerso = null;
              if (!file.type.includes("image/")) {
                this.isNoImagemVerso = true;
              }else {
                let reader = new FileReader();
                let vm = this;
                reader.onload = (e) => {
                 vm.dataDocumentoVerso = e.target.result
                }
                reader.readAsDataURL(file)
                this.isNoImagemVerso = false; 
               
       
                
                
          }
            break;

            
      }//fim case
    },
    montaComboOrigem() {      
      this.$http.get(`/origem`).then(
          function(response) {
            this.listaOrigem = response.data;
            this.selectedOrigem = this.selectedOrigem? this.selectedOrigem :this.listaOrigem[0];
            this.onChangePaises();
          }.bind(this)

      ).catch(function(error) {
          // handle error
          console.log(error);
      }).then(function() {
          // always executed
      });
      // //(this.numeroCPF = null),         
    },
    limparCamposAoMudarOrigem(){
         (this.numero = null),
         (this.dataVencimento = null),
         (this.dataExpedicao = null),
         (this.selectedEstado = null),
         (this.selectedConselho = ""),
         (this.selectedDestino = null),
         (this.selectedOrigem = ""),
         (this.selectedPais = ""),
         (this.selectedEstado = ""),
         (this.selectedTipoDocumento = "");

    },
    onChangePaises() {
      this.onChangeTipoDocumento(this.selectedOrigem.descOrigem);

      this.$http
        .get(`/paises/` + this.selectedOrigem.descOrigem.toLowerCase())
        .then(
          function(response) {
            this.listaPaises = response.data;
            this.selectedPais = this.listaPaises[0];
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
    onChangeTipoDocumento(origem) {
      this.$http
        .get(`/tipoDocumento?parametros=${origem}`)
        .then(
          function(response) {
            this.listaTipoDocumento = response.data;
            this.selectedTipoDocumento = this.selectedTipoDocumento ? this.selectedTipoDocumento :this.listaTipoDocumento[0];
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
    popularEstados() {
      this.$http
        .get("/estado/")
        .then(
          function(response) {
            this.listaEstados = response.data;
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
    validaData(event){
      event.preventDefault();
      var dtExped = document.getElementById('numero-data-expedicao-sivis');
      var dtVenc = document.getElementById('numero-data-vencimento-sivis');
      if(this.dataVencimento){
        dtExped.max = this.dataVencimento;
      }
      if(this.dataExpedicao){
        dtVenc.min = this.dataExpedicao;
      }
    },
    catchEvent(event) {
      this.tipoDocumentoSelecionado = event.target.options[event.target.options.selectedIndex].text;
      this.tipoOrigemSelecionado = event.target.options[event.target.options.selectedIndex].text;

      if (this.tipoOrigemSelecionado === "BRASILEIRO") {
        this.tipoDocumentoSelecionado = "RG";
      }

      this.numero = "";
      this.selectedEstado = "";
      
    },
    catchEventCountry(event) {
      this.tipoPaisSelecionado =
        event.target.options[event.target.options.selectedIndex].text;
      let outros = {
        id: 11,
        descTipoDocumento: "outros",
        origem: {
          id: 2,
          descOrigem: "Estrangeiro"
        }
      };
      if (
        this.tipoPaisSelecionado === "ARGENTINA" ||
        this.tipoPaisSelecionado === "PARAGUAI" ||
        this.tipoPaisSelecionado === "URUGUAI" ||
        this.tipoPaisSelecionado === "VENEZUELA"
      ) {
        this.listaTipoDocumento.push(outros);
      } else {
        this.onChangeTipoDocumento("Estrangeiro");
      }
    }
  },
  updated(){
    if(this.isDetalhar){
       this.desabilitarElementos();
    }
  }
};
</script>

<style scoped>
.panel {
  margin-top: 3rem;
}

h2 {
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

.main-info-container {
  background-color: rgb(240, 240, 240);
  padding: 1rem 0 1rem 0;
  margin-left: 0rem;
  margin-right: 0rem;
}
.input-large {
  height: 5rem;
  font-size: 2.5rem;
  font-weight: bold;
}

.textButton {
  margin-left: 1rem;
  font-weight: bold;
}

.marginContainerBottom {
  margin-bottom: 8rem;
}

.fa-close{
  margin-right: 0.5rem;
}

.fa-trash{
  margin-right: 0.5rem;
}

.fa-exclamation-circle{
  margin-right: 0.5rem;
}

.texto{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>