<template>
<div>
	<div class="page-header">
		<h1>Form Validation</h1>
	</div>
	<div class="row">
		<div class="col-sm-6 col-md-4">
			<section class="panel panel-default">
				<div class="panel-heading">
					<h2 class="panel-title">Primeiro exemplo</h2>
				</div>
				<div class="panel-body">
					<form id="form1" action='' method='get' data-pic-validation>
						<!-- <div data-pic-validation id="div1"> -->
						<div class="form-group">
							<label for="exampleInputGrupo1">Nome</label>
							<input data-pic-validation-config='[{"validate": "required"}]' type="text" class="form-control" id="exampleInputGrupo1" name="grupo1">
						</div>
						<div class="form-group">
							<label for="ponto1">Ponto</label>
							<input data-pic-validation-config='{"validate" : "ponto"}' type="text" class="form-control" id="ponto1" name="ponto">
						</div>
						<div class="form-group">
							<label for="numero1">CPF ou CNPJ</label>
							<input data-pic-validation-config='{"validate" : "CPFouCNPJ"}' type="text" class="form-control" id="numero1" name="numero">
						</div>
						<div class="form-group">
							<label data-pic-tooltip='{"text":"Aqui o tooltip ajuda a enteder quais são as regras para entender a informação a ser entrada"}'
								for="exampleInputEmail1">Email</label>
							<input data-pic-validation-config='[{"validate": "required"}, {"validate" : "email"}]' type="email" class="form-control"
								id="exampleInputEmail1" name="email">
						</div>
						<button type="submit" name="conf">Enviar</button>
					</form>
				</div>
			</section>
		</div>
	</div>
</div>
</template>

<script>
export default {
  name: 'Form'
};
</script>
