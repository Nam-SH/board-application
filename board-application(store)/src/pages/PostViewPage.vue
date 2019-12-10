<template>
  <div class="post-view-page">
    <!-- <div class="post-view">
      <div>
        <h1>글 제목</h1>
        <span>게시판 번호 1</span>
        <strong>작성자:: 작성 시간</strong>
      </div>
      <p>글 내용</p>
    </div> -->

    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostListPage' }">목록</router-link>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mapState } from 'vuex'

  import PostView from '@/components/PostView'

  export default {
    name: 'PostViewPage',

    components: {
      PostView
    },

    computed: {
      ...mapState(['post'])
    },

    props: {
      postId: {
        type: String,
        required: true
      }
    },

    methods: {
      ...mapActions([ 'fetchPost' ])
    },
    created () {
      this.fetchPost(`/${this.postId}`)
        .catch(err => {
          alert(err.response.data.msg)
          this.$router.back()
        })
    }

  }
</script>

<style scoped>

</style>