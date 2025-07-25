<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from './stores/data'
import Header from './components/Header-original.vue'
import Footer from './components/Footer.vue'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.loadLikedProducts()
})
</script>

<template>
  <div id="app">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>