<template>
  <div v-if="isLoaded">
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
        :md-description="`No se encontraron usuarios con el nombre '${search}'. Intenta una nueva búsqueda o crea un usuario nuevo.`">
        <md-button class="md-primary md-raised" @click="newUser">Crear nuevo usuario</md-button>
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
            <md-button class="md-icon-button md-primary" :disabled="item.admin !== 0" @click.prevent="editUser(item)">
                <md-icon>edit</md-icon>
                <md-tooltip md-direction="top">Editar usuario</md-tooltip>
            </md-button>
            <md-button class="md-icon-button md-accent" :disabled="item.admin !== 0" @click.prevent="deleteUser(item)">
                <md-icon>delete</md-icon>
                <md-tooltip md-direction="top">Eliminar usuario</md-tooltip>
            </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-button class="md-primary md-raised" @click="newUser">Crear nuevo usuario</md-button>
    <md-dialog-confirm
      :md-active.sync="delUser"
      ref="deleteUserAccount"
      md-title="Borrar usuario"
      md-content="Esta a punto de borrar este usuario. ¿Está seguro?"
      md-confirm-text="Borrar"
      md-cancel-text="Cancelar"
      @md-confirm="onConfirmDeleteUserAccount" />
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
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
    name: 'Perfiles',
    data: () => ({
      isLoaded: false,
      search: null,
      searched: [],
      users: [],
      objDeleteUser: null,
      delUser: false
    }),
    methods: {
        getUsername(email) {
            return email.substring(0, email.lastIndexOf("@"));
        },
        newUser () {
            this.$router.push('profiles/create')
            .catch(err => { 
                // Ignore the vuex err regarding  navigating to the page they are already on.
                if (err.name != "NavigationDuplicated") {
                    // But print any other errors to the console
                    console.error(err);
                }
            })
        },
        searchOnTable () {
            this.searched = searchByEMail(this.users, this.search)
        },
        editUser(user) {
            this.$router.push(`profiles/${this.getUsername(user.email)}`)
            .catch(err => { 
                // Ignore the vuex err regarding  navigating to the page they are already on.
                if (err.name != "NavigationDuplicated") {
                    // But print any other errors to the console
                    console.error(err);
                }
            })
        },
        async deleteUser(user) {
            this.objDeleteUser = user
            this.delUser = true;
        },
        async onConfirmDeleteUserAccount()
        {
            await this.$store.dispatch('users/deleteUser',{
                email: this.objDeleteUser.email
            })
            .then((response) => {
                this.$store.dispatch('users/getAllUsers')
                .then((response) => {
                    this.users = response
                    this.searched = this.users
                }) 
            })
            .catch((error) => {
                console.log('error',error)
            })
        }
    },
    async created () {
        await this.$store.dispatch('users/getAllUsers')
        .then((response) => {
            this.users = response
            this.searched = this.users
            this.isLoaded = true
        })        
    },
  }
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>