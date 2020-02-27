<template>
    <div class="wrapper d-flex align-items-stretch">
        <comp-sidebar />
        <div class="content-wrapper">
          <comp-header />
          <router-view />
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
  }
}
</script>
<style scoped>
  .content-wrapper {
    width: 100%;
  }
</style>