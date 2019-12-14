<template>
  <form @submit.prevent="submit" novalidate>
    <fieldset>
      <input type="text" v-model="name" placeholder="홍길동">
      <input type="text" v-model="email" placeholder="abc123@google.com">
      <input type="password" v-model="password" placeholder="최소 8자 입력하시오">
      <input type="password" v-model="passwordConfirm" placeholder="비밀번호를 다시 한번 입력하시오">
      
      <button type="submit">회원가입!</button>
    </fieldset>
    
  </form>
</template>

<script>
  export default {
    name: 'SignupForm',
    data () {
      return {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    },
    methods: {
      submit () {
        const { name, email, password, passwordConfirm } = this

        if (!name || !email || !password || !passwordConfirm) {
          alert('모든 항목을 입력하시오')
        }
        if (password !== passwordConfirm) {
          alert('비밀번호가 일치하지 않습니다.')
          return
        }
        this.$emit('submit', { name, email, password })
      }
    }
  }
</script>

<style scoped>

</style>