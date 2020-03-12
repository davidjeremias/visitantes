<template>
  <div class="row main-info-container">
    <div class="page-header" style="padding-left: 15px">
            <h1>GABINETE</h1>
            <h4>{{ siglaParlamentar }} - {{ nomeParlamentar }}</h4>
    </div>
    <div style="height:5px; background:#fff"></div>
  </div>
        
</template>
<script>
export default {
  name: 'PainelGabinete',
    props: {
      siglaParlamentar:String,
      nomeParlamentar:String,

    },
data () {
    return {

    }
  }
}
</script>