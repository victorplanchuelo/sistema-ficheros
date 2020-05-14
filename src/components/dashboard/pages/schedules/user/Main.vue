<template>
    <div>
        <div v-if="isLoaded">
            
            <div class="alert alert-success alert-dismissible" v-if="isScheduled">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                Registro <strong>{{actionText}}</strong> realizado correctamente a las {{actionHora}}
            </div>
            <md-card class="col-lg-4 col-md-6 col-sm-8 m-0 mx-auto">
                <md-card-content class="text-center">
                    <div class="box">
                        <div class="clock">
                            <span class="hours" ref="hours" :style="`transform: rotate(${styleHours}deg);`"></span>
                            <span class="minutes" ref="minutes" :style="`transform: rotate(${styleMinutes}deg);`"></span>
                            <span class="seconds" ref="seconds" :style="`transform: rotate(${styleSeconds}deg);`"></span>
                        </div>
                        <div class="time mb-3">
                            <div id="fulltime">{{hora}}</div>
                        </div>
                        <div class="date">
                            <div id="day">{{dia}}</div>
                            <div id="month">{{getMonth}}</div>
                            <div id="year">{{anyo}}</div>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions class="mx-auto">
                    <md-button class="md-raised md-accent w-100" @click="fichar">{{getTextoBoton}}</md-button>
                </md-card-actions>
            </md-card>
        </div>
        <md-dialog-alert
            :md-active.sync="notAuthorized"
            md-content="No estás autorizado a ver esta página"
            md-confirm-text="Cerrar" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            today: null,
            hora:'',
            anyo: 0,
            mes: 0,
            dia: 0,
            isLoaded: false,

            styleHours: 0,
            styleMinutes: 0,
            styleSeconds: 0,

            notAuthorized: false,
            varAlert : 0,

            fichajes: null,

            isScheduled: false,
            actionText: '',
            actionHora: '',
        }
    },
    computed: {
        getMonth() {
            let m = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            return m[this.mes-1]
        },
        getTextoBoton() {
            return this.$store.state.schedules.textoBoton
        },
        getFichajes() {
            return this.$store.state.schedules.fichajes
        }
    },
    props: {
        username: String,
        user: Object
    },
    created() {
        let username_profile = this.$store.getters['users/getUsername']
        this.fichajes = this.user.fichajes
        if(!this.user.fichajes.debe_fichar || username_profile !== this.username)
        {
            this.notAuthorized = true
            this.intAlert = setInterval(this.closeNotAuthorizedAlert, 1000)
        }
        else {
            setInterval(() => {
                this.getNow()
            }, 1000);

            this.checkScheduleStatus()
        }
    },
    methods: {
        async fichar() {
            this.createDailyNodeForUserSchedule();
        },
        async createDailyNodeForUserSchedule() {
            this.fichajes = this.getFichajes
            await this.$store.dispatch('schedules/createNodeSchedule', {
                username: this.username,
                fichajes: this.fichajes,
                fecha: {
                    anyo: this.anyo,
                    mes: this.mes,
                    dia: this.dia,
                } ,
                hora: this.hora
            })
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
                this.isScheduled = response.exito
                this.actionText = response.actionText
                this.actionHora = response.actionHora
                this.fichajes = this.getFichajes
            })
        },
        
        async checkScheduleStatus() {  
            this.getNow();

            return await this.$store.dispatch('schedules/scheduleInitialStatus', {
                fichajes: this.fichajes,
                fecha: {
                    anyo: this.anyo,
                    mes: this.mes,
                    dia: this.dia
                } 
            })
            .then(() => {
            })   
        },
        
        closeNotAuthorizedAlert() {
            if(!this.notAuthorized)
            {
                clearInterval(this.intAlert)
                this.$router.push('/dashboard')
                .catch(err => { 
                    // Ignore the vuex err regarding  navigating to the page they are already on.
                    if (err.name != "NavigationDuplicated") {
                        // But print any other errors to the console
                        console.error(err);
                    }
                })
    
            }
        },
        zeroPadding(num, digit) {
            var zero = '';
            for(var i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
        },
        getNow() {
            this.today = new Date();
            this.dia = this.today.getDate();
            this.mes = this.today.getMonth()+1;
            this.anyo = this.today.getFullYear();

            this.hora = this.zeroPadding(
                this.today.getHours(), 2) + ':' + this.zeroPadding(this.today.getMinutes(), 2) + ':' + this.zeroPadding(this.today.getSeconds(), 2);
    
            this.styleSeconds = this.today.getSeconds() * 6,
            this.styleMinutes = this.today.getMinutes() * 6 + (this.styleSeconds / 60),
            this.styleHours = this.today.getHours() % 12 / 12 * 360 + (this.styleMinutes / 12);  


            if(!this.isLoaded)
                this.isLoaded = true;
        },
        
    }
}
</script>
<style scoped>
    body {
        background-color:#2C3E50;
        font-family:Arial, sans-serif;
        text-align:center;
    }

    .box {
        background:#FFF;
        border-radius:5px;
        display:inline-block;
        margin:6em 0 0;
        padding:0 20px 20px;
    }

    .date #day {
        color:#454545;
        font-size:2em;
        padding:10px 0 0;
    }

    .date #month {
        color:#454545;
        font-size:1.8em;
        padding:10px 0;
    }

    .date #year {
        color:#454545;
        font-size:1.8em;
    }

    .clock {
        background-color:#D75B42;
        border: 0.6em solid white;
        border-radius: 100%;
        height: 12em;
        margin-top:-50%;
        position: relative;
        width: 12em;
    }
    .clock span {
        background: white;
        bottom: 50%;
        display: block;
        left: 50%;
        position: absolute;
        transform-origin: bottom center;
    }
    .clock .hours {
        height: 20%;
        width: 0.2em;
    }
    .clock .minutes {
        height: 35%;
        width: 0.2em;
    }

    .clock .seconds {
        height: 45%;
        width: 0.2em;
    }

    .time #fulltime {
        color:#C1C1C1;
        font-size:1.8em;
    }
</style>