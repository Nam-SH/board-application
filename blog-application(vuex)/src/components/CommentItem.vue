<template>
  <div class="comment-item">
    <strong>{{ comment.user.name }}</strong><span>{{ comment.createdAt }}</span>
    <div v-if="isEditing">
      <textarea v-model="editMessage" rows="3" ref="contents"></textarea>
      <button @click="onEdit">수정완료</button>
    </div>
    <p v-else>{{ comment.contents }}</p>
    <ul v-if="isMyComment">
      <li> <button type="button" @click="toggleEditMode" @blur="handleBlur">{{ editButtonText }}</button> </li>
      <li> <button type="button" @click="onDelete">삭제</button> </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true,
      validator (comment) {
        const isValidCommentId = typeof comment.id === 'number'
        const isValidContents = comment.contents && comment.contents.length
        const isValidUser = !!comment.user
        return isValidCommentId && isValidContents && isValidUser
      }
    }
  },
  computed: {
    ...mapState(['me']),
    ...mapGetters(['isAuthorized']),
    isMyComment() {
      return this.isAuthorized && this.comment.user.id === this.me.id
    },
    editButtonText () {
      return this.isEditing ? '수정 취소':'수정'
    },
    isValidComment () {
      return 0 < this.editMessage.length < 256
    }
  },
  data () {
    return {
      isEditing: false,
      editMessage: ''
    }
  },
  methods: {
    toggleEditMode () {
      this.isEditing = !this.isEditing
      console.log('toggleEditMode', this.isEditing)
      // this.$refs.contents.focus() 만 추가할 시,undefined 에러가 발생한다.
      // 따라서 nextTick 함수를 사용한다.
      if (this.isEditing) {
        this.editMessage = this.comment.contents
        this.$nextTick(() => {
          this.$refs.contents.focus()
      })
      }
      else {
        this.$refs.contents.blur()
      }
    },
    handleBlur() {
      console.log('handleBlur', this.isEditing)
      // this.isEditing = !this.isEditing
    }
    ,
    onEdit() {
      if (this.isValidComment) {
        // console.log('길이 통과~')
        this.isEditing = false
        const { id } = this.comment
        this.$emit('edit', { id, comment: this.editMessage })
      }
      else {
        alert('댓글을 1글자 이상 255자 이하여야 한다.')
      }
    },
    onDelete () {
      const { id } = this.comment
      this.$emit('delete', id)
    }
  }
}
</script>