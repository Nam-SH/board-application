import { FETCH_POST_LIST } from './mutations-types'
import { FETCH_POST } from './mutations-types'

export default {

  [FETCH_POST_LIST] (state, posts) {
    state.posts = posts
  },

  [FETCH_POST] (state, post) {
    state.post = post
  }
}