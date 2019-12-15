<template>
  <div class="sign-in-page">
    <h3>로그인</h3>
    <signin-form @submit="onSubmit" />
    <p>회원이 아니신가요? <router-link :to="{ name: 'Signup' }" >회원가입하러 가기</router-link> </p>

  </div>
</template>

<script>
  import SigninForm from '@/components/SigninForm'

  // import api from '@/api'

  // mapActions에 중괄호 꼭 하기
  import { mapActions } from 'vuex'

  export default {
    name: 'Signin',
    components: {
      SigninForm
    },
    methods: {
      
      onSubmit (payload) {
        // console.log(payload)
        // const { email, password } = payload
        // api.post('/auth/signin', { email, password })
        this.signin(payload)
          .then(res => {
            // console.log(res.data.accessToken)
            // const { accessToken } = res.data.accessToken
            // api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

            alert('로그인 되었습니다.')
            this.$router.push({ name: 'PostListPage' })
          })
          .catch(err => {
            alert(err.response.data.msg)
          })
      },
      ...mapActions([ 'signin' ])
    }
  }
</script>