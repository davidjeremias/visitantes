<template>
  <span>
    <!-- TITULO PAGINAS-->
    <div class="page-header">
      <template v-if="isIncluir">
        <h1>Novo Visitante</h1>
      </template>
      <template v-if="isDetalhar">
        <h1>Detalhar Visitante</h1>
      </template>
      <template v-if="isAlterar">
        <h1>Alterar Visitante</h1>
      </template>
    </div>

    <form>
      <!-- ALERTAS DE VALIDAÇÃO -->
      <div v-show="isAlert" data-pic-alert='{"type": "error"}'>
        Todos os campos, <b v-if="nomeVisitante.length <= 0">NOME, </b> <b v-if="avatar != null"> FOTO</b> do visitante,
        <b>DOCUMENTO</b>, <span v-if="selectedDestino.id == null"><b>PORTARIA</b> e o <b>LOCAL</b></span> devem
        estar preenchidos.
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="row main-info-container">
            <!-- FOTO NOVO VISITANTE-->
            <template v-if="!isDetalhar">
              <div class="col-md-2 text-center photo-avatar-container" data-toggle="modal" data-target="#photoWebcam">
                <div class="photo-avatar" id="photo-avatar" v-on:click="startup()">
                  <img v-bind:src="this.avatar" class="photo-webcam" alt="Perfil" />
                </div>
              </div>
            </template>
              <!-- FOTO VISITANTE-->
            <template v-if="isDetalhar">
              <div class="col-md-2 text-center photo-avatar-container">
                <div class="photo-avatar" id="photo-avatar">
                  <img v-bind:src="this.avatar" class="photo-webcam" alt="Perfil" />
                </div>
              </div>
            </template>

            <div class="col-md-6">
              <div class="row">

                <div class="col-md-4">
                  <div class="form-group">
                      <label for="numeroCPF">CPF</label>
                      <input type="text" v-model="numeroCPF" @change="validaCPF(); validaRegistraEntradaButton();" v-mask="'###.###.###-##'" masked="false" class="form-control" id="numeroCPF" :disabled=isDetalhar>
                      <span class="validacao" v-show="isCpf">CPF Obrigatório para esse tipo de Documento</span>
                      <span class="validacao" v-show="!isValid && (numeroCPF != null && numeroCPF != '') ">CPF Inválido</span>
                      <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                  </div>
                </div>

                <div class="col-md-8">
                  <div class="form-group">
                      <label for="sivis-nome">Nome<span class="requiredLabel">*</span></label>
                      <input type="text" @blur="buscarVisitantes(); validaRegistraEntradaButton();" v-model="nomeVisitante" class="form-control" id="sivis-nome" :disabled=isDetalhar>
                      <button type="button" v-if="isMsgHomonimo" class="btn btn-secondary pull-right" data-toggle="modal" data-target="#modalListaHomonimos" v-on:click="chamarModalListaHomonimos();">Apresentar</button>
                      <template v-if="isMsgHomonimo">
                       <div  id="visitanteHomonimo">
                         <i class="fas fa-exclamation-circle"></i> Existe(m) {{qtdReg}} visitante(s) cadastrado(s) com o nome "{{this.nomeVisitante}}"
                      
                      
                          
                      </div>
                    </template>
                  </div>
                </div>

              </div>

              <div class="row">

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="sivis-telefone">Telefone</label>
                    <input type="text" v-model="numeroTel" v-on:keyup="verificarTelefone();" @blur="validaRegistraEntradaButton();" v-mask="['(##) ####-####', '(##) #####-####']" masked="false" class="form-control" id="sivis-telefone" :disabled=isDetalhar>
                    <span class="validacao" v-show="isTelefoneInvalido">Telefone inválido</span>
                  </div>
                </div>
               </div> 
                    <div class="col-md-12" id="visitanteRestricao" v-if="isRestricaoEntrada">
                    <i class="fas fa-exclamation-circle"></i> Visitante com restrição.
                    </div>

                    <div class="col-md-12" id="agent-message">
                    <i class="fas fa-exclamation-circle"></i> Necessita autorização de entrada pelo agente.
                    </div>
                

                
              </div>

              

            
          </div>
        </div>
      </div>

      <template v-if="isDetalhar ">
        <div class="row margin-top-row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h2>Documentos</h2>
              </div>
              <div class="panel-body">
                <div class="row">

                  <div class="col-md-12" id="container-documento-detalhar">
                    <div v-if="this.listaDocumentos.length >= 1" data-pic-carousel>
                      <div v-for="(e) in this.listaDocumentos" :key="e.id" class="borderRadiusCarousel">
                        <div class="row tipoDocumentoCarouselContainer">
                          <div class="col-md-12">
                            <span class="tipoDocumentoCarousel">{{ e.tipoDocumento.descTipoDocumento }}</span>
                            <span v-show="e.isPrincipal">
                              <span class="subtitle-principal"> (Principal)</span>
                            </span>
                          </div>
                        </div>

                        <div id="rowDocumento" class="row" style="cursor: pointer">
                          <div class="col-md-12">
                            <div class="row">
                              <div class="col-md-3">
                                <img v-bind:src="e.fotoDocumentoFrente" class="document-img"
                                     alt="Imagem da frente do documento" />
                              </div>

                              <div class="col-md-3 " v-if="e.fotoDocumentoVerso">
                                <template v-if="e.fotoDocumentoVerso">
                                  <img v-bind:src="e.fotoDocumentoVerso" class="document-img"
                                       alt="Imagem do verso do documento" />
                                </template>
                              </div>
                              <div class="col-md-6">
                                <div class="col-md-6 teste" v-if="e.origemDocumento != null">
                                  <label>Origem</label>
                                  <input disabled v-model="e.origemDocumento.descOrigem">
                                </div>
                                <div class="col-md-6 teste"  v-if="e.pais != null">
                                  <label>País</label>
                                  <input disabled v-model="e.pais.namePais">
                                </div>
                                <div class="col-md-6 teste" v-if="e.tipoDocumento != null">
                                  <!-- vemprak-->
                                  <label>Tipo do Documento</label>
                                  <input disabled v-model="e.tipoDocumento.descTipoDocumento">
                                </div>
                                <div class="col-md-6 teste" v-if="e.origemDocumento != null">
                                  <label>N. Documento</label>
                                  <input disabled v-model="e.origemDocumento.descOrigem">
                                </div>
                                <div class="col-md-4 teste"  v-if="e.estadoEmissao">
                                  <label>UF</label>
                                  <input disabled  v-model="e.estadoEmissao.uf">
                                </div>
                                <div class="col-md-4 teste" v-if="e.dataExpedicao != null">
                                  <label>Data de expedição</label>
                                  <input disabled v-model="e.dataExpedicao">
                                </div>
                                <div class="col-md-4 teste" v-if="e.dataExpedicao != null">
                                  <label>Data de vencimento</label>
                                  <input disabled v-model="e.dataExpedicao">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </template>

    <template v-if="this.isIncluir || this.isAlterar">
        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2>Documentos</h2>
                </div>

                <!-- BLOCO DOCUMENTOS ADIÇÃO -->
                <div class="row">
                    <div v-show="!controleCarousel" class="panel-body">
                        <div class="col-md-12" id="doc-carrossel-adicao">
                            <div v-if="this.listaDocumentos.length >= 1" data-pic-carousel>
                                <div v-for="(e, index) in this.listaDocumentos" :key="e.id" class="borderRadiusCarousel">
                                    <div class="row tipoDocumentoCarouselContainer">
                                        <div class="col-md-12">
                                            <span class="tipoDocumentoCarousel">{{ e.tipoDocumento.descTipoDocumento }}</span>
                                            <span v-show="e.isPrincipal">
                                                <span class="subtitle-principal"> (Principal)</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div id="rowDocumento" class="row" style="cursor: pointer" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('editar', e, index); startupDocumentoVerso(); montaComboOrigem('editar');">
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento" />
                                                </div>

                                                <div class="col-md-3">
                                                    <template v-if="e.fotoDocumentoVerso">
                                                        <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento" />
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BLOCO DOCUMENTOS EDIÇÃO -->
                    <div v-show="controleCarousel" class="panel-body">
                        <div class="col-md-12" id="doc-carrossel-edicao">
                            <div v-if="this.listaDocumentosTemp.length >= 1" data-pic-carousel>
                                <div v-for="(e, index) in this.listaDocumentosTemp" :key="e.id" class="borderRadiusCarousel">
                                    <div class="row tipoDocumentoCarouselContainer">
                                        <div class="col-md-12">
                                            <span class="tipoDocumentoCarousel">{{ e.tipoDocumento.descTipoDocumento }}</span>
                                            <span v-show="e.isPrincipal">
                                                <span class="subtitle-principal"> (Principal)</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div id="rowDocumento" class="row" style="cursor: pointer" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('editar', e, index); startupDocumentoVerso(); montaComboOrigem('editar');">
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento" />
                                                </div>

                                                <div class="col-md-3">
                                                    <template v-if="e.fotoDocumentoVerso">
                                                        <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento" />
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="checkbox">
                            <label style="margin-left: 3%;"> 
                                <input type="checkbox" id="sem-doc" v-on:click="showDocument();"/> Sem documento de identificação 
                            </label>
                        </div>
                    </div>

                    <div class="col-md-6" id="document-button-container">
                        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('novo', null, null);montaComboOrigem('novo');" style="margin-left: 62%;">
                            Novo documento
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6" v-if="!isAlterar">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2>Destino</h2>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="portaria">Portaria<span class="requiredLabel">*</span></label>
                                <select v-model="selectedPortaria" @change="onChangeLocal(); selecionarPortariaDestino();" class="form-control" id="portaria">
                                    <option v-for="e in this.listaPortaria" :key="e.id" :value="e">{{e.descricaoPortaria}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="local">Destino<span class="requiredLabel"></span></label>
                                <select v-model="selectedDestino" @change="validaRegistraEntradaButton(); selecionarLocalDestino();" class="form-control" id="local">
                                <option v-for="e in this.listaDestino" :key="e.id" :value="e">{{e.nomeDestino}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="Gabinete">Gabinete</label>
                                <input type="text" id="gabinete-destino" v-model="descGabineteSelecionado" @blur="selecionarGabineteDestino(); validaRegistraEntradaButton();" class="form-control" data-pic-autocomplete='{"source":"#listaGabiente", "sourceType":"hidden", "type":"suggestion"}'>
                                <input type="hidden" id="listaGabiente" :value="listaGabinetes">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <h2></h2>
            </div>
        </div>
    </template>

      <div class="row margin-top-row margin-bottom-row">
        <template v-if=" !isDetalhar || isIncluir">
          <div class="col-md-12">
            <button type="button" :disabled="!isRegistraEntrada || !validaDocumentoPrincipal()" @click="confirmaSalvar()" class="btn btn-primary button-busca-margin pull-right" v-if="!isAlterar && $auth('REGISTRAR_ENTRADA_DE_VISITANTE')">Registrar Entrada</button>
            <button type="button" @click="validaAutorizarSalvar()" class="btn btn-secondary pull-right button-busca-margin" id="authorize-entry" >Autorizar entrada </button>
            <button type="submit" v-if="$auth('REGISTRAR_DECISAO_DE_ENTRADA_PARA_CPF_COM_RESTRICAO_DE_ENTRADA_IDENTIFICADO')" @click="administradorRejeitarBTN()" class="btn btn-secondary pull-right button-busca-margin">Rejeitar entrada</button>
            <button type="button" @click="confirmaSalvar()" class="btn btn-primary button-busca-margin pull-right" v-if="isAlterar">Alterar</button >
          </div>
        </template>

        <template v-if="isDetalhar ">
          <div class="col-md-12">
            <button type="button" @click="voltarPesquisaEntrada()" class="btn btn-primary button-busca-margin pull-right">Voltar</button>
            <button type="button" @click="prepararAlterarVisitante(idVisitante)" class="btn btn-primary button-busca-margin pull-right" v-if="this.$perfilUsuario === 'Administrador'" >Alterar</button>
          </div>
        </template>

      </div>

    </form>

      <!-- MODAIS -->

    <div data-pic-modal='{"title": "Digitalizar Foto", "dialog": "default"}' id="photoWebcam">
      <form>
        <div class="col-md-12 text-center">

          <div class="camera" v-show="isVideo">
            <video id="video">Webcam não está funcionando. Verifique com o suporte.</video>
          </div>

          <div class="camera" v-show="isFoto">
            <canvas id="canvas"></canvas>
            <img id="photo" alt="Foto do Avatar">
          </div>

        </div>

        <div class="col-md-12 text-center">
          <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepicture();"><i class="fas fa-camera"></i></button>
          <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startup()"><i class="fas fa-redo"></i></button>
        </div>

        <div class="buttons">
          <button type="submit" class="btn btn-primary"
                  v-on:click="setAvatar(); validaRegistraEntradaButton()">Confirmar</button>
        </div>
      </form>
    </div>

    <div data-pic-modal='{"title": "Digitalizar Documento", "dialog": "default"}' id="novoDocumento">
      <form>
        <div v-show="isAlertModal" data-pic-alert='{"type": "error"}'>
          Todos os campos, foto do visitante e o documento e o destino devem estar preenchidos.
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-6 document-webcam-container" id="documentoFrenteContainer">
                <div class="row">
                  <div class="col-md-12 document-webcam-title text-center">
                    Frente
                  </div>

                  <div class="col-md-12">
                    <div class="camera text-center" v-show="isVideoDocumentoFrente">
                      <video id="videoDocumentoFrente"></video>
                    </div>

                    <template>
                      <div v-if="!isEdit" class="camera text-center" v-show="isFotoDocumentoFrente">
                        <canvas id="canvasDocumentoFrente"></canvas>
                        <img id="photoDocumentoFrente" alt="Foto do Avatar">
                      </div>
                    </template>

                    <template>
                      <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoFrente">
                        <canvas id="canvasDocumentoFrente"></canvas>
                        <img id="photoDocumentoFrente" v-bind:src="documentoEdicao.fotoDocumentoFrente" width="347rem"
                             height="260.25rem" alt="Foto do Avatar">
                      </div>
                    </template>

                  </div>

                  <template v-if="!isEdit">
                    <div class="col-md-12 text-center">
                      <button type="button" class="btn btn-primary button-margin-top"
                              v-on:click="takepictureDocumentoFrente();startupDocumentoVerso()"><i
                              class="fas fa-camera"></i></button>
                      <button type="button" class="btn btn-secondary button-margin-top button-margin-left"
                              v-on:click="startupDocumentoFrente('novo', null, null)"><i class="fas fa-redo"></i></button>
                    </div>
                  </template>

                  <template v-if="isEdit">
                    <div class="col-md-12 text-center">
                      <button type="button" class="btn btn-primary button-margin-top"
                              v-on:click="takepictureDocumentoFrente();startupDocumentoVersoEditar('frente')"><i
                              class="fas fa-camera"></i></button>
                      <button type="button" class="btn btn-secondary button-margin-top button-margin-left"
                              v-on:click="startupDocumentoFrenteEditar(null, null)"><i class="fas fa-redo"></i></button>
                    </div>
                  </template>

                </div>
              </div>

              <div class="col-md-6 document-webcam-container" id="documentoVersoContainer">
                <div class="row">
                  <div class="col-md-12 document-webcam-title text-center">
                    Verso
                  </div>

                  <div class="col-md-12">
                    <div class="camera text-center" v-show="isVideoDocumentoVerso">
                      <video id="videoDocumentoVerso">Webcam não está funcionando. Verifique com o suporte.</video>
                    </div>

                    <div v-if="!isEdit" class="camera text-center" v-show="isFotoDocumentoVerso">
                      <canvas id="canvasDocumentoVerso"></canvas>
                      <img id="photoDocumentoVerso" alt="Foto do Avatar">
                    </div>

                    <template>
                      <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoVerso">
                        <canvas id="canvasDocumentoVerso"></canvas>
                        <img id="photoDocumentoVerso" v-bind:src="documentoEdicao.fotoDocumentoVerso" width="347rem"
                             height="260.25rem" alt="Foto do Avatar">
                      </div>
                    </template>
                  </div>

                  <template v-if="!isEdit">
                    <div class="col-md-12 text-center">
                      <button type="button" class="btn btn-primary button-margin-top"
                              v-on:click="takepictureDocumentoVerso()"><i class="fas fa-camera"></i></button>
                      <button type="button" class="btn btn-secondary button-margin-top button-margin-left"
                              v-on:click="startupDocumentoVerso()"><i class="fas fa-redo"></i></button>
                    </div>
                  </template>

                  <template v-if="isEdit">
                    <div class="col-md-12 text-center">
                      <button type="button" class="btn btn-primary button-margin-top"
                              v-on:click="takepictureDocumentoVerso()"><i class="fas fa-camera"></i></button>
                      <button type="button" class="btn btn-secondary button-margin-top button-margin-left"
                              v-on:click="startupDocumentoVersoEditar('verso')"><i class="fas fa-redo"></i></button>
                    </div>
                  </template>
                </div>
              </div>

            </div>
          </div>

          <div class="col-md-12">
            <div class="row document-fields-container">
              <div class="col-md-6" v-if="!isEdit">
                <div class="form-group">
                  <label for="origem">Origem</label>
                  <select v-model="selectedOrigem"
                          @change="onChangePaises(); catchEvent($event); changeDocument(); verificaDuplicidadeTipoDocumento()"
                          class="form-control" id="origem" name="origem">
                    <option v-for="(e, key) in listaOrigem" :key="key" :value="e" selected>
                      {{e.descOrigem.toUpperCase()}}</option>
                  </select>
                </div>
              </div>

              <div class="col-md-6" v-if="isEdit">
                <div class="form-group">
                  <label for="origem">Origem</label>
                  <select v-model="documentoEdicao.origemDocumento"
                          @change="onChangePaises(); catchEvent($event); changeDocument()" class="form-control" id="origem"
                          name="origem">
                    <option v-for="(e, key) in listaOrigem" :key="key" :value="e" selected>
                      {{e.descOrigem.toUpperCase()}}</option>
                  </select>
                </div>
              </div>

              <div class="col-md-6" v-if="!isEdit">
                <div class="form-group">
                  <label for="pais">País</label>
                  <select v-model="selectedPais" @change="catchEventCountry($event); validaCrnm(); validaPassaporte()"
                          class="form-control" id="pais" name="pais">
                    <option v-for="(e, key) in listaPaises" :key="key" :value="e" selected>{{e.namePais}}</option>
                  </select>
                  <span class="validacao" v-show="selectedPais.namePais == 'Selecione' || selectedPais == ''">Campo
                    obrigatório</span>
                </div>
              </div>

              <div class="col-md-6" v-if="isEdit">
                <div class="form-group">
                  <label for="pais">País</label>
                  <select v-model="documentoEdicao.pais"
                          @change="catchEventCountry($event); validaCrnm(); validaPassaporte()" class="form-control" id="pais"
                          name="pais">
                    <option v-for="(e, key) in listaPaises" :key="key" :value="e" selected>{{e.namePais}}</option>
                  </select>
                  <span class="validacao"
                        v-show="documentoEdicao.pais.namePais == 'Selecione' || documentoEdicao.pais.namePais == ''">Campo
                    obrigatório</span>
                </div>
              </div>

              <template>
                <div class="col-md-6">
                  <div class="form-group" v-if="!isEdit">
                    <label for="tipo-do-documento">Tipo do Documento</label>
                    <select v-model="selectedTipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event);changeDocument(); verificaDuplicidadeTipoDocumento()">
                      <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key">
                        {{ e.descTipoDocumento.toUpperCase() }}</option>
                    </select>
                  </div>
                  <div class="form-group" v-if="isEdit">
                    <label for="tipo-do-documento">Tipo do Documento</label>
                    <select v-model="documentoEdicao.tipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event);changeDocument()"> <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key">
                        {{ e.descTipoDocumento.toUpperCase() }}</option>
                    </select>
                  </div>
                </div>
              </template>

            <!-- RG -->
            <template v-if="tipoDocumentoSelecionado === this.$rg">
                <div class="col-md-6" v-if="!isEdit">
                    <div class="form-group">
                        <label>UF</label>
                        <select v-model="selectedUF" class="form-control" id="uf-rg-sivis" name="estado" @change="validaRG()">
                            <option v-for="(e, key) in this.estadosBrasileiros" :key="key" :value="e" selected>{{e.uf.toUpperCase()}}</option>
                        </select>
                        <span class="validacao" v-show="isRG && (selectedUF == 'Selecione' || selectedUF == '') && numero">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6" v-if="isEdit">
                    <div class="form-group">
                        <label>UF</label>
                        <select v-model="documentoEdicao.estadoEmissao" class="form-control" id="uf-rg-sivis" name="estado" @change="validaRG()">
                            <option v-for="(e, key) in this.estadosBrasileiros" :key="key" :value="e" selected>{{e.uf.toUpperCase()}}</option>
                        </select>
                        <span class="validacao" v-show="isRG && (selectedUF == 'Selecione' || selectedUF == '') && numero">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-rg-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-on:keyup="validaRG()" v-model="numero" class="form-control" id="numero-rg-sivis">
                        <span class="validacao" v-show="isRG && numero == ''">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-rg-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-on:keyup="validaRG()" v-model="documentoEdicao.numero" class="form-control" id="numero-rg-sivis">
                        <span class="validacao" v-show="isRG && numero == ''">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <!-- CTPS -->
            <template v-else-if="tipoDocumentoSelecionado === this.$carteira_trabalho">
                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-carteira-de-trabalho-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" @keyup="validaCTPS()" v-model="numero" class="form-control" id="numero-carteira-de-trabalho-sivis">
                        <span class="validacao" v-show="isNumeroCTPS">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-carteira-de-trabalho-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" @keyup="validaCTPS()" v-model="documentoEdicao.numero" class="form-control" id="numero-carteira-de-trabalho-sivis">
                        <span class="validacao" v-show="isNumeroCTPS">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="estado-carteira-de-trabalho-sivis">Estado</label>
                        <select class="form-control" v-model="selectedUF" id="estado-carteira-de-trabalho-sivis" @change="validaCTPS()">
                            <option value="">Selecione</option>
                            <option v-for="e in this.estadosBrasileiros" :key="e.id" :value="e">{{e.estado}}</option>
                        </select>
                        <span class="validacao" v-show="isEstado">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="estado-carteira-de-trabalho-sivis">Estado</label>
                        <select class="form-control" v-model="documentoEdicao.estadoEmissao" id="estado-carteira-de-trabalho-sivis" @change="validaCTPS()">
                            <option value="">Selecione</option>
                            <option v-for="e in this.estadosBrasileiros" :key="e.id" :value="e">{{e.estado}}</option>
                        </select>
                        <span class="validacao" v-show="isEstado">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <!-- PASSAPORTE -->
            <template v-else-if="tipoDocumentoSelecionado === this.$passaporte || tipoOrigemSelecionado === 'MERCOSUL' || tipoOrigemSelecionado === 'ESTRANGEIRO'">
                <div class="col-md-6" >
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-passaporte-sivis">Identificação</label>
                        <input :disabled="isDocumentoDuplicidade" type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaPassaporte" class="form-control" id="numero-passaporte-sivis">
                        <span class="validacao" v-show="isNumeroPassaporte && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-passaporte-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.numero" @keyup="validaPassaporte" class="form-control" id="numero-passaporte-sivis">
                        <span class="validacao" v-show="isNumeroPassaporte && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-data-expedicao-sivis">Data de Expedição </label>
                        <input :disabled="isDocumentoDuplicidade" type="date"  v-model="dataExpedicao"  :max="formatDateInput()"  @change="validaPassaporte"  @blur="verificarDataExpedicao" class="form-control" id="numero-data-expedicao-sivis">
                        <span class="validacao" v-show="isDataExpedicao && !isDocumentoDuplicidade">Campo obrigatório</span>
                        <span class="validacao" v-show="isErro">{{msgErro}}</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                        <input type="date" v-model="documentoEdicao.dataExpedicao" :max="documentoEdicao.dataVencimento" @change="validaPassaporte"  class="form-control" id="numero-data-expedicao-sivis">
                        <span class="validacao" v-show="isDataExpedicao && !isDocumentoDuplicidade">Campo obrigatório</span>
                        <span class="validacao" v-show="isErro">{{msgErro}}</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                        <input @blur="verificarDataVencimento"  :disabled="isDocumentoDuplicidade" type="date" v-model="dataVencimento" :min="formatDateInput()" @change="validaPassaporte" class="form-control" id="numero-data-vencimento-sivis">
                        <span class="validacao" v-show="isDataVencimento && !isDocumentoDuplicidade">Campo obrigatório</span>
                        <span class="validacao" v-show="isErroVencimento">{{msgErro}}</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                        <input type="date" v-model="documentoEdicao.dataVencimento" :min="documentoEdicao.dataExpedicao" @change="validaPassaporte" class="form-control" id="numero-data-vencimento-sivis">
                        <span class="validacao" v-show="isDataVencimento && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <!-- CRNM -->
            <template v-else-if="tipoDocumentoSelecionado === this.$crnm">
                <div class="col-md-6" >
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-passaporte-sivis">Identificação</label>
                        <input :disabled="isDocumentoDuplicidade" type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaCrnm" class="form-control" id="numero-crnm">
                        <span class="validacao" v-show="isNumeroCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-passaporte-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.numero" @keyup="validaCrnm" class="form-control" id="numero-crnm">
                        <span class="validacao" v-show="isNumeroCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                        <input :disabled="isDocumentoDuplicidade" type="date" v-model="dataExpedicao" :max="formatDateInput()" @change="validaCrnm" class="form-control" id="numero-data-expedicao-sivis">
                        <span class="validacao" v-show="isDataExpedicaoCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                        <input type="date" v-model="documentoEdicao.dataExpedicao" :max="documentoEdicao.dataVencimento" @change="validaCrnm" class="form-control" id="numero-data-expedicao-sivis">
                        <span class="validacao" v-show="isDataExpedicaoCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                        <input :disabled="isDocumentoDuplicidade" type="date" v-model="dataVencimento" :min="formatDateInput()" @change="validaCrnm" class="form-control" id="numero-data-vencimento-sivis">
                        <span class="validacao" v-show="isDataVencimentoCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                        <input type="date" v-model="documentoEdicao.dataVencimento" :min="documentoEdicao.dataExpedicao" @change="validaCrnm" class="form-control" id="numero-data-vencimento-sivis">
                        <span class="validacao" v-show="isDataVencimentoCrnm && !isDocumentoDuplicidade">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <!-- TITULO ELEITOR -->
            <template v-else-if="tipoDocumentoSelecionado === this.$titulo_eleitor">
                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-inscricao-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaTituloEleitor" class="form-control" id="numero-inscricao-sivis">
                        <span class="validacao" v-show="isNumeroTituloEleitor">Campo obrigatório</span>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="numero-inscricao-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.numero" @keyup="validaTituloEleitor" class="form-control" id="numero-inscricao-sivis">
                        <span class="validacao" v-show="isNumeroTituloEleitor">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <!-- CONSELHO DE CLASSE -->
            <template v-else-if="tipoDocumentoSelecionado === this.$conselho_classe">
                <div class="col-md-6" >
                    <div class="form-group" v-if="!isEdit">
                        <label for="numero-conselho-de-classe-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaConselhoClasse()" class="form-control" id="numero-conselho-de-classe-sivis">
                    </div>

                    <div class="form-group" v-if="isEdit">
                        <label for="numero-conselho-de-classe-sivis">Identificação</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.numero" @keyup="validaConselhoClasse()" class="form-control" id="numero-conselho-de-classe-sivis">
                    </div>

                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="estado-conselho-responsavel-sivis">Conselho Responsável</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="selectedConselho" @keyup="validaConselhoClasse()" class="form-control" id="estado-conselho-responsavel-sivis">
                    </div>

                    <div class="form-group" v-if="isEdit">
                        <label for="estado-conselho-responsavel-sivis">Conselho Responsável</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.conselho" @keyup="validaConselhoClasse()" class="form-control" id="estado-conselho-responsavel-sivis">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group" v-if="!isEdit">
                        <label for="estado-conselho-sivis">Estado</label>
                        <select class="form-control" v-model="selectedUF" id="estado-conselho-sivis" @change="validaConselhoClasse();">
                            <option value="">Selecione</option>
                            <option v-for="e in this.estadosBrasileiros" :key="e.id" :value="e">{{e.estado}}</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="isEdit">
                        <label for="estado-conselho-sivis">Estado</label>
                        <select class="form-control" v-model="documentoEdicao.estadoEmissao" id="estado-conselho-sivis" @change="validaConselhoClasse();">
                            <option value="">Selecione</option>
                            <option v-for="e in this.estadosBrasileiros" :key="e.id" :value="e">{{e.estado}}</option>
                        </select>
                    </div>
                </div>
            </template>

            <!-- OUTROS -->
            <template v-else-if="!isEdit && tipoDocumentoSelecionado === this.$outros">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="numero-outros-sivis">Identificador</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaOutros" class="form-control" id="numero-outros-sivis" placeholder="Número">
                        <span class="validacao" v-show="isNumeroIdentificador">Campo obrigatório</span>
                    </div>
                </div>
            </template>

            <template v-else-if="isEdit && tipoDocumentoSelecionado === this.$outros">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="numero-outros-sivis">Identificador</label>
                        <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="documentoEdicao.numero" @keyup="validaOutros" class="form-control" id="numero-outros-sivis" placeholder="Número">
                        <span class="validacao" v-show="documentoEdicao.numero == ''">Campo obrigatório</span>
                    </div>
                </div>
            </template>

              <div class="col-md-12">
                <span v-if="isDocumentoDuplicidade" class="validacao">Esse tipo de documento já foi adicionado.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="buttons">
          <button v-if="!isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary"
                  :disabled="isConfirmaDocumento || isDocumentoDuplicidade" @click="addDocumento();">Adicionar</button>
          <button v-if="isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary"
                  :disabled="isConfirmaDocumento || isDocumentoDuplicidade" @click="addDocumento();">Atualizar</button>
        </div>
      </form>
    </div>


      <!-- Tabela restricao de entrada -->
    <template v-if="isDetalhar">
      <div class="panel panel-default" v-if="isListaRestricao">
        <div class="panel-heading">
          <h2>Restrição de entrada do Visitante</h2>
        </div>
        <br />
        <table id="table-restricao-entrada" class="table table-bordered" data-pic-datatable>
          <thead>
            <tr>
              <th width="12%">Tipo de restrição</th>
              <th width="20%">Motivo</th>
              <th width="8%">Data Inicial</th>
              <th width="8%">Data Final</th>
              <th width="8%">Ponto</th>
              <th width="20%">Nome do cadastrador</th>
              <th width="2%">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in  listaRestricao" :key="res.id">
              <td>{{ res.tipoRestricao.nome }}</td>
              <td class="line">{{ res.motivoRestricao }}</td>
              <td>{{ getDate(res.dataInicioRestricao) }}</td>
              <td>{{ getDate(res.dataFinalRestricao) }}</td>
              <td>{{ res.pontoCadastrador }}</td>
              <td>nome cadastrador</td>
              <td>
                <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}'>
                  <li>
                    <a href="#">Alterar</a>
                  </li>
                  <li>
                    <a href="#">Excluir</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <button class="btn btn-primary btn btn-primary button-busca-margin pull-right ">Criar Restrição</button>
      </div>
      <div class="panel panel-default" v-else>
        <div class="panel-heading">
          <h2>Restrição de entrada do Visitante</h2>
        </div>
        <br />
        <span>
          <p>Não existe nenhum registro de Restrição de entrada.</p>
        </span>
      </div>


        <!-- Tabela registro de entrada -->

      <div class="panel panel-default espacamento-tabela" v-if="isListaRegistro">
        <div class="panel-heading">
          <h2>Registro de Entrada do Visitante</h2>
        </div>
        <br />
        <table id="table-restricao-entrada" class="table table-bordered" data-pic-datatable>
          <thead>
            <tr>
              <th width="8%">Data</th>
              <th width="5%">Hora</th>
              <th width="15%">Portaria</th>
              <th width="15%">Destino</th>
              <th width="2%">Ação</th>
            </tr>
          </thead>
          <tbody>

            <tr v-for="e in  listaRegistro" :key="e.id">
              <td>{{ getDate(e.dataHoraVisita ) }}</td>
              <td>{{ getTime(e.dataHoraVisita) }}</td>
              <td>{{ e.portaria.descricaoPortaria }}</td>
              <td>{{ e.destino.nomeDestino }}</td>
              <td>
                <ul data-pic-actionsbar='{"type":"bar", "showLabel":"true", "buttonType":"primary"}'>
                  <li>
                    <a @click="alterarEntrada(e.id)">Alterar</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>


        <button @click="registrarEntrada()" class="btn btn-primary btn btn-primary button-busca-margin pull-right">Registrar Entrada</button>
      </div>
      <div class="panel panel-default" v-else>
        <div class="panel-heading">
          <h2>Registro de Entrada do Visitante</h2>
        </div>
        <br />
        <span>
          <p>Não existe nenhum registro de entrada de visitante.</p>
        </span>
      </div>
    </template>


      <!-- Modal Login Depol-->
    <div data-pic-modal='{"title": "Autorizar Entrada", "dialog": "default"}' id="autorizarRestricaoLogin" ref="autorizarRestricaoLogin">
      <div v-show="isAlertModalAutorizarAgente" data-pic-alert='{"type": "error"}'>
        Necessário um ponto de um Agente DEPOL, para liberar entrada.
      </div>
      <form>
        <div class="col-md-2">
          <div class="form-group">
            <label for="ponto">Ponto</label>
            <input type="text" class="form-control" id="pontoAgenteAutorizador" v-model="pontoAgenteAutorizador">
          </div>
        </div>
        <div class="col-md-10">
          <div class="form-group">
            <label for="senha-agente">Senha do agente</label>
            <input type="password" class="form-control" id="senhaAgenteAutorizador" v-model="senhaAgenteAutorizador">
          </div>
        </div>
        <div class="buttons">
          <button type="button" class="btn btn-primary" @click="VerificarAdministrador()">Entrar</button>
          <button type="submit" class="btn btn-secondary">Fechar</button>
        </div>
      </form>
   </div>
      <!-- Modal Autorizacao Depol-->
    <div data-pic-modal='{"title": "Autorizar Entrada", "dialog": "default"}' id="autorizarRestricaoEntradaModal" >

      <form class="modal_autorizarRes">
        <div class="col-md-2">
          <div class="form-group">
            <label for="ponto">Ponto</label>
            <input type="text" class="form-control" disabled id="ponto" v-model="this.pontoAgenteAutorizador">
          </div>
        </div>

        <div class="col-md-10">
          <div class="form-group">
            <label for="senha-agente">Nome do agente</label>
            <input type="text" class="form-control" disabled id="nome-agente" v-model="this.nomeAutorizadorSemDocumento">
          </div>
        </div>
        <div class="col-md-12">
          <p><b>Tentativas de entrada hoje, dia {{ getDateHoje() }}</b></p>
            <table-sivis2 class="table-hover table-striped table-sm"
                     :columns="tableColumns"
                     :data="listaTentativasEntrada" v-if="islistaTentativasEntrada"
                     :page=1
                     :perPage=5>
            </table-sivis2>

          <div class="form-group">
            <label for="motivo">Motivo da Restrição</label>
            <textarea v-model="motivoRestricaoEntrada" class="form-control" disabled id="motivo" rows="5" cols="10"></textarea>
          </div>
          <div class="form-group">
            <label for="justificativa">Justificativa do agente <span class="requiredLabel">*</span> </label>
            <textarea v-model="justificativa" class="form-control" id="justificativa" rows="5" cols="10"  maxlength="600" required></textarea>
          </div>
        </div>

        <div class="buttons">
          <button type="submit" v-bind:disabled="!isValidJustify" @click="rejeitarEntradaRestricao()" class="btn btn-primary">Rejeitar entrada</button>
          <button type="submit" @click="autorizarEntradaRestricao()" class="btn btn-primary">Autorizar entrada</button>

          <button type="submit" class="btn btn-secondary">Fechar</button>
        </div>
      </form>
    </div>

      <!-- MODAL LISTA HOMONIMOS -->
    <div data-pic-modal='{"title": "Lista de Homônimos", "dialog": "default"}' id="modalListaHomonimos">
        <div class="col-md-12">
            <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Identificação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="visitante in listaHomonimos" :key="visitante.id">
                        <td width="5%" class="text-center">
                            <template v-if="visitante.fotoVisitante != null">
                                <img :src="visitante.fotoVisitante"  class="molduraFotoConvidado"/>
                            </template>
                            <template v-else>
                                <img src="/images/avatar.png" alt="Foto do convidado" />
                            </template>
                        </td>
                        <td width=""><span>{{visitante.nomeVisitante}}</span></td>
                        <td width=""><span>{{visitante.cpf}}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="espacamentoPageFinal"></div>
  </span>
</template>

<script>
    // import Tabs from '../components/Tabs.vue';
    import { mask } from 'vue-the-mask'
    import { log } from 'util';
    import TableSivis2 from '@/componentes/TableSivis2'
    export default {
        name: "NovoVisitante",
        directives: { mask },
        props: {
            parametros: '',
            idVisitante: Number,
            visitante: Object,
        },
        components:{
            TableSivis2  
        },
        data() {
            return {
                tableColumns: [],
            
                liberar: false,
                //Table  restricao entrada
                isListaRestricao: false,
                listaRestricao: [],

                //Table  registro entrada
                isListaRegistro: false,
                listaRegistro: [],

                pontoAgenteAutorizador: null,
                senhaAgenteAutorizador: null,

                //AVATAR
                avatar: '././images/photo-final.png',
                width: 500,
                height: 0,
                streaming: false,
                video: null,
                canvas: null,
                photo: null,
                isVideo: true,
                isFoto: false,
                data: '',
                //DOCUMENTO FRENTE
                documentoFrente: "../../images/photo-final.png",
                widthDocumentoFrente: 347,
                heightDocumentoFrente: 0,
                streamingDocumentoFrente: false,
                videoDocumentoFrente: null,
                canvasDocumentoFrente: null,
                photoDocumentoFrente: null,
                isVideoDocumentoFrente: true,
                isFotoDocumentoFrente: false,
                dataDocumentoFrente: '',
                //DOCUMENTO VERSO
                documentoVerso: "../../images/photo-final.png",
                widthDocumentoVerso: 347,
                heightDocumentoVerso: 0,
                streamingDocumentoVerso: false,
                videoDocumentoVerso: null,
                canvasDocumentoVerso: null,
                photoDocumentoVerso: null,
                isVideoDocumentoVerso: true,
                isFotoDocumentoVerso: false,
                dataDocumentoVerso: '',
                listaDestino: [],
                listaPortaria: [],
                listaLocal: [],
                lista: [],
                listaOrigem: [],
                listaPaises: '',
                listaTipoDocumento: '',
                numero: '',
                isCpf: false,
                nomeVisitante: '',
                ddd: '',
                numeroTel: '',
                destino: '',
                fotoEnvioVisitante: '',
                isDocumento: false,
                isPrincipal: false,
                listaDocumentos: new Array(),
                mensagem: '',
                //GERAL
                justificativa: "",
                nomeMae: '',
                tipoDocumentoSelecionado: 'RG',
                tipoOrigemSelecionado: '',
                tipoPaisSelecionado: '',
                listaTipoDocumentoOutros: ['PASSAPORTE', 'CNRM', 'OUTROS'],
                numeroCPF: null,
                numero: null,
                dataCadastro: null,
                dataVencimento: null,
                dataExpedicao: null,
                selectedEstado: null,
                selectedConselho: '',
                selectedDestino: {
                    id: null
                },
                selectedPortaria: {
                    id: null
                },
                selectedLocal: null,
                selectedOrigem: '',
                selectedPais: '',
                selectedUF: '',
                selectedTipoDocumento: '',
                isValid: Boolean,
                isAlert: false,
                isAlertModal: false,
                isPrincipal: false,
                isDuplicidade: false,
                isDocumentoDuplicidade: false,
                isConfirmaDocumento: true,
                isRegistraEntrada: false,
                isRG: false,
                isNumeroCTPS: false,
                isEstado: false,
                isNumeroTituloEleitor: false,
                isNumeroIdentificador: false,
                isNumeroPassaporte: false,
                isDataExpedicao: false,
                isDataVencimento: false,
                isNumeroCrnm: false,
                isDataExpedicaoCrnm: false,
                isDataVencimentoCrnm: false,
                isPais: false,
                isEdit: false,
                documentoEdicao: '',
                estadosBrasileiros: [],
                indexEdicao: '',
                selecionar: {
                    id: null,
                    descricaoPortaria: "Selecione"
                },
                selecionarDestinos: {
                    id: null,
                    nomeDestino: "Selecione"
                },
                isDocumenoFrente: Boolean,
                isDocumentoVerso: Boolean,
                listTemp: new Array(),
                now: new Date(),
                
                motivo: "",
                documentoDTO: [],
                inexistenciaDocumento: false,
                pontoAutorizador: null,
                nomeAutorizadorSemDocumento: null,

                isAlertModalAutorizarAgente: false,

                isRestricaoEntrada: false,
                idRestricaoEntrada: null,
                motivoRestricaoEntrada: null,

                listaTentativasEntrada: [],
                islistaTentativasEntrada: false,


                isAlterar: this.$route.params.isAlterar,
                isIncluir: this.$route.meta.isIncluir,
                isDetalhar: this.$route.params.isDetalhar,

                isRejeicaoEntrada :false,
                isAdministrador: false,

                listaHomonimos: [],
                isMsgHomonimo: false,
                qtdReg: 0,
                listaGabinetes: [],
                listaGabinetesSelecionado: [],
                gabineteDestinoSelecionado: '',
                isRegraEntradaAtendida: false,
                isTelefoneInvalido: false,
                descGabineteSelecionado: '',
                isNovoVisitante: false,

                controleCarousel: false,
                listaDocumentosTemp: [],

                idGabineteSelecionado: null,
            }
        },
        beforeRouteUpdate (to, from, next) {
            this.isIncluir = to.meta.isIncluir;
        },
        updated() {
            var elemento = document.getElementById("table-restricao-entrada");
            if (elemento !== null) {
                PIC.activateWidget("Datatable");
                PIC.activateWidget('Actionsbar');
            }
        },
        created: function () {
            if (this.isDetalhar) {
                this.isIncluir = false;
                this.isAlterar = false;
            } else if (this.isAlterar) {
                this.isIncluir = false;
                this.isDetalhar = false;
            }

            if (this.idVisitante) {
                let cpfPesquisa = null;

                this.$http.get(`/visitante/buscarVisitantePorID?idVisitante=${this.idVisitante}`)
                    .then(
                        function (response) {
                            if (response.status === 200) {
                                cpfPesquisa = response.data.cpf;
                                this.verificarRestricaoEntradaVisitante(cpfPesquisa);
                                this.prepararVisitanteDTO(response.data);
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                if (this.isDetalhar) {
                    this.buscarRestricoesEntrada(this.idVisitante);
                    this.buscarEntradas(this.idVisitante);
                }
            }
            if(!this.isDetalhar && !this.isAlterar && !this.idVisitante){
                this.isNovoVisitante = true;
            }

            this.buscarListaGabinetes();

            if (this.parametros != '') {
                if (this.isInteger(this.parametros)) {
                    this.nomeVisitante = this.parametros;
                } else {
                    this.numeroCPF = this.parametros;
                }
            }

            this.$http.get(`/portaria`).then(
                function (response) {
                    this.listaPortaria = response.data;

                    this.listaPortaria.unshift(this.selecionar);
                    this.selectedPortaria = this.listaPortaria[0];

                    this.listaDestino.unshift(this.selecionarDestinos);
                    this.selectedDestino = this.listaDestino[0];

                }.bind(this)

            ).catch(function (error) {
                // handle error
                console.log(error);
            });
            this.getDateHoje();
        },
        computed: {
            isValidJustify: function () {
                return this.justificativa !== '' && this.justificativa.length > 10;
            }
        },        
        methods: {                
            getDateHoje() {
                var data = new Date(),
                dia  = data.getDate().toString(),
                diaF = (dia.length == 1) ? '0'+dia : dia,
                mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                mesF = (mes.length == 1) ? '0'+mes : mes,
                anoF = data.getFullYear();
                return diaF+"/"+mesF+"/"+anoF;
            
            },
            verificarTelefone(){
                this.isRegistraEntrada = true;
                let numeroFone = this.numeroTel.replace(/[^0-9]+/g,'');;
                if(numeroFone.length > 0 && numeroFone.length < 10){
                    this.isTelefoneInvalido = true;
                    this.isRegistraEntrada = false;

                }else{
                    this.isTelefoneInvalido = false;
                }

            },
            buscarListaGabinetes() {
                this.$http.get(`/gabinete`).then(
                    function(response) {
                        response.data.forEach(resp => {
                            let gabineteDTO = {
                                label: resp.label,
                                value: resp.value
                            }
                            this.listaGabinetes.push(gabineteDTO);
                        });
                        this.listaGabinetes = JSON.stringify(this.listaGabinetes);

                    }.bind(this)

                ).catch(function(error) {
                    // handle error
                    console.log(error);
                });
            },
            selecionarPortariaDestino(){
                if(this.selectedPortaria.descricaoPortaria == 'Selecione'){
                    this.descGabineteSelecionado = '';
                    this.selectedDestino = this.selecionarDestinos;

                    this.listaDestino = [];
                    this.listaDestino.unshift(this.selecionarDestinos);
                    
                    document.getElementById("gabinete-destino").disabled = false;
                    document.getElementById("local").disabled = false;            
                }
            },
            selecionarLocalDestino(){
                if(this.selectedDestino.nomeDestino == 'Selecione'){
                    $('#gabinete-destino').attr('disabled', false);
                }else{
                    $('#gabinete-destino').attr('disabled', true);
                }
            },
            selecionarGabineteDestino(){
                this.listaGabinetes = JSON.parse(this.listaGabinetes);

                this.descGabineteSelecionado = $('#gabinete-destino').val();

                this.listaGabinetes.forEach(e => {
                    if(e.label == $('#gabinete-destino').val()){
                        this.gabineteDestinoSelecionado = e.value;
                    }
                });

                if($('#gabinete-destino').val() != ''){
                    $('#local').attr('disabled', true);

                    this.listaDestino = [];
                    this.listaDestino.unshift(this.selecionarDestinos);

                    this.isRegistraEntrada = true;
                }else{
                    $('#local').attr('disabled', false);

                    this.gabineteDestinoSelecionado = '';

                    this.isRegistraEntrada = false;
                }

                this.listaGabinetes = JSON.stringify(this.listaGabinetes);
            },
            formataCPF(cpf) {
                //retira os caracteres indesejados...
                cpf = cpf.replace(/[^\d]/g, "");
                //realizar a formatação...
                return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            },
            buscarVisitantes(){
                var nomeVisitante = this.nomeVisitante.replace(/( )+/g, ' ');
                let isListaHomonimo;

                if(nomeVisitante.length != null){
                    this.$http.get(`/visitante/buscaPorFiltros?parametros=${nomeVisitante}`).then(
                        function(response) {
                            this.listaHomonimos = response.data.content;

                            this.isMsgHomonimo = false;

                            if(this.listaHomonimos){
                                this.qtdReg = this.listaHomonimos.length;

                                this.isMsgHomonimo = true;
                            }else{
                                this.isMsgHomonimo = false;

                                this.listaHomonimos = [];
                            }

                            isListaHomonimo = this.isMsgHomonimo
                        }.bind(this)

                    ).catch(function(error) {
                        // handle error
                        console.log(error);

                    });
                }
            },
            administradorRejeitarBTN(){ //quando o usuário for DEPOL/ADMINISTRADOR

                if (this.$perfilUsuario === 'Administrador') {
                    this.isRejeicaoEntrada = true;
                    this.isAlertModalAutorizarAgente = false;
                    
                    this.pontoAgenteAutorizador = this.$pontoCadastrador;
                                       

                    this.pontoAutorizador =  this.$pontoCadastrador;
                    $('#autorizarRestricaoEntradaModal').picModal().show();
                    this.buscarTentativasEntrada(this.idRestricaoEntrada);
                }
            },
            alterarEntrada(idEntrada){
                this.$router.push({
                    name: "alterarEntrada",
                    params: { idEntrada: idEntrada, idVisitante: this.idVisitante }
                });
            },
            registrarEntrada(){
                this.isDetalhar = false;
                this.isIncluir = true;
                setTimeout(() => {
                    PIC.refreshWidget('Carousel');
                }, 0.1);
            },
            getTime(stringDate) {
                var date = new Date(stringDate);

                // Guarda cada pedaço em uma variável
                var dia = date.getDate();           // 1-31
                var dia_sem = date.getDay();            // 0-6 (zero=domingo)
                var mes = date.getMonth();          // 0-11 (zero=janeiro)
                var ano2 = date.getYear();           // 2 dígitos
                var ano4 = date.getFullYear();       // 4 dígitos
                var hora = date.getHours();          // 0-23
                var min = date.getMinutes();        // 0-59
                var seg = date.getSeconds();        // 0-59
                var mseg = date.getMilliseconds();   // 0-999
                var tz = date.getTimezoneOffset(); // em minutos

                // Formata a data e a hora (note o mês + 1)
                var str_date = dia + '/' + (mes + 1) + '/' + ano4;
                var str_hora = String(hora).padStart(2, "0") + ':' + String(min).padStart(2, "0");

                // Mostra o resultado
                return str_date + ' às ' + str_hora;
            },
            rejeitarEntradaRestricao() {
                let visitanteDTO = null;
                let rejeicaoEntradaDTO = null;

                rejeicaoEntradaDTO = {
                    id: this.id ? this.id : null,
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                    pontoCamara: this.pontoCamara ? this.pontoCamara : null,
                    visitanteDTO: visitanteDTO ? visitanteDTO : null,
                    portariaDTO: this.selectedPortaria ? this.selectedPortaria : null,
                    destino: this.selectedDestino.id != null ? this.selectedDestino : null,
                    idGabinete: this.gabineteDestinoSelecionado ? this.gabineteDestinoSelecionado : null,
                    inexistenciaDocumento: this.inexistenciaDocumento ? this.inexistenciaDocumento : false,
                    motivo: this.justificativa ? this.justificativa : null,
                    convidadoDTO: null,
                    nomeEquipamento: this.nomeEquipamento ? this.nomeEquipamento : "nomeEquipamento",
                    numeroEnderecoIP: this.numeroEnderecoIP ? this.numeroEnderecoIP : "EnderecoIP",
                    existeRestricao: this.isRestricaoEntrada ? this.isRestricaoEntrada : null,
                    idRestricaoEntrada: this.idRestricaoEntrada ? this.idRestricaoEntrada : null,
                    pontoAutorizador: this.pontoAutorizador ? this.pontoAutorizador : null,

                }

                visitanteDTO = {
                    id: this.idVisitante ? this.idVisitante : null,
                    dataCadastro: this.dataCadastro ? this.dataCadastro :this.dataCadastro,
                    nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                    cpf: this.numeroCPF ? this.numeroCPF : null,
                    nomeMae: this.nomeMae ? this.nomeMae : null,
                    telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                    fotoVisitante: this.data ? this.data : null,
                    isDocumento: this.isDocumento ? this.isDocumento : false,
                    documentos: this.listaDocumentos ? this.listaDocumentos : null,
                    rejeicaoEntradaDTO: rejeicaoEntradaDTO ? rejeicaoEntradaDTO : null,
                    entradaDTO: null,
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                    isNovoVisitante: this.isNovoVisitante ? this.isNovoVisitante : false,
                    isAlterar : this.isAlterar ? this.isAlterar : false
                }
                
                this.validaSalvar();

                if (!this.isAlert) {
                    const now = new Date();
                    this.$http.post(`/visitante`, visitanteDTO).then(
                        function (response) {
                            if (response.status === 200) {
                                this.$router.push({ 
                                    name: 'buscaVisitantes', 
                                    params: { 
                                        msg: "Rejeição de " + this.nomeVisitante + " registrada com sucesso às " + String(now.getHours()).padStart(2, "0") + ':' + String(now.getMinutes()).padStart(2, "0") + ':' + String(now.getSeconds()).padStart(2, "0"), 
                                        isSalvo: true 
                                    } 
                                });
                            }
                        }.bind(this)

                    ).catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                }

            },
            autorizarEntradaRestricao() {
                this.confirmaSalvar();
            },
            getDate(dataSemFormato) {
                return dataSemFormato ? moment(dataSemFormato).format('DD/MM/YYYY') : null;
            },
            getTime(stringDate) {
                var date = new Date(stringDate);
                return date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
            },
            verificarRestricaoEntradaVisitante(cpf) {
                this.$http
                    .get("/restricao/verificarRestricaoEntradaVisitante", {
                        params: { numeroCPF: cpf }
                    })
                    .then(
                        function (response) {
                            if (response.status === 200) {
                                this.isRestricaoEntrada = true;
                                this.habilitarBotaoAutorizar();
                                let data = null;
                                data = response.data;

                                this.idRestricaoEntrada = data.id;
                                this.motivoRestricaoEntrada = data.motivoRestricao;

                                let restricaoEntradaDTO = null;
                                restricaoEntradaDTO = {
                                    id: response.data.id
                                }

                                let portariaDTO = null;
                                portariaDTO = {
                                    id: 1
                                }
                                let entradaDTO = null;

                                let tentativaEntradaRestricaoDTO = null;
                                tentativaEntradaRestricaoDTO = {
                                    restricaoEntradaDTO: restricaoEntradaDTO ? restricaoEntradaDTO : null,
                                    portariaDTO: portariaDTO ? portariaDTO : null,
                                    entradaDTO: entradaDTO ? entradaDTO : null,
                                    nomeEquipamento: 'noEquipamento',
                                    numeroEnderecoIP: 'numeroIP'
                                }
                                this.$http
                                    .post('/tentativaEntrada', tentativaEntradaRestricaoDTO)
                                    .then(function (response) {

                                        }.bind(this)
                                    )
                                    .catch(function (error) {
                                        // handle error
                                        console.log(error);
                                    });

                            } else {
                                this.isRestricaoEntrada = false;
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
            habilitarBotaoAutorizar() {

                var authorizeEntry = document.getElementById("authorize-entry");
                authorizeEntry.style.display = "block";
                var documentButtonContainer = document.getElementById("document-button-container");
                documentButtonContainer.style.display = "nome";
            },
            VerificarAdministrador() {

                let loginDTO = {
                    ponto: this.pontoAgenteAutorizador ? btoa(this.pontoAgenteAutorizador) : null,
                    senha: this.senhaAgenteAutorizador ? btoa(this.senhaAgenteAutorizador) : null,
                    sigla: this.$sistema
                }
                this.$http
                    .post("/login/verificarUsuarioAgenteAutorizador", loginDTO)
                    .then(function (response) {
                            if (response.status === 200) {
                                let data = response.data;

                                this.pontoAutorizador = data.ponto;
                                this.nomeAutorizadorSemDocumento = data.nome;

                                if (response.data.perfil.perfil === "Administrador") {
                                    this.isAdministrador = true;
                                    this.isAlertModalAutorizarAgente = false;
                                    if (!this.inexistenciaDocumento && this.isRestricaoEntrada) {
                                        $('#autorizarRestricaoEntradaModal').picModal().show();
                                        this.buscarTentativasEntrada(this.idRestricaoEntrada);
                                    } else {
                                        this.confirmaSalvar();
                                    }
                                } else {
                                    this.isAlertModalAutorizarAgente = true;
                                    $('#autorizarRestricaoLogin').picModal().show();
                                }
                            }else{
                                    this.isAlertModalAutorizarAgente = true;
                                    $('#autorizarRestricaoLogin').picModal().show();
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
            buscarTentativasEntrada(idRestricao) {
                this.$http
                    .get("/restricao/listarEntradasRestricao", {
                        params: { idRestricaoEntrada: idRestricao, hoje: 'sim' }
                    })
                    .then(
                        function (response) {
                            if (response.status === 200) {
                                this.tableColumns = ['Portaria', 'Anexo', 'Horário'];
                                let data = response.data;
                                this.listaTentativasEntrada = [];

                                for(let i = 0; i < data.length ; i++){

                                    this.listaTentativasEntrada.push({
                                        portaria:data[i].portariaDTO.descricaoPortaria.trim(),
                                        anexo:"Anexo", 
                                        horário:this.getDate(data[i].dataTentativaRestricao)+"-"+ this.getTime(data[i].dataTentativaRestricao)
                                 }); 
                                }
                                console.log(this.listaTentativasEntrada);

                                if (data.length > 0) {
                                    this.islistaTentativasEntrada = true;
                                    

                                } else {
                                    this.islistaTentativasEntrada = false;
                                }
                            }
                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    }).then(()=> {
                        // always executed
                        if (this.islistaTentativasEntrada) {
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
                    });
            },
            prepararVisitanteDTO(data) {

                //this.id = data.id;
                this.dataCadastro = data.dataCadastro;
                this.data = data.fotoVisitante;
                this.nomeVisitante = data.nomeVisitante;
                this.numeroCPF = data.cpf;
                this.numeroTel = data.telefoneVisitante;
                this.isFotoVisitanteVencida = data.isFotoVisitanteVencida;

                this.setAvatar();
                if (this.numeroCPF) {
                    this.isControleCpf = true;
                }
                data.documentos.forEach(e => {
                    let documentoDTO = {
                        id: e.id ? e.id : null,
                        origemDocumento: e.origemDocumento ? e.origemDocumento : null,
                        pais: e.pais ? e.pais : null,
                        tipoDocumento: e.tipoDocumento ? e.tipoDocumento : null,
                        numero: e.numero ? e.numero : null,
                        cpf: e.cpf ? e.cpf : null,
                        isPrincipal: e.isPrincipal,
                        dataVencimento: e.dataVencimento ? e.dataVencimento : null,
                        dataExpedicao: e.dataExpedicao ? e.dataExpedicao : null,
                        estadoEmissao: e.estadoEmissao ? e.estadoEmissao : null,
                        conselho: e.conselho ? e.conselho : null,
                        fotoDocumentoFrente: e.fotoDocumentoFrente ? e.fotoDocumentoFrente : null,
                        fotoDocumentoVerso: e.fotoDocumentoVerso ? e.fotoDocumentoVerso : null,
                        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                        dataCadastro: e.dataCadastro ? e.dataCadastro : null
                    };
                    this.listaDocumentos.push(documentoDTO);

                    setTimeout(() => {
                        PIC.refreshWidget('Carousel');
                    }, 0.1);
                });

            },
            voltarPesquisaEntrada() {
                this.$router.push({
                    name: "pesquisarVisitanteEntradas"
                });
            },
            prepararAlterarVisitante() {
                this.isDetalhar = false;
                this.isAlterar = true;
                setTimeout(() => {
                    PIC.refreshWidget('Carousel');
                }, 0.1);
            },
            buscarRestricoesEntrada(idVisitante) {
                this.listaRestricao = null;
                this.$http
                    .get(`/restricao/buscarRestricaoEntradaVisitanteID?idVisitante=` + idVisitante)
                    .then(
                        function (response) {
                            this.listaRestricao = response.data;

                            if (this.listaRestricao) {
                                this.isListaRestricao = true;
                            } else {
                                this.isListaRestricao = false;
                            }

                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });

            },
            buscarEntradas(idVisitante) {
                this.listaRegistro = null;
                this.$http
                    .get(`/entrada/buscarEntradaVisitanteID?idVisitante=` + idVisitante)
                    .then(
                        function (response) {
                            this.listaRegistro = response.data;

                            if (this.listaRegistro) {
                                this.isListaRegistro = true;
                            } else {
                                this.isListaRegistro = false;
                            }

                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            },

            validaCheckboxIsPricipal(event) {
                if (event.target.checked) {
                    this.listTemp = JSON.parse(JSON.stringify(this.listaDocumentos));
                    this.listaDocumentos.forEach(e => {
                        e.isPrincipal = false;
                    });
                } else {
                    this.listaDocumentos = this.listTemp;
                }
            },
            onChangeLocal() {
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
                this.validaRegistraEntradaButton();
            },
            catchEvent(event) {
                this.tipoDocumentoSelecionado = event.target.options[event.target.options.selectedIndex].text
                this.tipoOrigemSelecionado = event.target.options[event.target.options.selectedIndex].text

                if (this.tipoOrigemSelecionado === "BRASILEIRO") {
                    this.tipoDocumentoSelecionado = 'RG'
                }

                this.numero = '';
                this.selectedUF = '';
                this.dataExpedicao = '';
                this.dataVencimento = '';
                if (this.isEdit) {
                    this.documentoEdicao.numero = '';
                    this.documentoEdicao.dataExpedicao = '';
                    this.documentoEdicao.dataVencimento = '';
                    this.documentoEdicao.estadoEmissao = '';
                }
                this.isValid = true;
            },
            catchEventCountry(event) {
                this.isEdit ? this.tipoPaisSelecionado = this.documentoEdicao.pais.namePais : this.tipoPaisSelecionado = event.target.options[event.target.options.selectedIndex].text;
                if (this.isEdit) {
                    this.selectedPais = this.documentoEdicao.pais
                }
                let outros = {
                    id: 11,
                    descTipoDocumento: 'outros',
                    origem: {
                        id: 2,
                        descOrigem: 'Estrangeiro'
                    }
                }

                if (this.tipoPaisSelecionado === "ARGENTINA (Mercosul)" || this.tipoPaisSelecionado === "PARAGUAI (Mercosul)" || this.tipoPaisSelecionado === "URUGUAI (Mercosul)" || this.tipoPaisSelecionado === "VENEZUELA (Mercosul)") {
                    if (this.listaTipoDocumento.length < 3) {
                        this.listaTipoDocumento.push(outros);
                    }
                } else {
                    if (this.listaTipoDocumento.length == 3) {
                        var index = this.listaTipoDocumento.indexOf(outros)
                        this.listaTipoDocumento.splice(index, 1);
                    }
                }
            },
            converterBase64ToByte(base64) {
                fetch(base64)
                    .then(res => res.blob())
                    .then(blob => {
                        return blob;
                    })
            },
            //AVATAR
            startup() {
                this.isVideo = true;
                this.isFoto = false;
                this.video = document.getElementById('video');
                this.canvas = document.getElementById('canvas');
                this.photo = document.getElementById('photo');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((stream) => {
                        this.video.srcObject = stream;
                        this.video.play();
                    })
                    .catch((err) => {
                        console.log("An error occurred: " + err);
                    });

                this.video.addEventListener('canplay', () => {
                    if (!this.streaming) {
                        this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
                        if (isNaN(this.height)) {
                            this.height = this.width / (4 / 3);
                        }
                        this.video.setAttribute('width', this.width);
                        this.video.setAttribute('height', this.height);
                        this.canvas.setAttribute('width', this.width);
                        this.canvas.setAttribute('height', this.height);
                        this.streaming = true;
                    }
                }, false);
            },
            takepicture() {
                this.isFoto = true;
                this.isVideo = false;
                var context = this.canvas.getContext('2d');
                if (this.width && this.height) {
                    this.canvas.width = this.width;
                    this.canvas.height = this.height;
                    context.drawImage(this.video, 0, 0, this.width, this.height);

                    this.data = this.canvas.toDataURL('image/jpg');
                    this.photo.setAttribute('src', this.data);
                }
            },
            setAvatar() {
                if (this.data) {
                    this.avatar = this.data;
                    return this.avatar;
                }
            },

            formatarData(dataSemFormato) {
                return moment(dataSemFormato).format('DD/MM/YYYY');
            },

            //DOCUMENTO FRENTE
            startupDocumentoFrente(tipo, elemento, index) {
                this.isDocumentoDuplicidade = false;
                let dataHoje = null;
                let dataCadastroDocumento =  null;

                this.dataDocumentoFrente = null;
                this.dataDocumentoVerso  = null;

                if(elemento != null){
                    const now = new Date();
                    dataHoje = this.formatarData(now);
                    dataCadastroDocumento =  this.formatarData(elemento.dataCadastro);
                }
               
                this.isRG = false;

                if (tipo == "editar") {
                    this.isEdit = true;
                    this.indexEdicao = index;
                    this.documentoEdicao = elemento;
                    this.selectedPais = elemento.pais;
                    this.selectedUF = elemento.estadoEmissao;
                    this.tipoDocumentoSelecionado = elemento.tipoDocumento;
                    this.dataDocumentoFrente = elemento.fotoDocumentoFrente;
                    this.dataDocumentoVerso = elemento.fotoDocumentoVerso ? elemento.fotoDocumentoVerso : null;
                    this.isVideoDocumentoFrente = false;
                    this.isFotoDocumentoFrente = true;
                    this.isPrincipal = elemento.isPrincipal;

                    if (elemento.fotoDocumentoVerso == null) {
                        this.isDocumentoVerso = false;
                    } else {
                        this.isDocumentoVerso = true;
                    }

                    if (this.$perfilUsuario === "Administrador" || (elemento.pontoCadastrador === this.$pontoCadastrador && dataCadastroDocumento === dataHoje)) {
                        this.enableForm();
                        setTimeout(()=>{
                            document.getElementById("digitalizarDocumentoConfirm").disabled = false;
                        });
                    } else {
                        this.disableForm();
                        setTimeout(()=>{
                            document.getElementById("digitalizarDocumentoConfirm").disabled = true;
                        });
                    }
                }

                if (tipo == 'novo') {
                    this.isVideoDocumentoFrente = true;
                    this.isFotoDocumentoFrente = false;
                    this.disableForm();
                    documentoVersoContainer.style.display = "none";
                }

                this.videoDocumentoFrente = document.getElementById('videoDocumentoFrente');
                this.canvasDocumentoFrente = document.getElementById('canvasDocumentoFrente');
                this.photoDocumentoFrente = document.getElementById('photoDocumentoFrente');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((stream) => {
                        this.videoDocumentoFrente.srcObject = stream;
                        this.videoDocumentoFrente.play();
                    })
                    .catch((err) => {
                        console.log("An error occurred: " + err);
                    });

                this.videoDocumentoFrente.addEventListener('canplay', () => {
                    if (!this.streamingDocumentoFrente) {
                        this.heightDocumentoFrente = this.videoDocumentoFrente.videoHeight / (this.videoDocumentoFrente.videoWidth / this.widthDocumentoFrente);
                        if (isNaN(this.heightDocumentoFrente)) {
                            this.heightDocumentoFrente = this.widthDocumentoFrente / (4 / 3);
                        }
                        this.videoDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                        this.videoDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                        this.canvasDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                        this.canvasDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                        this.streamingDocumentoFrente = true;
                    }
                }, false);

            },

            formatDate(data) {
                return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getUTCFullYear();
            },
            formatDateInput() {
                let data = new Date();
                return data.getUTCFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
            },
            //DOCUMENTO FRENTE EDITAR
            startupDocumentoFrenteEditar(elemento, index) {

                this.isVideoDocumentoFrente = true;
                this.isFotoDocumentoFrente = false;
                this.dataDocumentoFrente = '';

                this.videoDocumentoFrente = document.getElementById('videoDocumentoFrente');
                this.canvasDocumentoFrente = document.getElementById('canvasDocumentoFrente');
                this.photoDocumentoFrente = document.getElementById('photoDocumentoFrente');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((stream) => {
                        this.videoDocumentoFrente.srcObject = stream;
                        this.videoDocumentoFrente.play();
                    })
                    .catch((err) => {
                        console.log("An error occurred: " + err);
                    });

                this.videoDocumentoFrente.addEventListener('canplay', () => {
                    if (!this.streamingDocumentoFrente) {
                        this.heightDocumentoFrente = this.videoDocumentoFrente.videoHeight / (this.videoDocumentoFrente.videoWidth / this.widthDocumentoFrente);
                        if (isNaN(this.heightDocumentoFrente)) {
                            this.heightDocumentoFrente = this.widthDocumentoFrente / (4 / 3);
                        }
                        this.videoDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                        this.videoDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                        this.canvasDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                        this.canvasDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                        this.streamingDocumentoFrente = true;
                    }
                }, false);

                this.enableForm();
                this.changeDocument();

            },
            verificaDuplicidadeTipoDocumento() {
                this.isDocumentoDuplicidade = false;
                // bloqueia o botão confirmar quando houver duplicidade de tipo de documento
                if (this.listaDocumentos.length > 0) {
                    let descTipoDocumentoSelecionado = this.isEdit ? this.documentoEdicao.descTipoDocumento : this.selectedTipoDocumento.descTipoDocumento;
                    this.listaDocumentos.forEach(e => {
                        if (e.tipoDocumento.descTipoDocumento == descTipoDocumentoSelecionado) {
                            
                            if ((e.tipoDocumento.descTipoDocumento == this.$passaporte || e.tipoDocumento.descTipoDocumento == this.$crnm) && this.$moment(e.dataVencimento).isBefore(moment(), 'day')) {
                                this.isDocumentoDuplicidade = false;
                            } else {
                                this.isDocumentoDuplicidade = true;
                            }
                        }
                    });
                }
                this.changeDocument();
            },
            takepictureDocumentoFrente() {
                this.enableForm();
                this.isFotoDocumentoFrente = true;
                this.isVideoDocumentoFrente = false;
                var context = this.canvasDocumentoFrente.getContext('2d');
                if (this.widthDocumentoFrente && this.heightDocumentoFrente) {
                    this.canvasDocumentoFrente.widthDocumentoFrente = this.widthDocumentoFrente;
                    this.canvasDocumentoFrente.heightDocumentoFrente = this.heightDocumentoFrente;
                    context.drawImage(this.videoDocumentoFrente, 0, 0, this.widthDocumentoFrente, this.heightDocumentoFrente);

                    this.dataDocumentoFrente = this.canvasDocumentoFrente.toDataURL('image/jpg');
                    this.photoDocumentoFrente.setAttribute('src', this.dataDocumentoFrente);
                }

                this.verificaDuplicidadeTipoDocumento();

            },
            //DESABILITAR CAMPOS
            disableForm() {
                this.isConfirmaDocumento = true;
                let tipoDocumento = this.tipoDocumentoSelecionado.descTipoDocumento;

                setTimeout( ()=> {
                    document.getElementById("origem").disabled = true;
                    document.getElementById("pais").disabled = true;
                    document.getElementById("tipo-do-documento").disabled = true;
                });

                if (document.getElementById("isPrincipal")) {
                    setTimeout( ()=> {
                        document.getElementById("isPrincipal").disabled = true;
                    },1);
                }

                if (tipoDocumento === this.$rg) {
                    setTimeout( ()=> {
                        document.getElementById("numero-rg-sivis").disabled = true;
                        document.getElementById("uf-rg-sivis").disabled = true;
                    });
                }

                if (tipoDocumento === this.$carteira_trabalho) {
                    setTimeout( ()=> {
                        document.getElementById("numero-carteira-de-trabalho-sivis").disabled = true;
                        document.getElementById("estado-carteira-de-trabalho-sivis").disabled = true;
                    });
                }

                if (tipoDocumento === this.$passaporte) {
                    setTimeout( ()=> {
                        document.getElementById("numero-passaporte-sivis").disabled = true;
                        document.getElementById("numero-data-expedicao-sivis").disabled = true;
                        document.getElementById("numero-data-vencimento-sivis").disabled = true;
                    });
                }

                if (tipoDocumento === this.$crnm) {
                    setTimeout( ()=> {
                        document.getElementById("numero-data-expedicao-sivis").disabled = true;
                        document.getElementById("numero-data-vencimento-sivis").disabled = true;
                        document.getElementById("numero-crnm").disabled = true;
                    });
                }

                if (tipoDocumento === this.$titulo_eleitor) {
                    setTimeout( ()=> {
                        document.getElementById("numero-inscricao-sivis").disabled = true;
                    });
                }

                if (tipoDocumento === this.$conselho_classe) {
                    setTimeout( ()=> {
                        document.getElementById("origem").disabled = true;
                        document.getElementById("pais").disabled = true;
                        document.getElementById("tipo-do-documento").disabled = true;
                        document.getElementById("numero-conselho-de-classe-sivis").disabled = true;
                        document.getElementById("estado-conselho-responsavel-sivis").disabled = true;
                        document.getElementById("estado-conselho-sivis").disabled = true;
                    });
                }

                if (tipoDocumento === this.$outros) {
                    setTimeout( ()=> {
                        document.getElementById("numero-outros-sivis").disabled = true;
                    });
                }
            },

            //HABILITAR CAMPOS
            enableForm() {
                let tipoDocumento = this.tipoDocumentoSelecionado.descTipoDocumento;

                document.getElementById("origem").disabled = false;
                document.getElementById("pais").disabled = false;
                document.getElementById("tipo-do-documento").disabled = false;

                if (document.getElementById("isPrincipal")) {
                    setTimeout( ()=> {
                        document.getElementById("isPrincipal").disabled = false;
                    },1);
                }
                if (tipoDocumento === this.$rg) {
                    setTimeout( ()=> {
                        document.getElementById("numero-rg-sivis").disabled = false;
                        document.getElementById("uf-rg-sivis").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$carteira_trabalho) {
                    setTimeout( ()=> {
                        document.getElementById("numero-carteira-de-trabalho-sivis").disabled = false;
                        document.getElementById("estado-carteira-de-trabalho-sivis").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$passaporte) {
                    setTimeout( ()=> {
                        document.getElementById("numero-passaporte-sivis").disabled = false;
                        document.getElementById("numero-data-expedicao-sivis").disabled = false;
                        document.getElementById("numero-data-vencimento-sivis").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$crnm) {
                    setTimeout( ()=> {
                        document.getElementById("numero-data-expedicao-sivis").disabled = false;
                        document.getElementById("numero-data-vencimento-sivis").disabled = false;
                        document.getElementById("numero-crnm").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$titulo_eleitor) {
                    setTimeout( ()=> {
                        document.getElementById("numero-inscricao-sivis").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$conselho_classe) {
                    setTimeout( ()=> {
                        document.getElementById("origem").disabled = false;
                        document.getElementById("pais").disabled = false;
                        document.getElementById("numero-conselho-de-classe-sivis").disabled = false;
                        document.getElementById("estado-conselho-responsavel-sivis").disabled = false;
                        document.getElementById("estado-conselho-sivis").disabled = false;
                    },1);
                }

                if (tipoDocumento === this.$outros) {
                    setTimeout( ()=> {
                        document.getElementById("numero-outros-sivis").disabled = false;
                    },1);
                }
            },

            //DOCUMENTO VERSO
            startupDocumentoVerso() {
                documentoVersoContainer.style.display = "block";
                if (this.isEdit) {
                    if (this.dataDocumentoVerso) {
                        this.isVideoDocumentoVerso = false;
                        this.isFotoDocumentoVerso = true;
                    } else {
                        this.isVideoDocumentoVerso = true;
                        this.isFotoDocumentoVerso = false;
                    }
                } else {
                    this.isVideoDocumentoVerso = true;
                    this.isFotoDocumentoVerso = false;
                }

                this.videoDocumentoVerso = document.getElementById('videoDocumentoVerso');
                this.canvasDocumentoVerso = document.getElementById('canvasDocumentoVerso');
                this.photoDocumentoVerso = document.getElementById('photoDocumentoVerso');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((stream) => {
                        this.videoDocumentoVerso.srcObject = stream;
                        this.videoDocumentoVerso.play();
                    })
                    .catch((err) => {
                        console.log("An error occurred: " + err);
                    });

                this.videoDocumentoVerso.addEventListener('canplay', () => {
                    if (!this.streamingDocumentoVerso) {
                        this.heightDocumentoVerso = this.videoDocumentoVerso.videoHeight / (this.videoDocumentoVerso.videoWidth / this.widthDocumentoVerso);
                        if (isNaN(this.heightDocumentoVerso)) {
                            this.heightDocumentoVerso = this.widthDocumentoVerso / (4 / 3);
                        }
                        this.videoDocumentoVerso.setAttribute('width', this.widthDocumentoVerso);
                        this.videoDocumentoVerso.setAttribute('height', this.heightDocumentoVerso);
                        this.canvasDocumentoVerso.setAttribute('width', this.widthDocumentoVerso);
                        this.canvasDocumentoVerso.setAttribute('height', this.heightDocumentoVerso);
                        this.streamingDocumentoVerso = true;
                    }
                }, false);
            },
            startupDocumentoVersoEditar(tipo) {
                let controleFotoVerso = true;
                if (tipo == 'verso') {
                    controleFotoVerso = false;
                }

                if (this.isEdit) {
                    if (this.dataDocumentoVerso && controleFotoVerso) {
                        this.isVideoDocumentoVerso = false;
                        this.isFotoDocumentoVerso = true;
                    } else {
                        this.isVideoDocumentoVerso = true;
                        this.isFotoDocumentoVerso = false;
                    }
                } else {
                    this.isVideoDocumentoVerso = true;
                    this.isFotoDocumentoVerso = false;
                }

                if (this.isDocumentoVerso == true) {
                    this.isDocumentoVerso = false;
                }

                documentoVersoContainer.style.display = "block";

                this.videoDocumentoVerso = document.getElementById('videoDocumentoVerso');
                this.canvasDocumentoVerso = document.getElementById('canvasDocumentoVerso');
                this.photoDocumentoVerso = document.getElementById('photoDocumentoVerso');

                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((stream) => {
                        this.videoDocumentoVerso.srcObject = stream;
                        this.videoDocumentoVerso.play();
                    })
                    .catch((err) => {
                        console.log("An error occurred: " + err);
                    });

                this.videoDocumentoVerso.addEventListener('canplay', () => {
                    if (!this.streamingDocumentoVerso) {
                        this.heightDocumentoVerso = this.videoDocumentoVerso.videoHeight / (this.videoDocumentoVerso.videoWidth / this.widthDocumentoVerso);
                        if (isNaN(this.heightDocumentoVerso)) {
                            this.heightDocumentoVerso = this.widthDocumentoVerso / (4 / 3);
                        }
                        this.videoDocumentoVerso.setAttribute('width', this.widthDocumentoVerso);
                        this.videoDocumentoVerso.setAttribute('height', this.heightDocumentoVerso);
                        this.canvasDocumentoVerso.setAttribute('width', this.widthDocumentoVerso);
                        this.canvasDocumentoVerso.setAttribute('height', this.heightDocumentoVerso);
                        this.streamingDocumentoVerso = true;
                    }
                }, false);
                this.changeDocument();
            },
            takepictureDocumentoVerso() {
                this.isFotoDocumentoVerso = true;
                this.isVideoDocumentoVerso = false;
                var context = this.canvasDocumentoVerso.getContext('2d');
                if (this.widthDocumentoVerso && this.heightDocumentoVerso) {
                    this.canvasDocumentoVerso.widthDocumentoVerso = this.widthDocumentoVerso;
                    this.canvasDocumentoVerso.heightDocumentoVerso = this.heightDocumentoVerso;
                    context.drawImage(this.videoDocumentoVerso, 0, 0, this.widthDocumentoVerso, this.heightDocumentoVerso);

                    this.dataDocumentoVerso = this.canvasDocumentoVerso.toDataURL('image/jpg');
                    this.photoDocumentoVerso.setAttribute('src', this.dataDocumentoVerso);
                }
                this.changeDocument('foto');
            },
            setDocumentos() {
                if (this.dataDocumentoFrente) {
                    this.documentoFrente = this.dataDocumentoFrente;
                }

                if (this.dataDocumentoVerso) {
                    this.documentoVerso = this.dataDocumentoVerso;
                }

                return this.documentoFrente, this.documentoVerso;
            },
            showDocument(){
                if (document.getElementById('sem-doc').checked){
                    this.listaDocumentos = [];
                    this.listaDocumentosTemp = [];

                    /*Mensagem de autorização*/
                    document.getElementById("agent-message").style.display = "block";
                    /*Botao autorizar*/
                    if(this.isDuplicidade){
                        document.getElementById("authorize-entry").style.display = "none";
                    }else{
                        document.getElementById("authorize-entry").style.display = "block";
                    }
                    /*Botao novo documento*/
                    document.getElementById("document-button-container").style.display = "none";
                    /*Carrossel de documentos*/
                    document.getElementById("doc-carrossel-adicao").style.display = "none";
                    document.getElementById("doc-carrossel-edicao").style.display = "none";

                    if(this.isDetalhar){
                        document.getElementById("container-documento-detalhar").style.display = "none";
                    }

                    this.inexistenciaDocumento = true;
                    this.isDocumento = true;

                }else{
                    /*Mensagem de autorização*/
                    document.getElementById("agent-message").style.display = "none";
                    /*Botao autorizar*/
                    if(this.isRestricaoEntrada && this.isDuplicidade){
                        document.getElementById("authorize-entry").style.display = "nome";
                    }else if(this.isRestricaoEntrada){
                        document.getElementById("authorize-entry").style.display = "block";
                    }else{
                         document.getElementById("authorize-entry").style.display = "none";
                    }
                    /*Botao novo documento*/
                    document.getElementById("document-button-container").style.display = "block";
                    /*Carrossel de documentos*/
                    document.getElementById("doc-carrossel-adicao").style.display = "block";
                    document.getElementById("doc-carrossel-edicao").style.display = "block";

                    if(this.isDetalhar){
                        document.getElementById("container-documento-detalhar").style.display = "block";
                    }

                    this.inexistenciaDocumento = false;
                    this.isDocumento = false;
                }
            },
            isInteger(campoPesquisa) {
                let d = true;
                if (campoPesquisa) {
                    if (!campoPesquisa[0].match("^[a-zA-Z]{1,25}$")) {
                        d = false;
                    }
                    return d;
                }
            },
            montaComboOrigem(tipo) {
                if (tipo == 'novo') {
                    this.isEdit = false;
                }

                this.isEdit ? this.tipoDocumentoSelecionado = this.documentoEdicao.tipoDocumento.descTipoDocumento.toUpperCase() : this.tipoDocumentoSelecionado = 'RG';

                this.$http.get(`/origem`).then(
                    function (response) {
                        this.listaOrigem = response.data;
                        this.selectedOrigem = this.listaOrigem[0];
                        this.onChangePaises();
                    }.bind(this)

                ).catch(function (error) {
                    // handle error
                    console.log(error);
                });

                this.numero = null,
                    this.dataVencimento = null,
                    this.dataExpedicao = null,
                    this.selectedEstado = null,
                    this.selectedConselho = '',
                    this.selectedOrigem = '',
                    this.selectedPais = '',
                    this.selectedUF = '',
                    this.selectedTipoDocumento = ''

                if (this.listaDocumentos.length > 0) {
                    this.listaDocumentos.forEach(e => {
                        if (e.cpf && !this.numeroCPF) {
                            this.numeroCPF = e.cpf;
                        }
                    });
                }

                if (this.isEdit) {
                    this.isConfirmaDocumento = false;
                }

            },
            onChangePaises() {
                if (this.isEdit) {
                    this.onChangeTipoDocumento(this.documentoEdicao.origemDocumento.descOrigem)
                    this.$http
                        .get(`/paises/` + this.documentoEdicao.origemDocumento.descOrigem.toLowerCase())
                        .then(function (response) {
                                this.listaPaises = response.data;
                                if (this.documentoEdicao.origemDocumento.descOrigem === 'Brasileiro') {
                                    this.selectedPais = this.listaPaises[0];
                                } else {
                                    this.listaPaises.unshift({ namePais: 'Selecione' });
                                    this.selectedPais = this.listaPaises[0];
                                }
                                this.catchEventCountry('');
                            }.bind(this)
                        )
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                } else {
                    this.onChangeTipoDocumento(this.selectedOrigem.descOrigem)
                    this.$http
                        .get(`/paises/` + this.selectedOrigem.descOrigem.toLowerCase())
                        .then(function (response) {
                                this.listaPaises = response.data;
                                if (this.selectedOrigem.descOrigem === 'Brasileiro') {
                                    this.selectedPais = this.listaPaises[0];
                                } else {
                                    this.listaPaises.unshift({ namePais: 'Selecione' });
                                    this.selectedPais = this.listaPaises[0];
                                }
                            }.bind(this)
                        )
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                }
            },
            onChangeTipoDocumento(origem) {
                this.$http
                    .get(`/tipoDocumento?parametros=${origem}`)
                    .then(function (response) {
                            this.listaTipoDocumento = response.data;
                            this.selectedTipoDocumento = this.listaTipoDocumento[0];
                            this.verificaDuplicidadeTipoDocumento();
                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            },
            converterDate(date) {
                if (date) {
                    var dt = date.split('/');
                    var data = new Date(dt[2], dt[1] - 1, dt[0]);
                }
                return data;
            },
            addDocumento() {
                this.controleCarousel = true;
                this.listaDocumentosTemp = [];
                let documentoDTO;

                if (this.isDocumentoDuplicidade) {
                    console.log("Documento Duplicado");

                } else {
                    if (!this.isEdit) {
                        documentoDTO = {
                            origemDocumento: this.selectedOrigem ? this.selectedOrigem : null,
                            pais: this.selectedPais ? this.selectedPais : null,
                            tipoDocumento: this.selectedTipoDocumento ? this.selectedTipoDocumento : null,
                            fotoDocumentoFrente: this.dataDocumentoFrente ? this.dataDocumentoFrente : null,
                            fotoDocumentoVerso: this.dataDocumentoVerso ? this.dataDocumentoVerso : null,
                            numero: this.numero ? this.numero : null,
                            dataVencimento: this.dataVencimento ? this.dataVencimento : null,
                            dataExpedicao: this.dataExpedicao ? this.dataExpedicao : null,
                            isPrincipal: this.isPrincipal ? this.isPrincipal : false,
                            estadoEmissao: this.selectedUF ? this.selectedUF : null,
                            conselho: this.selectedConselho ? this.selectedConselho : null,
                            pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null
                        };

                        if (this.listaDocumentos.length === 0) {
                            documentoDTO.isPrincipal = true;
                        }

                        if (documentoDTO.isPrincipal === true) {
                            this.listaDocumentos.forEach(e => {
                            e.isPrincipal = false;
                            });
                        }

                        if (documentoDTO.isPrincipal && this.listaDocumentos.length > 0) {
                            this.listaDocumentos.unshift(documentoDTO);
                        } else {
                            this.listaDocumentos.push(documentoDTO);
                        }

                        setTimeout(() => {
                            this.listaDocumentos.forEach(e => {
                                this.listaDocumentosTemp.push(e);
                            });
                        }, 1);
                    }

                    if (this.isEdit) {
                        console.log(this.documentoEdicao);

                        documentoDTO = {
                            id: this.documentoEdicao.id ? this.documentoEdicao.id : null,
                            origemDocumento: this.documentoEdicao.origemDocumento ? this.documentoEdicao.origemDocumento : null,
                            pais: this.documentoEdicao.pais ? this.documentoEdicao.pais : null,
                            tipoDocumento: this.documentoEdicao.tipoDocumento ? this.documentoEdicao.tipoDocumento : null,
                            fotoDocumentoFrente: this.dataDocumentoFrente ? this.dataDocumentoFrente : null,
                            fotoDocumentoVerso: this.dataDocumentoVerso ? this.dataDocumentoVerso : null,
                            numero: this.documentoEdicao.numero ? this.documentoEdicao.numero : null,
                            dataVencimento: this.documentoEdicao.dataVencimento ? this.documentoEdicao.dataVencimento : null,
                            dataExpedicao: this.documentoEdicao.dataExpedicao ? this.documentoEdicao.dataExpedicao : null,
                            isPrincipal: this.documentoEdicao.isPrincipal ? this.documentoEdicao.isPrincipal : false,
                            estadoEmissao: this.documentoEdicao.estadoEmissao ? this.documentoEdicao.estadoEmissao : null,
                            conselho: this.documentoEdicao.conselho ? this.documentoEdicao.conselho : null,
                            pontoCadastrador: this.documentoEdicao.pontoCadastrador ? this.documentoEdicao.pontoCadastrador : null
                        };

                        if (documentoDTO.isPrincipal === true) {
                            this.listaDocumentos.forEach(e => {
                                e.isPrincipal = false;
                            });
                        }

                        if (documentoDTO.isPrincipal && this.listaDocumentos.length > 1) {
                            this.listaDocumentos.splice(this.indexEdicao, 1);
                            this.listaDocumentos.unshift(documentoDTO);
                        } else {
                            this.listaDocumentos[this.indexEdicao] = documentoDTO;
                        }

                        setTimeout(() => {
                            this.listaDocumentos.forEach(e => {
                                this.listaDocumentosTemp.push(e);
                            });
                        }, 1);
                    }

                    this.cleanDocumento();
                    this.validaRegistraEntradaButton();

                    // RESOLUÇÃO DE BUG PARA O PIC - A IMAGEM NÃO ATUALIZAVA NO CARROSSEL (CAROUSEL)
                    setTimeout(() => {
                        let valueCPF;

                        valueCPF        = this.numeroCPF;
                        this.numeroCPF  = "";
                        this.numeroCPF  = valueCPF;

                        PIC.refreshWidget("Carousel");
                    }, 1);
                }
            },
            cleanDocumento(foto) {
                this.isPrincipal = false;
                if (foto != 'foto') {
                    this.numero = undefined;
                }
            },
            validaSalvar() {
                if (this.isAdministrador) {
                    if(this.isAlterar){
                        return this.isAlert = false;
                    }
                    if (this.data == null || this.nomeVisitante == null || this.selectedPortaria.id == null || (this.selectedDestino.id == null && this.gabineteDestinoSelecionado == '')) {
                        return this.isAlert = true;
                    } else {
                        return this.isAlert = false;
                    }
                } else {                    

                    if (this.data == null || this.nomeVisitante == null || this.listaDocumentos.length <= 0 || this.selectedPortaria.id == null || (this.selectedDestino.id == null && this.gabineteDestinoSelecionado == '')) {
                        return this.isAlert = true;
                    } else {
                        return this.isAlert = false;
                    }
                }
            },
            validaDocumentoPrincipal: function() {
                let i = 0;
                this.listaDocumentos.forEach(e => {
                    if (e.isPrincipal) {
                        i++;
                    }
                });
                if (i > 1 || i == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            validaAutorizarSalvar() {
                if (this.data == null || this.data == "" || this.nomeVisitante == null || this.selectedPortaria.id == null || (this.selectedDestino.id == null && this.gabineteDestinoSelecionado == '')) {
                    return this.isAlert = true;
                } else {
                    if (this.$perfilUsuario === "Administrador") {
                        this.pontoAutorizador = this.$pontoCadastrador;
                        this.confirmaSalvar();

                    } else {
                        $('#autorizarRestricaoLogin').picModal().show();
                        return this.isAlert = false;
                    }

                }
            },
            validaRegistraEntradaButton() {
                let isCpf = false;
                this.isCpf = false;
                if (this.listaDocumentos.length > 0) {
                    this.listaDocumentos.forEach(e => {
                        if (e.tipoDocumento.descTipoDocumento != this.$cnh && e.tipoDocumento.descTipoDocumento != this.$oab && e.tipoDocumento.descTipoDocumento != this.$dni) {
                            isCpf = true;
                            stop();
                        }
                    });
                    if (!isCpf && !this.numeroCPF) {
                        this.isCpf = true;
                        isCpf = false;
                    } else if (!isCpf && this.numeroCPF && this.isValid && !this.isDuplicidade) {
                        isCpf = true;
                       
                    } else if (!isCpf && this.numeroCPF && (!this.isValid || this.isDuplicidade)) {
                        isCpf = false;
                    }
                }

                if(this.isRestricaoEntrada == true){
                    this.isRegraEntradaAtendida = false;
                    

                }else{
                    if(this.selectedPortaria.id == null){
                        this.isRegraEntradaAtendida = false;
                    }
                    
                    if(this.selectedDestino == null && this.gabineteDestinoSelecionado == ''){
                        this.isRegraEntradaAtendida = false;
                    }

                    if(this.selectedPortaria.id != null && (this.selectedDestino.id != null || this.gabineteDestinoSelecionado != '')){
                        this.isRegraEntradaAtendida = true;
                    }else{
                        this.isRegraEntradaAtendida = false;
                    }
                }

                if((this.data == null || this.data == '') || !isCpf || !this.isRegraEntradaAtendida){
                    this.isRegistraEntrada = false;
                }else{
                    this.isRegistraEntrada = true;
                }

                if(this.isDuplicidade){
                    document.getElementById("authorize-entry").style.display = "none";
                }
                
            },
            confirmaSalvar() {                
                this.nomeVisitante = this.removeEspacoString(this.nomeVisitante);

                let visitanteDTO = {
                    id: this.idVisitante ? this.idVisitante : null,
                    dataCadastro: this.dataCadastro ? this.dataCadastro : null,
                    nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                    cpf: this.numeroCPF ? this.numeroCPF : null,
                    nomeMae: this.nomeMae ? this.nomeMae : null,
                    telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                    fotoVisitante: this.data ? this.data : null,
                    isDocumento: this.isDocumento ? this.isDocumento : null,
                    documentos: this.listaDocumentos ? this.listaDocumentos : null,
                    rejeicaoEntradaDTO: null,
                    isNovoVisitante: this.isNovoVisitante ? this.isNovoVisitante : false,
                    isAlterar: this.isAlterar ? this.isAlterar : false,
                    entrada: {
                        id: this.id ? this.id : null,
                        portaria: this.selectedPortaria ? this.selectedPortaria : null,
                        destino: this.selectedDestino.id != null ? this.selectedDestino : null,
                        idGabinete: this.gabineteDestinoSelecionado ? this.gabineteDestinoSelecionado : null,
                        hostname: this.$hostname ? this.$hostname : null,
                        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                        inexistenciaDocumento: this.inexistenciaDocumento ? this.inexistenciaDocumento : false,
                        pontoAutorizador: this.pontoAutorizador ? this.pontoAutorizador : null,
                        existeRestricao: this.isRestricaoEntrada ? this.isRestricaoEntrada : false,
                        idRestricaoEntrada: this.idRestricaoEntrada ? this.idRestricaoEntrada : null
                    },
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null
                }

                this.validaSalvar();

                if (!this.isAlert) {
                    const now = new Date();

                    this.$http.post(`/visitante`, visitanteDTO).then(
                        function (response) {
                            if (response.status === 201) {
                                this.$router.push({ 
                                    name: 'buscaVisitantes', 
                                    params: { 
                                        msg: "Entrada de " + this.nomeVisitante + " registrada com sucesso às " + String(now.getHours()).padStart(2, "0") + ':' + String(now.getMinutes()).padStart(2, "0") + ':' + String(now.getSeconds()).padStart(2, "0"), 
                                        isSalvo: true 
                                    } 
                                });
                            }
                        }.bind(this)

                    ).catch(function (error) {
                        // handle error
                        console.log(error);
                    }).then(function () {
                        // always executed
                    });
                }
            },
            removeEspacoString(string) {
                return string.replace(/( )+/g, ' ');
            },
            validaCPFValido() {
                this.isValid = true;
                let cpf = this.numeroCPF;

                if (cpf != null) {
                    cpf = cpf.replace(/[^\d]+/g, '');
                    // Elimina CPFs invalidos conhecidos
                    if (cpf.length != 11 ||
                        cpf == "00000000000" ||
                        cpf == "11111111111" ||
                        cpf == "22222222222" ||
                        cpf == "33333333333" ||
                        cpf == "44444444444" ||
                        cpf == "55555555555" ||
                        cpf == "66666666666" ||
                        cpf == "77777777777" ||
                        cpf == "88888888888" ||
                        cpf == "99999999999") {
                        this.isValid = false;
                    }

                    // Valida 1o digito
                    let add = 0;
                    for (let i = 0; i < 9; i++) {
                        add += parseInt(cpf.charAt(i)) * (10 - i);
                    }

                    let rev = 11 - (add % 11);
                    if (rev == 10 || rev == 11) {
                        rev = 0;
                    }
                    if (rev != parseInt(cpf.charAt(9))) {
                        this.isValid = false;
                    }

                    // Valida 2o digito
                    let add1 = 0;
                    for (let i = 0; i < 10; i++) {
                        add1 += parseInt(cpf.charAt(i)) * (11 - i);
                    }
                    rev = 11 - (add1 % 11);
                    if (rev == 10 || rev == 11) {
                        rev = 0;
                    }
                    if (rev != parseInt(cpf.charAt(10))) {
                        this.isValid = false;
                    }
                } else {
                    this.isValid = false;
                }

            },
            validaCPF() {
                this.validaCPFValido();
                if (this.numeroCPF != '' || this.numeroCPF != null) {
                    this.verificarRestricaoEntradaVisitante(this.numeroCPF);
                    this.isRG = false;
                    this.$http
                        .get(`/visitante/validaCPF?parametros=${this.numeroCPF}`)
                        .then(
                            function (response) {
                                if (response.status === 200) {
                                    this.isDuplicidade = true;
                                    
                                } else {
                                    this.isDuplicidade = false;
                                }
                                this.validaRegistraEntradaButton();
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
            carregaEstadosBrasileiros() {
                this.$http
                    .get(`/estado`)
                    .then(
                        function (response) {
                            this.estadosBrasileiros = response.data;
                        }.bind(this)
                    )
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });

                this.selectedUF = this.estadosBrasileiros[0];
            },
            validaRG() {
                if (this.isEdit) {
                    this.numero = this.documentoEdicao.numero;
                    this.selectedUF = this.documentoEdicao.estadoEmissao;
                }
                if (!this.numeroCPF) {
                    this.isRG = true;
                } else {
                    this.isRG = false;
                }

                if(this.dataDocumentoFrente != ''){
                    if (this.isRG) {
                        if ((this.numero != '' && this.numero != null) && this.dataDocumentoFrente != '' &&
                            (this.selectedUF != '' && this.selectedUF != 'Selecione') &&
                            this.isRG && this.selectedPais.namePais != 'Selecione') {
                            this.isConfirmaDocumento = false;
                        } else {
                            this.isConfirmaDocumento = true;
                        }
                    } else {
                        if ((this.numero != '' && this.numero != null) &&
                            (this.selectedUF != '' && this.selectedUF != 'Selecione') &&
                            this.selectedPais.namePais != 'Selecione') {
                            this.isConfirmaDocumento = false;
                        } else if (!this.numero && (!this.selectedUF || this.selectedUF == 'Selecione') &&
                            this.selectedPais.namePais != 'Selecione') {
                            this.isConfirmaDocumento = false;
                        } else {
                            this.isConfirmaDocumento = true;
                        }
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }

                if (this.isDocumentoDuplicidade) {
                    this.isConfirmaDocumento = true;
                }
            },
            changeDocument(foto) {
                if (this.isEdit) {
                    this.selectedTipoDocumento = this.documentoEdicao.tipoDocumento;
                }
                this.isConfirmaDocumento = false;

                if (foto == 'foto') {
                    this.cleanDocumento('foto');
                } else {
                    this.cleanDocumento();
                }

                if (this.selectedTipoDocumento.origem.descOrigem === 'Brasileiro'){

                    if (this.selectedTipoDocumento.descTipoDocumento == this.$titulo_eleitor) {
                        this.validaTituloEleitor();
                    }

                    if (this.selectedTipoDocumento.descTipoDocumento == this.$carteira_trabalho) {
                        this.validaCTPS();
                    }

                    if (this.selectedTipoDocumento.descTipoDocumento == this.$rg) {
                        this.validaRG();
                    }

                    if (this.selectedTipoDocumento.descTipoDocumento == this.$outros) {
                        this.validaOutros();
                    }
                    
                    if (this.selectedTipoDocumento.descTipoDocumento == this.$conselho_classe) {
                        this.validaConselhoClasse();
                    }
                    if (this.selectedTipoDocumento.descTipoDocumento == this.$cnh || this.selectedTipoDocumento.descTipoDocumento == this.$oab || this.selectedTipoDocumento.descTipoDocumento == this.$dni) {
                        this.isConfirmaDocumento = false;
                    }

                }else {
                    this.isConfirmaDocumento = true;

                    if (this.selectedTipoDocumento.descTipoDocumento == this.$passaporte) {
                            this.validaPassaporte();
                    }
                    if (this.selectedTipoDocumento.descTipoDocumento == this.$crnm) {
                        this.validaCrnm();
                    }
                }

                // bloqueia o botão confirmar quando não tiver foto da frente
                if (this.dataDocumentoFrente == '') {
                    this.isConfirmaDocumento = true;
                }
                if (this.isDocumentoDuplicidade) {
                    this.isConfirmaDocumento = true;
                }              

                this.isRG = false;
            },
            validaTituloEleitor() {
                if(this.dataDocumentoFrente != ''){
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                    }
                    if (!this.numero) {
                        this.isNumeroTituloEleitor = true;
                    } else {
                        this.isNumeroTituloEleitor = false;
                    }

                    if (!this.isNumeroTituloEleitor && (this.selectedPais.namePais != '' && this.selectedPais.namePais != 'Selecione')) {
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
            },
            validaCTPS() {
                if(this.dataDocumentoFrente != ''){                
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                        this.selectedUF = this.documentoEdicao.estadoEmissao;
                    }
                    if (!this.numero) {
                        this.isNumeroCTPS = true;
                    } else {
                        this.isNumeroCTPS = false;
                    }

                    if (!this.isNumeroCTPS && (this.selectedUF != null && this.selectedUF != '') &&
                        (this.selectedPais.namePais != '' || this.selectedPais.namePais != 'Selecione')) {
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
            },
            validaOutros() {
                if(this.dataDocumentoFrente != ''){    
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                    }
                    if (!this.numero) {
                        this.isNumeroIdentificador = true;
                    } else {
                        this.isNumeroIdentificador = false;
                    }
                    if (this.numero) {
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
            },
            validaPassaporte() {
                if(this.dataDocumentoFrente != ''){    
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                        this.dataExpedicao = this.documentoEdicao.dataExpedicao;
                        this.dataVencimento = this.documentoEdicao.dataVencimento;
                    }
                    if (!this.numero) {
                        this.isNumeroPassaporte = true;
                    } else {
                        this.isNumeroPassaporte = false;
                    }
                    if (!this.dataExpedicao) {
                        this.isDataExpedicao = true;
                    } else {
                        this.isDataExpedicao = false;
                    }
                    if (!this.dataVencimento) {
                        this.isDataVencimento = true;
                    } else {
                        this.isDataVencimento = false;
                    }
                    if (this.selectedPais.namePais == '' || this.selectedPais.namePais == 'Selecione') {
                        this.isPais = true;
                    } else {
                        this.isPais = false;
                    }

                    if (this.numero && this.dataExpedicao && this.dataVencimento &&
                        (this.selectedPais.namePais != '' && this.selectedPais.namePais != 'Selecione')) {
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }

            },
            validaCrnm() {
                if(this.dataDocumentoFrente != ''){
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                        this.dataExpedicao = this.documentoEdicao.dataExpedicao;
                        this.dataVencimento = this.documentoEdicao.dataVencimento;
                    }
                    if (!this.numero) {
                        this.isNumeroCrnm = true;
                    } else {
                        this.isNumeroCrnm = false;
                    }
                    if (!this.dataExpedicao) {
                        this.isDataExpedicaoCrnm = true;
                    } else {
                        this.isDataExpedicaoCrnm = false;
                    }
                    if (!this.dataVencimento) {
                        this.isDataVencimentoCrnm = true;
                    } else {
                        this.isDataVencimentoCrnm = false;
                    }
                    if (this.selectedPais.namePais === 'Selecione') {
                        this.isPais = true;
                    } else {
                        this.isPais = false;
                    }

                    if (this.numero && this.dataExpedicao && this.dataVencimento &&
                        (this.selectedPais.namePais != 'Selecione' && this.selectedPais.namePais != '')) {
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
            },
            validaConselhoClasse(){
                if(this.dataDocumentoFrente != ''){
                    if(this.isEdit){
                        this.numero = this.documentoEdicao.numero;
                        this.selectedConselho = this.documentoEdicao.conselho;
                        this.selectedUF = this.documentoEdicao.estadoEmissao
                    }

                    if (this.numero != '' && this.selectedConselho != '' && this.selectedUF.id != null){
                        this.isConfirmaDocumento = false;
                    } else {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
            },
            chamarModalListaHomonimos(){
                PIC.activateWidget('Modal', '#modalListaHomonimos');
                $('#modalListaHomonimos').picModal().show();

                setTimeout(()=>{
                    $('.zeroRecords').hide();
                    $('.dataTables_info').hide();
                });
            }
        }, 
        mounted() {
            this.carregaEstadosBrasileiros();
        }
    };
</script>
<style scoped>
    .teste {
        display: flex;
        flex-direction: column;
        padding: 4px;
    }

    .espacamento-tabela {
        margin-top: 10rem;
    }

    .button-busca-margin {
        margin-top: 3rem;
    }

    td.line {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>