<template>
    <div class="col-md-12 marginContainerBottom">
        <div class="page-header">
        <h1>Gerenciar e-mail para os visitantes agendados do gabinete</h1>
        </div>

        <div class="row main-info-container">
            <div class="col-md-12">
                <div class="form-group">
                <label for="descricao">Descrição</label>
                <input type="text" v-model="descricao" class="form-control input-large" id="descricao" disabled />
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
                <input type="date" v-model="dataAgendamento" class="form-control" id="data" disabled />
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                <label for="periodo">Período</label>
                <input type="text" id="periodo" v-model="periodo" class="form-control" disabled />
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                <label for="situacao">Situação</label>
                <input type="text" id="situacao" v-model="situacao" class="form-control" disabled />
                </div>
            </div>
        </div>

        <div class="col-md-12">
            <a href="#" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
                <i class="fas fa-share"></i> <span class="buttonWithIcon">Mensagens encaminhadas</span>
            </a>

            <a href="#" class="btn btn-primary btnCreateMarginTop pull-right button-margin-left">
                <i class="fas fa-times-circle"></i> <span class="buttonWithIcon">E-mail de cancelamento</span>
            </a>

            <a href="#" class="btn btn-primary btnCreateMarginTop pull-right">
                <i class="fas fa-check-circle"></i> <span class="buttonWithIcon">E-mail de confirmação</span>
            </a>
        </div>

        <div class="col-md-12">
            <hr />
        </div>
        
        <div data-pic-tabs>
            <!-- A lista de abas -->
            <ul class="tab-list">
                <li><a href="#agendados">Agendados</a></li>
                <li><a href="#excluidos">Excluídos</a></li>
            </ul>
            <!-- O conjunto de conteúdos das abas -->
            <div class="tab-content">
                <div id="agendados">
                    <div class="col-md-12">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="selecionarTodos" value="" @click="marcarCheckboxes()">
                            <label class="form-check-label" for="selecionarTodos">Selecionar Todos</label>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
                            <thead>
                            <tr>
                                <th>Selecionados</th>
                                <th>Foto</th>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Origem</th>
                                <th>Identificação</th>
                                <th>Tot. Confirmação</th>
                                <th>Tot. Cancelamento</th>
                                <th>Enviado</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td width="5%" class="text-center">
                                    <input class="form-check-input checkboxItem" type="checkbox" value="">
                                </td>
                                <td width="5%" class="text-center">
                                    <img v-bind:src="this.avatar" alt="Foto do convidado" />
                                </td>
                                <td width="">Diogo Patrick de Paiva Costa</td>
                                <td width="">(61) 9 8262 3484</td>
                                <td width="">Brasileiro</td>
                                <td width="">2.429.057</td>
                                <td width="">1</td>
                                <td width="">2</td>
                                <td width="">Sim</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="excluidos">
                    <div class="col-md-12">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="selecionarTodos" value="" @click="marcarCheckboxes()">
                            <label class="form-check-label" for="selecionarTodos">Selecionar Todos</label>
                        </div>
                    </div>

                    <div class="col-md-12">
                        <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
                            <thead>
                            <tr>
                                <th>Selecionados</th>
                                <th>Foto</th>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Origem</th>
                                <th>Identificação</th>
                                <th>Tot. Confirmação</th>
                                <th>Tot. Cancelamento</th>
                                <th>Enviado</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td width="5%" class="text-center">
                                    <input class="form-check-input checkboxItem" type="checkbox" value="">
                                </td>
                                <td width="5%" class="text-center">
                                    <img v-bind:src="this.avatar" alt="Foto do convidado" />
                                </td>
                                <td width="">Diogo Patrick de Paiva Costa</td>
                                <td width="">(61) 9 8262 3484</td>
                                <td width="">Brasileiro</td>
                                <td width="">2.429.057</td>
                                <td width="">1</td>
                                <td width="">2</td>
                                <td width="">Sim</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GerenciarEmails",
        data() {
            return {
                // CABEÇALHO
                descricao: 'Descrição do Agendamento',
                local: 'Local do Agendamento',
                patrocinador: 'Patrocinador do Agendamento',
                dataAgendamento: '',
                periodo: 'Manhã e Tarde',
                situacao: 'Cancelado',
                // TABELA
                avatar: '../../images/avatar.png',
                // CHECKBOX
                todosCheckboxes: false,
            };
        },
        methods: {
            // CHECKBOX
            marcarCheckboxes() {
                var checkboxes = document.querySelectorAll('.checkboxItem');
                for (var i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = !checkboxes[i].checked;
                }
            }
        }
    };
</script>