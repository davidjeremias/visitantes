<template>
    <!-- Header -->
      <div id="banner">
        <header>
          <div class="sr-only">
            <a href="#page-content-wrapper">Ir para o conteúdo.</a> |
            <a href="#menubar">Ir para a navegação</a>
          </div>
          
          <!-- Informações sobre a Aplicação -->
          <div id="cabecalho" class="container-fluid">
            <div class="topoAplicacao">
              <a class="identAplicacao" href="/sivis2/buscaVisitantes">
                <span class="sigla">SIVIS2</span>
                <span class="nome">Sistema de Identificação de Visitantes</span>
              </a>

              <div class="suporteGlobal">
                <ul class="funcoesGlobais">
                  <li>
                    <span class="semLink usuario">
                      <span class="nome">{{nome}}</span> <span class="separador"> / </span> {{ponto}}
                    </span>
                  </li>
                  <li>
                    <!-- <a @click="logoff()" title="Efetuar Logoff do sistema SIVIS"> -->
                    <a @click="logoff()" title="Efetuar Logoff do sistema SIVIS">
                      <span class="Link glyphicon glyphicon-log-out" aria-hidden="true"></span>
                      <span class="letra">Sair </span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>
          <Menu authenticated="authenticated"/>
        </header>
      </div>
</template>

<script>
import Menu from "./Menu.vue";
export default {
    name: "Header",
    props:{
      authenticated: {
        type: Boolean,
        default: false
      }
    },
    beforeRouteEnter(to, from, next){
      if(this.authenticated === false){
          to('/')
      }
    },    
    data() {
      return {
          user: sessionStorage.getItem('user'),
          ponto: '',
          nome: '',
          perfil: sessionStorage.getItem('perfil'),
      };
    },
    methods:{
      logoff(){
        sessionStorage.setItem('logoff', true);
        sessionStorage.setItem('user', "");
        sessionStorage.setItem('login', false);
        sessionStorage.setItem('authenticated', false);
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('refresh_token', '');

        this.$router.push({ 
          name: 'Login'
        });

        location.reload();
      }
    },
    components:{
        Menu
    },
    created:function(){
      if(this.user){
        let user = JSON.parse(this.user);
        this.ponto = user.ponto;
        this.nome = user.nome;
      }
    }
}
</script>