<template>
  <span>
    <div class="page-header">
      <h1>Visitante</h1>
    </div>

    <form>
        <div v-show="isAlert" data-pic-alert='{"type": "error"}'>
	        Todos os campos, foto do visitante e o documento e o destino devem estar preenchidos.
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row main-info-container">
                    <div class="col-md-2 text-center photo-avatar-container" data-toggle="modal" data-target="#photoWebcam">
                        <div class="photo-avatar" id="photo-avatar" v-on:click="startup()">
                            <img v-bind:src="this.data" class="photo-webcam" alt="Perfil" />
                        </div>
                    </div>

                    <div class="col-md-8">
                        <div class="row">
                            <template v-if="isControleCpf">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="numeroCPF">CPF</label>
                                        <input type="text" v-model="numeroCPF" v-on:keyup="validaCPF()" v-mask="'###.###.###-##'" masked="false" class="form-control" id="numeroCPF" disabled>
                                        <span class="validacao" v-show="isCpf">CPF Obrigatório para esse tipo de Documento</span>
                                        <span class="validacao" v-show="!isValid && (numeroCPF != null && numeroCPF != '') ">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="numeroCPF">CPF</label>
                                        <input type="text" v-model="numeroCPF" v-on:keyup="validaCPF()" v-mask="'###.###.###-##'" masked="false" class="form-control" id="numeroCPF">
                                        <span class="validacao" v-show="isCpf">CPF Obrigatório para esse tipo de Documento</span>
                                        <span class="validacao" v-show="!isValid && (numeroCPF != null && numeroCPF != '') ">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <div class="col-md-8">
                                <div class="form-group">
                                    <label for="sivis-nome">Nome<span class="requiredLabel">*</span></label>
                                    <input type="text" v-on:keyup="validaRegistraEntradaButton()" v-model="nomeVisitante" class="form-control" id="sivis-nome" disabled>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="col-md-8">
                        <div class="row">
                            <span v-for="document in this.listaDocumentos" :key="document.id">
                                <div v-if="document.isPrincipal && validaApresentacaoInputDocumento(document)">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="sivis-identificacao">{{document.tipoDocumento.descTipoDocumento.toUpperCase()}}</label>
                                            <input type="text" v-bind:value="document.numero" class="form-control" id="sivis-identificacao" disabled>                        
                                        </div>
                                    </div>
                                </div>
                            </span>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="sivis-telefone">Telefone</label>
                                    <input type="text" v-on:keyup="validaRegistraEntradaButton()" v-model="numeroTel" v-mask="['(##) ####-####', '(##) #####-####']" class="form-control" id="sivis-telefone" disabled>                        
                                </div>                      
                            </div>



                            <div class="col-md-12" id="agent-message">
                                Necessita autorização de entrada pelo agente.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row margin-top-row">
            <div class="col-md-6">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h2>Documentos</h2>
                    </div>
                    <div v-show="!controleCarousel" class="panel-body">
                        <div class="row">

                            <div class="col-md-12" id="document-tabs-container">
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

                                        <div id="rowDocumento" class="row" style="cursor: pointer" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('editar', e, index);startupDocumentoVerso();montaComboOrigem('editar')">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento"/>
                                                    </div>

                                                    <div class="col-md-3">
                                                        <template v-if="e.fotoDocumentoVerso">
                                                            <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento"/>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" v-model="isDocumento" v-on:change="showDocument"> Sem documento de identificação
                                    </label>
                                </div>
                            </div>

                            <div class="col-md-6" id="document-button-container">
                                <button type="button" class="btn btn-secondary pull-right" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('novo', null, null);montaComboOrigem('novo')">Novo documento</button>
                            </div>

                        </div>
                    </div>
                    <div v-show="controleCarousel" class="panel-body">
                        <div class="row">

                            <div class="col-md-12" id="document-tabs-container">
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

                                        <div id="rowDocumento" class="row" style="cursor: pointer" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('editar', e, index);startupDocumentoVerso();montaComboOrigem('editar')">
                                            <div class="col-md-12">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento"/>
                                                    </div>

                                                    <div class="col-md-3">
                                                        <template v-if="e.fotoDocumentoVerso">
                                                            <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento"/>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" v-model="isDocumento" v-on:change="showDocument"> Sem documento de identificação
                                    </label>
                                </div>
                            </div>

                            <div class="col-md-6" id="document-button-container">
                                <button type="button" class="btn btn-secondary pull-right" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('novo', null, null);montaComboOrigem('novo')">Novo documento</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
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
                                    <label for="local">Local<span class="requiredLabel">*</span></label>
                                    <select v-model="selectedDestino" @change="validaRegistraEntradaButton(); selecionarLocalDestino();" class="form-control" id="local">
                                        <option v-for="e in this.listaDestino" :key="e.id" :value="e">{{e.nomeDestino}}</option>
                                    </select>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                                </div> 
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="Gabinete">Gabinete</label>
                                    <input type="text" id="gabinete-destino" v-model="this.descGabineteSelecionado" @blur="selecionarGabineteDestino(); validaRegistraEntradaButton();" class="form-control" data-pic-autocomplete='{"source":"#listaGabiente", "sourceType":"hidden", "type":"suggestion"}'>
                                    <input type="hidden" id="listaGabiente" :value="listaGabinetes">
                                </div>
                            </div>
                            
                        </div>    
                    </div>
                </div>

                <div class="col-md-4">            
                    <h2>
                        
                    </h2>            
                </div>
            </div>

        </div>

        <div class="row margin-top-row margin-bottom-row">
            <div class="col-md-12">
                <button type="button" v-if="$auth('REGISTRAR_ENTRADA_DE_VISITANTE')" :disabled="!isRegistraEntrada" v-on:keyup="validaRegistraEntradaButton()" @click="confirmaAlterar()" class="btn btn-primary button-busca-margin pull-right">Confirmar Entrada</button>
                <button type="button" class="btn btn-secondary pull-right" id="authorize-entry" data-toggle="modal" data-target="#authorize-entry-modal">Autorizar entrada</button>
            </div>
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
                <button type="submit" class="btn btn-primary" v-on:click="setAvatar(); validaRegistraEntradaButton()">Confirmar</button>
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

                                    <template >
                                        <div v-if="!isEdit" class="camera text-center" v-show="isFotoDocumentoFrente">
                                            <canvas id="canvasDocumentoFrente"></canvas>
                                            <img id="photoDocumentoFrente" alt="Foto do Avatar">
                                        </div>
                                    </template>

                                    <template >
                                        <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoFrente">
                                            <canvas id="canvasDocumentoFrente"></canvas>
                                            <img id="photoDocumentoFrente" v-bind:src="documentoEdicao.fotoDocumentoFrente" width="347rem" height="260.25rem" alt="Foto do Avatar">
                                        </div>
                                    </template>

                                </div>

                                <template v-if="!isEdit">
                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoFrente();startupDocumentoVerso()"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoFrente('novo', null, null)"><i class="fas fa-redo"></i></button>
                                    </div>
                                </template>

                                <template v-if="isEdit">
                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoFrente();startupDocumentoVersoEditar('frente')"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoFrenteEditar(null, null)"><i class="fas fa-redo"></i></button>
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

                                    <template >
                                        <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoVerso">
                                            <canvas id="canvasDocumentoVerso"></canvas>
                                            <img id="photoDocumentoVerso" v-bind:src="documentoEdicao.fotoDocumentoVerso" width="347rem" height="260.25rem" alt="Foto do Avatar">
                                        </div>
                                    </template>
                                </div>

                                <template v-if="!isEdit">
                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoVerso()"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoVerso()"><i class="fas fa-redo"></i></button>
                                    </div>
                                </template>

                                <template v-if="isEdit">
                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoVerso()"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoVersoEditar('verso')"><i class="fas fa-redo"></i></button>
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
                                <select v-model="selectedOrigem" @change="onChangePaises(); catchEvent($event); changeDocument(); verificaDuplicidadeTipoDocumento()" class="form-control" id="origem" name="origem">
                                    <option v-for="(e, key) in listaOrigem" :key="key" :value="e" selected>{{e.descOrigem.toUpperCase()}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6" v-if="isEdit">
                            <div class="form-group">
                                <label for="origem">Origem</label>
                                <select v-model="documentoEdicao.origemDocumento" @change="onChangePaises(); catchEvent($event); changeDocument(); verificaDuplicidadeTipoDocumento()" class="form-control" id="origem" name="origem">
                                    <option v-for="(e, key) in listaOrigem" :key="key" :value="e" selected>{{e.descOrigem.toUpperCase()}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6" v-if="!isEdit">
                            <div class="form-group">
                                <label for="pais">País</label>
                                <select v-model="selectedPais" @change="catchEventCountry($event); validaCrnm(); validaPassaporte()" class="form-control" id="pais" name="pais">
                                    <option v-for="(e, key) in listaPaises" :key="key" :value="e" selected >{{e.namePais}}</option>
                                </select>
                                <span class="validacao" v-show="selectedPais.namePais == 'Selecione' || selectedPais == ''">Campo obrigatório</span>
                            </div>
                        </div>

                        <div class="col-md-6" v-if="isEdit">
                            <div class="form-group">
                                <label for="pais">País</label>
                                <select v-model="documentoEdicao.pais" @change="catchEventCountry($event); validaCrnm(); validaPassaporte()" class="form-control" id="pais" name="pais">
                                    <option v-for="(e, key) in listaPaises" :key="key" :value="e" selected >{{e.namePais}}</option>
                                </select>
                                <span class="validacao" v-show="documentoEdicao.pais.namePais == 'Selecione' || documentoEdicao.pais.namePais == ''">Campo obrigatório</span>
                            </div>
                        </div>

                        <template>
                            <div class="col-md-6">
                                <div class="form-group" v-if="!isEdit">
                                    <label for="tipo-do-documento">Tipo do Documento</label>
                                    <select v-model="selectedTipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event);changeDocument(); verificaDuplicidadeTipoDocumento()">
                                        <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key">{{ e.descTipoDocumento.toUpperCase() }}</option>
                                    </select>
                                </div>                                
                                <div class="form-group" v-if="isEdit">
                                    <label for="tipo-do-documento">Tipo do Documento</label>
                                    <select v-model="documentoEdicao.tipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event);changeDocument()">
                                        <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key">{{ e.descTipoDocumento.toUpperCase() }}</option>
                                    </select>
                                </div>
                            </div>
                        </template>

                        <template v-if="tipoDocumentoSelecionado === 'RG'">
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

                        <template v-else-if="tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'">
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

                        <template v-else-if="tipoDocumentoSelecionado === 'PASSAPORTE' || tipoOrigemSelecionado === 'MERCOSUL' || tipoOrigemSelecionado === 'ESTRANGEIRO'">
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
                                    <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                                    <input :disabled="isDocumentoDuplicidade" type="date" v-model="dataExpedicao" :max="formatDateInput()" @change="validaPassaporte" class="form-control" id="numero-data-expedicao-sivis">
                                    <span class="validacao" v-show="isDataExpedicao && !isDocumentoDuplicidade">Campo obrigatório</span>
                                </div>
                                <div class="form-group" v-if="isEdit">
                                    <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                                    <input type="date" v-model="documentoEdicao.dataExpedicao" :max="documentoEdicao.dataVencimento" @change="validaPassaporte" class="form-control" id="numero-data-expedicao-sivis">
                                    <span class="validacao" v-show="isDataExpedicao && !isDocumentoDuplicidade">Campo obrigatório</span>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group" v-if="!isEdit">
                                    <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                                    <input :disabled="isDocumentoDuplicidade" type="date" v-model="dataVencimento" :min="formatDateInput()" @change="validaPassaporte" class="form-control" id="numero-data-vencimento-sivis">
                                    <span class="validacao" v-show="isDataVencimento && !isDocumentoDuplicidade">Campo obrigatório</span>
                                </div>
                                <div class="form-group" v-if="isEdit">
                                    <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                                    <input type="date" v-model="documentoEdicao.dataVencimento" :min="documentoEdicao.dataExpedicao" @change="validaPassaporte" class="form-control" id="numero-data-vencimento-sivis">
                                    <span class="validacao" v-show="isDataVencimento && !isDocumentoDuplicidade">Campo obrigatório</span>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="tipoDocumentoSelecionado === 'CRNM'">
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

                        <template v-else-if="tipoDocumentoSelecionado === 'TITULO DE ELEITOR'">
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

                        <template v-else-if="tipoDocumentoSelecionado === 'CONSELHO DE CLASSE'">
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

                        <template v-else-if="!isEdit && tipoDocumentoSelecionado === 'OUTROS'">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="numero-outros-sivis">Identificador</label>
                                    <input type="text" v-mask="'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'" v-model="numero" @keyup="validaOutros" class="form-control" id="numero-outros-sivis" placeholder="Número">
                                    <span class="validacao" v-show="isNumeroIdentificador">Campo obrigatório</span>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="isEdit && tipoDocumentoSelecionado === 'OUTROS'">
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
                <button v-if="!isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary" :disabled="isConfirmaDocumento || isDocumentoDuplicidade" @click="addDocumento();">Adicionar</button>
                <button v-if="isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary" :disabled="isConfirmaDocumento || isDocumentoDuplicidade" @click="addDocumento();">Atualizar</button>
            </div>
        </form>
    </div>
    
    <div data-pic-modal='{"title": "Autorizar Entrada", "dialog": "default"}' id="authorize-entry-modal">
        <form>
           <div class="col-md-2">
                <div class="form-group">
                    <label for="ponto">Ponto</label>
                    <input type="text" class="form-control" id="ponto">
                </div>
           </div>

           <div class="col-md-10">
                <div class="form-group">
                    <label for="nome-agente">Nome do agente</label>
                    <input type="text" class="form-control" id="nome-agente">
                </div>
           </div>

           <div class="col-md-12">
                <div class="form-group">
                    <label for="senha-agente">Senha do agente</label>
                    <input type="password" class="form-control" id="senha-agente">
                </div>
  
           </div>

           <div class="col-md-12">
                <div class="form-group">
                    <label for="justificativa-agente">Justificativa do agente</label>
                    <textarea class="form-control" id="justificativa-agente" rows="4"></textarea>
                </div>
           </div>

           <div class="buttons">
                <button type="submit" class="btn btn-primary">Autorizar Entrada</button>
                <button type="submit" class="btn btn-secondary">Rejeitar Entrada</button>
            </div>
        </form>
    </div>

  </span>
</template>

<script>
    // import Tabs from '../components/Tabs.vue';
    import {mask} from 'vue-the-mask'
    export default {
    name: "Visitante",
    directives: {mask},
    props:{
        visitante: Object,
        isSalvo: Boolean
    },    
    data() {
        return {
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
            listaLocal:[],
            lista: [],
            listaOrigem: [],
            listaPaises:'',
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
            listaDocumentosTemp: new Array(),
            mensagem: '',
            //GERAL
            nomeMae: '',
            tipoDocumentoSelecionado: 'RG',
            tipoOrigemSelecionado: '',
            tipoPaisSelecionado: '',
            listaTipoDocumentoOutros: ['PASSAPORTE', 'CNRM', 'OUTROS'],
            numeroCPF: null,
            numero: null,
            dataVencimento: null,
            dataExpedicao: null,
            selectedEstado: null,
            selectedConselho: '',
            selectedDestino: {
                id: null,
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
            controleCarousel: false,
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
            isControleCpf: false,
            listaGabinetes: [],
            listaGabinetesSelecionado: [],
            gabineteDestinoSelecionado: '',
            isRegraEntradaAtendida: false,

            descGabineteSelecionado: ''
            
        }
    },
    created:function(){
        this.buscarListaGabinetes();

        if(this.visitante){
            this.id = this.visitante.id;
            this.data = this.visitante.fotoVisitante;
            this.nomeVisitante = this.visitante.nomeVisitante;
            this.numeroCPF = this.visitante.cpf;
            this.numeroTel = this.visitante.telefoneVisitante;
            this.isFotoVisitanteVencida = this.visitante.isFotoVisitanteVencida;

            if(this.numeroCPF){
                this.isControleCpf = true;
            }

            this.$http
            .get(`/documento?parametros=${this.id}`)
            .then(
            function(response) {
                    response.data.forEach(e => {
                        let documentoDTO = {
                            id: e.id ? e.id : null,
                            origemDocumento: e.origemDocumento ? e.origemDocumento: null,
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
                            fotoDocumentoVerso: e.fotoDocumentoVerso ? e.fotoDocumentoVerso: null,
                            pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                            dataCadastro: e.dataCadastro ? e.dataCadastro : null
                        };
                        this.listaDocumentos.push(documentoDTO);
                        console.log(this.listaDocumentos);
                        setTimeout( ()=> {
                            PIC.refreshWidget('Carousel');
                        }, 0.1);
                    });
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

        this.$http.get(`/portaria`).then(
            function(response) {
                this.listaPortaria = response.data;

                this.listaPortaria.unshift(this.selecionar);
                this.selectedPortaria = this.listaPortaria[0];

                this.listaDestino.unshift(this.selecionarDestinos);
                this.selectedDestino = this.listaDestino[0];

            }.bind(this)

        ).catch(function(error) {
            // handle error
            console.log(error);
        });
    },
    methods: {
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
        validaApresentacaoInputDocumento: function(document){
            return document.tipoDocumento.descTipoDocumento !== 'cnh' || document.tipoDocumento.descTipoDocumento !== 'oab' || document.tipoDocumento.descTipoDocumento !== 'dni' || document.tipoDocumento.descTipoDocumento !== 'conselho de classe';
        },
        selecionarPortariaDestino(){
            if(this.selectedPortaria.descricaoPortaria == 'Selecione'){
                this.descGabineteSelecionado = '';
                this.selectedDestino = this.selecionarDestinos;
                
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

                this.selectedDestino = null;

                this.isRegistraEntrada = true;
            }else{                    
                $('#local').attr('disabled', false);

                this.gabineteDestinoSelecionado = '';

                this.isRegistraEntrada = false;
            }

            this.listaGabinetes = JSON.stringify(this.listaGabinetes);
        },       
        validaCheckboxIsPricipal(event){
            if(event.target.checked){
                this.listTemp = JSON.parse(JSON.stringify(this.listaDocumentos));
                this.listaDocumentos.forEach(e => {
                    e.isPrincipal = false;
                });
            }else{
                this.listaDocumentos = this.listTemp;
            }
        },
        formatDateInput(){
            let data = new Date();
            return data.getUTCFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate();
        },
        onChangeLocal(){
            if(this.selectedPortaria.descricaoPortaria == 'Selecione'){
                
                if(this.listaDestino[0].id != null){
                    this.listaDestino.unshift(this.selecionarDestinos);
                }

            }else{
                this.listaDestino = this.selectedPortaria.destinos;
                
                this.listaDestino.sort(function (a, b) {
                    if(a.nomeDestino != 'Selecione' && b.nomeDestino != 'Selecione'){
                        if (a.nomeDestino > b.nomeDestino) {
                            return 1;
                        }
                        if (a.nomeDestino < b.nomeDestino) {
                            return -1;
                        }
                    }
                    return 0;
                });

                if(this.listaDestino[0].id != null){
                    this.listaDestino.unshift(this.selecionarDestinos);
                }
            }
        },
        confirmaAlterar(){
            const now = new Date();
            this.nomeVisitante = this.removeEspacoString(this.nomeVisitante);
            let visitanteDTO = {
                id: this.id ? this.id : null,
                nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                cpf: this.numeroCPF ? this.numeroCPF : null,
                telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                fotoVisitante: this.data ? this.data : null,
                isDocumento: this.isDocumento ? this.isDocumento : null,
                documentos: this.listaDocumentos ? this.listaDocumentos : null,
                pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                rejeicaoEntradaDTO: null,
                isAlterar: false,
                isNovoVisitante: false,
                entrada: {
                    portaria: this.selectedPortaria ? this.selectedPortaria : null,
                    destino: this.selectedDestino ? this.selectedDestino : null,
                    idGabinete: this.gabineteDestinoSelecionado ? this.gabineteDestinoSelecionado : null,
                    hostname: this.$hostname ? this.$hostname : null,
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                    inexistenciaDocumento: false,
                    existeRestricao: false,
                }
            }
            this.$http
                .post(`/visitante`, visitanteDTO)
                .then(function(response) {
                    this.listaTipoDocumento = response.data;
                    this.selectedTipoDocumento = this.listaTipoDocumento[0];
                    if(response.status === 201){
                        this.$router.push({ name: 'buscaVisitantes', params: { msg: "Entrada de " + this.nomeVisitante + " registrada com sucesso às " + String(now.getHours()).padStart(2, "0") + ':' + String(now.getMinutes()).padStart(2, "0") + ':' + String(now.getSeconds()).padStart(2, "0"), isSalvo: true }});
                    }
                    
                }.bind(this)
                )
                .catch(function(error) {
                // handle error
                console.log(error);
                // this.isError = true;
                // this.mensagem = "Algum erro inesperado aconteceu"
                })
                .then(function() {
                // always executed
                });
        },
        // AQUI
        validarCPF() {
            let cpf = this.numeroCPF;	
            cpf = cpf.replace(/[^\d]+/g,'');	
            if(cpf == '') return this.isValid = false;
            
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
                cpf == "99999999999")
                return this.isValid = false;
                
            // Valida 1o digito	
            add = 0;	
            for (i=0; i < 9; i ++)		
                add += parseInt(cpf.charAt(i)) * (10 - i);	
                rev = 11 - (add % 11);	
                if (rev == 10 || rev == 11)		
                    rev = 0;	
                if (rev != parseInt(cpf.charAt(9)))		
                    return this.isValid = false;
                            
            // Valida 2o digito
            add = 0;	
            for (i = 0; i < 10; i ++)		
                add += parseInt(cpf.charAt(i)) * (11 - i);	
            rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)	
                rev = 0;	
            if (rev != parseInt(cpf.charAt(10)))
                return this.isValid = false;		
            return this.isValid = true;   
        },  
        catchEvent (event) {
            this.tipoDocumentoSelecionado = event.target.options[event.target.options.selectedIndex].text
            this.tipoOrigemSelecionado = event.target.options[event.target.options.selectedIndex].text


            if (this.tipoOrigemSelecionado === "BRASILEIRO") {
                this.tipoDocumentoSelecionado = 'RG'
            }

            this.numero = '';
            this.selectedUF = '';
            this.dataExpedicao = '';
            this.dataVencimento = '';
            if(this.isEdit){
                this.documentoEdicao.numero = '';
                this.documentoEdicao.dataExpedicao = '';
                this.documentoEdicao.dataVencimento = '';
                this.documentoEdicao.estadoEmissao = '';
            }
            this.isValid = true;
        },
        catchEventCountry(event) {
            this.isEdit ? this.tipoPaisSelecionado = this.documentoEdicao.pais.namePais : this.tipoPaisSelecionado = event.target.options[event.target.options.selectedIndex].text;
            if(this.isEdit){
                this.selectedPais = this.documentoEdicao.pais
            }
            let outros = {
                id: 11,
                descTipoDocumento: 'outros',
                origem:{
                    id: 2,
                    descOrigem: 'Estrangeiro'
                }
            }

            if (this.tipoPaisSelecionado === "ARGENTINA (Mercosul)" || this.tipoPaisSelecionado === "PARAGUAI (Mercosul)" || this.tipoPaisSelecionado === "URUGUAI (Mercosul)" || this.tipoPaisSelecionado === "VENEZUELA (Mercosul)") {
                if(this.listaTipoDocumento.length < 3){
                    this.listaTipoDocumento.push(outros);
                }
            }else{
                if(this.listaTipoDocumento.length == 3){
                    var index = this.listaTipoDocumento.indexOf(outros)
                    this.listaTipoDocumento.splice(index, 1);
                }
            }
        },
        converterBase64ToByte(base64){
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

            navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) =>{
                this.video.srcObject = stream;
                this.video.play();
            })
            .catch((err) =>{
                console.log("An error occurred: " + err);
            });

            this.video.addEventListener('canplay', () =>{
            if (!this.streaming) {
                this.height = this.video.videoHeight / (this.video.videoWidth/this.width);
                if (isNaN(this.height)) {
                    this.height = this.width / (4/3);
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
        //DOCUMENTO FRENTE
        startupDocumentoFrente(tipo, elemento, index) {
            this.isDocumentoDuplicidade = false;

            this.isRG = false;
            if(tipo == 'editar'){
                this.isEdit = true;
                this.indexEdicao = index;
                this.documentoEdicao = elemento;
                this.selectedPais = elemento.pais;
                this.selectedUF = elemento.estadoEmissao;
                this.tipoDocumentoSelecionado = elemento.tipoDocumento;
                this.dataDocumentoFrente = elemento.fotoDocumentoFrente;
                this.dataDocumentoVerso =  elemento.fotoDocumentoVerso ? elemento.fotoDocumentoVerso : null;
                this.isVideoDocumentoFrente = false;
                this.isFotoDocumentoFrente = true;
                this.isPrincipal = elemento.isPrincipal;

                if (elemento.fotoDocumentoVerso == null) {
                    this.isDocumentoVerso = false;
                } else {
                    this.isDocumentoVerso = true;
                }
            }
            if(tipo == 'novo'){
                this.isVideoDocumentoFrente = true;
                this.isFotoDocumentoFrente = false;
                this.disableForm();
                documentoVersoContainer.style.display = "none";
            }

            this.videoDocumentoFrente = document.getElementById('videoDocumentoFrente');
            this.canvasDocumentoFrente = document.getElementById('canvasDocumentoFrente');
            this.photoDocumentoFrente = document.getElementById('photoDocumentoFrente');

            navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) =>{
                this.videoDocumentoFrente.srcObject = stream;
                this.videoDocumentoFrente.play();
            })
            .catch((err) =>{
                console.log("An error occurred: " + err);
            });

            this.videoDocumentoFrente.addEventListener('canplay', () =>{
            if (!this.streamingDocumentoFrente) {
                this.heightDocumentoFrente = this.videoDocumentoFrente.videoHeight / (this.videoDocumentoFrente.videoWidth/this.widthDocumentoFrente);
                if (isNaN(this.heightDocumentoFrente)) {
                    this.heightDocumentoFrente = this.widthDocumentoFrente / (4/3);
                }
                this.videoDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                this.videoDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                this.canvasDocumentoFrente.setAttribute('width', this.widthDocumentoFrente);
                this.canvasDocumentoFrente.setAttribute('height', this.heightDocumentoFrente);
                this.streamingDocumentoFrente = true;
            }
            }, false);

            if(this.isEdit){
                this.enableForm();
            }
        },
        //DOCUMENTO FRENTE EDITAR
        startupDocumentoFrenteEditar(elemento, index) {

            this.isVideoDocumentoFrente = true;
            this.isFotoDocumentoFrente = false;
            this.dataDocumentoFrente = '';

            this.videoDocumentoFrente = document.getElementById('videoDocumentoFrente');
            this.canvasDocumentoFrente = document.getElementById('canvasDocumentoFrente');
            this.photoDocumentoFrente = document.getElementById('photoDocumentoFrente');

            navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) =>{
                this.videoDocumentoFrente.srcObject = stream;
                this.videoDocumentoFrente.play();
            })
            .catch((err) =>{
                console.log("An error occurred: " + err);
            });

            this.videoDocumentoFrente.addEventListener('canplay', () =>{
            if (!this.streamingDocumentoFrente) {
                this.heightDocumentoFrente = this.videoDocumentoFrente.videoHeight / (this.videoDocumentoFrente.videoWidth/this.widthDocumentoFrente);
                if (isNaN(this.heightDocumentoFrente)) {
                    this.heightDocumentoFrente = this.widthDocumentoFrente / (4/3);
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
        verificaDuplicidadeTipoDocumento(){
            this.isDocumentoDuplicidade = false;
            // bloqueia o botão confirmar quando houver duplicidade de tipo de documento
            if(this.listaDocumentos.length > 0 ){
                let descTipoDocumentoSelecionado = this.isEdit ? this.documentoEdicao.descTipoDocumento : this.selectedTipoDocumento.descTipoDocumento;
                this.listaDocumentos.forEach(e => {
                    if(e.tipoDocumento.descTipoDocumento == descTipoDocumentoSelecionado){
                        if((e.tipoDocumento.descTipoDocumento == 'passaporte' || e.tipoDocumento.descTipoDocumento == 'crnm') && this.$moment(e.dataVencimento).isBefore(moment(), 'day')){
                            this.isDocumentoDuplicidade = false;
                        }else{
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
            document.getElementById("origem").disabled = true;
            document.getElementById("pais").disabled = true;
            document.getElementById("tipo-do-documento").disabled = true;
            if(document.getElementById("isPrincipal")){
                document.getElementById("isPrincipal").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'RG'){
                document.getElementById("numero-rg-sivis").disabled = true;
                document.getElementById("uf-rg-sivis").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'){
                document.getElementById("numero-carteira-de-trabalho-sivis").disabled = true;
                document.getElementById("estado-carteira-de-trabalho-sivis").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'PASSAPORTE'){
                document.getElementById("numero-passaporte-sivis").disabled = true;
                document.getElementById("numero-data-expedicao-sivis").disabled = true;
                document.getElementById("numero-data-vencimento-sivis").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'CRNM'){
                document.getElementById("numero-data-expedicao-sivis").disabled = true;
                document.getElementById("numero-data-vencimento-sivis").disabled = true;
                document.getElementById("numero-crnm").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'TITULO DE ELEITOR'){
                document.getElementById("numero-inscricao-sivis").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'CONSELHO DE CLASSE'){
                document.getElementById("numero-conselho-de-classe-sivis").disabled = true;
                document.getElementById("estado-conselho-responsavel-sivis").disabled = true;
                document.getElementById("estado-conselho-sivis").disabled = true;
            }
            if(this.tipoDocumentoSelecionado === 'OUTROS'){
                document.getElementById("numero-outros-sivis").disabled = true;
            }
        },
        // HABILITAR CAMPOS
        enableForm() {
            document.getElementById("origem").disabled = false;
            document.getElementById("pais").disabled = false;
            document.getElementById("tipo-do-documento").disabled = false;
            if(document.getElementById("isPrincipal")){
                document.getElementById("isPrincipal").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'RG'){
                document.getElementById("numero-rg-sivis").disabled = false;
                document.getElementById("uf-rg-sivis").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'){
                document.getElementById("numero-carteira-de-trabalho-sivis").disabled = false;
                document.getElementById("estado-carteira-de-trabalho-sivis").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'PASSAPORTE'){
                document.getElementById("numero-passaporte-sivis").disabled = false;
                document.getElementById("numero-data-expedicao-sivis").disabled = false;
                document.getElementById("numero-data-vencimento-sivis").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'CRNM'){
                document.getElementById("numero-data-expedicao-sivis").disabled = false;
                document.getElementById("numero-data-vencimento-sivis").disabled = false;
                document.getElementById("numero-crnm").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'TITULO DE ELEITOR'){
                document.getElementById("numero-inscricao-sivis").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'CONSELHO DE CLASSE'){
                document.getElementById("numero-conselho-de-classe-sivis").disabled = false;
                document.getElementById("estado-conselho-responsavel-sivis").disabled = false;
                document.getElementById("estado-conselho-sivis").disabled = false;
            }
            if(this.tipoDocumentoSelecionado === 'OUTROS'){
                document.getElementById("numero-outros-sivis").disabled = false;
            }
        },
        //DOCUMENTO VERSO
        startupDocumentoVerso() {
            documentoVersoContainer.style.display = "block";
            if(this.isEdit){
                if(this.dataDocumentoVerso){
                    this.isVideoDocumentoVerso = false;
                    this.isFotoDocumentoVerso = true;
                } else {
                    this.isVideoDocumentoVerso = true;
                    this.isFotoDocumentoVerso = false;
                }
            }else{
                this.isVideoDocumentoVerso = true;
                this.isFotoDocumentoVerso = false;
            }

            this.videoDocumentoVerso = document.getElementById('videoDocumentoVerso');
            this.canvasDocumentoVerso = document.getElementById('canvasDocumentoVerso');
            this.photoDocumentoVerso = document.getElementById('photoDocumentoVerso');

            navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) =>{
                this.videoDocumentoVerso.srcObject = stream;
                this.videoDocumentoVerso.play();
            })
            .catch((err) =>{
                console.log("An error occurred: " + err);
            });

            this.videoDocumentoVerso.addEventListener('canplay', () =>{
            if (!this.streamingDocumentoVerso) {
                this.heightDocumentoVerso = this.videoDocumentoVerso.videoHeight / (this.videoDocumentoVerso.videoWidth/this.widthDocumentoVerso);
                if (isNaN(this.heightDocumentoVerso)) {
                    this.heightDocumentoVerso = this.widthDocumentoVerso / (4/3);
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
            if(tipo == 'verso'){
                controleFotoVerso = false;
            }

            if(this.isEdit){
                if(this.dataDocumentoVerso && controleFotoVerso){
                    this.isVideoDocumentoVerso = false;
                    this.isFotoDocumentoVerso = true;
                } else {
                    this.isVideoDocumentoVerso = true;
                    this.isFotoDocumentoVerso = false;
                }
            }else{
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

            navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then((stream) =>{
                this.videoDocumentoVerso.srcObject = stream;
                this.videoDocumentoVerso.play();
            })
            .catch((err) =>{
                console.log("An error occurred: " + err);
            });

            this.videoDocumentoVerso.addEventListener('canplay', () =>{
            if (!this.streamingDocumentoVerso) {
                this.heightDocumentoVerso = this.videoDocumentoVerso.videoHeight / (this.videoDocumentoVerso.videoWidth/this.widthDocumentoVerso);
                if (isNaN(this.heightDocumentoVerso)) {
                    this.heightDocumentoVerso = this.widthDocumentoVerso / (4/3);
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
        showDocument() {
            var documentButtonContainer = document.getElementById("document-button-container");
            var documentTabsContainer = document.getElementById("document-tabs-container");
            var agentMessage = document.getElementById("agent-message");
            var authorizeEntry = document.getElementById("authorize-entry");

            if (documentButtonContainer.style.display === "none") {
                documentButtonContainer.style.display = "block";
            } else {
                documentButtonContainer.style.display = "none";
            }

            if (documentTabsContainer.style.display === "none") {
                documentTabsContainer.style.display = "block";
            } else {
                documentTabsContainer.style.display = "none";
            }

            if (agentMessage.style.display === "block") {
                agentMessage.style.display = "none";
            } else {
                agentMessage.style.display = "block";
            }

            if (authorizeEntry.style.display === "block") {
                authorizeEntry.style.display = "none";
            } else {
                authorizeEntry.style.display = "block";
            }
        },
        isInteger(campoPesquisa){
            let d = true;
            if(campoPesquisa){
                if (!campoPesquisa[0].match("^[a-zA-Z]{1,25}$")) {
                    d = false;
                }
                return d;
            }
        },
        montaComboOrigem(tipo){
            if(tipo == 'novo'){
                this.isEdit = false;
            }

            this.isEdit ? this.tipoDocumentoSelecionado = this.documentoEdicao.tipoDocumento.descTipoDocumento.toUpperCase() : this.tipoDocumentoSelecionado = 'RG';

            this.$http
                .get(`/origem`)
                .then(function(response) {
                    this.listaOrigem = response.data;
                    this.selectedOrigem = this.listaOrigem[0];
                    this.onChangePaises();
                }.bind(this)
                )
                .catch(function(error) {
                // handle error
                console.log(error);
                })
                .then(function() {
                // always executed
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

            if(this.listaDocumentos.length > 0 ){
                this.listaDocumentos.forEach(e => {
                    if(e.cpf && !this.numeroCPF){
                        this.numeroCPF = e.cpf;
                    }
                });
            }

            if(this.isEdit){
                this.isConfirmaDocumento = false;
            }

        },
        onChangePaises(){
            if(this.isEdit){
                this.onChangeTipoDocumento(this.documentoEdicao.origemDocumento.descOrigem)
                this.$http
                    .get(`/paises/`+this.documentoEdicao.origemDocumento.descOrigem.toLowerCase())
                    .then(function(response) {
                        this.listaPaises = response.data;
                        if (this.documentoEdicao.origemDocumento.descOrigem === 'Brasileiro' ) {
                            this.selectedPais = this.listaPaises[0];
                        }else{
                            this.listaPaises.unshift({namePais: 'Selecione'});
                            this.selectedPais = this.listaPaises[0];
                        }
                        this.catchEventCountry('');
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
                this.onChangeTipoDocumento(this.selectedOrigem.descOrigem)
                this.$http
                    .get(`/paises/`+this.selectedOrigem.descOrigem.toLowerCase())
                    .then(function(response) {
                        this.listaPaises = response.data;
                        if (this.selectedOrigem.descOrigem === 'Brasileiro' ) {
                            this.selectedPais = this.listaPaises[0];
                        }else{
                            this.listaPaises.unshift({namePais: 'Selecione'});
                            this.selectedPais = this.listaPaises[0];
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
        onChangeTipoDocumento(origem){
            this.$http
                .get(`/tipoDocumento?parametros=${origem}`)
                .then(function(response) {
                    this.listaTipoDocumento = response.data;
                    this.selectedTipoDocumento = this.listaTipoDocumento[0];
                    this.verificaDuplicidadeTipoDocumento();
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
        converterDate(date){
            if(date){
                var dt = date.split('/');
                var data = new Date(dt[2], dt[1] - 1, dt[0]);
            }
            return data;
        },
        addDocumento(){
            this.controleCarousel = true;
            this.listaDocumentosTemp = [];
            let documentoDTO;

            if(this.isDocumentoDuplicidade) {
                console.log('Documento Duplicado')
            } else {
                if(!this.isEdit){
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

                    if(documentoDTO.isPrincipal && this.listaDocumentos.length > 0) {
                        this.listaDocumentos.unshift(documentoDTO);
                    } else {
                        this.listaDocumentos.push(documentoDTO);
                    }

                    setTimeout( ()=> {
                        this.listaDocumentos.forEach(e => {
                            this.listaDocumentosTemp.push(e);
                        });
                    }, 0.4);
                }

                if(this.isEdit){
                    documentoDTO = {
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

                    if(documentoDTO.isPrincipal && this.listaDocumentos.length > 1) {
                        this.listaDocumentos.splice(this.indexEdicao, 1);
                        this.listaDocumentos.unshift(documentoDTO);
                    } else {
                        this.listaDocumentos[this.indexEdicao] = documentoDTO;
                    }

                    setTimeout( ()=> {
                        this.listaDocumentos.forEach(e => {
                            this.listaDocumentosTemp.push(e);
                        });
                    }, 0.4);

                }

                // if (this.isDocumentoVerso == false) {
                //     this.listaDocumentos.forEach(documento => {
                //         documento.fotoDocumentoVerso = null;
                //         this.dataDocumentoVerso = null;
                //     })
                // }

                this.cleanDocumento();
                this.validaRegistraEntradaButton();

                setTimeout( ()=> {
                    PIC.refreshWidget('Carousel');
                }, 0.1);

                // RESOLUÇÃO DE BUG PARA O PIC
                // A IMAGEM NÃO ATUALIZAVA NO CARROSSEL (CAROUSEL)
                setTimeout( ()=> {
                    let valueCPF;
                    valueCPF = this.numeroCPF;
                    this.numeroCPF = '';
                    this.numeroCPF = valueCPF;
                }, 100);
            }
        },
        cleanDocumento(foto){
            this.isPrincipal = false;
            if (foto != 'foto') {
                this.numero = undefined;
            }
        },
        validaSalvar(){
            if(this.data == null || 
                this.nomeVisitante == null || 
                this.listaDocumentos.length <= 0 || 
                this.selectedPortaria.id == null ||
                (this.selectedDestino == null && this.gabineteDestinoSelecionado == '') 
            ) {
                return this.isAlert = true;
            }else{
                return this.isAlert = false;
            }
        },
        validaAutorizarSalvar(){
            if(this.data == null || 
                this.nomeVisitante == null || 
                this.selectedPortaria.id == null ||
                (this.selectedDestino == null && this.gabineteDestinoSelecionado == '') 
            ) {
                return this.isAlert = true;
            }else{
                return this.isAlert = false;
            }
        },
        validaAutorizarButton(){
            if(this.data == null || 
                this.nomeVisitante == null || 
                this.selectedPortaria.id == null ||
                (this.selectedDestino == null && this.gabineteDestinoSelecionado == '') 
            ) {
                return true;
            }else{
                return false;
            }
        },
        validaRegistraEntradaButton(){
            let isCpf = false;
            this.isCpf = false;
            if(this.listaDocumentos.length > 0 ){
                this.listaDocumentos.forEach(e => {
                    if(e.tipoDocumento.descTipoDocumento != 'cnh' &&
                        e.tipoDocumento.descTipoDocumento != 'oab' &&
                        e.tipoDocumento.descTipoDocumento != 'dni'){
                            isCpf = true;
                            stop();
                    }
                });
                if(!isCpf && !this.numeroCPF){
                    this.isCpf = true;
                    isCpf = false;
                } else if (!isCpf && this.numeroCPF && this.isValid && !this.isDuplicidade){
                    isCpf = true;
                } else if (this.numeroCPF && (!this.isValid || this.isDuplicidade)){
                    isCpf = false;
                }
            }

            if(this.selectedPortaria.id == null){
                this.isRegraEntradaAtendida = false;
            }
            
            if(this.selectedDestino == null && this.gabineteDestinoSelecionado == ''){
                this.isRegraEntradaAtendida = false;
            }

            if(this.selectedPortaria.id != null && (this.selectedDestino != null || this.gabineteDestinoSelecionado != '')){
                this.isRegraEntradaAtendida = true;
            }

            if((this.data == null || this.data == '') || !isCpf || !this.isRegraEntradaAtendida){
                this.isRegistraEntrada = false;
            }else{
                this.isRegistraEntrada = true;
            }
        },
        confirmaSalvar(){
            let visitanteDTO = {
                nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                cpf: this.numeroCPF ? this.numeroCPF : null,
                nomeMae: this.nomeMae ? this.nomeMae : null,
                telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                fotoVisitante: this.data ? this.data : null,
                isDocumento: this.isDocumento ? this.isDocumento : null,
                documentos: this.listaDocumentos ? this.listaDocumentos : null,
                entrada: {
                    portaria: this.selectedPortaria ? this.selectedPortaria : null,
                    destino: this.selectedDestino ? this.selectedDestino : null,
                    idGabinete: this.gabineteDestinoSelecionado ? this.gabineteDestinoSelecionado : null,
                    hostname: this.$hostname ? this.$hostname : null,
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null
                },
                pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null
            }
            this.validaSalvar();
            if(!this.isAlert){
                const now = new Date();
                this.$http
                .post(`/visitante`, visitanteDTO)
                .then(function(response) {
                    if(response.status === 201){
                        this.$router.push({ name: 'buscaVisitantes', params: { msg: "Entrada de " + this.nomeVisitante + " registrada com sucesso às " + String(now.getHours()).padStart(2, "0") + 'h' + String(now.getMinutes()).padStart(2, "0") + 'm.', isSalvo: true }});
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
        validarDuplicidadeCPF(){
            this.$http
                .get(`/documento/validaCPF?parametros=${this.numeroCPF}`)
                .then(
                    function(response) {
                        console.log(response.data);
                        if(response.status === 200){
                            console.log('Pessoa já cadastrada com esse CPF');
                        }else{
                            console.log('Nenhuma Pessoa cadastrada com esse CPF');
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
        validaCPFValido() {
            this.isValid = true;
            let cpf = this.numeroCPF;

            if(cpf != null) {
                cpf = cpf.replace(/[^\d]+/g,'');
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
                cpf == "99999999999"){
                    this.isValid = false;
                }

                // Valida 1o digito
                let add = 0;
                for (let i=0; i < 9; i ++){
                    add += parseInt(cpf.charAt(i)) * (10 - i);
                }

                let rev = 11 - (add % 11);
                if (rev == 10 || rev == 11){
                    rev = 0;
                }
                if (rev != parseInt(cpf.charAt(9))){
                    this.isValid = false;
                }

                // Valida 2o digito
                let add1 = 0;
                for (let i = 0; i < 10; i ++){
                    add1 += parseInt(cpf.charAt(i)) * (11 - i);
                }
                rev = 11 - (add1 % 11);
                if (rev == 10 || rev == 11){
                    rev = 0;
                }
                if (rev != parseInt(cpf.charAt(10))){
                    this.isValid = false;
                }
            } else {
                this.isValid = false;
            }

        },
        validaCPF() {
            this.validaCPFValido();
            if (this.numeroCPF != '' || this.numeroCPF != null) {
                this.isRG = false;
                this.$http
                    .get(`/visitante/validaCPF?parametros=${this.numeroCPF}`)
                    .then(
                        function(response) {
                            if(response.status === 200){
                                this.isDuplicidade = true;
                            }else{
                                this.isDuplicidade = false;
                            }
                            this.validaRegistraEntradaButton();
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
        carregaEstadosBrasileiros() {
            this.$http
                .get(`/estado`)
                .then(
                    function(response) {
                        this.estadosBrasileiros = response.data;                        
                }.bind(this)
                )
                .catch(function(error) {
                // handle error
                console.log(error);
                })
                .then(function() {
                // always executed
                });
            
            this.selectedUF = this.estadosBrasileiros[0];
        },
        validaRG() {
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
                this.selectedUF = this.documentoEdicao.estadoEmissao;
            }
            if(!this.numeroCPF){
                this.isRG = true;
            } else {
                this.isRG = false;
            }

            if(this.isRG){
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
            if(this.isDocumentoDuplicidade){
                this.isConfirmaDocumento = true;
            }
        },
        changeDocument(foto) {
            if(this.isEdit){
                this.selectedTipoDocumento = this.documentoEdicao.tipoDocumento;
            }

            if (foto == 'foto') {
                this.cleanDocumento('foto');
            } else {
                this.cleanDocumento();
            }

            if(this.selectedTipoDocumento.descTipoDocumento == 'titulo de eleitor'){
                this.validaTituloEleitor();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'carteira de trabalho'){
                this.validaCTPS();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'rg'){
                this.validaRG();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'outros'){
                this.validaOutros();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'passaporte'){
                this.validaPassaporte();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'crnm'){
                this.validaCrnm();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'conselho de classe'){
                this.validaConselhoClasse();
            }
            if(this.selectedTipoDocumento.descTipoDocumento == 'cnh' || this.selectedTipoDocumento.descTipoDocumento == 'oab' || this.selectedTipoDocumento.descTipoDocumento == 'dni'){
                this.isConfirmaDocumento = false;
            }
            // bloqueia o botão confirmar quando não tiver foto da frente
            if(this.dataDocumentoFrente == ''){
                this.isConfirmaDocumento = true;
            }
            if(this.isDocumentoDuplicidade){
                this.isConfirmaDocumento = true;
            }
            
            this.isRG = false;
        },
        validaTituloEleitor() {
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
            }
            if(!this.numero){
                this.isNumeroTituloEleitor = true;
            } else {
                this.isNumeroTituloEleitor = false;
            }

            if (!this.isNumeroTituloEleitor && (this.selectedPais.namePais != '' && this.selectedPais.namePais != 'Selecione')) {
                this.isConfirmaDocumento = false;
            } else {
                this.isConfirmaDocumento = true;
            }
        },
        validaCTPS(){
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
                this.selectedUF = this.documentoEdicao.estadoEmissao;
            }
            if(!this.numero){
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
        },
        validaOutros(){
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
            }
            if(!this.numero){
                this.isNumeroIdentificador = true;
            } else {
                this.isNumeroIdentificador = false;
            }
            if (this.numero) {
                this.isConfirmaDocumento = false;
            } else {
                this.isConfirmaDocumento = true;
            }
        },
        validaPassaporte(){
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
                this.dataExpedicao = this.documentoEdicao.dataExpedicao;
                this.dataVencimento = this.documentoEdicao.dataVencimento;
            }
            if(!this.numero){
                this.isNumeroPassaporte = true;
            } else {
                this.isNumeroPassaporte = false;
            }
                if(!this.dataExpedicao){
                this.isDataExpedicao = true;
            } else {
                this.isDataExpedicao = false;
            }
                if(!this.dataVencimento){
                this.isDataVencimento = true;
            } else {
                this.isDataVencimento = false;
            }
            if(this.selectedPais.namePais == '' || this.selectedPais.namePais == 'Selecione'){
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
        },
        validaCrnm(){
            if(this.isEdit){
                this.numero = this.documentoEdicao.numero;
                this.dataExpedicao = this.documentoEdicao.dataExpedicao;
                this.dataVencimento = this.documentoEdicao.dataVencimento;
            }
                if(!this.numero){
                this.isNumeroCrnm = true;
            } else {
                this.isNumeroCrnm = false;
            }
                if(!this.dataExpedicao){
                this.isDataExpedicaoCrnm = true;
            } else {
                this.isDataExpedicaoCrnm = false;
            }
                if(!this.dataVencimento){
                this.isDataVencimentoCrnm = true;
            } else {
                this.isDataVencimentoCrnm = false;
            }
            if(this.selectedPais.namePais === 'Selecione'){
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
        },
        validaConselhoClasse(){
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
        }
  },mounted(){
        this.carregaEstadosBrasileiros();
        setTimeout( ()=> {
            PIC.refreshWidget('Carousel');
        }, 0.02);
  }
};
</script>