<template>
  <div class="app-header">
    <h1>Community</h1>
    <div v-if="isAuthorized">
      <strong>
        <button> 안녕 {{ me.name }}({{me.email}})!!</button>
      </strong>
    </div>

    <div v-else>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'AppHeader',
    computed: {
      ...mapGetters(['isAuthorized']),
      ...mapState(['me'])
    }
  }
</script>

<style scoped>

</style>