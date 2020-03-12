import Vue from 'vue';
import VueRouter from 'vue-router';

import NotFound from './views/error/NotFound.vue'
import NotAuthorized from './views/error/NotAuthorized.vue'
import BuscaVisitantes from './views/BuscaVisitantes.vue';
import Login from './views/Login.vue';
import UltimasEntradas from './views/UltimasEntradas.vue';
import NovoVisitante from './views/NovoVisitante.vue';
import DetalharVisitante from './views/NovoVisitante.vue';
import Visitante from './views/Visitante.vue';
import VisitanteUltimasEntradas from './views/VisitanteUltimasEntradas.vue';
import Agendamento from './views/agendamento/Agendamento.vue';
import VisualizarAgendamento from './views/agendamento/VisualizarAgendamento.vue';
import NovoAgendamento from './views/agendamento/NovoAgendamento.vue';
import DetalharAgendamento from './views/agendamento/DetalharAgendamento.vue';
import AdicionarConvidado from './views/agendamento/AdicionarConvidado.vue';
import EncaminharMensagem from './views/agendamento/EncaminharMensagem.vue';
import GerenciarEmails from './views/agendamento/GerenciarEmails.vue';

import NovaRestricao from './views/restricao/NovaRestricao.vue';
import DetalharRestricao from './views/restricao/NovaRestricao.vue';
import AlterarRestricao from './views/restricao/NovaRestricao.vue';

import PesquisarRestricao from './views/restricao/PesquisarRestricao.vue';
import PesquisarVisitanteEntradas from './views/restricao/PesquisarVisitanteEntradas.vue';
import PesquisarTentativasEntradaRestricao from './views/restricao/PesquisarTentativasEntradaRestricao.vue';
import AlterarEntrada from './views/AlterarEntrada.vue';
import PesquisarAgendamento from './views/agendamento/PesquisarAgendamento';
import ConfirmarConvidadoAgendamento from './views/convidadoAgendamento/ConfirmarConvidadoAgendamento.vue';
import PesquisarMensagens from './views/agendamento/PesquisarMensagens.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    routes: [
    {
        path: '/login',
        name: 'login',
        component: Login
    }, 
    {
        path: '/buscaVisitantes',
        name: 'buscaVisitantes',
        props: true,
        component: BuscaVisitantes,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },  
    {
        path: '/ultimasEntradas',
        name: 'ultimasEntradas',
        props: true,
        component: UltimasEntradas,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/novoVisitante/',
        name: 'novoVisitante',
        props: true,
        component: NovoVisitante,
        meta: {requiresAuth: true, geral: true, contexto: false, isIncluir:true}
    },
    {
        path: '/detalharVisitante/:idVisitante',
        name: 'detalharVisitante',
        props: true,
        component: DetalharVisitante,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/visitante',
        name: 'visitante',
        props: true,
        component: Visitante,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/visitanteUltimasEntradas',
        name: 'visitanteUltimasEntradas',
        props: true,
        component: VisitanteUltimasEntradas,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/agendamento/agendamento',
        name: 'agendamento',
        props: true,
        component: Agendamento,
        meta: {requiresAuth: true, geral: false, contexto: true}
    },
    {
        path: '/agendamento/visualizarAgendamento',
        name: 'visualizarAgendamento',
        props: true,
        component: VisualizarAgendamento,
        meta: {requiresAuth: true, geral: false, contexto: true}
    },
    {
        path: '/agendamento/novoAgendamento',
        name: 'novoAgendamento',
        props: true,
        component: NovoAgendamento,
        meta: {requiresAuth: true, geral: false, contexto: true}
    },
    {
        path: '/agendamento/detalharAgendamento/:idAgendamento/:isDetalhar',
        name: 'detalharAgendamento',
        props: true,
        component: DetalharAgendamento,
        meta: {requiresAuth: true, geral: false, contexto: true}
    },
    {
        path: '/agendamento/adicionarConvidado/:idAgendamento',
        name: 'adicionarConvidado',
        props: true,
        component: AdicionarConvidado,
        meta: {requiresAuth: true, geral: false, contexto: true}
    },
    {
        path: '/agendamento/encaminharMensagem',
        name: 'encaminharMensagem',
        props: true,
        component: EncaminharMensagem
    },
    {
        path: '/agendamento/gerenciarEmails',
        name: 'gerenciarEmails',
        props: true,
        component: GerenciarEmails
    },
    {
        path: '/agendamento/pesquisarAgendamento',
        name: 'pesquisarAgendamento',
        props: true,
        component: PesquisarAgendamento,
        meta: { requiresAuth: true }
    },
    {
        path: '/convidadoAgendamento/confirmarConvidadoAgendamento/:idAgendamento',
        name: 'confirmarConvidadoAgendamento',
        props: true,
        component: ConfirmarConvidadoAgendamento,
        meta: { requiresAuth: true }
    },
    {
        path: '/agendamento/pesquisarMensagens/:idAgendamento',
        name: 'pesquisarMensagens',
        props: true,
        component: PesquisarMensagens,
        meta: { requiresAuth: true }
    },
    {
        path: '/restricao/NovaRestricao',
        name: 'novaRestricao',
        props: true,
        component: NovaRestricao,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/restricao/DetalharRestricao',
        name: 'detalharRestricao',
        props: true,
        component: DetalharRestricao,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/restricao/AlterarRestricao',
        name: 'alterarRestricao',
        props: true,
        component: AlterarRestricao,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/restricao/PesquisarRestricao',
        name: 'pesquisarRestricao',
        props: true,
        component: PesquisarRestricao,
        meta: {requiresAuth: true, geral: true, contexto: false}
    }
    ,
    {
        path: '/restricao/PesquisarVisitanteEntradas',
        name: 'pesquisarVisitanteEntradas',
        props: true,
        component: PesquisarVisitanteEntradas,
        meta: {requiresAuth: true, geral: true, contexto: false}
    }
    ,
    {
        path: '/restricao/PesquisarTentativasEntradaRestricao',
        name: 'pesquisarTentativasEntradaRestricao',
        props: true,
        component: PesquisarTentativasEntradaRestricao,
        meta: {requiresAuth: true, geral: true, contexto: false}
    }
    ,
    {
        path: '/AlterarEntrada',
        name: 'alterarEntrada',
        props: true,
        component: AlterarEntrada,
        meta: {requiresAuth: true, geral: true, contexto: false}
    },
    {
        path: '/notFound',
        name: 'notFound',
        props: true,
        component: NotFound,
        meta: {requiresAuth: true}
    },
    {
        path: '/notAuthorized',
        name: 'notAuthorized',
        props: true,
        component: NotAuthorized,
        meta: {requiresAuth: true}
    },
    {
        path: '*',
        redirect: '/notFound'
    }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        let auth = sessionStorage.getItem('authenticated')
        if ((auth === null || auth === 'false') && to.path !== '/login') {
            console.log("Usuário não autenticado");
            next('/login')
        } else if (to.meta.contexto) {
            const user = JSON.parse(sessionStorage.getItem('user'))
            if (user.contexto) {
                next()
            } else {
                next('/notAuthorized')
            }
        } else if (to.meta.geral) {
            const user = JSON.parse(sessionStorage.getItem('user'))
            if (user.geral) {
                next()
            } else {
                next('/notAuthorized')
            }
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router