# board-application

> NAM-SH's Vue.js project

## 0. 서론

### 0.1 목표

- 모든 사용자는 타인의 게시물과 댓글을 조회할 수 있다.
- 인증된 사용자만 게시물과 댓글을 작성할 수 있다.
- 자신의 게시물과 댓글만 수정 및 삭제를 할 수 있다.
- 사용자는 다른 사용자의 게시물에 여러 개의 댓글을 남길 수 있다.



## 1. 프로젝트 생성

### 1.1 프로젝트 구성

``` bash
# 1. 환경 구축
$ vue init webpack board-application

# 2. 폴더 이동 및 필요모듈 설치
$ cd board-application
$ cd npm install 	# or npm i <필요 모듈>

# 3. 서버 실행
$ cd npm run dev
```

### 1.2  스타일 적용하기

```vue
// board-application/src/App.vue

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 스타일을 적용시킨다. */
@import 'http://localhost:8000/assets/index.css';
</style>
```



## 2. Store 사용 및 게시글 페이지 구현

### 2.1 `Vuex` 설치 및 필요파일 생성

```bash
$ npm install veux --save
```

```

```

### 2.2  `Vuex` 기본설정

```javascript
// src/store/index.js

import Vue from 'vue'
import Vuex from 'vuex'

import state from './states.js'
import getters from './getters.js'
import mutations from './mutations'
import actions from './actions.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
```

### 2.3 `main.js`의 vue 인스턴스에 `store` 옵션을 주입

```javascript
// src/main.js

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import store from './store'

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App/>'
})
```

### 2.4 `states.js`에 게시물에 대한 상태를 추가

```javascript
// src/store/states.js

export default {
  posts: [],
}
```

### 2.5 추가한 스토어의 값을 변경할 수 있는 변이(`Mutation`) 작성

```javascript
// src/store/mutations-types.js

// 먼저 mutations-types.js에 변이 이름을 상수로 선언한다.
export const FETCH_POST_LIST = 'FETCH_POST_LIST'
```

```javascript
// src/store/mutations.js

import { FETCH_POST_LIST } from './mutations-types'

export default {
  [FETCH_POST_LIST] (state, posts) {
    state.posts = posts
  }
}
```

### 2.6 `Actions.js` 작성

- api모듈을 사용해서 서버로부터 게시물을 받아올 요청을 생성하도록 함수 작성
- 응답으로 내려온 게시물 데이터를 `FETCH_POST_LIST` 변이의 실행과 함께 인자로 넘김

```javascript
// src/store/actions.js

import api from '@/api'
import { FETCH_POST_LIST } from './mutations-types'


export default {
  fetchPostList({ commit }) {
    return api.get('/posts')
      .then(res => {
        commit(FETCH_POST_LIST, res.data)
      })
  },
```

- 여기까지 `fetchPostList` 액션과 `FETCH_POST_LIST` 변이를 통해 스토어의 상태에 서버로부터 받아온 게시물 자원들을 저장하는 과정이 끝남

### 2.7  `PostListPage`에 `mapActions`, `mapState` 헬퍼함수 추가

```vue
// src/pages/PostListPage.vue

<script>

  // import api from '@/api'
  import { mapActions, mapState } from 'vuex'


  export default {
    name: 'PostListPage',
    
    computed: {
    // 1. mapState 헬퍼함수를 사용해 스토어의 게시물 상태를 참조하도록 변경
      ...mapState([ 'posts' ])
    },
    // data () {
    //   return {
    //     posts: []
    //   }
    // },

    created () {
      // 2. 매핑된 함수를 실행한다.
      this.fetchPostList()
      // api.get('/posts')
      //   .then(res => {
      //     this.posts = res.data
      //   })
    },
    
    methods: {
      // 1. fetchPostList를 매핑시킨다.
      ...mapActions([ 'fetchPostList' ])
    }
  }
</script>
```



## 3. 상세보기 페이지 구현

### 3.1 `pages`에 `PostViewPage.vue` 생성

```

```

