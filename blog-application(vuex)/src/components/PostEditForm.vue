<template>
  <form @submit.prevent="onSubmit" >
    <fieldset>
      <legend>생성 양식</legend>

      <label>게시물 번호</label>
      <input type="text" :value="post.id" disabled>

      <label>게시물 생성일</label>
      <input type="text" :value="post.createdAt" disabled>

      <label>제목</label>
      <input v-model="title" type="text" placeholder="게시물 제목을 입력해주세여">

      <label>내용</label>
      <textarea v-model="contents" rows="5" type="text" placeholder="게시물 내용을 입력해주세여"> </textarea>

      <button type="submit">수정!</button>
      <router-link :to="{ name: 'PostViewPage', params: { postId: post.id } }">취소!</router-link>
      
    </fieldset>
  </form>
</template>

<script>
  export default {
    name: 'PostEditForm',
    data () {
      return {
        title: '',
        contents: ''
      }
    },
    created() {
      this.title = this.post.title
      this.contents = this.post.contents
    },
    methods: {
      onSubmit () {
        const { title, contents } = this
        this.$emit('submit', { title, contents })
      }
    },
    props: {
      post: {
        type: Object,
        required: true,
        validator (post) {
          const isValidPostId = typeof post.id === 'number'
          const isValidTitle = !!post.title && post.title.length
          const isValidContents = post.contents && post.contents.length
          return isValidPostId && isValidTitle && isValidContents
        }
      }
    },
    methods: {
      onSubmit () {
        const { title, contents } = this
        this.$emit('submit', { title, contents })
      }
    }
  }
</script>