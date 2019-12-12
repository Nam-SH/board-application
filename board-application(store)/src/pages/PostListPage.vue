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
      ...mapState(['posts'])
    },
    // data () {
    //   return {
    //     posts: []
    //   }
    // },


    created () {
      this.fetchPostList()
      // api.get('/posts')
      //   .then(res => {
      //     this.posts = res.data
      //   })
    },
    methods: {
      ...mapActions(['fetchPostList'])
    }
  }
</script>

<style scoped>

</style>