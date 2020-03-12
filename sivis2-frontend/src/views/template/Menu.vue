<template>
<!-- MENU GLOBAL -->
	<div id="menuGlobal">
		<div id="pic-menu-global">
			<nav class="navbar navbar-default">
				<ul data-pic-globalnav>
					<li v-if="$auth('PESQUISA_BASICA_DE_VISITANTES')">
						<a  v-if="authenticated" href=""> Busca </a>
						<ul>
							<li v-if="$auth('PESQUISA_BASICA_DE_VISITANTES')">
								<router-link v-if="authenticated" to="/buscaVisitantes">Visitantes</router-link>
							</li>
							<li v-if="$auth('LISTAR_ULTIMAS_ENTRADAS')" >
								<router-link v-if="authenticated" to="/ultimasEntradas">Últimas Entradas</router-link>
							</li>
						</ul>
					</li>
					<li v-if="$auth('REGISTRAR_ENTRADA_DE_VISITANTE')">
						<router-link v-if="authenticated" to="/novoVisitante">Novo Visitante</router-link>
					</li>
					 <!-- Agendamento recepcionista -->
					<li v-if="$auth('PESQUISAR_AGENDAMENTOS_DATA_CORRENTE')">
						<router-link v-if="authenticated" to="/agendamento/pesquisarAgendamento"> Agendamento </router-link>
					</li>
					<!-- Agendamento gabinete -->
					<li v-if="$auth('MANTER_AGENDAMENTO')">
						<router-link v-if="authenticated" to="/agendamento/agendamento">Agendamento</router-link>
					</li>
					<li v-if="$auth('MANTER_AGENDAMENTO')">
						<router-link v-if="authenticated" to="/agendamento/novoAgendamento">Novo Agendamento</router-link>
					</li>
          <!-- Menu DEPOL -->
          <li>
            <a v-if="$auth('PESQUISAR_RESTRICOES_DE_ENTRADA','PESQUISAR_TENTATIVAS_DE_ENTRADAS_COM_RESTRICAO','PESQUISAR_VISITANTES_E_ENTRADAS')" href="">Restrições/Alertas</a>
            <ul>
              <li v-if="$auth('PESQUISAR_RESTRICOES_DE_ENTRADA')"><router-link v-if="authenticated" to="/restricao/pesquisarRestricao">Pesquisar Restrições</router-link></li>
              <li v-if="$auth('PESQUISAR_VISITANTES_E_ENTRADAS')"><router-link v-if="authenticated" to="/restricao/pesquisarVisitanteEntradas">Pesquisar Visitante e Entradas</router-link></li>
              <li v-if="$auth('PESQUISAR_TENTATIVAS_DE_ENTRADAS_COM_RESTRICAO')"><router-link v-if="authenticated" to="/restricao/pesquisarTentativasEntradaRestricao">Pesquisar tentativas de entradas com restrição</router-link></li>
            </ul>
          </li>
					<!-- <li>
						<router-link to="/form">Formulário</router-link>
					</li> -->
				</ul>
			</nav>
		</div>
	</div>
</template>

<script>
export default {
    name: 'Menu',
    props:{
      authenticated: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
          perfil: sessionStorage.getItem('perfil'),
      };
    },
}
</script>