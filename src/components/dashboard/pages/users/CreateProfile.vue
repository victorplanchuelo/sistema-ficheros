<template>
  <div v-if="isLoaded">
    <md-steppers :md-active-step.sync="active" md-vertical md-linear>
      <md-step id="primero" md-label="Primer paso" :md-error="createdFailed" :md-editable="false" :md-done.sync="primero">
        <p>Primeramente indica el email y la contraseña del usuario, para poder crear la cuenta.</p>
        <form novalidate class="md-layout" @submit.prevent="validatePasswordChanges">
            <md-card class="formulario col-12">
                <md-card-content>
                    <md-field :class="getValidationClass('form_usuario','email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form_usuario.email" />
                        <div v-if="$v.form_usuario.$error">
                            <span class="md-error" v-if="!$v.form_usuario.email.required">El email es obligatorio</span>
                            <span class="md-error" v-else-if="!$v.form_usuario.email.email">Email incorrecto</span>
                            <span class="md-error" v-else-if="!$v.form_usuario.email.isUnique">El email ya existe</span>
                        </div>
                    </md-field>

                    <md-field :class="getValidationClass('form_usuario','password')" :md-toggle-password="true">
                        <label for="password">Contraseña</label>
                        <md-input type="password" name="password" id="password" autocomplete="password" v-model="form_usuario.password" />
                        <div v-if="$v.form_usuario.$error">
                            <span class="md-error" v-if="!$v.form_usuario.password.required">La contraseña es obligatoria</span>
                            <span class="md-error" v-if="!$v.form_usuario.password.minlength">La contraseña debe tener 4 caracteres mínimo</span>
                        </div>
                    </md-field>
                    <md-field  :class="getValidationClass('form_usuario','password_confirm')" :md-toggle-password="true">
                        <label for="password_confirm">Repetir contraseña</label>
                        <md-input type="password" name="password_confirm" id="password_confirm" autocomplete="password_confirm" v-model="form_usuario.password_confirm" />
                        <div v-if="$v.form_usuario.$error">
                            <span class="md-error" v-if="!$v.form_usuario.password_confirm.required">La confirmación de la contraseña es obligatoria</span>
                            <span class="md-error" v-if="!$v.form_usuario.password_confirm.sameAsPassword">La contraseña debe ser idéntica</span>
                        </div>
                    </md-field>
                </md-card-content>
                <md-progress-bar md-mode="indeterminate" v-if="sending" />
            </md-card>
            <md-button type="submit" class="md-raised md-primary">Continuar</md-button>
        </form> 
      </md-step>

      <md-step id="segundo" md-label="Segundo paso" :md-error="segundoPasoError" :md-editable="false" :md-done.sync="segundo">
          <p>A continuación sube una imagen.</p>
         <md-card>
            <md-card-media md-medium class="w-100 b-block m-0">
                <img :src="'https://res.cloudinary.com/dfj8xaqmv/image/upload/v1583749912/ingelyt/users/default-avatar_jo0gu8.png'" alt="avatar" class="mx-auto img-fluid profile-image">
            </md-card-media>
                <md-card-header>
                <md-card-content>
                    <md-field>
                        <label for="file">Cambiar imagen</label>
                        <md-file id="file" @md-change="createAvatar()" accept="image/*" />
                    </md-field>
                </md-card-content>
            </md-card-header>
        </md-card>
        <md-button type="button" class="md-raised md-primary" @click="setDone('segundo', 'tercero')">Omitir este paso</md-button>
      </md-step>

      <md-step id="tercero" md-label="Tercer paso" :md-error="dataFailed"  :md-editable="false" :md-done.sync="tercero">
        <p>Lo siguiente es añadir algo de información</p>
        <form novalidate class="md-layout" @submit.prevent="validateData">
            <md-card class="formulario col-12">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('form_data','nombre')">
                            <label for="nombre">Nombre</label>
                            <md-input name="nombre" id="nombre" autocomplete="nombre" v-model="form_data.nombre" />
                            <div v-if="$v.form_data.$error">
                                <span class="md-error" v-if="!$v.form_data.nombre.required">El nombre es obligatorio</span>
                                <span class="md-error" v-else-if="!$v.form_data.nombre.minlength">Nombre incorrecto</span>
                            </div>
                        </md-field>
                        </div>

                        <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('form_data','apellidos')">
                            <label for="apellidos">Apellidos</label>
                            <md-input name="apellidos" id="apellidos" autocomplete="apellidos" v-model="form_data.apellidos" />
                            <div v-if="$v.form_data.$error">
                                <span class="md-error" v-if="!$v.form_data.apellidos.required">Los apellidos son obligatorios</span>
                                <span class="md-error" v-else-if="!$v.form_data.apellidos.minlength">Apellidos incorrectos</span>
                            </div>
                        </md-field>
                        </div>
                    </div>

                    <md-field :class="getValidationClass('form_data','cargo')">
                        <label for="cargo">Cargo</label>
                        <md-input name="cargo" id="cargo" autocomplete="position" v-model="form_data.cargo" />
                        <div v-if="$v.form_data.$error">
                            <span class="md-error" v-if="!$v.form_data.cargo.required">El cargo es obligatorio</span>
                        </div>
                    </md-field>
                </md-card-content>                    
                <md-progress-bar md-mode="indeterminate" v-if="sending" />
            </md-card>
            <md-button type="submit" class="md-raised md-primary">Continuar</md-button>
        </form>
      </md-step>
      <md-step id="cuarto" md-label="Cuarto paso" :md-editable="false" :md-done.sync="cuarto">
          <p>Por último elije qué tardes trabajará.</p>
          <form novalidate class="md-layout" @submit.prevent="validateSchedule"> 
            <md-card class="formulario col-12">
                <md-card-content>
                    <md-field>
                        <md-checkbox v-model="tardes" value="1">Lunes</md-checkbox>
                        <md-checkbox v-model="tardes" value="2">Martes</md-checkbox>
                        <md-checkbox v-model="tardes" value="3">Miércoles</md-checkbox>
                        <md-checkbox v-model="tardes" value="4">Jueves</md-checkbox>
                        <md-checkbox v-model="tardes" value="5">Viernes</md-checkbox>
                    </md-field>
                </md-card-content>
            </md-card>
            <md-button type="submit" class="md-raised md-primary">Finalizar</md-button>
        </form>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { required, sameAs, minLength, email} from "vuelidate/lib/validators";

  export default {
    data: () => ({
      username: null,
      active: 'primero',
      primero: false,
      segundo: false,
      tercero: false,
      cuarto: false,
      segundoPasoError: null,
      dataFailed: null,

      isLoaded: false,
      sending: false,

      form_usuario: {
          email: '',
          password: '',
          password_confirm: ''
      },
      form_data: {
          nombre: '',
          apellidos: '',
          cargo: ''
      },
      tardes: []
    }),
    validations: {
        form_usuario: {
            email: {
                required,
                email,
                async isUnique(value) {
                    this.$store.commit('auth/createdUser', null)
                    this.$v.$reset();
                    console.log(this.$v)
                    if (value === '') return true
                    return await new Promise((resolve, reject) => {
                        let username = value.substring(0, value.lastIndexOf("@"));
                        this.$store.dispatch('users/getUserByUsername', username)
                        .then((response) => {
                            console.log(Object.keys(response).length)
                            return (Object.keys(response).length === 0) ? resolve(true) : reject(false)
                        })
                    });

                    
                }
            },
            password: {
                required,
                minLength: minLength(4)
            },
            password_confirm: {
                required,
                sameAsPassword: sameAs('password')
            }     
        },
        form_data: {
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
            }
        }
    },
    computed: {
        createdFailed() {
            if(this.$store.state.auth.createdUser!== null) {
                return (this.$store.state.auth.createdUser===false) ?  'Hay errores en este paso' : null;
            }

            return null;
        }
    },
    methods: {
        setDone (id, index) {
            this[id] = true

            this.stepError = null

            if (index) {
                this.active = index
            }
        } ,
        setError (id) {
            const error = 'Hay errores en este paso'
            if(id==='primero') {
                this.$store.commit('auth/createdUser', false)
            }

            if(id==='segundo') {
                this.segundoPasoError = error
            }

            if(id==='tercero') {
                this.dataFailed = error
            }    
        },
        getValidationClass(form, fieldName)
        {
            const field = this.$v[form][fieldName]
            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        async validatePasswordChanges()
        {
            this.$v.$reset();
            this.$v.$touch()
            
            console.log('antes del invalid')
            console.log(this.$v.form_usuario.$invalid)
            if (!this.$v.form_usuario.$invalid) {
                this.sending = true;
                
                await this.$store.dispatch('auth/createUser', {
                    email: this.form_usuario.email,
                    password: this.form_usuario.password
                })
                .then((response) => {
                    if(response.ok) {
                        this.$store.dispatch('users/createUserNode', {
                            email: this.form_usuario.email,
                            password: this.form_usuario.password
                        })
                        .then((response) => {
                            this.username = this.form_usuario.email.substring(0, this.form_usuario.email.lastIndexOf("@"));
                            this.setDone('primero', 'segundo')
                        })
                    } 
                    else{
                        this.setError('primero')
                    } 
                    this.sending = false; 
                })    
            }
            else {
                this.setError('primero')
            }
            
        },
        createAvatar() {
            this.sending = true;
            let file = event.target.files[0];
            this.$store.dispatch('users/imageUpload', {
                username: this.username,
                file,
            })
            .then((response) => {
                this.setDone('segundo', 'tercero')
                this.sending = false;
            })
            .catch((error) => {
                this.setError('segundo')
                this.sending = false;
            })
        },
        async validateData() {
            this.$v.$touch()
            
            if (!this.$v.form_data.$invalid) {
                this.sending = true;
                
                await this.$store.dispatch('users/changeProfileData', {
                    form: this.form_data,
                    username: this.username
                })
                .then((response) => {
                    this.sending = false; 
                    this.setDone('tercero', 'cuarto')
                })    
            }
            else {
                this.setError('tercero')
            }
        },
        async validateSchedule() {
            this.sending = true;
                
            await this.$store.dispatch('users/addScheduleData', {
                tardes: this.tardes,
                username: this.username
            })
            .then((response) => {
                this.sending = false; 
                this.setDone('cuarto')
                this.$router.push('/dashboard') 
                .catch(err => { 
                    // Ignore the vuex err regarding  navigating to the page they are already on.
                    if (err.name != "NavigationDuplicated") {
                        // But print any other errors to the console
                        console.error(err);
                    }
                })
            })    
        }
    },
    created() {
        this.isLoaded = true;
    },
}
</script>

<style scoped>
    .md-steppers {

    }
    .profile-image {
        width: 140px;
    }

    .md-progress-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }
</style>