### 3.2 `PostViewPage` 컴포넌트

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
  
    <div class="post-view">
      <div>
        <h1>글 제목</h1>
        <span>게시판 번호 1</span>
        <strong>작성자:: 작성 시간</strong>
      </div>
      <p>글 내용</p>
    </div>
    <router-link :to="{ name: 'PostListPage' }">목록</router-link>
      
  </div>
</template>

<script>
  export default {
    name: 'PostViewPage',
  }
</script>
```

### 3.3 `router`의 `index.js`에 `PostViewPage`추가

```javascript
// src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

import PostListPage from '@/pages/PostListPage'
import PostViewPage from '@/pages/PostViewPage'

Vue.use(Router)

export default new Router({

  mode: 'history',
  routes: [

    {
      path: '/',
      name: 'PostListPage',
      component: PostListPage
      }
    },
    
    {
      path: '/post/:postId',
      name: 'PostViewPage',
      components: {
        header: AppHeader,
        default: PostViewPage
      },
      props: {
        default: true
      }
    }
    
  ]
})
```

### 3.4 `PostList.vued`의 `template`를 아래와 같이 수정

```vue
// src/components/PostList.vue

<template>
  <div>
      
    <table>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td scope="col">
              <!-- params에 게시글의 고유한 번호를 postId 파라미터로 추가(문자열로 바꿔서 추가) -->
			<router-link 
			:to="{ name: 'PostViewPage', params: { postId: post.id.toString() } }">{{ post.title }}
			</router-link> [{{ post.comments.length }}]
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
```

### 3.5 스토어에 상세 보기 페이지를 위한 게시물 상태(State)를 선언

```javascript
// src/store/states.js

export default {
  posts: [],
    
  // 상세보기 페이지를 위한 게시물 상태인 post를 추가
  post: null
}
```

```javascript
// src/store/mutations-types.js

// FETCH_POST 변이 타입을 선언한다.
export const FETCH_POST = 'FETCH_POST'
```

```javascript
// src/store/mutations.js

import { FETCH_POST_LIST, FETCH_POST } from './mutations-types'

export default {

  [FETCH_POST_LIST] (state, posts) {
    state.posts = posts
  },

  [FETCH_POST] (state, post) {
    state.post = post
  },
  
}
```

```javascript
// src/store/actions.js

import api from '@/api'
import { FETCH_POST_LIST, FETCH_POST } from './mutations-types'


export default {
  
  fetchPostList({ commit }) {
    return api.get('/posts')
      .then(res => {
        commit(FETCH_POST_LIST, res.data)
      })
  },

  // FETCH_POST 변이를 일으킬 액션함수 작성
  // postId를 인자로 받을 fetchPost를 작성
  // API 요청 시 인자로 받은 postId를 URI에 포함
  fetchPost({ commit }, postId) {
    return api.get(`/posts/${postId}`)
      .then(res => {
      
      	// 받아온 데이트와 함께 FETCH_POST 변이를 실행시킨다.
        commit(FETCH_POST, res.data)
      })
  }
  
}
```

### 3.6 `PostViewPage`에서  `postId`를 통해 액션을 호출

```vue
// src/pages/PostViewPage.vue

<script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'PostViewPage',
    
    // mapActions를 통해 fetchPost 함수를 컴포넌트 메소드에 매핑한다.
    methods: {
      ...mapActions([ 'fetchPost' ]),
    },
    
    created () {
    
      // fetchPost액션 실행 시 props를 통해 내려받은 postId의 인자와 함께 호출
      this.fetchPost(`/${this.postId}`)
        // 에러발생 시, 메세지 노출 후 이전페이지로 넘기는 방어코드 추가
        .catch(err => {
          alert(err.response.data.msg)
          this.$router.back()
        })
    }
  }
</script>
```

### 3.7 `PostViewPage`의 라우트 설정

```javascript
// src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

