<template>
  <div class="post-list-page">
    <h1>포스트 게시글</h1>

    <!-- PostListPage는 껍데기 역할만 하고, 실질적인 페이지의 내용을 보여주는 것은 PostList에 작성한다. -->
    <post-list :posts="posts" />
  </div>
</template>

<script>

  // PostList 컴포넌트를 추가한다.
  import PostList from '@/components/PostList'

  // 커스텀마이징된 `axios` 객체를 추가한다.
  import api from '@/api'

  export default {
    name: 'PostListPage',
    components: {
      PostList
    },

    // 컴포넌트 내에 데이터를 생성한다.
    data () {
      return {
        posts: []
      }
    },
    
    created () {
      api.get('/posts')
        .then(res => {
          this.posts = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>

<style scoped>

</style>