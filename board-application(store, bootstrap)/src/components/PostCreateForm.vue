<template>
  <form @submit.prevent="onSubmit" >
    <fieldset>
      <legend>생성 양식</legend>

      <label>제목</label>
      <input v-model="title" type="text" placeholder="게시물 제목을 입력해주세여">

      <label>내용</label>
      <textarea v-model="contents" type="text" placeholder="게시물 내용을 입력해주세여"> </textarea>
      <button type="submit">제출!</button>
    </fieldset>

  </form>
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