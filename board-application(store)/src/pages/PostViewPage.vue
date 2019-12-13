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
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정</router-link>
    <button @click="onDelete">삭제!</button>
    <router-link :to="{ name: 'PostListPage' }">목록</router-link>
  </div>
</template>


<script>
  import { mapActions } from 'vuex'
  import { mapState } from 'vuex'

  import PostView from '@/components/PostView'

  import api from '@/api'

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
      ...mapActions([ 'fetchPost' ]),
      onDelete () {
        // console.log(this.post)
        const { id } = this.post
        // console.log(id)
        api.delete(`/posts/${id}`)
          .then(res => {
            alert('게시물이 성공적을 삭제되었습니다.')
            this.$router.push({ name: 'PostListPage' })
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