<template>
  <div>
    <comp-header />
    <comp-sidebar />
    <router-view />
    <comp-footer />
  </div>
</template>

<script>
import compHeader from './components/layout/Header.vue'
import compFooter from './components/layout/Footer.vue'
import compSidebar from './components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: {
    compHeader,
    compFooter,
    compSidebar
  }
}
</script>
