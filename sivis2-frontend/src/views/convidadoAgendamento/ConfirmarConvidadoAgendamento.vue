<template>
    <span>
        <div id="detecta-adblock" style="display:none;">
            <div class="load">
                <i class="fa fa-spinner fa-pulse fa-9x fa-fw"></i>
                <span class="sr-only">Carregando...</span> 
            </div>

            <div class="backdrop-adblock"> </div>

        </div>

        <div class="row col-md-12" style="height:800px; margin-bottom:60px;">

            <!-- Lado esquerdo -->
            <div id="dados-agendamento-recepcao" class="col-md-4" style="border: solid 1px #DCDCDC">
                <AgendamentoRecepcao :idAgendamento="idAgendamento" :convidado="convidado"></AgendamentoRecepcao>
            </div>
            
            <!-- Lado direito -->
            <div id="dados-convidado-agendamento" class="col-md-8" style="width:66%; margin-left:8px; height:795px; -webkit-box-shadow: -5px 0px 4px rgba(50, 50, 50, 0.66);  overflow-y: auto;">
                <DetalhesAgendados></DetalhesAgendados>
            </div>
        </div>

        <div class="espacamentoPageFinal"></div>

    </span>
</template>

<script>
    import { log } from 'util';
    import MethodsGlobal from '@/mixins/MethodsGlobais.js';
    
    import AgendamentoRecepcao from '@/componentes/convidadoAgendamento/AgendamentosRecepcao.vue'
    import DetalhesAgendados from '@/componentes/convidadoAgendamento/DetalhesAgendados.vue'

    export default {
        name: "ConfirmarConvidadoAgendamento",
        components:{
            AgendamentoRecepcao,
            DetalhesAgendados
        },
        data() {
            return {
                idAgendamento: this.$route.params.idAgendamento,
                convidado: this.$route.params.convidado,
                now: new Date()
            }
        },
        methods: {
            converterDate(date){
                if(date){
                    var dt = date.split('/');
                    var data = new Date(dt[2], dt[1] - 1, dt[0]);
                }
                return data;
            }
        }
    };
</script>

<style scoped>
    .load {
        z-index: 9999999;
        width: 300px;
        height: 300px;
        position: absolute;
        top: 30%;
        left: 45%;
        color: #173010;
        /* color: #4f7b3e; */
    }

    #detecta-adblock {
        width: 100%;
        position: fixed;
        height: 100vh;
        z-index: 99999;
        top: 0;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #detecta-adblock .backdrop-adblock {
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: -15px;
    }

</style>