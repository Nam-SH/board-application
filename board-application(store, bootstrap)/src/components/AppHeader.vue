<template>
  <div class="app-header">
    <b-nav tabs justified>
    <b-nav-item> <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link> </b-nav-item>
    <div v-if="isAuthorized">
      <b-dropdown> 
        <template v-slot:button-content > 안녕!! {{ me.name }}({{ me.email }}) </template>
        <b-dropdown-item @click="onClickSignout"> 로그아웃 </b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-else>
      <b-button variant="outline-primary"> <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link> </b-button>
    </div>
    </b-nav>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    name: 'AppHeader',
    computed: {
      ...mapGetters(['isAuthorized']),
      ...mapState(['me'])
    },
    methods: {
      onClickSignout () {
        this.signout()
        this.$router.push({ name: 'PostListPage' })
      },

      ...mapActions(['signout'])
    }
  }
</script>

<style scoped>

</style>