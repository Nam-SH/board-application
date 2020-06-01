<template>
  <div class="post-list-page">
    <h1>포스트 게시글</h1>
    <post-list :posts="posts" />
    <router-link :to="{ name: 'PostCreatePage' }">글쓰기</router-link>
  </div>
</template>


<script>
  // import PostList from '../components/PostList'
  import PostList from '@/components/PostList'

  // import api from '@/api'
  import { mapActions, mapState } from 'vuex'


  export default {
    name: 'PostListPage',
    components: {
      PostList
    },
    
    computed: {
      // 1. mapState 헬퍼함수를 사용해 스토어의 게시물 상태를 참조하도록 변경
      ...mapState(['posts'])
    },
    // data () {
    //   return {
    //     posts: []
    //   }
    // },


    created () {
      // 2. 매핑된 함수를 실행한다.
      this.fetchPostList()
      // api.get('/posts')
      //   .then(res => {
      //     this.posts = res.data
      //   })
    },
    methods: {
      // 1. fetchPostList를 매핑시킨다.
      ...mapActions([ 'fetchPostList' ])
    }
  }
</script>

<style scoped>

</style>