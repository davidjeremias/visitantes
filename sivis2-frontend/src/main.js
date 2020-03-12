import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import moment from 'moment'

//axios.defaults.baseURL = 'https://copadtes.camara.gov.br/sivis2-backend'
//axios.defaults.baseURL = 'https://copadhom.camara.gov.br/sivis2-backend/'
axios.defaults.baseURL = 'http://localhost:9080/sivis2-backend'

axios.interceptors.request.use(async config => {
    let user = JSON.parse(sessionStorage.getItem('user') ? sessionStorage.getItem('user') : null)
    if(user){
        const token = user.accessTokenResponse.access_token
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

Vue.config.productionTip = false

// Importing the global css file
import "../public/css/sivis.css"

require('./componentes');

Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.$hostname = location.hostname
Vue.prototype.$pontoCadastrador = sessionStorage.getItem('ponto')
Vue.prototype.$sistema = 'SIVIS'
Vue.prototype.$authenticated = sessionStorage.getItem('authenticated')
Vue.prototype.$perfilUsuario = sessionStorage.getItem('perfil')

setInterval( ()=> {
    let user = JSON.parse(sessionStorage.getItem('user') ? sessionStorage.getItem('user') : null)
    if(user){
        let refreshToken = user.accessTokenResponse.refresh_token ? user.accessTokenResponse.refresh_token : null
        if(refreshToken != null){
            let accessTokenResponse = {
                refresh_token: refreshToken
            }
            axios.post(`/login/refreshToken`, accessTokenResponse).then(
                function(response) {
                    user.accessTokenResponse.access_token = response.data.access_token
                    user.accessTokenResponse.refresh_token = response.data.refresh_token
                    sessionStorage.setItem('user', JSON.stringify(user));
                }.bind(this)
        
            ).catch(error => {
                // handle error
                console.log('SERVIÇO INDISPONÍVEL: '+error);
                if(error.message === 'Network Error'){
                    sessionStorage.setItem('logoff', true);
                    sessionStorage.setItem('user', "");
                    sessionStorage.setItem('login', false);
                    sessionStorage.setItem('authenticated', false);
                }
            });
        }
    }
}, 130000);

/*CONSTANTES TIPOS DOCUMENTOS*/
Vue.prototype.$rg = 'RG';
Vue.prototype.$carteira_trabalho = 'CARTEIRA DE TRABALHO';
Vue.prototype.$passaporte = 'PASSAPORTE';
Vue.prototype.$crnm = 'CRNM';
Vue.prototype.$titulo_eleitor = 'TITULO DE ELEITOR';
Vue.prototype.$conselho_classe = 'CONSELHOS DE CLASSE';
Vue.prototype.$outros = 'OUTROS';
Vue.prototype.$cnh = 'CNH';
Vue.prototype.$oab = 'OAB';
Vue.prototype.$dni = 'DNI';

//Pegando dados do Usuário
const user = JSON.parse(sessionStorage.getItem('user') ? sessionStorage.getItem('user') : null)
if (user != null) {
    if (user.contexto) {
        Vue.prototype.$idParlamentar = user.lotacao.idSGMDeputadoOcupante
        Vue.prototype.$siglaParlamentar = user.lotacao.sigla
        Vue.prototype.$nomeParlamentar = user.lotacao.nome
    }
}

Vue.prototype.$auth = function(authority) {
    let auth = false
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user !== null && user.funcionalidades.length > 0) {
        auth = user.funcionalidades.some(a => a === authority);
    }

    return auth
}

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');