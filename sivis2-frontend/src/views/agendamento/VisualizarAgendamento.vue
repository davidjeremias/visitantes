<template>
    <div>
        <div class="row">
            <div class="col-md-4 containerLeft">
                <div class="row">
                    <div class="col-md-12 leftTitle">
                        <h2>Agendamento da visita ao partido</h2>
                    </div>

                    <div class="col-md-12">
                        <span class="labelLeft">Local:</span> Nome do local
                    </div>

                    <div class="col-md-12">
                        <span class="labelLeft">Patrocinador:</span> Nome do patrocinador
                    </div>

                    <div class="col-md-12">
                        <span class="labelLeft">Período:</span> Manhã e tarde
                    </div>

                    <div class="col-md-12 searchContainer">
                        <div class="row">
                            <div class="col-md-9">
                                <input type="text" class="form-control" />
                            </div>

                            <div class="col-md-3">
                                <button type="submit" class="btn btn-default">Buscar</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <hr>
                    </div>

                    <div class="col-md-12 tableContainer">
                        <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Dados</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td width="25%" class="text-center">
                                        <img v-bind:src="this.avatarList" alt="Foto do convidado">
                                    </td>
                                    <td width="65%">
                                        <div class="nameLeft">
                                            <a href="#">Diogo Patrick de Paiva Costa</a>
                                        </div>

                                        <div>
                                            <span class="labelLeft">CPF:</span> 029.353.771-25
                                        </div>
                                    </td>
                                    <td width="10%">
                                        <button class="btn btn-primary">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="row">
                    <div class="col-md-12">
                        <div class="page-header">
                            <h1>Visitante Agendado</h1>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">

                        <form>
                            <div v-show="isAlert" data-pic-alert='{"type": "error"}'>
                                Todos os campos, foto do visitante e o documento e o destino devem estar preenchidos.
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="row main-info-container">
                                        <div class="col-md-3 text-center photo-avatar-container" data-toggle="modal" data-target="#photoWebcam">
                                            <div class="photo-avatar" id="photo-avatar" v-on:click="startup()">
                                                <img v-bind:src="this.avatar" class="photo-webcam" alt="Perfil" />
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="sivis-nome">Nome<span class="requiredLabel">*</span></label>
                                                        <input type="text" v-model="nomeVisitante" class="form-control" id="sivis-nome">
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="sivis-telefone">Telefone</label>
                                                        <input type="text" v-model="numeroTel" v-mask="['(##) ####-####', '(##) #####-####']" masked="false" class="form-control" id="sivis-telefone">                        
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
                                <div class="col-md-7">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h2>Documentos</h2>
                                        </div>
                                        <div class="panel-body">
                                            <div class="row">

                                                <div class="col-md-12" id="document-tabs-container">                
                                                    <div v-if="this.listaDocumentos.length >= 1" data-pic-carousel>
                                                        <div v-for="e in this.listaDocumentos" :key="e.id" class="borderRadiusCarousel">
                                                            <div class="row tipoDocumentoCarouselContainer">
                                                                <div class="col-md-12">
                                                                    <span class="tipoDocumentoCarousel">{{ e.tipoDocumento.descTipoDocumento }}</span>
                                                                    <span v-show="e.isPrincipal">
                                                                        <span class="subtitle-principal"> (Principal)</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div class="row" style="cursor: pointer" data-toggle="modal" data-target="#ampliarDocumento">
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
                                                    <button type="button" class="btn btn-secondary pull-right" data-toggle="modal" data-target="#novoDocumento" v-on:click="startupDocumentoFrente();montaComboOrigem()">Novo documento</button>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-5">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h2>Destino</h2>
                                        </div>
                                        <div class="panel-body">
                                            <div class="row">          
                                                <!-- <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="destino-local">Local<span class="requiredLabel">*</span></label>
                                                        <select v-model="selectedDestino" id="destino-local" class="form-control">
                                                            <option v-for="e in this.listaDestino" :key="e.id" :value="e.nomeDestino">{{e.nomeDestino}}</option>
                                                        </select>
                                                    </div> 
                                                </div> -->

                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="portaria">Portaria<span class="requiredLabel">*</span></label>
                                                        <select class="form-control" id="portaria">
                                                            <option value="">Selecione</option>
                                                        </select>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                    </div> 
                                                </div>

                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="local">Local<span class="requiredLabel">*</span></label>
                                                        <select class="form-control" id="local">
                                                            <option value="">Selecione</option>
                                                        </select>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
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
                                    <button type="button" v-if="!isDocumento" @click="confirmaSalvar()" class="btn btn-primary button-busca-margin pull-right">Registrar Entrada</button>
                                    <button type="button" v-if="validaAutorizarButton()" class="btn btn-secondary pull-right" @click="validaAutorizarSalvar()" id="authorize-entry">Autorizar entrada</button>
                                    <button type="button" v-if="!validaAutorizarButton()" class="btn btn-secondary pull-right" id="authorize-entry" data-toggle="modal" data-target="#authorize-entry-modal">Autorizar entrada</button>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </div>

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
                    <button type="submit" class="btn btn-primary" v-on:click="setAvatar()">Confirmar</button>
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
                                            <video id="videoDocumentoFrente">Webcam não está funcionando. Verifique com o suporte.</video>
                                        </div>

                                        <div class="camera text-center" v-show="isFotoDocumentoFrente">
                                            <canvas id="canvasDocumentoFrente"></canvas>
                                            <img id="photoDocumentoFrente" alt="Foto do Avatar"> 
                                        </div>
                                    </div>

                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoFrente();startupDocumentoVerso();validaCPF()"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoFrente()"><i class="fas fa-redo"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6" id="documentoVersoContainer">
                                <div class="row">
                                    <div class="col-md-12 document-webcam-title text-center">
                                        Verso
                                    </div>

                                    <div class="col-md-12">
                                        <div class="camera text-center" v-show="isVideoDocumentoVerso">
                                            <video id="videoDocumentoVerso">Webcam não está funcionando. Verifique com o suporte.</video>
                                        </div>

                                        <div class="camera text-center" v-show="isFotoDocumentoVerso">
                                            <canvas id="canvasDocumentoVerso"></canvas>
                                            <img id="photoDocumentoVerso" alt="Foto do Avatar"> 
                                        </div>
                                    </div>

                                    <div class="col-md-12 text-center">
                                        <button type="button" class="btn btn-primary button-margin-top" v-on:click="takepictureDocumentoVerso()"><i class="fas fa-camera"></i></button>
                                        <button type="button" class="btn btn-secondary button-margin-top button-margin-left" v-on:click="startupDocumentoVerso()"><i class="fas fa-redo"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <div class="row document-fields-container">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="origem">Origem</label>
                                    <select v-model="selectedOrigem" @change="onChangePaises(); catchEvent($event)" class="form-control" id="origem" name="origem">
                                        <option v-for="(e, key) in listaOrigem" :key="key" :value="e" selected>{{e.descOrigem.toUpperCase()}}</option> 
                                    </select>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="pais">País</label>
                                    <select v-model="selectedPais" @change="catchEventCountry($event); validaCrnm(); validaPassaporte()" class="form-control" id="pais" name="pais">
                                        <option v-for="(e, key) in listaPaises" :key="key" :value="e" selected >{{e.namePais}}</option>
                                    </select>
                                    <span class="validacao" v-show="isPais">Campo obrigatório</span>
                                </div>
                            </div>
                            
                            <template>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="tipo-do-documento">Tipo do Documento</label>
                                        <select v-model="selectedTipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" @change="catchEvent($event);changeDocument()">
                                            <option v-for="(e, key) in listaTipoDocumento" :value="e" :key="key">{{ e.descTipoDocumento.toUpperCase() }}</option>
                                        </select>
                                    </div>
                                </div>
                            </template>

                            <template v-if="tipoDocumentoSelecionado === 'RG'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCPF" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && (numeroCPF != null && numeroCPF != '') ">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="uf-rg-sivis">UF</label>
                                        <select @change="validaRG()" class="form-control" v-model="selectedUF" id="uf-rg-sivis">
                                            <option value="">Selecione</option>
                                            <option value="AC">AC</option>
                                            <option value="AL">AL</option>
                                            <option value="AP">AP</option>
                                            <option value="AM">AM</option>
                                            <option value="BA">BA</option>
                                            <option value="CE">CE</option>
                                            <option value="DF">DF</option>
                                            <option value="ES">ES</option>
                                            <option value="GO">GO</option>
                                            <option value="MA">MA</option>
                                            <option value="MS">MS</option>
                                            <option value="MT">MT</option>
                                            <option value="MG">MG</option>
                                            <option value="PA">PA</option>
                                            <option value="PB">PB</option>
                                            <option value="PR">PR</option>
                                            <option value="PE">PE</option>
                                            <option value="PI">PI</option>
                                            <option value="RJ">RJ</option>
                                            <option value="RN">RN</option>
                                            <option value="RS">RS</option>
                                            <option value="RO">RO</option>
                                            <option value="RR">RR</option>
                                            <option value="SC">SC</option>
                                            <option value="SP">SP</option>
                                            <option value="SE">SE</option>
                                            <option value="TO">TO</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6" >
                                    <div class="form-group">
                                        <label for="numero-rg-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" v-on:keyup="validaRG()" v-model="numero" class="form-control" id="numero-rg-sivis">
                                        <span class="validacao" v-show="isRG">Campo obrigatório</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'CNH'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCPF" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && numeroCPF != null">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-carteira-de-trabalho-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" @keyup="validaCarteiraDeTrabalho()" v-model="numero" class="form-control" id="numero-carteira-de-trabalho-sivis">
                                        <span class="validacao" v-show="isNumeroCTPS">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="estado-carteira-de-trabalho-sivis">Estado</label>
                                        <select class="form-control" v-model="selectedEstado" id="estado-carteira-de-trabalho-sivis" @change="validaCarteiraDeTrabalho()">
                                            <option value="">Selecione</option>
                                            <option value="AC">Acre</option>
                                            <option value="AL">Alagoas</option>
                                            <option value="AP">Amapá</option>
                                            <option value="AM">Amazonas</option>
                                            <option value="BA">Bahia</option>
                                            <option value="CE">Ceará</option>
                                            <option value="DF">Distrito Federal</option>
                                            <option value="ES">Espírito Santo</option>
                                            <option value="GO">Goiás</option>
                                            <option value="MA">Maranhão</option>
                                            <option value="MT">Mato Grosso</option>
                                            <option value="MS">Mato Grosso do Sul</option>
                                            <option value="MG">Minas Gerais</option>
                                            <option value="PA">Pará</option>
                                            <option value="PB">Paraíba</option>
                                            <option value="PR">Paraná</option>
                                            <option value="PE">Pernambuco</option>
                                            <option value="PI">Piauí</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                            <option value="RN">Rio Grande do Norte</option>
                                            <option value="RS">Rio Grande do Sul</option>
                                            <option value="RO">Rondônia</option>
                                            <option value="RR">Roraima</option>
                                            <option value="SC">Santa Catarina</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="SE">Sergipe</option>
                                            <option value="TO">Tocantins</option>
                                        </select>
                                        <span class="validacao" v-show="isEstado">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCarteiraDeTrabalho" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && numeroCPF != null">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'PASSAPORTE' || tipoOrigemSelecionado === 'MERCOSUL' || tipoOrigemSelecionado === 'ESTRANGEIRO'">
                                <div class="col-md-6" >
                                    <div class="form-group">
                                        <label for="numero-passaporte-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" v-model="numero" @keyup="validaPassaporte" class="form-control" id="numero-passaporte-sivis">
                                        <span class="validacao" v-show="isNumeroPassaporte">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                                        <input type="text" v-model="dataExpedicao" @keyup="validaPassaporte" class="form-control" id="numero-data-expedicao-sivis" v-mask="'##/##/####'">
                                        <span class="validacao" v-show="isDataExpedicao">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                                        <input type="text" v-model="dataVencimento" @keyup="validaPassaporte" class="form-control" id="numero-data-vencimento-sivis" v-mask="'##/##/####'">
                                        <span class="validacao" v-show="isDataVencimento">Campo obrigatório</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'CRNM'">                            
                                <div class="col-md-6" >
                                    <div class="form-group">
                                        <label for="numero-passaporte-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" v-model="numero" @keyup="validaCrnm" class="form-control" id="numero-crnm">
                                        <span class="validacao" v-show="isNumeroCrnm">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                                        <input type="text" v-model="dataExpedicao" @keyup="validaCrnm" class="form-control" id="numero-data-expedicao-sivis"  v-mask="'##/##/####'">
                                        <span class="validacao" v-show="isDataExpedicaoCrnm">Campo obrigatório</span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                                        <input type="text" v-model="dataVencimento" @keyup="validaCrnm" class="form-control" id="numero-data-vencimento-sivis" v-mask="'##/##/####'">
                                        <span class="validacao" v-show="isDataVencimentoCrnm">Campo obrigatório</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'OAB'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCPF" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && numeroCPF != null">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'TITULO DE ELEITOR'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-inscricao-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" v-model="numero" @keyup="validaTituloEleitor" class="form-control" id="numero-inscricao-sivis">
                                        <span class="validacao" v-show="isNumeroTituloEleitor">Campo obrigatório</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'DNI'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCPF" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && numeroCPF != null">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'CONSELHOS DE CLASSE'">
                                <div class="col-md-6" >
                                    <div class="form-group">
                                        <label for="numero-conselho-de-classe-sivis">Identificação</label>
                                        <input type="text" v-mask="'#################################'" v-model="numero" class="form-control" id="numero-conselho-de-classe-sivis">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="estado-conselho-responsavel-sivis">Conselho Responsável</label>
                                        <select class="form-control" v-model="selectedConselho" id="estado-conselho-responsavel-sivis">
                                            <option value="conselho1">Conselho 1</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="estado-conselh0-sivis">Estado</label>
                                        <select class="form-control" v-model="selectedEstado" id="estado-conselho-sivis">
                                            <option value="">Selecione</option>
                                            <option value="AC">Acre</option>
                                            <option value="AL">Alagoas</option>
                                            <option value="AP">Amapá</option>
                                            <option value="AM">Amazonas</option>
                                            <option value="BA">Bahia</option>
                                            <option value="CE">Ceará</option>
                                            <option value="DF">Distrito Federal</option>
                                            <option value="ES">Espírito Santo</option>
                                            <option value="GO">Goiás</option>
                                            <option value="MA">Maranhão</option>
                                            <option value="MT">Mato Grosso</option>
                                            <option value="MS">Mato Grosso do Sul</option>
                                            <option value="MG">Minas Gerais</option>
                                            <option value="PA">Pará</option>
                                            <option value="PB">Paraíba</option>
                                            <option value="PR">Paraná</option>
                                            <option value="PE">Pernambuco</option>
                                            <option value="PI">Piauí</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                            <option value="RN">Rio Grande do Norte</option>
                                            <option value="RS">Rio Grande do Sul</option>
                                            <option value="RO">Rondônia</option>
                                            <option value="RR">Roraima</option>
                                            <option value="SC">Santa Catarina</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="SE">Sergipe</option>
                                            <option value="TO">Tocantins</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-cpf-sivis">CPF</label>
                                        <input type="text" v-mask="'###.###.###-##'" v-model="numeroCPF" @keyup="validaCPF" class="form-control" id="numero-cpf-sivis" placeholder="Número do CPF">
                                        <span class="validacao" v-show="!isValid && numeroCPF != null">CPF Inválido</span>
                                        <span class="validacao" v-show="isDuplicidade">CPF já cadastrado</span>
                                    </div>
                                </div>
                            </template>

                            <template v-else-if="tipoDocumentoSelecionado === 'OUTROS'">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="numero-outros-sivis">Identificador</label>
                                        <input type="text" v-mask="'#################################'" v-model="numero" @keyup="validaOutros" class="form-control" id="numero-outros-sivis" placeholder="Número">
                                        <span class="validacao" v-show="isNumeroIdentificador">Campo obrigatório</span>
                                    </div>
                                </div>
                            </template>

                            <div v-if="listaDocumentos.length > 0" class="col-md-6">
                                <div class="form-group">
                                    <div class="checkbox">
                                        <label for="isPrincipal">
                                            <input type="checkbox" id="isPrincipal" v-model="isPrincipal">Documento principal
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>              
                </div>

                <div class="buttons">
                    <button type="submit" id="digitalizarDocumentoConfirm" class="btn btn-primary" :disabled="isConfirmaDocumento" @click="addDocumento()">Confirmar</button>
                </div>
            </form>
        </div>

        <div data-pic-modal='{"title": "Documento Ampliado", "dialog": "default"}' id="ampliarDocumento">                
            <form>            
                <div v-if="this.listaDocumentos.length >= 1" data-pic-carousel>
                    <div v-for="e in this.listaDocumentos" :key="e.id">
                        <div class="row">
                            <div class="col-md-12">                                                                          
                                <div class="row">
                                    <div class="col-md-6">
                                        <img v-bind:src="e.fotoDocumentoFrente" class="document-img" alt="Imagem da frente do documento" width="2rem" height="275rem"/>
                                    </div>

                                    <div class="col-md-6">
                                        <template v-if="e.fotoDocumentoVerso">
                                            <img v-bind:src="e.fotoDocumentoVerso" class="document-img" alt="Imagem do verso do documento" width="2rem" height="275rem"/>
                                        </template>                                                    
                                    </div>
                                </div>              
                            </div>

                            <div class="col-md-12">
                                <div class="row document-fields-container">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="origem">Origem</label>
                                            <input type="text" v-model="e.origemDocumento.descOrigem" class="form-control" id="origem" name="origem" disabled>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="pais">País</label>
                                            <input type="text" v-model="e.pais.namePais" class="form-control" id="pais" name="pais" disabled>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="tipo-do-documento">Tipo do Documento</label>
                                            <input type="text" v-model="e.tipoDocumento.descTipoDocumento" class="form-control" id="tipo-do-documento" name="tipo-do-documento" disabled>
                                        </div>
                                    </div>                                        

                                    <template v-if="e.cpf !== null">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-cpf-sivis">CPF</label>
                                                <input type="text" v-model="e.cpf" class="form-control" id="numero-cpf-sivis" name="numero-cpf-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="e.uf !== null">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="uf-rg-sivis">UF</label>
                                                <input type="text" v-model="e.uf" class="form-control" id="uf-rg-sivis" name="uf-rg-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>
                                    
                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento === 'rg'">
                                        <div class="col-md-6" >
                                            <div class="form-group">
                                                <label for="numero-rg-sivis">Identificação</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="numero-rg-sivis" name="numero-rg-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento === 'carteira de trabalho'">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-carteira-de-trabalho-sivis">Identificação</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="umero-carteira-de-trabalho-sivis" name="numero-carteira-de-trabalho-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="selectedEstado !== null">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="estado-carteira-de-trabalho-sivis">Estado</label>
                                                <input type="text" v-model="selectedEstado.estadoEmissao" class="form-control" id="estado-carteira-de-trabalho-sivis" name="estado-carteira-de-trabalho-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento === 'passaporte'">
                                        <div class="col-md-6" >
                                            <div class="form-group">
                                                <label for="numero-passaporte-sivis">Identificação</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="numero-passaporte-sivis" name="numero-passaporte-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="e.dataExpedicao !== null">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-data-expedicao-sivis">Data de Expedição</label>
                                                <input type="text" v-model="e.dataExpedicao" class="form-control" id="numero-data-expedicao-sivis" name="numero-data-expedicao-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>
                                    
                                    <template v-if="e.dataVencimento !== null">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-data-vencimento-sivis">Data de Vencimento</label>
                                                <input type="text" v-model="e.dataVencimento" class="form-control" id="numero-data-vencimento-sivis" name="numero-data-vencimento-sivis" disabled>
                                            </div>
                                        </div>                            
                                    </template>

                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento == 'titulo de eleitor'">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-inscricao-sivis">Identificação</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="numero-inscricao-sivis" name="numero-inscricao-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento == 'conselhos de classe'">
                                        <div class="col-md-6" >
                                            <div class="form-group">
                                                <label for="numero-conselho-de-classe-sivis">Identificação</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="numero-conselho-de-classe-sivis" name="numero-conselho-de-classe-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>
                                    
                                    <template v-if="e.conselho !== null && selectedTipoDocumento.descTipoDocumento == 'conselhos de classe'">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="estado-conselho-responsavel-sivis">Conselho Responsável</label>
                                                <input type="text" v-model="e.conselho" class="form-control" id="estado-conselho-responsavel-sivis" name="estado-conselho-responsavel-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>
                                    
                                    <template v-if="e.numero !== null && selectedTipoDocumento.descTipoDocumento == 'outros'">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="numero-identificador-sivis">Identificador</label>
                                                <input type="text" v-model="e.numero" class="form-control" id="numero-identificador-sivis" disabled>
                                            </div>
                                        </div>
                                    </template>

                                    <div v-if="listaDocumentos.length > 0" class="col-md-6">
                                        <template v-if="e.isPrincipal">
                                            <div class="form-group">
                                                <div class="checkbox">
                                                    <label for="isPrincipalAmpliar">
                                                        <input type="checkbox" id="isPrincipalAmpliar" checked disabled>Documento principal
                                                    </label>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="form-group">
                                                <div class="checkbox">
                                                    <label for="isPrincipalAmpliar">
                                                        <input type="checkbox" id="isPrincipalAmpliar" disabled>Documento principal
                                                    </label>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
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

            <!-- <div class="col-md-12">
                    <div class="form-group">
                        <label for="justificativa-agente">Justificativa do agente</label>
                        <textarea class="form-control" id="justificativa-agente" rows="4"></textarea>
                    </div>
            </div> -->

            <div class="buttons">
                    <button type="submit" class="btn btn-primary">Registrar Entrada</button>
                    <!-- <button type="submit" class="btn btn-primary">Autorizar Entrada</button>
                    <button type="submit" class="btn btn-secondary">Rejeitar Entrada</button> -->
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {mask} from 'vue-the-mask';
    export default {
        name: "VisualizarAgendamento",
        directives: {mask},
        data() {
            return {
                //AVATAR
                avatarList: '../../images/avatar.png',
                avatar: '../../images/photo-final.png',
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
                listaDestino: '',
                lista: [],
                listaOrigem: [],
                listaPaises:'',
                listaTipoDocumento: '',
                numero: '',
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
                selectedDestino: null,
                selectedOrigem: '',
                selectedPais: '',
                selectedUF: '',
                selectedTipoDocumento: '',
                isValid: Boolean,
                isAlert: false,
                isAlertModal: false,
                isPrincipal: false,
                isDuplicidade: false,
                isConfirmaDocumento: true,
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
                isPais: false
            };
        },
        methods: {
            catchEvent (event) {
                this.tipoDocumentoSelecionado = event.target.options[event.target.options.selectedIndex].text           
                this.tipoOrigemSelecionado = event.target.options[event.target.options.selectedIndex].text
                

                if (this.tipoOrigemSelecionado === "BRASILEIRO") {
                    this.tipoDocumentoSelecionado = 'RG'
                }

                this.numero = '';
                this.isValid = true;
            },
            catchEventCountry(event) {
                this.tipoPaisSelecionado = event.target.options[event.target.options.selectedIndex].text;
                let outros = {
                    id: 11,
                    descTipoDocumento: 'outros',
                    origem:{
                        id: 2,
                        descOrigem: 'Estrangeiro'
                    }
                }
                console.log(this.tipoPaisSelecionado);
                if (this.tipoPaisSelecionado === "ARGENTINA (Mercosul)" || this.tipoPaisSelecionado === "PARAGUAI (Mercosul)" || this.tipoPaisSelecionado === "URUGUAI (Mercosul)" || this.tipoPaisSelecionado === "VENEZUELA (Mercosul)") {
                    this.listaTipoDocumento.push(outros);
                }else{
                    var index = this.listaTipoDocumento.indexOf(outros)
                    this.listaTipoDocumento.splice(index, 1);
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
            startupDocumentoFrente() {
                this.isRG = false;
                this.disableForm();
                documentoVersoContainer.style.display = "none";

                this.isVideoDocumentoFrente = true;
                this.isFotoDocumentoFrente = false;
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
            },
            //DESABILITAR CAMPOS
            disableForm() {
                this.isConfirmaDocumento = true;
                document.getElementById("origem").disabled = true;
                document.getElementById("pais").disabled = true;
                document.getElementById("tipo-do-documento").disabled = true;
                if(this.tipoDocumentoSelecionado === 'RG'){
                    document.getElementById("numero-rg-sivis").disabled = true;
                    document.getElementById("uf-rg-sivis").disabled = true;
                    document.getElementById("numero-cpf-sivis").disabled = true;
                }
                if(this.tipoDocumentoSelecionado === 'CNH'){
                    document.getElementById("numero-cpf-sivis").disabled = true;
                }
                if(this.tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'){
                    document.getElementById("numero-carteira-de-trabalho-sivis").disabled = true;
                    document.getElementById("estado-carteira-de-trabalho-sivis").disabled = true;
                    document.getElementById("numero-cpf-sivis").disabled = true;
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
                if(this.tipoDocumentoSelecionado === 'OAB'){
                    document.getElementById("numero-cpf-sivis").disabled = true;
                }
                if(this.tipoDocumentoSelecionado === 'TITULO DE ELEITOR'){
                    document.getElementById("numero-inscricao-sivis").disabled = true;
                }
                if(this.tipoDocumentoSelecionado === 'DNI'){
                    document.getElementById("numero-cpf-sivis").disabled = true;
                }
                if(this.tipoDocumentoSelecionado === 'CONSELHOS DE CLASSE'){
                    document.getElementById("numero-cpf-sivis").disabled = true;
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
                if(this.tipoDocumentoSelecionado === 'RG'){
                    document.getElementById("numero-rg-sivis").disabled = false;
                    document.getElementById("uf-rg-sivis").disabled = false;
                    document.getElementById("numero-cpf-sivis").disabled = false;
                }
                if(this.tipoDocumentoSelecionado === 'CNH'){
                    document.getElementById("numero-cpf-sivis").disabled = false;
                }
                if(this.tipoDocumentoSelecionado === 'CARTEIRA DE TRABALHO'){
                    document.getElementById("numero-carteira-de-trabalho-sivis").disabled = false;
                    document.getElementById("estado-carteira-de-trabalho-sivis").disabled = false;
                    document.getElementById("numero-cpf-sivis").disabled = false;
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
                if(this.tipoDocumentoSelecionado === 'OAB'){
                    document.getElementById("numero-cpf-sivis").disabled = false;
                }
                if(this.tipoDocumentoSelecionado === 'TITULO DE ELEITOR'){
                    document.getElementById("numero-inscricao-sivis").disabled = false;
                }
                if(this.tipoDocumentoSelecionado === 'DNI'){
                    document.getElementById("numero-cpf-sivis").disabled = false;
                }
                if(this.tipoDocumentoSelecionado === 'CONSELHOS DE CLASSE'){
                    document.getElementById("numero-cpf-sivis").disabled = false;
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
                
                this.isVideoDocumentoVerso = true;
                this.isFotoDocumentoVerso = false;
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
            montaComboOrigem(){
                this.tipoDocumentoSelecionado = 'RG';
                
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

                this.numeroCPF = null,
                this.numero = null,            
                this.dataVencimento = null,
                this.dataExpedicao = null,
                this.selectedEstado = null,
                this.selectedConselho = '',
                this.selectedDestino = null,
                this.selectedOrigem = '',
                this.selectedPais = '',
                this.selectedUF = '',
                this.selectedTipoDocumento = ''
                
            },
            onChangePaises(){
                this.onChangeTipoDocumento(this.selectedOrigem.descOrigem)
                this.$http
                    .get(`/paises/`+this.selectedOrigem.descOrigem.toLowerCase())
                    .then(function(response) {
                        this.listaPaises = response.data;
                        if (this.selectedOrigem.descOrigem === 'Brasileiro' ) {
                            this.selectedPais = this.listaPaises[0];
                        }else{
                            this.listaPaises.unshift({namePais: 'Selecione'});
                            console.log(this.listaPaises[0]);
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
            },
            onChangeTipoDocumento(origem){
                this.$http
                    .get(`/tipoDocumento?parametros=${origem}`)
                    .then(function(response) {
                        this.listaTipoDocumento = response.data;
                        this.selectedTipoDocumento = this.listaTipoDocumento[0];
                        console.log(this.listaTipoDocumento);
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
                let documentoDTO = {
                    origemDocumento: this.selectedOrigem ? this.selectedOrigem : null,
                    pais: this.selectedPais ? this.selectedPais : null,
                    tipoDocumento: this.selectedTipoDocumento ? this.selectedTipoDocumento : null,
                    fotoDocumentoFrente: this.dataDocumentoFrente ? this.dataDocumentoFrente : null,
                    fotoDocumentoVerso: this.dataDocumentoVerso ? this.dataDocumentoVerso : null,
                    numero: this.numero ? this.numero : null,
                    cpf: this.numeroCPF ? this.numeroCPF : null,
                    dataVencimento: this.dataVencimento ? this.dataVencimento : null,
                    dataExpedicao: this.dataExpedicao ? this.dataExpedicao : null,
                    isPrincipal: this.isPrincipal ? this.isPrincipal : false,
                    uf: this.selectedUF ? this.selectedUF : null,
                    estadoEmissao: this.selectedEstado ? this.selectedEstado : null,
                    conselho: this.selectedConselho ? this.selectedConselho : null,
                };

                if (this.listaDocumentos.length === 0) {
                    documentoDTO.isPrincipal = true;
                }

                if (documentoDTO.isPrincipal === true) {
                    this.listaDocumentos.forEach(e => {
                        e.isPrincipal = false;
                    });
                }

                this.listaDocumentos.push(documentoDTO);
                this.cleanDocumento();

                setTimeout( ()=> { 
                    PIC.refreshWidget('Carousel');
                }, 0.01);            
            },
            cleanDocumento(){
                this.dataDocumentoFrente = '';
                this.dataDocumentoVerso = '';
                this.isPrincipal = false;
                this.numero = undefined;
                this.numeroCPF = undefined;
                console.log("Clean: " + this.isPrincipal);
            },
            validaSalvar(){
                if(this.data == null || this.nomeVisitante == null || this.listaDocumentos.length <= 0 || this.selectedDestino == null){
                    return this.isAlert = true;
                }else{
                    return this.isAlert = false;
                }
            },
            validaAutorizarSalvar(){
                if(this.data == null || this.nomeVisitante == null || this.selectedDestino == null){
                    return this.isAlert = true;
                }else{
                    return this.isAlert = false;
                }
            },
            validaAutorizarButton(){
                if(this.data == null || this.nomeVisitante == null || this.selectedDestino == null){
                    return true;
                }else{
                    return false;
                }
            },
            confirmaSalvar(){
                let visitanteDTO = {
                    nomeVisitante: this.nomeVisitante ? this.nomeVisitante : null,
                    nomeMae: this.nomeMae ? this.nomeMae : null,
                    telefoneVisitante: this.numeroTel ? this.numeroTel : null,
                    fotoVisitante: this.data ? this.data : null,
                    isDocumento: this.isDocumento ? this.isDocumento : null,
                    documentos: this.listaDocumentos ? this.listaDocumentos : null,
                    entrada: {
                        destino: this.selectedDestino ? this.selectedDestino : null,
                        hostname: this.$hostname ? this.$hostname : null,
                        pontoCadastrador: this.$pontoCadastrador ? this.$pontoCadastrador : null
                    } 
                }
                this.validaSalvar();
                if(!this.isAlert){
                    this.$http
                    .post(`/visitante`, visitanteDTO)
                    .then(function(response) {
                        if(response.status === 201){
                            this.$router.push({ name: 'buscaVisitantes', params: { msg: `Entrada registrada com sucesso.`, isSalvo: true }});
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
            validaCPFValido() {
                this.isValid = true;
                let cpf = this.numeroCPF;

                console.log(cpf);

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
                        .get(`/documento/validaCPF?parametros=${this.numeroCPF}`)
                        .then(
                            function(response) {
                                console.log(response);
                                if(response.status === 200){
                                    this.isDuplicidade = true;
                                }else{
                                    this.isDuplicidade = false;
                                }
                                if(!this.isValid || this.dataDocumentoFrente == '' || this.isDuplicidade){
                                    this.isConfirmaDocumento = true;
                                }else{
                                    this.isConfirmaDocumento = false;
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
                if(this.numeroCPF == '' || this.numeroCPF == null){
                    setTimeout( ()=> { 
                        this.validaRG();
                    }, 0.4); 
                }
            },
            validaRG() {
                let isRg = false;
                if((this.numero == '' || this.numero == null) && (this.numeroCPF == '' || this.numeroCPF == null)){
                    this.isRG = true;
                } else {
                    this.isRG = false;
                }
                if(this.numeroCPF == '' || this.numeroCPF == null){
                    isRg = true;
                } else {
                    isRg = false;
                }
                
                if ((this.numero != '' && this.numero != null) && this.selectedUF != '' && isRg && this.selectedPais.namePais != 'Selecione') {
                    this.isConfirmaDocumento = false;
                } else {
                    this.isConfirmaDocumento = true;
                }
            },
            changeDocument() {
                this.isRG = false;
            },
            validaCarteiraDeTrabalho() {
                this.validaCPFValido();

                if (this.numeroCPF != '') {
                    this.$http
                        .get(`/documento/validaCPF?parametros=${this.numeroCPF}`)
                        .then(
                            function(response) {
                                console.log(response);
                                if(response.status === 200){
                                    this.isDuplicidade = true;
                                }else{
                                    this.isDuplicidade = false;
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
                
                this.isConfirmaDocumento = false;
                this.isNumeroCTPS = !this.numero;
                this.isEstado = !this.selectedEstado != '';

                if (this.numero && this.selectedEstado != '' && this.numeroCPF) {
                    this.isConfirmaDocumento = false;
                } else {
                    this.isConfirmaDocumento = true;
                }
            },
            validaTituloEleitor() {
                if(!this.numero){
                    this.isNumeroTituloEleitor = true;
                } else {
                    this.isNumeroTituloEleitor = false;
                }

                if (this.numero) {
                    this.isConfirmaDocumento = false;
                } else {
                    this.isConfirmaDocumento = true;
                }
            },
            validaOutros(){
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
                if(this.selectedPais.namePais === 'Selecione'){
                    this.isPais = true;
                } else {
                    this.isPais = false;
                }

                if (this.numero && this.dataExpedicao && this.dataExpedicao && this.selectedPais.namePais != '') {
                    this.isConfirmaDocumento = false;
                } else {
                    this.isConfirmaDocumento = true;
                }
            },
            validaCrnm(){
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

                if (this.numero && this.dataExpedicao && this.dataExpedicao && this.selectedPais.namePais != 'Selecione') {
                    this.isConfirmaDocumento = false;
                } else {
                    this.isConfirmaDocumento = true;
                }
            }
        }
    };
</script>