<template>
  <b-form @submit.prevent="onSubmit" >
    <fieldset>
      <legend>생성 양식</legend>
      <label>제목</label>
      <b-form-input v-model="title" placeholder="게시물 제목을 입력해주세여"></b-form-input>
      <label>내용</label>
      <b-form-textarea id="textarea" v-model="contents" placeholder="게시물 내용을 입력해주세여" rows="3" max-rows="6" ></b-form-textarea>
      <br>
      <br>
      <b-button type="submit" variant="primary">제출</b-button>
      <b-button type="reset" variant="danger">리셋</b-button>
      <b-button type="reset" variant="success" tex><router-link :to="{ name: 'PostListPage' }">목록</router-link></b-button>
      
    </fieldset>
  </b-form>
</template>

<script>
  export default {
    name: 'PostCreateForm',

    data () {
      return {
        title: '',
        contents: ''
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