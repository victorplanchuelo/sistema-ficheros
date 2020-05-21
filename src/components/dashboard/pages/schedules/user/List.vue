<template>
    <div v-if="isLoaded">
        <div id="accordionYears" v-if="Object.keys(this.fichajes).length">
            <div class="card bg-primary" v-for="(meses, indexY) in this.fichajes" :key="indexY">
                <div class="card-header" :id="`headingYear_${indexY}`">
                    <h3 class="mb-0">
                        <button class="btn btn-link collapsed text-white" data-toggle="collapse" 
                                :data-target="`#year_${indexY}`" aria-expanded="false" 
                                :aria-controls="`#year_${indexY}`">
                            Año: {{indexY}}
                        </button>
                    </h3>
                </div>
                <div :id="`year_${indexY}`" 
                        class="collapse" :aria-labelledby="`headingYear_${indexY}`" 
                        data-parent="#accordionYears">
                    <div id="accordionMonths" class="card-body">
                        <div class="card bg-secondary" v-for="(dias, indexM) in meses" :key="indexM">
                            <div class="card-header" :id="`headingMonth_${indexY}${indexM}`">
                                <h4 class="mb-0">
                                    <button class="btn btn-link collapsed text-white" data-toggle="collapse" 
                                            :data-target="`#month_${indexY}${indexM}`" aria-expanded="false" 
                                            :aria-controls="`#month_${indexY}${indexM}`">
                                        Mes: {{getMes(indexM)}}
                                    </button>
                                </h4>
                            </div>
                            <div :id="`month_${indexY}${indexM}`" 
                                    class="collapse" :aria-labelledby="`headingMonth_${indexY}${indexM}`" 
                                    data-parent="#accordionMonths">
                                <div class="card-body" id="accordionDays">
                                    <div class="card bg-light" v-for="(operaciones, indexD) in dias" :key="indexD">
                                        <div class="card-header">
                                            <a href="#" data-toggle="collapse" :data-target="`#day_${indexY}${indexM}${indexD}`">Día: {{indexD}}</a>
                                        </div>
                                        <div class="card-body collapse" data-parent="#accordionDays" :id="`day_${indexY}${indexM}${indexD}`">
                                            <ul class="list-group list-group-flush">
                                                <li v-for="(fich, indexO) in operaciones" :key="indexO" class="list-group-item">
                                                    {{fich.hora}} - {{fich.tipo_fichaje}}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const meses = ['Enero', 'Febrero','Marzo','Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre','Diciembre'];

export default {
    data() {
        return {
            fichajes: null,
            username_profile: '',
            isLoaded: false,
        }
    },
    props: {
        user: Object,
        username: String,
    },
    methods: {
        getMes(mes) {
            console.log('mes', meses)
            return meses[mes-1];
        }
    },
    async created() {
        const username_profile = this.$store.getters['users/getUsername']
        let userData;
        if(this.user.admin && this.username !== username_profile)
        {
            await this.$store.dispatch('users/getUserByUsername', this.username)
            .then((response) => {
                    userData = response
            })

            delete userData.fichajes.debe_fichar;
            this.fichajes = userData.fichajes;
            this.isLoaded = true;
        }
        else
        {
            this.$router.push('/dashboard')
            .catch(err => { 
                if (err.name != "NavigationDuplicated") {
                    console.error(err);
                }
            })
        } 
    },
    
}
</script>