import PostListPage from '@/pages/PostListPage'
import PostViewPage from '@/pages/PostViewPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  	...

    {
      path: '/post/:postId',
      name: 'PostViewPage',
      components: {
        header: AppHeader,
        default: PostViewPage
      },
      
      // PostViewPage의 props에 접근해서 postId를 가져오기 위해 true값으로 설정해준다.
      // 이로 인해, PostViewPage에서 this.postId로 접근 가능해 진다.
      props: {
        default: true
      }
    }
  ]
})
```

### 3.8 `PostView.vue` 생성

- `API`를 통해 스토어에 저장된 게시물 데이터를 보여줄 `PostVuew`컴포넌트를 `components` 디렉터리 안에 생성

```

```

```vue
// src/components/PostView.vue

<template>
    <div class="post-view">
      <div>
        <h1>{{ post.title }}</h1>
        <span>게시물 번호 : {{ post.id }}</span>
        <strong>{{ post.user.name }}:: {{ post.createdAt }}</strong>
      </div>
      <p>{{ post.contents }}</p>
    </div>
</template>

<script>
  export default {
    name: 'PostView',
    props: {
      post: {
        type: Object,
        required: true,
          
        // JS에서 null 타입 역시 Object이기 때문에 Props의 타입에 대한 검증이 제대로 이루어지지 않는다.
        // 타입에 대한 검증을 위해 validator를 추가한다.
        validator (post) {
          const isValidPostId = typeof post.id === 'number'
          const isValidTitle = !!post.title && post.title.length
          const isValidContents = post.contents && post.contents.length
          return isValidPostId && isValidTitle && isValidContents
        }
      }
    }
  }
</script>
```

### 3.9 `PostViewPage`에 `PostView.vue` 컴포넌트 추가하기

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">

    <!-- 
    1. 다음과 같이 수정한다. 
    2. PostView 컴포넌트를 추가한다.
    -->
    <post-view :post="post" />
    <router-link :to="{ name: 'PostListPage' }">목록!</router-link>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  import PostView from '@/components/PostView'

  import api from '@/api'

  export default {
    name: 'PostViewPage',

    components: {
      PostView
    },
    
    computed: {
      // mapState 헬퍼 함수를 통해 컴포넌트의 데이터에 post를 매핑한다.
      ...mapState([ 'post' ])
    },
    
    props: {
      ...
    },
    
    methods: {
      ...mapActions([ 'fetchPost' ]),
    },
    
    created () {
      ...
    }
  }
</script>
```



## 4. 에러

![error](https://user-images.githubusercontent.com/50367487/70845717-3ec0bb00-1e95-11ea-9de1-43c22e847d34.PNG)

### 4.1 `Invalid prop` 경고

- 'post라는 props속성의 값으로 Object 자료형을 가진 값일 할당되는 것을 기대했으나, null값을 얻었다.'라는 것이다.
- props의 required의 값을 false로 바꾸거나, post에 게시물이 들어있다는 것을 보장해주면 된다.
-  post에 게시물이 들어있다는 것을 보장하는 형식으로 수정한다.

### 4.2 . 에러 처리

- post 변수에 담긴 게시물 데이터는 API 서버와 통신이 성공적으로 완료된 이후 변수에 담기는 비동기 처리방식 때문에 컴포넌트가 렌더될 때 반드시 값이 존재할 것이라 보장할 수 없다. 따라서 아래와 같은 예외처리를 해야 한다.
- 위의 3가지 에러 모두 null값으로인해 발생하는 에러이므로, 아래와 같은 처리로 모두 해결할 수 있다.

```


<template>
  <div class="post-view-page">
  
    // 게시물의 데이터가 있는 경우에만 컴포넌트가 노출된다.
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
  </div>
</template>
```

  

## 5. 회원가입 페이지 구현

## 6. 로그인 페이지 구현

## 7. 애플리케이션 헤더 컴포넌트 작성

## 8. 게시물 생성 페이지 작성

## 9.  게시물 수정 페이지 작성

## 10.  게시물 삭제 페이지 작성

## 11. 게시물에 댓글 기능 추가

### 11.1 댓글 노출 기능추가

### 11.2 댓글 생성 기능 추가

### 11.3 댓글 수정 기능 추가

### 11.4 댓글 삭제기능 추가















