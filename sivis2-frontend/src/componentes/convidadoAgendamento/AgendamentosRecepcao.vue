<template>    
    <div class="row main-info-container" style="height: 793px;">
        <div id="nomeAgendamento" class="col-md-12">
            <label for="descricao">{{descricao}}</label>
        </div>

        <hr style="border:0.03rem solid #C0C0C0">

        <div id="descAgendamento" class="col-md-12">
            <label for="local">Local: </label> {{local}}
            <br>
            <label for="nomePatrocinador">Nome do Patrocinador:</label> {{patrocinador}}
            <br>
            <label for="dtAgendamento">Data:</label> {{formatarData(dtAgendamento)}}
            <br>
            <label for="periodo">Período: </label> {{periodo}}
        </div>

        <div id="campoBusca" class="col-md-12">
            <div class="col-md-10" style="margin-top:5px; margin-left: -15px;">
                <!-- <input type="text" class="form-control" v-model="parametros" /> -->
                <input type="text" class="form-control" v-on:keyup.enter="buscarConvidados()" v-model="parametros" />
            </div>

            <div class="col-md-2" style="margin-top:5px; margin-left:-20px;">
                <button type="button" @click="buscarConvidados()" class="btn btn-default">Buscar</button>
            </div>
        </div>

        <div class="row" style="padding:1.5rem;">
            <div class="col-md-8 col-md-offset-1">Há {{listaConvidados.length}} convidados para esse agendamento.</div>
        </div>

        <hr style="border:0.05rem solid #C0C0C0; margin-top:2px;">

        <div id="gridConvidados" class="col-md-12" style="margin-top:-5px; height:508px; overflow:auto">
            <table class="table table-bordered" data-pic-datatable='{"filter": false, "sort": false, "paginate": false}'>
                <thead>
                    <tr>
                        <th align="center">Foto</th>
                        <th align="center">Convidado</th>
                        <th align="center">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="element in listaConvidados" :key="element.id">
                        <td width="3%" class="text-center">
                            <template v-if="element.fotoConvidadoDTO != null">
                                <img :src="element.fotoConvidadoDTO.imagemFoto" class="molduraFotoConvidado" style="width:115px !important; height:100px; !important"/>
                            </template>
                            <template v-else>
                                <img src="images/avatar_sem_foto.jpeg" class="molduraFotoConvidado" alt="Foto do convidado" />
                            </template>
                        </td>
                        <td width="33%">
                            {{element.nomeConvidado}}
                            <br>
                            {{formataCPF(element.cpf)}}
                            <br>
                            {{formataFone(element.telefone)}}
                            <br><br>
                            <span class="alert-success" v-show="element.isEntrouAgendamento">Entrada registrada</span>
                        </td>
                        <td width="12%" class="clearfix">
                            <div class="text-center clearfix" style="margin-top:5px; margin-left:-20px;">
                                <button type="button" @click="alterarConvidadoAgendado(element)" class="btn btn-default">Detalhar</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import bus from '@/bus'
    export default {
        name: "agendamentoGabinete",
        data() {
            return {
                id: '',
                idAgendamento: this.$route.params.idAgendamento,
                convidado: this.$route.params.convidado,
                descricao: '',
                local: this.$route.params.local,
                patrocinador: '',
                dtAgendamento: '',
                periodo:'',
                listaConvidados: [],
                isLista: false,
                parametros: null,
                isRenderPIC: false
            };
        },
        created: function(){
            if(this.idAgendamento){
                this.$http
                    .get("/agendamento/buscaPorId", {params: { idAgendamento: this.idAgendamento }})
                    .then(
                        function(response) {
                            if (response.status === 200) {
                            let data = response.data;
                            this.descricao = data.descricaoAgendamento;
                            this.local = data.local;
                            this.patrocinador = data.nomePatrocinador;
                            this.periodo = this.prepararPeriodo(data.periodo).nome;
                            this.dtAgendamento = data.dataAgendamento;
                            this.buscarConvidados();
                        }
                        }.bind(this)
                    )
                    .catch(function(error) {
                        // handle error
                        console.log(error);
                    });
            }
            
        },
        methods: {
            buscarConvidados(){
                let filtroConfirmarConvidadoAgendadoDTO = null;
                filtroConfirmarConvidadoAgendadoDTO = {
                    agendamentoID : this.idAgendamento ? this.idAgendamento : null,
                    parametros : this.parametros ? this.parametros : null
                } 

                let listaAtiva;

                this.$http.post("/convidado/listarConvidadosRecepcao", filtroConfirmarConvidadoAgendadoDTO)
                    .then(                    
                        function(response) {
                            this.listaConvidados = response.data;

                            if(this.listaConvidados){
                                this.isLista = true;  
                            }else{
                                this.isLista = false;  
                            }

                            listaAtiva = this.isLista;

                        }.bind(this)

                    ).catch(function(error) {
                        // handle error
                        console.log(error);

                    }).then(function() {
                        // always executed
                        if(listaAtiva){      
                            var elem1 = document.querySelector('.zeroRecords');
                            var elem2 = document.querySelector('.dataTables_info');

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

                        PIC.refreshWidget('Actionsbar');
                    });
            },
            alterarConvidadoAgendado(convidado){
                let agendamento = {
                    convidado: convidado,
                    idAgendamento: this.idAgendamento,
                    local: this.local,
                }
                bus.$emit('getConvidado', agendamento);

                document.getElementById('detecta-adblock').style.display = "block";
            },
            filterConvidadoByName: function(value){
                return value === value;
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
            formataCPF(cpf) {
                //retira os caracteres indesejados...
                cpf = cpf.replace(/[^\d]/g, "");
                //realizar a formatação...
                return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            },
            formatarData(data) {              
                var dataFormatada = data.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
                return dataFormatada;
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
            removeEspacoString(string){
                return string.replace(/( )+/g, ' ');
            }
        },
        updated(){
            
            if(this.convidado){
                this.listaConvidados.forEach(convidado => {
                    if(convidado.nomeConvidado === this.convidado.nomeConvidado){
                        this.alterarConvidadoAgendado(convidado);
                    }     
                });
            }
        }
    };
</script>
<style scoped>
.alert-success, .alert-danger{
    padding: 4px;
    border: 1px solid;
}
</style>