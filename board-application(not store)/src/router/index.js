import Vue from 'vue'
import Router from 'vue-router'

// PostListPage 컴포넌트를 추가한다.
import PostListPage from '../pages/PostListPage'

Vue.use(Router)

export default new Router({

  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PostListPage',

      // PostListPage 컴포넌트를 라우트와 연결한다.
      component: PostListPage
    }
  ]
})