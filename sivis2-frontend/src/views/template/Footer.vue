<template>
    <!-- Informações de Rodapé -->
    <div class="rodape" role="contentinfo" aria-labelledby="foot-info">
      <div class="dir" id="foot-info">
        Produzido por
        <span>DITEC</span>
      </div>
      <div class="esq">
        <span class="sigla">COPAD</span>
        <span class="divisor">-</span>
        <span class="nomeSetor">Soluções de Tic para as Áreas Política e Administrativa</span>
        <span class="versao">{{this.versionSivis}} - Atualizado em {{this.dataUpdate}} às {{this.hourUpdate}}</span>
      </div>
    </div>
    <!-- /rodapé -->
</template>

<script>
import json from '../../../package.json';
export default {
    name: 'Footer',
    data() {
        return {
            ambienteSivis: '',
            versionSivis: '',
            dataUpdate: '',
            hourUpdate: ''
        }
    },
    created() {
        this.versionSivis = json.version.split('-')[0];
        this.dataUpdate = json.dataUpdate;
        this.hourUpdate = json.hourUpdate;
  }
}
</script>