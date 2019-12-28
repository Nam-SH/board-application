<template>
  <b-container class="post-list-page">
    <h1>포스트 게시글</h1>
    <post-list :posts="posts" />
    <b-button variant="outline-primary"> <router-link :to="{ name: 'PostCreatePage' }">글쓰기</router-link> </b-button>
  </b-container>
</template>


<script>
  import PostList from '@/components/PostList'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'PostListPage',
    components: {
      PostList
    },
    
    computed: {
      ...mapState(['posts'])
    },

    created () {
      this.fetchPostList()
    },
    methods: {
      ...mapActions([ 'fetchPostList' ])
    }
  }
</script>