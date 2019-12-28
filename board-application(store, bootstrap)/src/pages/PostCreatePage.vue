<template>
  <b-container class="post-create-page">
    <h3><strong> 게시물 작성하기 </strong></h3>
    <post-create-form @submit="onSubmit" />
  </b-container>
</template>


<script>
  import PostCreateForm from '@/components/PostCreateForm'
  import api from '@/api'


  export default {
    name: 'PostCreatePage',
    components: {
      PostCreateForm
    },
    methods: {
      onSubmit (payload) {
        // console.log(payload)
        const { title, contents } = payload
        api.post('/posts', { title, contents })
          .then(res => {
            alert('게시물이 성공적으로 작성되었습니다.')

            this.$router.push({
              name: 'PostViewPage',
              params: { postId: res.data.id.toString() }
            })
          })
          .catch(err => {
            if (err.response.status === 401) {
              alert('로그인이 필요합니다.')
              this.$router.push({ name: 'Signin' })
            } else {
              alert(err.response.data.msg)
            }
          })
      } 
    }
  }
</script>


<style scoped>

</style>