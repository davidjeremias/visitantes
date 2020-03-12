<template>
    <div>
        <template v-if="isLogin">
            <div data-pic-login='{"state":"initial"}'>
                <form>
                    <div class="form-group">
                        <label class="sr-only" for="username">Usuário</label>
                        <input type="text" v-model="ponto" name="username" id="username" class="form-control" placeholder="Usuário" required="" autofocus="">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="password">Senha</label>
                        <input type="password" v-model="senha" name="password" id="password" class="form-control" placeholder="Senha" required="">
                    </div>
                    <button v-if="isBotao" type="button" id="btnSubmit" @click="logon()" class="btn btn-default" >Entrar</button>
                </form>
            </div>
        </template>

        <template v-if="!isLogin">
            <div data-pic-login='{"state":"authenticationFailed"}'>
                <form>
                    <div class="form-group">
                        <label class="sr-only" for="username">Usuário</label>
                        <input type="text" v-model="ponto" name="username" id="username" class="form-control" placeholder="Usuário" required="" autofocus="">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="password">Senha</label>
                        <input type="password" v-model="senha" name="password" id="password" class="form-control" placeholder="Senha" required="">
                    </div>
                    <button v-if="isBotao" type="button" id="btnSubmit" @click="logon()" class="btn btn-default" >Entrar</button>
                </form>
            </div>
        </template>
        	
    </div>
</template>

<script>
    import { mask } from "vue-the-mask";
    export default {
        name: "Login",
        directives: { mask },
        data() {
            return {
                ponto: '',
                senha: '',
                sistema: '',
                isLogin: Boolean,
                selectedGabinete: '',
                isBotao: true,
                listaFuncionalidadesContexto: new Array()
            };
        },
        created() {
            sessionStorage.setItem('user', "");

            if( (sessionStorage.getItem('login') === "false" && sessionStorage.getItem('logoff') === "false") || sessionStorage.getItem('naoAutorizado') === "false" ){
                this.isLogin = false;
            }else{
                this.isLogin = true;
            }
        },
        methods: {
            logon(){
                let loginDTO = {
                    ponto: this.ponto ? btoa(this.ponto) : null,
                    senha: this.senha ? btoa(this.senha) : null,
                    sigla: this.$sistema
            }
            this.$http.post(`/login`, loginDTO).then(
                function(response) {
                    if(response.status === 200 && response.data.funcionalidades.length > 0){
                        sessionStorage.setItem('authenticated', true);
                        sessionStorage.setItem('user', JSON.stringify(response.data));
                        sessionStorage.setItem('ponto', response.data.ponto);
                        sessionStorage.setItem('logoff', false);
                        sessionStorage.setItem('naoAutorizado', true);
                        sessionStorage.setItem('perfil', response.data.perfil.perfil);

                        if(response.data.lotacao != null){
                            sessionStorage.setItem('parlamentar', response.data.lotacao.idSGMDeputadoOcupante);
                        }
                        if(response.data.contexto){
                            this.$router.push({ name: "agendamento" });
                            location.reload();
                        }else{
                            this.$router.push({ name: "buscaVisitantes" });
                            location.reload();
                        }
                    }else{
                        sessionStorage.setItem('authenticated', false);
                        sessionStorage.setItem('login', false);
                        sessionStorage.setItem('logoff', false);
                        sessionStorage.setItem('naoAutorizado', false);
                        location.reload();
                    }
                }.bind(this)

                ).catch(function(error) {
                    // handle error
                    console.log(error);
                });
            },
            catchEvent(){
                this.$router.push({ name: "agendamento" });
                location.reload();
            },
        }
    };
</script>