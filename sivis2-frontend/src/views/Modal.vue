<template>
<div>
    <div class="row">
		<div class="col-sm-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Modal</h3>
				</div>
				<div class="panel-body">
					<p><button data-toggle="modal" data-target="#m1">Formulário</button></p>
					<p><button data-toggle="modal" data-target="#m2">Básico</button></p>
					<p><button data-toggle="modal" data-target="#m31">Sucesso</button></p>
					<p><button data-toggle="modal" data-target="#m32">Informação</button></p>
				</div>
			</div>
			<!-- Modals -->
			<div data-pic-modal='{"title": "Modal com Formulário Básico"}' id="m1">
				<form data-pic-validation id="formModal">
					<div class="form-group">
						<label for="nome">Nome</label>
						<input id="nome" data-pic-validation-config='{"validate": ["required"]}' placeholder="Nome" name="nome" type="text">
					</div>
					<div class="buttons">
						<button id="ajaxBtn" class="btn ajax-call btn-secondary" type="button">Enviar</button>
					</div>
				</form>
			</div>
			<div data-pic-modal='{"dialog": "confirm", "title": "Básico", "callback": {"name": "myFunc"} }' id="m2">
				<p>Modal de Confirmação</p>
				<p>Você pode usar modal de confirmação para quando esperar uma decisão do usuário.</p>
			</div>
			<div data-pic-modal='{"dialog": "alert", "title": "Sucesso", "type" : "success" }' id="m31">
				<p>Modal de Alerta do tipo Sucesso</p>
				<p>Observe como o tipo é diferente.</p>
				<p><code>"type": "success"</code></p>
			</div>
			<div data-pic-modal='{"dialog": "alert", "title": "Informação", "type" : "info" }' id="m32">
				<p>Modal de Alerta do tipo Informação</p>
				<p>Observe como o tipo é diferente.</p>
				<p><code>"type": "info"</code></p>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
  name: 'Modal',
};
</script>
