<template>
    <div id="detalhesAgendado">
        
        <!-- BLOCO DADOS PESSOAIS -->
        <template>
            <div id="dados-pessoais" class="row">
                <div class="col-md-12" style="font-family:'Source Sans Pro',sans-serif; font-size:15px; margin-top:0px;">
                    <h4>Convidado Agendado </h4>
                </div>

                <div class="col-md-12">
                    <div class="panel panel-default panel-body" style="margin-top: 0px;">
                        <template v-if="isVisitante">
                            <div class="col-md-3">
                                <div class="text-center photo-avatar-container">
                                    <div class="photo-avatar" id="photo-avatar">
                                        <img v-bind:src="this.fotoVisitante" class="imagemFotoConvidadoDetalharAgendamento" alt="Perfil"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="isConvidado">
                            <div class="col-md-3">
                                <div class="text-center photo-avatar-container" data-toggle="modal" data-target="#photoWebcam">
                                    <div class="photo-avatar" id="photo-avatar" v-on:click="startup()">
                                        <img v-bind:src="this.fotoConvidado" class="imagemFotoConvidadoDetalharAgendamento" alt="Perfil"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="col-md-3">
                                <div class="text-center photo-avatar-container">
                                    <div class="photo-avatar" id="photo-avatar">
                                        <img v-bind:src="this.avatar" class="photo-webcam" alt="Perfil" style="width:auto !important; max-height:17rem!important;"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                        

                        <div class="col-md-7" style="padding-left: 0px !important; width:54.3333% !important;">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="numeroCPF">CPF</label>
                                        <input type="text" v-model="numeroCPF" v-on:keyup="validaCPF()" v-mask="'###.###.###-##'" masked="false" class="form-control" id="numeroCPF" :disabled="isVisitante">
                                        <!-- <span class="validacao" v-show="isCpf">CPF Obrigatório para esse tipo de Documento</span>
                                        <span class="validacao" v-show="!isValid && (numeroCPF != null && numeroCPF != '') ">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span> -->
                                    </div>
                                </div>

                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label for="sivis-nome">Nome</label>
                                        <input type="text" v-on:keyup="validaRegistraEntradaButton()" v-model="nomeVisitante" class="form-control" id="sivis-nome" :disabled="isVisitante">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="sivis-telefone">Telefone</label>
                                        <input type="text" v-model="numeroTel" v-on:keyup="validaRegistraEntradaButton()" v-mask="['(##) ####-####', '(##) #####-####']" masked="false" class="form-control" id="sivis-telefone" :disabled="isVisitante">
                                    </div>
                                </div>
                                <div class="col-md-8" id="visitanteRestricao" v-if="isRestricaoEntrada">
                                    <i class="fas fa-exclamation-circle"></i> Visitante com restrição.
                                </div>

                            </div>
                        </div>
                        <template v-if="isVisitante || isConvidado">
                            <template v-if="!isEntrou">
                                <div class="col-md-2 text-center alert-entrada">
                                    <span class="alert-danger">
                                        <i class="glyphicon glyphicon-exclamation-sign"></i> Entrada não registrada
                                    </span>
                                </div>
                            </template>

                            <template v-else>
                                <div class="col-md-2 text-center alert-entrada">
                                    <span class="alert-success">
                                        <i class=" glyphicon glyphicon-ok"></i> Entrada registrada                                        
                                    </span>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>

                <!-- MODAL DIGITALIZAR FOTO -->
                <template>
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
                                <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepicture();">
                                    <i class="fas fa-camera"></i>
                                </button>
                                <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startup()">
                                    <i class="fas fa-redo"></i>
                                </button>
                            </div>

                            <div class="buttons">
                                <button type="submit" class="btn btn-primary" v-on:click="setAvatar();">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </template>
                <!-- MODAL DIGITALIZAR FOTO -->                        
            </div>    
        </template>
        <!-- BLOCO DADOS PESSOAIS -->


        <!-- BLOCO IMAGENS DOS DOCUMENTOS -->
        <template>

            <div id="documentos" class="row">
                <div class="col-md-4" style=" font-family:'Source Sans Pro',sans-serif; font-size:15px; margin-top:-15px;">
                    <h4>Documentos</h4>
                </div>


                <div class="col-md-8" style="margin-top:-10px; z-index:10;">
                    <button v-if="!isEntrou" class="btn btn-primary button-busca-margin pull-right" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('novo', null, null);montaComboOrigem('novo')">
                        Novo documento
                    </button>
                </div>

                <div class="col-md-12" style="margin-top:-22px;">
                    <div class="panel panel-default">
                        <div class="panel-body">
                                <div class="col-md-12" id="document-tabs-container" style="height: 252px;">
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

                                            <div id="rowDocumento" class="row" style="cursor: pointer" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente('editar', e, index); startupDocumentoVerso(); montaComboOrigem('editar')">
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <div class="col-md-3">
                                                            <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento" style="max-height:156px;"/>
                                                        </div>

                                                        <div class="col-md-3">
                                                            <template v-if="e.fotoDocumentoVerso">
                                                                <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento" style="max-height:156px;"/>
                                                            </template>
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

                    <!-- MODAL DIGITALIZAR DOCUMENTOS FRENTE E VERSO -->
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
                                                        <img id="photoDocumentoVerso"  alt="Foto do Avatar">
                                                    </div>

                                                    <template v-if="documentoEdicao.fotoDocumentoVerso">
                                                        <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoVerso">
                                                            <canvas id="canvasDocumentoVerso"></canvas>
                                                            <img id="photoDocumentoVerso" v-bind:src="documentoEdicao.fotoDocumentoVerso" width="347rem" height="260.25rem" alt="Foto do Avatar">
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div v-if="isEdit" class="camera text-center" v-show="isFotoDocumentoVerso">
                                                            <canvas id="canvasDocumentoVerso"></canvas>
                                                            <img id="photoDocumentoVerso" width="347rem" height="260.25rem" alt="Foto do Avatar">
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
                                                    <select v-model="selectedTipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event); changeDocument(); verificaDuplicidadeTipoDocumento();">
                                                        <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key" :data-tipo-doc="e.id">{{ e.descTipoDocumento.toUpperCase() }}</option>
                                                    </select>
                                                </div>                                
                                                <div class="form-group" v-if="isEdit">
                                                    <label for="tipo-do-documento">Tipo do Documento</label>
                                                    <select v-model="documentoEdicao.tipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event); changeDocument(); verificaDuplicidadeTipoDocumento();">
                                                        <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key" :data-tipo-doc="e.id">{{ e.descTipoDocumento.toUpperCase() }}</option>
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
                                <button v-if="!isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary" :disabled="isConfirmaDocumento || isDocumentoDuplicidade" @click="addDocumento();">Adicionar</button>
                                <button v-if="isEdit" type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary" :disabled="isConfirmaDocumento || isDocumentoDuplicidade || isEntrou" @click="addDocumento();">Atualizar</button>
                            </div>
                        </form>
                    </div>
                    <!-- MODAL DIGITALIZAR DOCUMENTOS FRENTE E VERSO -->
            </div>
        </template>
        <!-- BLOCO IMAGENS DOS DOCUMENTOS -->

        <!-- BLOCO ENTRADA DOS AGENDADOS -->
        <template>
            <div id="destino" class="row">
                <div class="col-md-12" style=" font-family:'Source Sans Pro',sans-serif; font-size:15px; margin-top:-15px;">
                    <h4>Entrada</h4>
                </div>

                <div class="col-md-12" style="margin-top:-25px;">
                    <div class="panel panel-body" style="padding-:0px !important;">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="portaria">Portaria</label>
                                    <select v-model="selectedPortaria" @change="onChangeLocal(); validaRegistraEntradaButton();" class="form-control" id="portaria">
                                        <option v-for="e in this.listaPortaria" :key="e.id" :value="e">{{e.descricaoPortaria}}</option>
                                    </select>
                                </div>
                                <span class="validacao" v-if="isPortariaObrigatorio">Campo obrigatório</span>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="gabinete-destino">Gabinete</label>
                                    <input type="text" class="form-control" id="gabinete-destino" :value="local" disabled>
                                    <input type="hidden" :value="local">
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- BLOCO ENTRADA DOS AGENDADOS -->
        
        <div class="row">
            <div class="col-md-12" v-if="$auth('REGISTRAR_ENTRADA_CONVIDADO_AGENDADO')">
                <button type="button" 
                id="btnConfirma" 
                name="confirmaEnt" 
                :disabled="!isRegistraEntrada || !validaDocumentoPrincipal()"
                @click="confirmaSalvar()"  class="btn btn-primary button-busca-margin pull-right">Confirmar Entrada</button>
                
                <button type="button" 
                @click="validaAutorizarSalvar()" 
                class="btn btn-secondary pull-right button-busca-margin" 
                id="authorize-entry" 
                :disabled="!isRestricaoEntrada"
                >Autorizar entrada </button>

            <button type="submit" v-if="this.$perfilUsuario === 'Administrador'" @click="administradorRejeitarBTN()" class="btn btn-secondary pull-right button-busca-margin">Rejeitar entrada</button>
            </div>
            
        </div>


 <!-- Modal Login Depol-->
    <div data-pic-modal='{"title": "Autorizar Entrada", "dialog": "default"}' id="autorizarRestricaoLogin"
         ref="autorizarRestricaoLogin">
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
    <div data-pic-modal='{"title": "Autorizar Entrada", "dialog": "default"}' id="autorizarRestricaoEntradaModal">

      <form class="modal_autorizarRes">
          <div class="row">
        <div class="col-md-2">
          <div class="form-group">
            <label for="ponto">Ponto</label>
            <input type="text" class="form-control" disabled id="ponto" v-model="this.pontoAgenteAutorizador">

          </div>
        </div>
        <div class="col-md-10">
          <div class="form-group">
            <label for="senha-agente">Nome do agente</label>
            <input type="text" class="form-control" disabled id="nome-agente" v-model="this.nomeAutorizador">
          </div>
        </div>
          </div>
        <div class="col-md-12">
          <p><b>Tentativas de entrada hoje, dia {{ getDateHoje() }}</b></p>
          <table id="listaTentativasEntrada" class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
            <thead>
              <tr>
                <th align="center">Portaria</th>
                <th align="center">anexo</th>
                <th align="center">Horário</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ter in listaTentativasEntrada" :key="ter.id">
                <td width="10%">{{ ter.portariaDTO.descricaoPortaria }}</td>
                <td width="10%">anexo?</td>
                <td width="10%" class="text-center">{{ getDate(ter.dataTentativaRestricao) }}
                  {{ getTime(ter.dataTentativaRestricao) }}</td>
              </tr>
            </tbody>
          </table>
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
    </div>
