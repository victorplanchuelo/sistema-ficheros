<template>
  <div>
    <div class="wrapper d-flex align-items-stretch" v-if="!loading">
      <comp-sidebar :user="user" />
      <div class="content-wrapper">
        <comp-header :user="user" />
        <router-view :user="user" id="content-main" class="p-4 p-md-5 pt-5 text-center" />
      </div>
    </div>
    <div class="loading-overlay h100" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
    </div>
  </div>
</template>
<script>
import compSidebar from '../layout/Sidebar.vue'
import compHeader from '../layout/Header.vue'


export default {
    components: {
    compSidebar,
    compHeader
  },
  data() {
    return {
      user: null,
      loading: false
    }
  },
  async created() {
      this.loading = true
      await this.$store.dispatch('users/getUserData')
        .then(() => {
          this.user = this.$store.getters['users/getUser'];
          this.loading = false;
        })
  }
}
</script>
<style scoped>
  .content-wrapper {
    width: 100%;
  }
  .loading-overlay {
    position:absolute;
    top: 50%;
    left: 50%;
  }

  #content-main {
    width: 100%;
    padding: 0;
    min-height: 100vh;
    -webkit-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s; 
    background-image: url('../../assets/images/bk.jpg');
    background-position: center; 
    background-repeat: no-repeat; 
    background-color:rgba(255, 255, 255, 0.1);
    background-size: cover;
  }
</style>