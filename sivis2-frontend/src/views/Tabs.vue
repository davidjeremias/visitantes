<template>

  <div class="col-md-12">
    <div data-pic-tabs>
      <ul class="tab-list">
          <li><a href="#visitantes">Visitantes</a></li>
          <li><a href="#servidores">Servidores</a></li>
      </ul>
      
      <div class="tab-content">
          <div id="visitantes">

            <table class="table table-bordered" data-pic-datatable='{"paginate": [50,100,150]}'>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Agendamento</th>
            <th>Ação</th>
        </tr>
    </thead>
    <tbody>

      <tr>
        <td width="85%">
          <div class="row">
            <div class="col-md-2 text-center">
                <img src="../../public/images/avatar-w.png" class="avatar-sivis" alt="Avatar">
            </div>

            <div class="col-md-10">
              <div class="row">
                <div class="col-md-12 title-visitant">
                  <a href="">
                    Antonieta de Tal da Silva
                  </a>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 subtitle-visitant-item">
                    <span class="subtitle-visitant">Tipo do Documento:</span> 000.000.000-00
                </div>
              </div>
            </div>
          </div>
        </td>
        <td width="12%">Não</td>
        <td width="3%">
            <div class="text-right clearfix">
              <button type="button" class="btn btn-primary">Visualizar</button>
            </div>
        </td>
      </tr>                     

    </tbody>
</table>

          </div>

          <div id="servidores">

            <table class="table table-bordered" data-pic-datatable='{"paginate": [50,100,150]}'>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Agendamento</th>
            <th>Ação</th>
        </tr>
    </thead>
    <tbody>

      <tr>
        <td width="85%">
          <div class="row">
            <div class="col-md-2 text-center">
                <img src="../../public/images/avatar.png" class="avatar-sivis" alt="Avatar">
            </div>

            <div class="col-md-10">
              <div class="row">
                <div class="col-md-12 title-visitant">
                  <a href="">
                    Antônio de Tal da Silva
                  </a>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 subtitle-visitant-item">
                    <span class="subtitle-visitant">Tipo do Documento:</span> 000.000.000-00
                </div>
              </div>
            </div>
          </div>
        </td>
        <td width="12%">Não</td>
        <td width="3%">
            <div class="text-right clearfix">
              <button type="button" class="btn btn-primary">Visualizar</button>
            </div>
        </td>
      </tr>                     

    </tbody>
</table>


          </div>

          <div id="terceirizados">
            Terceirizados
          </div>
      </div>
    </div>  
  </div>

</template>

<script>
  // import TabsVisitantes from './TabsVisitantes.vue';
  // import TabsServidores from './TabsServidores.vue';

  export default {
    name: 'Tabs',
    components: {
      // TabsVisitantes, TabsServidores
    },
    updated() {
      window.PIC.refreshWidget('Tabs');
    }
  };
</script>
