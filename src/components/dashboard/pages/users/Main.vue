<template>
  <div v-if="isLoaded">
    Main users profiles
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
  export default {
    data() {
        return {
            isLoaded: false,
        }
    },
    created() {
        this.isLoaded = true
    }
}
</script>

<style scoped>
    
</style>