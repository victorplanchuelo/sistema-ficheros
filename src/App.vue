<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('auth/refreshToken')
  }
}
</script>
