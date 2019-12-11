<template>
  <div id="app">
    
    <router-view name="header" />
    <router-view />

  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'

export default {
  name: 'App',
  components: { AppHeader }
}
</script>

<style>
@import 'http://localhost:8000/assets/index.css'

</style>
