import Vue from 'vue'
import Router from 'vue-router'

import PostListPage from '@/pages/PostListPage'
import PostViewPage from '@/pages/PostViewPage'
import PostCreatePage from '@/pages/PostCreatePage'
import PostEditPage from '@/pages/PostEditPage'

import Signup from '@/pages/Signup'
import Signin from '@/pages/Signin'

import AppHeader from '@/components/AppHeader'

import store from '@/store'

Vue.use(Router)

export default new Router({

  mode: 'history',
  routes: [

    {
      path: '/',
      name: 'PostListPage',
      components: {
        header: AppHeader,
        default: PostListPage
      }
    },
    {
      path: '/post/create',
      name: 'PostCreatePage',
      components: {
        header: AppHeader,
        default: PostCreatePage
      },

      // 내비게이션 가드 구현
      beforeEnter (to, from, next) {
        const { isAuthorized } = store.getters
        if (!isAuthorized) {
          alert('로그인이 필요합니다.')
          next({ name: 'Signin' })
        }
        next()
      }
    },
    {
      path: '/post/:postId',
      name: 'PostViewPage',
      components: {
        header: AppHeader,
        default: PostViewPage
      },

      // PostViewPage의 props에 접근해서 postId를 가져오기 위해 true값으로 설정해준다.
      props: {
        default: true
      }
    },
    {
      path: '/post/:postId/edit',
      name: 'PostEditPage',
      components: {
        header: AppHeader,
        default: PostEditPage
      },
      props: {
        default: true
      },
      beforeEnter: (to, from, next) => {
        const { isAuthorized } = store.getters
        if (!isAuthorized) {
          alert('로그인이 필요합니다.')
          next({ name: 'Signin' })
          return
        }
        store.dispatch('fetchPost', to.params.postId)
          .then(() => {
            const post = store.state.post
            const isAuthor = (post.user.id === store.state.me.id)
            if (isAuthor) {
              next()
            }
            else {
              alert('게시물을 수정할 권한이 없습니다.')
              next(from)
            }
          })
          .catch(err => {
            alert(err.response.data.msg)
            next(from)
          })
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        header: AppHeader,
        default: Signup
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ]
})