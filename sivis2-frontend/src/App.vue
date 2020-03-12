<template>
  <div>
    <div id="wrapper">
      <Header/>

      <!-- Área de Conteúdo -->
      <div class="sr-only">
        <a href="#page-content-wrapper">Ir para o conteúdo.</a> | <a href="#menubar">Ir para a navegação</a>
      </div>
      
      <div id="cabecalho" class="container-fluid">
        <div class="col-md-12">
          <router-view class="view"></router-view>
        </div>
      </div>

    </div>

    <Footer/>

  </div>
</template>

<script>
import Header from "./views/template/Header.vue";
import Footer from "./views/template/Footer.vue";
import json from '../package.json';
export default {
  name: "app",
  components:{
    Header,
    Footer
  },
  data() {
    return {
        ambienteSivis: ''
    }
  },
  updated() {
    PIC.activateAllWidgets();
  },
  created() {
    this.ambienteSivis = json.version.split('-')[1];
    let element = document.querySelector('body[data-pic-ambiente]');
    
    if (this.ambienteSivis === "HMG") {
      element.setAttribute("data-pic-ambiente", "Homologação");
    } else if (this.ambienteSivis === "SNAPSHOT") {
      element.setAttribute("data-pic-ambiente", "Teste");
    } else {
      element.setAttribute("data-pic-ambiente", "Produção");
    }
  }
}
</script>