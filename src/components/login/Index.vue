<template>
    <div class="centered-container">
        <md-content class="md-elevation-3">
            <div class="title">
                <img class="height:100%;" :src="require('../../assets/empresa.png')" />
            </div>

            <div class="form" @keyup.enter="auth">
                <md-field :class="getValidationClass('email')">
                    <label>E-mail</label>
                    <md-input @blur="$v.login.email.$touch()" v-model="login.email" autofocus></md-input>
                    <div v-if="$v.login.email.$error">
                        <span
                            class="md-error"
                            v-if="!$v.login.email.required"
                        >Este campo es requerido</span>
                        <span
                            class="md-error"
                            v-if="!$v.login.email.email"
                        >Ingrese un correo electrónico válido</span>
                    </div>
                </md-field>

                <md-field md-has-password :class="getValidationClass('password')"
                >
                    <label>Password</label>
                    <md-input
                        @blur="$v.login.password.$touch()"
                        v-model="login.password"
                        type="password"
                    ></md-input>
                    <div v-if="$v.login.password.$error">
                        <span
                            class="md-error"
                            v-if="!$v.login.password.required"
                        >Este campo es requerido</span>
                        <span
                            class="md-error"
                            v-if="!$v.login.password.minLength"
                        >Al menos 4 caracteres</span>
                    </div>
                </md-field>
            </div>

            <div class="actions md-layout md-alignment-center-space-between">
                <md-button class="md-raised md-primary" @click="auth">Entrar</md-button>
            </div>

            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>

            <p class="alert alert-danger" v-if="authFailed">
                Falloó el acceso de usuario. Por favor, compruebe sus credenciales.
            </p>
        </md-content>
        <div class="background" />
    </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
    data() {
        return {
            loading: false,
            login: {
                email: "",
                password: ""
            },
            username: ''
        };
    },
    destroyed() {
        this.$store.commit('auth/authFailed', 'reset')
    },
    validations: {
        login: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(4)
            }
        }
    },
    computed: {
        authFailed() {
            return this.$store.state.auth.authFailed
        }
    },
    methods: {
        getValidationClass (fieldName) {
            const field = this.$v.login[fieldName]

            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        auth() {
            if (!this.$v.$invalid) {
                //Se lanza el dispatch del login
                this.loading = true;
                
                setTimeout(() => {
                    this.$store.dispatch('auth/login', this.login)
                    .then(() => {
                            this.loading = false;
                    })
                }, 2000)
            } 
        }
    }
};
</script>

<style scoped>
.centered-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100vh;
}
.centered-container .title {
    text-align: center;
    margin-bottom: 30px;
}
.centered-container .title img {
    margin-bottom: 16px;
    max-width: 100%;
}
.centered-container .actions .md-button {
    margin: 0;
}
.centered-container .form {
    margin-bottom: 60px;
}
.centered-container .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
}
.centered-container .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
}
.centered-container .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>