<template>
  <div class="app-header">
    <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link>
    <div v-if="isAuthorized">
      <strong>
        <button @click="toggle" > 안녕!! {{ me.name }}({{ me.email }})!!
          <i v-if="!isActive" class="fas fa-sort-down" ></i>
          <i v-else class="fas fa-sort-up" ></i>
        </button>
      </strong>
      <ul v-if="isActive">
        <li><button @click="onClickSignout">로그아웃</button></li>
      </ul>
    </div>
    <div v-else>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    name: 'AppHeader',
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      ...mapGetters(['isAuthorized']),
      ...mapState(['me'])
    },
    methods: {
      toggle () {
        this.isActive = !this.isActive
      },

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