</template>

<script>
    import {mask} from 'vue-the-mask';
    import bus from '@/bus';
    import MethodsGlobais from '@/mixins/MethodsGlobais'

    export default {
        name: "detalhesAgendados",
        directives: {
            mask
        },
        mixins:[
            MethodsGlobais
        ],
        data() {
            return {
                /*BLOCO  DADOS PESSOIAS*/
                isVideo: true,
                isFoto: false,
                nomeVisitante: null,
                numeroTel: '',
                numeroCPF: '',
                fotoVisitante: null,
                fotoConvidado: null,              
                avatar: '././images/avatar_sem_foto.jpeg',
                width: 500,
                height: 0,
                streaming: false,
                video: null,
                photo: null,
                data: '',
                canvas: null,

                /*BLOCO DADOS PESSOIAS*/

                /*BLOCO IMAGENS DOS DOCUMENTOS*/
                isEdit: false,
                /*Documento frente*/
                isVideoDocumentoFrente: true,
                isFotoDocumentoFrente: false,
                widthDocumentoFrente: 347,
                heightDocumentoFrente: 0,
                streamingDocumentoFrente: false,
                videoDocumentoFrente: null,
                canvasDocumentoFrente: null,
                photoDocumentoFrente: null,
                dataDocumentoFrente: '',
                documentoFrente: "../../images/photo-final.png",
                /*Documento Verso*/
                isVideoDocumentoVerso: true,
                isFotoDocumentoVerso: false,
                widthDocumentoVerso: 347,
                heightDocumentoVerso: 0,
                streamingDocumentoVerso: false,
                videoDocumentoVerso: null,
                canvasDocumentoVerso: null,
                photoDocumentoVerso: null,
                dataDocumentoVerso: '',
                documentoVerso: "../../images/photo-final.png",
                /*Dados Documentos*/
                isRG: false,
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
                isPrincipal: false,
                isDocumentoDuplicidade: false,
                isConfirmaDocumento: true,
                numero: null,
                listaDocumentos: [],
                selectedOrigem: '',
                listaOrigem: [],
                selectedPais: '',
                listaPaises: [],
                selectedTipoDocumento: '',
                listaTipoDocumento: [],
                tipoDocumentoSelecionado: 'RG',
                selectedUF: '',
                estadosBrasileiros: [],
                documentoEdicao: '',
                dataVencimento: null,
                dataExpedicao: null,
                tipoOrigemSelecionado: '',
                /*BLOCO IMAGENS DOS DOCUMENTOS*/

                /*BLOCO ENTRADA DOS AGENDADOS*/
                isRegistraEntrada: false,
                listaPortaria: [],
                listaDestino: [],
                listaLocal:[],
                selectedPortaria: {
                    id: null
                },
                selectedDestino: {
                    id: null
                },
                selectedGabinete: {
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
                /*BLOCO ENTRADA DOS AGENDADOS*/

                /*FUNÇÃO GERAL*/
                isAlertModal: null,
                isCpf: '',
                isValid: false,
                isDuplicidade: '',
                /*FUNÇÃO GERAL*/

                idAgendamento: null,
                convidado: null,
                visitante: null,
                isVisitante: false,
                isConvidado: false,
                idVisitante: null,
                isEntrou: false,
                valid: false,
                listaGabinetes: [],
                listaGabinetesSelecionado: [],
                gabineteDestinoSelecionado: '',
                isRegraEntradaAtendida: false,
                isNovoVisitante: null,
                local: null,
                dataATual: new Date(),
                isDateValid: false,
                isErro: false,
                isErroVencimento: false,
                msgErro:"",

                pontoAgenteAutorizador: null,
                senhaAgenteAutorizador: null,
                //Table  restricao entrada
                isListaRestricao: false,
                listaRestricao: [],
                //Table  registro entrada
                isListaRegistro: false,
                listaRegistro: [],
                isAlertModalAutorizarAgente: false,
                isRestricaoEntrada: false,
                idRestricaoEntrada: null,
                motivoRestricaoEntrada: null,
                listaTentativasEntrada: [],
                islistaTentativasEntrada: false,
                isRejeicaoEntrada :false,
                isAdministrador: false,
                justificativa: "",
                isPortariaObrigatorio: false,
                nomeAutorizador: "",


            }
        },
        created: function(){
            bus.$on('getConvidado', agendamento => {                
                this.idAgendamento  = agendamento.idAgendamento;
                this.convidado      = agendamento.convidado;
                this.local          = agendamento.local;

                if(!this.convidado.isVisitante){
                    /* NÃO VISITANTE - "CONVIDADO" */
                    this.cleanDadosEntrada();

                    this.listaDocumentos    = [];
                    this.isNovoVisitante    = true;
                    this.valid              = false;
                    this.isEntrou           = this.convidado.isEntrouAgendamento;
                    this.isVisitante        = false;
                    this.isConvidado        = true;

                    /*
                    * Para que a Rederização do caroseul PIC funcione corretamente é necessário que o "criação do objeto visitante" ocorra dentrdo o callback
                    */
                    setTimeout( ()=> {
                        document.getElementById('detecta-adblock').style.display = "none";

                        this.idVisitante    = null;
                        this.nomeVisitante  = this.convidado.nomeConvidado;
                        this.fotoConvidado  = this.convidado.fotoConvidadoDTO != null ? this.convidado.fotoConvidadoDTO.imagemFoto : this.avatar;
                        this.numeroCPF      = this.convidado.cpf;
                        this.numeroTel      = this.formataFone(this.convidado.telefone);
                        this.selectedUF     = this.convidado.documentosConvidadoDTO != null ? this.convidado.documentosConvidadoDTO.estadoEmissao : 'DF';
                        this.dataCadastro   = null;//ADICIONADO NO DEPARA
                        
                        this.verificarRestricaoEntradaVisitante(this.numeroCPF);
                        //documento
                        let documentoDTO = {
                            id: null, //ADICIONADO NO DEPARA
                            origemDocumento: this.convidado.documentosConvidadoDTO.origemDocumento ? this.convidado.documentosConvidadoDTO.origemDocumento : null,
                            pais: this.convidado.documentosConvidadoDTO.nomePais ? this.convidado.documentosConvidadoDTO.nomePais : null,
                            tipoDocumento: this.convidado.documentosConvidadoDTO.tipoDocumento ? this.convidado.documentosConvidadoDTO.tipoDocumento : null,
                            numero: this.convidado.documentosConvidadoDTO.numeroDocumento ? this.convidado.documentosConvidadoDTO.numeroDocumento : null,
                            cpf: null, //ADICIONADO NO DEPARA
                            isPrincipal: true,
                            dataVencimento: this.convidado.documentosConvidadoDTO.dataVencimento ? this.convidado.documentosConvidadoDTO.dataVencimento : null,
                            dataExpedicao: this.convidado.documentosConvidadoDTO.dataExpedicao ? this.convidado.documentosConvidadoDTO.dataExpedicao : null,
                            estadoEmissao: this.convidado.documentosConvidadoDTO.estadoEmissao ? this.convidado.documentosConvidadoDTO.estadoEmissao : null,
                            conselho: this.convidado.documentosConvidadoDTO.conselho ? this.convidado.documentosConvidadoDTO.conselho : null,
                            fotoDocumentoFrente: this.convidado.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoFrente ? this.convidado.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoFrente : null,
                            fotoDocumentoVerso: this.convidado.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoVerso ? this.convidado.documentosConvidadoDTO.fotoDocumentoConvidadoDTO.fotoDocumentoVerso : null,
                            pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                            dataCadastro: null //ADICIONADO NO DEPARA
                        };                  
                        this.listaDocumentos.push(documentoDTO);

                        setTimeout( ()=> {
                            PIC.refreshWidget('Carousel');
                        }, 0.1);

                    }, 1);
                        
                }else{
                    /* VISITANTE */
                    this.cleanDadosEntrada();
                    this.listaDocumentos = [];
                    this.isNovoVisitante = false;
                    this.valid          = false;
                    this.isEntrou       = this.convidado.isEntrouAgendamento;
                    this.isVisitante    = true;
                    this.isConvidado    = false;

                    this.$http.get("/visitante/buscaPorAgendamento", {params: {idConvidado: this.convidado.id, idAgendamento: this.idAgendamento}})
                    .then(
                        function(response) {
                            if(response.status === 200){

                                document.getElementById('detecta-adblock').style.display = "none";
                            
                                let visitante = null;
                                visitante = response.data;

                                this.idVisitante    = visitante.id;
                                this.nomeVisitante  = visitante.nomeVisitante;
                                this.fotoVisitante  = visitante.fotoVisitante;
                                this.numeroCPF      = visitante.cpf;
                                this.numeroTel      = this.formataFone(visitante.telefoneVisitante);
                                this.dataCadastro   = visitante.dataCadastro;

                                if(visitante.entrada && visitante.entrada.portaria.id){
                                    document.getElementById('portaria').disabled = true;
                                    this.selectedPortaria = visitante.entrada.portaria 
                                }

                                visitante.documentos.forEach(e => {
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
                                });

                                setTimeout( ()=> {
                                    PIC.refreshWidget('Carousel');
                                }, 0.1);

                                this.verificarRestricaoEntradaVisitante(this.numeroCPF);
                            }
                    }.bind(this)

                    ).catch(function(error) {
                        // handle error
                        console.log(error);
                    });
                }
            });

            this.buscarListaGabinetes();
            this.getPortarias();
            this.carregaEstadosBrasileiros();
            this.getDateHoje();
            
        },
        computed: {
            isValidJustify: function () {
                return this.justificativa !== '' && this.justificativa.length > 10;
            }
        },
        methods: {
            autorizarEntradaRestricao() {
                this.confirmaSalvar();
            },
            getDateHoje() {

                var data = new Date(),
                dia  = data.getDate().toString(),
                diaF = (dia.length == 1) ? '0'+dia : dia,
                mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                mesF = (mes.length == 1) ? '0'+mes : mes,
                anoF = data.getFullYear();
                return diaF+"/"+mesF+"/"+anoF;
            
            },
            getDate(dataSemFormato) {
                return dataSemFormato ? moment(dataSemFormato).format('DD/MM/YYYY') : null;
            },
            getTime(stringDate) {
                var date = new Date(stringDate);
                return date.getHours() + ":" + String(date.getMinutes()).padStart(2, "0");
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
                    destinoDTO: this.selectedDestino ? this.selectedDestino : null,
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
                    isAlterar : this.isAlterar ? this.isAlterar : false
                }

                this.validaSalvar();
                if (!this.isAlert) {
                    const now = new Date();
                    this.$http
                        .post(`/visitante`, visitanteDTO)
                        .then(function (response) {
                                if (response.status === 200) {
                                    this.$router.push({ name: 'buscaVisitantes', params: { msg: "Rejeição de " + this.nomeVisitante + " registrada com sucesso às " + String(now.getHours()).padStart(2, "0") + ':' + String(now.getMinutes()).padStart(2, "0") + ':' + String(now.getSeconds()).padStart(2, "0"), isSalvo: true } });
                                }
                            }.bind(this)
                        )
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                }

            },
            VerificarAdministrador() {
                let loginDTO = {
                    ponto: this.pontoAgenteAutorizador ? btoa(this.pontoAgenteAutorizador) : null,
                    senha: this.senhaAgenteAutorizador ? btoa(this.senhaAgenteAutorizador) : null,
                    sigla: this.$sistema
                }

                this.$http.post("/login/verificarUsuarioAgenteAutorizador", loginDTO).then(
                    function (response) {
                        if (response.status === 200) {
                            let data = response.data;
                            this.pontoAutorizador = data.ponto;
                            this.nomeAutorizador = data.nome;
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

                ).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    // always executed
                });
            },
            buscarTentativasEntrada(idRestricao) {
                this.$http.get("/restricao/listarEntradasRestricao", {
                        params: { 
                            idRestricaoEntrada: idRestricao, 
                            hoje: 'sim' 
                        }
                }).then(
                    function (response) {
                        if (response.status === 200) {

                            this.listaTentativasEntrada = response.data;

                            if (this.listaTentativasEntrada.length > 0) {
                                this.islistaTentativasEntrada = true;
                            } else {
                                this.islistaTentativasEntrada = false;
                            }
                        }
                    }.bind(this)

                ).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    // always executed
                });
            },
            administradorRejeitarBTN(){ //quando o usuário for DEPOL/ADMINISTRADOR

                if (this.$perfilUsuario === 'Administrador') {
                    this.isRejeicaoEntrada = true;
                    this.isAlertModalAutorizarAgente = false;

                    this.pontoAutorizador =  this.$pontoCadastrador;
                    $('#autorizarRestricaoEntradaModal').picModal().show();
                    this.buscarTentativasEntrada(this.idRestricaoEntrada);
                }
            },
            validaAutorizarSalvar() {
                if (this.nomeVisitante == null || this.selectedPortaria.id == null) {
                    return this.isPortariaObrigatorio = true;
                } else {
                    this.isPortariaObrigatorio = false;
                    if (this.$perfilUsuario === "Administrador") {
                        this.pontoAutorizador = this.$pontoCadastrador;
                        this.confirmaSalvar();

                    } else {
                        $('#autorizarRestricaoLogin').picModal().show();
                        return this.isAlert = false;
                    }
                }
            },
            verificarRestricaoEntradaVisitante(cpf) {
                this.$http.get("/restricao/verificarRestricaoEntradaVisitante", {
                        params: { 
                            numeroCPF: cpf 
                        }
                }).then(
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

                ).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    // always executed
                });
            },
            habilitarBotaoAutorizar() {
                var authorizeEntry = document.getElementById("authorize-entry");
                //authorizeEntry.style.display = "block";                
            },
            verificarDataExpedicao() {
                
                this.isErro = false;
                /*Data corrente ou data atual*/
                var currentDate = moment().format("YYYY-MM-DD");
                var parteDataAt = currentDate.split("-");
                var dataAtual = new Date(parteDataAt[0], parteDataAt[1], parteDataAt[2]);
                
                /*Data digitada*/
                var strData = this.dataExpedicao;
                
                var partesData = strData.split("-");
                var data = new Date(partesData[0], partesData[1], partesData[2]);

                const year = moment(this.dataExpedicao, "DD-MM-YYYY").year();

                if (data > dataAtual) {
                    
                    this.isErro = true;
                    this.msgErro = "Data de expedição inválida.";
                    this.isConfirmaDocumento = true;
                    } else{
                        this.isConfirmaDocumento = false;
                    }
                
            },
            verificarDataVencimento() {
                this.isErroVencimento = false;
                /*Data corrente ou data atual*/
                var currentDate = moment().format("YYYY-MM-DD");
                var parteDataAt = currentDate.split("-");
                var dataAtual = new Date(parteDataAt[0], parteDataAt[1], parteDataAt[2]);
                
                /*Data digitada*/
                var strData = this.dataVencimento;
                
                var partesData = strData.split("-");
                var data = new Date(partesData[0], partesData[1], partesData[2]);

                const year = moment(this.dataVencimento, "DD-MM-YYYY").year();

                if (data < dataAtual) {
                    this.isErroVencimento = true;
                    this.msgErro = "Data de vencimento inválida.";
                    this.isConfirmaDocumento = true;
                    } else{
                        this.isConfirmaDocumento = false;
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
            selecionarLocalDestino(){
                if(this.selectedDestino.nomeDestino == 'Selecione'){
                    $('#gabinete-destino').attr('disabled', false);
                }else{
                    $('#gabinete-destino').attr('disabled', true);
                }

                this.validaRegistraEntradaButton();
            },
            selecionarGabineteDestino(){
                this.listaGabinetes = JSON.parse(this.listaGabinetes);

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

                this.validaRegistraEntradaButton();
            },
            confirmaSalvar(){
                const now = new Date();               
                this.nomeVisitante = this.removeEspacoString(this.nomeVisitante);

                let visitanteDTO = {
                    id: this.idVisitante ? this.idVisitante : null,
                    nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                    cpf: this.numeroCPF ? this.numeroCPF : null,
                    telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                    fotoVisitante: (this.fotoVisitante ? this.fotoVisitante : null) ? (this.fotoVisitante ? this.fotoVisitante : null) : (this.fotoConvidado ? this.fotoConvidado : null),
                    isDocumento: this.isDocumento ? this.isDocumento : null,
                    documentos: this.listaDocumentos ? this.listaDocumentos : null,
                    pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                    dataCadastro: this.dataCadastroVisitante ? this.dataCadastroVisitante : null,
                    isAlterar: false,
                    isNovoVisitante: this.isNovoVisitante,
                    agendamentoDTO: {
                        id: this.idAgendamento ? this.idAgendamento : null,
                        convidadoDTO:{
                            id: this.convidado.id ? this.convidado.id : null
                        }
                    },
                    entrada: {
                        id: this.idEntrada ? this.idEntrada : null,
                        portaria: this.selectedPortaria ? this.selectedPortaria : null,
                        destino: this.selectedDestino ? this.selectedDestino : null,
                        idGabinete: this.gabineteDestinoSelecionado ? this.gabineteDestinoSelecionado : null,
                        hostname: this.$hostname ? this.$hostname : null,
                        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null,
                        dataHoraVisita: this.dataHoraEntrada ? this.dataHoraEntrada : null,
                        inexistenciaDocumento: false,
                        
                        pontoAutorizador: this.pontoAutorizador ? this.pontoAutorizador : null,                        
                        existeRestricao: this.isRestricaoEntrada ? this.isRestricaoEntrada : false,
                        idRestricaoEntrada: this.idRestricaoEntrada ? this.idRestricaoEntrada : null
                    }
                }

                if(this.isVisitante){
                    this.$http.put(`/visitante`, visitanteDTO)
                    .then(
                        function(response) {
                            this.listaTipoDocumento = response.data;
                            this.selectedTipoDocumento = this.listaTipoDocumento[0];

                            if(response.status == 201){
                                this.isEntrou = true;

                                setTimeout( ()=> {
                                    location.reload();
                                }, 1);
                            }
                        }.bind(this)

                    ).catch(function(error) {
                        // handle error
                        console.log(error);
                    });
                }
                
                if(this.isConvidado){
                    this.$http.put(`/visitante`, visitanteDTO)
                    .then(
                        function(response) {
                                            
                            if(response.status == 201){
                                this.isEntrou = true;

                                setTimeout( ()=> {
                                    location.reload();
                                }, 1);
                            }
                        }.bind(this)

                    ).catch(function(error) {
                        // handle error
                        console.log(error);
                    });
                }                    
            },
            getPortarias(){
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
            cleanDadosEntrada(){
                this.selectedPortaria.id = null;
                this.selectedDestino = null;
            },
            validaDocumentoPrincipal(){
                let i = 0;
                this.listaDocumentos.forEach(e => {
                    if(e.isPrincipal){
                        i++;
                    }
                });
                if(i > 1 || i == 0){
                    return false;
                }else{
                    return true;
                }
            },
            validaConfirmarEntrada(){
                if((this.fotoVisitante || this.fotoConvidado) && this.nomeVisitante && this.listaDocumentos.length > 0 && this.selectedPortaria.id && this.selectedDestino.id){
                    this.valid = true;
                }else{
                    this.valid = false;
                }
            },
            removeEspacoString(string){
                return string.replace(/( )+/g, ' ');
            },
            formataFone(fone){
                if(fone != null){
                    //retira os caracteres indesejados...
                    fone = fone.replace(/[^\d]/g, "");
                    //realizar a formatação...
                    fone=fone.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
                    fone=fone.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
                    fone.replace(/(\d)(\d{4})$/,"$1-$2");
                }else{
                    return null;
                }
                return fone;
            },
            /*BLOCO DADOS PESSOIAS*/
            startup() {
                this.isVideo = true;
                this.isFoto = false;
                this.video = document.getElementById('video');
                this.canvas = document.getElementById('canvas');
                this.photo = document.getElementById('photo');

                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
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
                    this.fotoConvidado = this.data;
                    return this.fotoConvidado;
                }
            },

            /*BLOCO IMAGENS DOS DOCUMENTOS*/
            formatarData(dataSemFormato) {
                return moment(dataSemFormato).format('DD/MM/YYYY');
            },
            montaComboOrigem(tipo){
                if(tipo == 'novo'){
                    this.isEdit = false;
                }

                this.isEdit ? this.tipoDocumentoSelecionado = this.documentoEdicao.tipoDocumento.descTipoDocumento.toUpperCase() : this.tipoDocumentoSelecionado = 'RG';

                this.$http.get(`/origem`).then(
                    function(response) {
                        this.listaOrigem = response.data;
                        this.selectedOrigem = this.listaOrigem[0];
                        this.onChangePaises();
                    }.bind(this)

                ).catch(function(error) {
                    // handle error
                    console.log(error);
                }).then(function() {
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
                            if(response.status === 200){
                                this.listaPaises = null;
                                this.listaPaises = response.data;
                                if (this.documentoEdicao.origemDocumento.descOrigem === 'Brasileiro' ) {
                                    this.selectedPais = this.listaPaises[0];
                                }else{
                                    this.listaPaises.unshift({namePais: 'Selecione'});
                                    this.selectedPais = this.listaPaises[0];
                                }
                                this.catchEventCountry('');
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
                this.$http.get(`/tipoDocumento?parametros=${origem}`).then(
                    function(response) {
                        console.log(response);
                        this.listaTipoDocumento = response.data;
                        this.selectedTipoDocumento = this.listaTipoDocumento[0];
                        this.verificaDuplicidadeTipoDocumento();
                    }.bind(this)

                ).catch(function(error) {
                    // handle error
                    console.log(error);

                }).then(function() {
                    // always executed
                });
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

                    if(this.tipoOrigemSelecionado === "ESTRANGEIRO"){
                      this.selectedPais.namePais = '';
                    }else{
                      this.selectedPais = this.listaPaises[0];
                    }
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
            //DOCUMENTO FRENTE
            startupDocumentoFrente(tipo, elemento, index) {
                this.isDocumentoDuplicidade = false;
                let dataHoje = null;
                let dataCadastroDocumento =  null;

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
            addDocumento() {
                let documentoDTO;

                if (this.isDocumentoDuplicidade) {
                    console.log('Documento Duplicado')
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
                    }
                    if (this.isEdit) {
                        let listaDocumentosAntigos = [];
                        let listaDocumentosEditados = [];

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
                    }

                    this.cleanDocumento();
                    this.validaRegistraEntradaButton();

                    // RESOLUÇÃO DE BUG PARA O PIC - A IMAGEM NÃO ATUALIZAVA NO CARROSSEL (CAROUSEL)
                    setTimeout(() => {
                        let valueCPF;
                        valueCPF = this.numeroCPF;
                        this.numeroCPF = '';
                        this.numeroCPF = valueCPF;
                    }, 100);
                }

                var elCarousel = document.getElementsByClassName("owl-carousel");

                if(elCarousel.length > 0){
                    setTimeout(() => {
                        PIC.destroyWidget('Carousel');
                        PIC.activateWidget('Carousel');
                    }, 1);
                }
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
            cleanDocumento(foto) {
                this.isPrincipal = false;
                if (foto != 'foto') {
                    this.numero = undefined;
                }
            },            
            setDocumentos() {
                if (this.dataDocumentoVerso) {
                    this.documentoVerso = this.dataDocumentoVerso;
                }
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
                                // this.validaRegistraEntradaButton();
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
            validaRG() {
                if(this.dataDocumentoFrente != ''){
                    if (this.isEdit) {
                        this.numero = this.documentoEdicao.numero;
                        this.selectedUF = this.documentoEdicao.estadoEmissao;
                    }
                    if (!this.numeroCPF) {
                        this.isRG = true;
                    } else {
                        this.isRG = false;
                    }

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
                    if (this.isDocumentoDuplicidade) {
                        this.isConfirmaDocumento = true;
                    }
                }else{
                    this.isConfirmaDocumento = true;
                }
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
                    this.isDataVencimento = false;
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
                    this.isDataVencimento = false;
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
                    this.isDataVencimento = false;
                }
            },
            formatDate(dataEntrada) {
                let data = new Date(dataEntrada);
                return (data.getDate() + 1) + '/' + (data.getMonth() + 1) + '/' + data.getUTCFullYear();
            },
            formatDateInput() {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                 mm='0'+mm
                } 
                today = yyyy+'-'+mm+'-'+dd;
                return today;
            },
            /*BLOCO IMAGENS DOS DOCUMENTOS*/

            /*BLOCO ENTRADA DOS AGENDADOS*/
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
            /*BLOCO ENTRADA DOS AGENDADOS*/

            /*FUNÇÃO GERAL*/
            validaRegistraEntradaButton() {
                let isCpf = false;
                this.isCpf = false;

                if(this.numeroCPF){
                    this.validaCPF(this.numeroCPF);
                }

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

                if(this.fotoConvidado != null || this.fotoVisitante != null || !this.data || !this.isFoto){
                    this.isRegraEntradaAtendida = true;
                }

                if(this.selectedPortaria.id == null){
                    this.isRegraEntradaAtendida = false;
                }
  
                if(this.selectedPortaria.id != null){
                    this.isRegraEntradaAtendida = true;
                }

                if(this.isEntrou || !isCpf || !this.isRegraEntradaAtendida){
                    this.isRegistraEntrada = false;
                }else{
                    this.isRegistraEntrada = true;
                }

                if(this.isRestricaoEntrada){
                      this.isRegistraEntrada = false;
                }else{
                    this.isRegistraEntrada = true;
                }

                
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
            }
            /*FUNÇÃO GERAL*/
        },
        updated(){
            var elCarousel = document.getElementsByClassName("owl-carousel");

            if(elCarousel.length > 0){
                PIC.destroyAllWidgets('Carousel');
                PIC.activateWidget('Carousel');
            }           
        }
    };
</script>

<style scoped>
    .alert-entrada {
        border-left:solid 1px #507c3f;
        height: 144px;
        margin-top:6px;
        width:20.555555%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .alert-success, .alert-danger{
        padding: 4px;
        border: 1px solid;
    }
    
</style>