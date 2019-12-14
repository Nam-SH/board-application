<template>
  <div class="comment-form">
    <textarea v-model="comment" rows="5" placeholder="댓글을 입력해주세요"></textarea>
    <button type="button" @click="onCommentSubmit">등록</button>
  </div>
</template>

<script>
  export default {
    name: 'CommentForm',
    data () {
      return {
        comment: ''
      }
    },
    methods: {
      onCommentSubmit () {
        console.log('onSubmit', this.comment)
        const { comment } = this
        this.$emit('submit', comment)
        this.comment = ''
      }
    }
  }
</script>

<stylescoped>

</style>