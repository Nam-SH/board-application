<template>
  <div class="container">
  <b-form @submit.prevent="onSubmit" >
      <b-form-group label="게시물 번호:" label-for="input-1">
        <b-form-input id="input-1" type="text" :value="post.id" disabled ></b-form-input>
      </b-form-group>

      <b-form-group label="게시물 생성일:" label-for="input-2">
        <b-form-input id="input-2" type="text" :value="post.createdAt" disabled ></b-form-input>
      </b-form-group>

      <b-form-group label="제목:" label-for="input-3">
        <b-form-input id="input-3" v-model="title" type="text" placeholder="게시물 제목을 입력해주세여" ></b-form-input>
      </b-form-group>

      <label for="input-4">내용: </label>
      <b-form-textarea id="input-4" v-model="contents" rows="5" type="text" placeholder="게시물 내용을 입력해주세여">
      </b-form-textarea>

      <b-button variant="success" type="submit" style="color: white;">수정</b-button>
      <b-button variant="danger" ><router-link :to="{ name: 'PostViewPage', params: { postId: post.id } }" style="color: white;">취소</router-link></b-button>
      
  </b-form>
  </div>
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

<style scoped>

</style>