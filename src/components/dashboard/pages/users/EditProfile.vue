<template>
    <div class="container py-2" v-if="isLoaded">
        <div class="row my-2">
            <md-toolbar class="md-primary mb-2" :md-elevation="1">
                <span class="md-title">Perfil del usuario</span>
            </md-toolbar>
            <div class="col-lg-4 order-lg-0 text-center">
                <md-card>
                    <md-card-media md-medium class="w-100 b-block m-0">
                        <img :src="avatar()" alt="avatar" class="mx-auto img-fluid profile-image">
                    </md-card-media>
                     <md-card-header>
                        <md-card-content>
                            <md-field>
                                <label for="file">Cambiar imagen</label>
                                <md-file id="file" @md-change="changeAvatar()" v-model="new_image" accept="image/*" :disabled="!this.user.admin" />
                            </md-field>
                        </md-card-content>
                    </md-card-header>
                </md-card>
            </div>
            <div class="col-lg-8 order-lg-0 text-center">
                <form novalidate class="md-layout" @submit.prevent="validateChanges">
                    <md-card class="formulario">
                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                <md-field :class="getValidationClass('nombre')">
                                    <label for="nombre">Nombre</label>
                                    <md-input name="nombre" id="nombre" autocomplete="nombre" v-model="form.nombre" :disabled="!this.user.admin || sending" />
                                    <div v-if="$v.form.$error">
                                        <span class="md-error" v-if="!$v.form.nombre.required">El nombre es obligatorio</span>
                                        <span class="md-error" v-else-if="!$v.form.nombre.minlength">Nombre incorrecto</span>
                                    </div>
                                </md-field>
                                </div>

                                <div class="md-layout-item md-small-size-100">
                                <md-field :class="getValidationClass('apellidos')">
                                    <label for="apellidos">Apellidos</label>
                                    <md-input name="apellidos" id="apellidos" autocomplete="apellidos" v-model="form.apellidos" :disabled="!this.user.admin ||sending" />
                                    <div v-if="$v.form.$error">
                                        <span class="md-error" v-if="!$v.form.apellidos.required">Los apellidos son obligatorios</span>
                                        <span class="md-error" v-else-if="!$v.form.apellidos.minlength">Apellidos incorrectos</span>
                                    </div>
                                </md-field>
                                </div>
                            </div>

                            <md-field :class="getValidationClass('cargo')">
                                <label for="cargo">Cargo</label>
                                <md-input name="cargo" id="cargo" autocomplete="position" v-model="form.cargo" :disabled="!this.user.admin ||sending" />
                                <div v-if="$v.form.$error">
                                    <span class="md-error" v-if="!$v.form.cargo.required">El cargo es obligatorio</span>
                                </div>
                            </md-field>

                            <md-field>
                                <label for="email">Email</label>
                                <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="true" />
                            </md-field>

                            <!--<md-field :class="getValidationClass('password')" :md-toggle-password="false">
                                <label for="password">Contraseña</label>
                                <md-input type="password" name="password" id="password" autocomplete="password" v-model="form.password" :disabled="sending" />
                                <div v-if="$v.form.$error">
                                    <span class="md-error" v-if="!$v.form.password.minlength">Password incorrecto</span>
                                </div>
                            </md-field>
                            <md-field  :class="getValidationClass('password_confirm')" :md-toggle-password="false">
                                <label for="password_confirm">Repetir contraseña</label>
                                <md-input type="password" name="password_confirm" id="password_confirm" autocomplete="password_confirm" v-model="form.password_confirm" :disabled="sending" />
                                <div v-if="$v.form.$error">
                                    <span class="md-error" v-if="!$v.form.password_confirm.sameAsPassword">La contraseña debe ser idéntica</span>
                                </div>
                            </md-field>-->
                        </md-card-content>                    
                        <md-progress-bar md-mode="indeterminate" v-if="sending" />
                        <md-card-actions>
                            <md-button type="submit" class="md-primary" :disabled="sending">Actualizar perfil</md-button>
                        </md-card-actions>
                    </md-card>
                    <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
                    <md-snackbar :md-active.sync="uploadImage">La imagen se ha cambiado correctamente</md-snackbar>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { required, 
         minLength,
} from "vuelidate/lib/validators";

export default {
    data() {
        return {
            isLoaded: false,
            profile: null,
            form: {
                nombre: '',
                apellidos: '',
                email: '',
                cargo: '',
            },
            new_image: null,
            uploadImage: false,
            userSaved: false,
            sending: false,
            lastUser: null
        }
    },
    validations: {
      form: {
        nombre: {
          required,
          minLength: minLength(3)
        },
        apellidos: {
          required,
          minLength: minLength(3)
        },
        cargo: {
            required
        }, 
      }
    },
    props: {
        username: String,
        user: Object
    },
    methods: {
        changeAvatar() {
            let file = event.target.files[0];
            this.$store.dispatch('users/imageUpload', {
                username: this.username,
                file,
            })
            .then((response) => {
                    this.profile.imagen = response;
                    this.uploadImage = true
            })
        },
        avatar() {
            return (this.profile!==null) ? this.profile.imagen : 'https://res.cloudinary.com/dfj8xaqmv/image/upload/v1583749912/ingelyt/users/default-avatar_jo0gu8.png';
        },
        getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]
            if (field) {
            return {
                'md-invalid': field.$invalid && field.$dirty
            }
            }
        },
        clearForm () {
            this.$v.$reset()
            this.loadForm()
        },
        async saveUser () {
            if(this.user.admin) {
                this.sending = true

                await this.$store.dispatch('users/changeProfileData', {
                    form: this.form,
                    username: this.username
                })
                .then(() => {
                    this.profile.nombre = this.form.nombre;
                    this.profile.apellidos = this.form.apellidos;
                    this.profile.cargo = this.form.cargo;

                    window.setTimeout(() => {
                        this.lastUser = `${this.form.nombre} ${this.form.apellidos}`
                        this.userSaved = true
                        this.sending = false
                        this.clearForm()
                    }, 1500)
                })
            }
        },
        validateChanges () {
            this.$v.$touch()
            
            if (!this.$v.$invalid) {
                this.saveUser()
            }
        },
        loadForm () {
            this.form.nombre = this.profile.nombre;
            this.form.apellidos = this.profile.apellidos;
            this.form.email = this.profile.email;
            this.form.cargo = this.profile.cargo;

        }
    },
    async created() {
        let username_profile = this.$store.getters['users/getUsername']
        let userData;
        if(this.user.admin || this.username === username_profile)
        {
            if(this.username === username_profile)
            {
                userData = this.user;
            }
            else{
                await this.$store.dispatch('users/getUserByUsername', this.username)
                .then((response) => {
                        userData = response
                })
            }

            this.profile = userData
            this.loadForm();
            this.isLoaded = true;
        }
        else
        {
            // lanzar not authorized
            this.$router.push('/dashboard')
        }        
    }
}
</script>
<style scoped>
    .profile-image {
        width: 140px;
    }

    .md-progress-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }
    .formulario {
        width: 100%;
    }
</style>