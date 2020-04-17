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
      </md-table-row>
    </md-table>
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
    name: 'TableSearch',
    data: () => ({
      isLoaded: false,
      search: null,
      searched: [],
      users: []
    }),
    methods: {
      newUser () {
        window.alert('Noop')
      },
      searchOnTable () {
        this.searched = searchByEMail(this.users, this.search)
      }
    },
    async created () {
        await this.$store.dispatch('users/getAllUsers')
        .then((response) => {
            console.log(response)
            this.users = response
            this.searched = this.users
            this.isLoaded = true
        })        
    }
  }
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
</style>