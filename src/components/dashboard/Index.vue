<template>
    <div>
        <comp-header />
        <comp-sidebar />
        <comp-footer />
    </div>
</template>
<script>
import compHeader from '../layout/Header.vue'
import compFooter from '../layout/Footer.vue'
import compSidebar from '../layout/Sidebar.vue'

export default {
    components: {
    compHeader,
    compFooter,
    compSidebar
  },
  computed: {
    isAuth()
    {
        return this.$store.getters['auth/isAuth']
    }
  },
}
</script>