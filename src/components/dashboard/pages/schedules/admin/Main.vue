<template>
    <div>
        <div  v-if="isLoaded">
            <md-table v-model="searched" md-sort="nombre" md-sort-order="asc" md-card md-fixed-header>
                <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                    <h1 class="md-title">Usuarios</h1>
                    </div>

                    <md-field md-clearable class="md-toolbar-section-end">
                    <md-input placeholder="Buscar por Nombre..." v-model="search" @input="searchOnTable" />
                    </md-field>
                </md-table-toolbar>

                <md-table-empty-state
                    md-label="No se encontraron usuarios"
                    :md-description="`No se encontraron usuarios con el nombre '${search}'. Intenta una nueva búsqueda.`">
                </md-table-empty-state>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Imagen" md-sort-by="imagen">
                        <md-avatar>
                            <img :src="item.imagen" alt="Avatar">
                        </md-avatar>
                    </md-table-cell>
                    <md-table-cell md-label="Nombre" md-sort-by="nombre">{{ item.nombre }}</md-table-cell>
                    <md-table-cell md-label="Apellidos" md-sort-by="apellidos">{{ item.apellidos }}</md-table-cell>
                    <md-table-cell md-label="E-Mail" md-sort-by="email">{{ item.email }}</md-table-cell>
                    <md-table-cell>
                        <md-button class="md-icon-button md-primary" :disabled="item.admin !== 0" @click.prevent="schedulesUser(item)">
                            <md-icon>calendar_today</md-icon>
                            <md-tooltip md-direction="top">Ver fichajes</md-tooltip>
                        </md-button>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>
        
        <md-dialog-alert
            :md-active.sync="notAuthorized"
            md-content="No estás autorizado a ver esta página"
            md-confirm-text="Cerrar" />
    </div>
</template>
<script>
const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByEMail = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.nombre).includes(toLower(term)))
    }

    return items
  }

export default {
    data() {
        return {
            isLoaded: false,
            notAuthorized: false,
            intAlert: 0,

            search: null,
            searched: [],
            users: [],
        }
    },
    props: {
        username: String,
        user: Object
    },
    async created() {
        if(this.user.fichajes.debe_fichar)
        {
            this.notAuthorized = true
            this.intAlert = setInterval(this.closeNotAuthorizedAlert, 1000)
        }
        else {
            await this.$store.dispatch('users/getAllUsers')
            .then((response) => {
                this.users = response
                this.searched = this.users
                this.isLoaded = true
            }) 
        }
    },
    methods: {
        closeNotAuthorizedAlert() {
            if(!this.notAuthorized)
            {
                clearInterval(this.intAlert)
                this.$router.push('/dashboard')
                .catch(err => { 
                    if (err.name != "NavigationDuplicated") {
                        console.error(err);
                    }
                })
    
            }
        },
        getUsername(email) {
            return email.substring(0, email.lastIndexOf("@"));
        },
        searchOnTable () {
            this.searched = searchByEMail(this.users, this.search)
        },
        schedulesUser(user) {
            this.$router.push(`schedules/${this.getUsername(user.email)}/list`)
            .catch(err => { 
                // Ignore the vuex err regarding  navigating to the page they are already on.
                if (err.name != "NavigationDuplicated") {
                    // But print any other errors to the console
                    console.error(err);
                }
            })
        },
    },
}
</script>