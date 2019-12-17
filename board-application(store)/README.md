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

```vue
// src/pages/PostViewPage.vue

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

### 5.1 `pages`에 `Signup.vue` 생성

```

```

```vue
// src/pages/Signup.vue

<template>
  <div class="sign-up-page">
    <h3>회원가입</h3>
  </div>
</template>

<script>
  export default {
    name: 'Signup',
  }
</script>
```

```javascript
// src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

// 1. Signup 컴포넌트를 추가한다.
import Signup from '@/pages/Signup'

...

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    ...
     
    // 2. Signup 라우트를 등록한다.
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})
```

### 5.2 `components`에 사용자의 정보를 입력할 회원가입 폼 `SignupForm.vue` 생성

```vue
// src/components/SignupForm.vue

<template>
  <!--novalidata속성은 HTML5의 자체적인 유효성 검사를 하지 않도록 설정한 것 -->
  <form novalidate>
    <fieldset>
      <input type="text" v-model="name" placeholder="홍길동">
      <input type="text" v-model="email" placeholder="abc123@google.com">
      <input type="password" v-model="password" placeholder="최소 8자 입력하시오">
      <input type="password" v-model="passwordConfirm" placeholder="비밀번호를 다시 한번 입력하시오">
      <button type="submit">회원가입!</button>
    </fieldset>
  </form>
</template>

<script>
  export default {
    name: 'SignupForm',
    data () {
      return {
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    }
  }
</script>
```

### 5.3 `Signup.vue`에 `SignupForm.vue` 등록

```vue
// src/pages/Signup.vue

<template>
  <div class="sign-up-page">
    <h3>회원가입</h3>
    
    <!-- 3. 커스텀 엘리먼트를 이용해 template 영역에 추가 -->
    <signup-form @submit="onSubmit" />
  </div>
</template>

<script>
  // 1. SignupForm 컴포넌트 추가
  import SignupForm from '@/components/SignupForm'

  export default {
    name: 'Signup',
    
    // 2. components에 등록
    components: {
      SignupForm
    }
  }
</script>
```

### 5.4 `SignupForm.vue`에 `submit`이벤트가 호출되었을 때 실행할 함수 작성

```vue
// src/components/SignupForm.vue

<template>
  // 
  <form @submit.prevent="submit" novalidate>
  ...
  </form>
</template>

<script>
  export default {
    name: 'SignupForm',
    data () {
      ...
    },
    methods: {
      submit () {
        const { name, email, password, passwordConfirm } = this
        if (!name || !email || !password || !passwordConfirm) {
          alert('모든 항목을 입력하시오')
        }
        if (password !== passwordConfirm) {
          alert('비밀번호가 일치하지 않습니다.')
          return
        }
        this.$emit('submit', { name, email, password })
      }
    }
  }
</script>
```

### 5.5  `Signup.vue`에 `onSubmit`메서드 추가

```vue
// src/pages/Signup.vue

<template>
  <div class="sign-up-page">
    <h3>회원가입</h3>
      
    <!-- 3. 등록된 컴포넌트를 사용 -->
    <signup-form @submit="onSubmit" />
    <!-- Signin만들기 전에는, 임의로 name:'Signup'으로 설정 -->
    <p>이미 가입하셨나요? <router-link :to="{ name: 'Signin' }">로그인하러 가기</router-link> </p>
  </div>
</template>

<script>
  import SignupForm from '@/components/SignupForm'
    
  // 1. APU모듈 호출
  import api from '@/api'

  export default {
    name: 'Signup',
    components: {
      SignupForm
    },
    methods: {
        
      // SignupForm의 submit 이벤트가 발생하면, 이벤트 핸들러로 등록된 Signup컴포넌트의 onSubmit가 호출됨
      onSubmit (payload) {
        const { email, name, password } = payload
        api.post('/auth/signup', { name, email, password })
          .then(res => {
            alert('회원가입이 완료되었습니다.')
            
            // 회원가입 후 로그인페이지로 이동시킨다.
            this.$router.push({ name: 'Signin' })
          })
          .catch(err => {
            alert(err.response.data.msg)
          })
      }
    }
  }
</script>
```



## 6. 로그인 페이지 구현

- 전체적인 흐름은 `Signup`와 같다.

### 6.1 `Signin.vue`, `router/index.js`, `SigninForm.vue` 작성

```vue
// src/pages/Signin.vue

<template>
  <div class="sign-in-page">
    <h3>로그인</h3>
    <signin-form @submit="onSubmit" />
    <p>회원이 아니신가요? <router-link :to="{ name: 'Signup' }" >회원가입하러 가기</router-link> </p>
  </div>
</template>

<script>
  import SigninForm from '@/components/SigninForm'
  import api from '@/api'

  export default {
    name: 'Signin',
    components: {
      SigninForm
    },
    methods: {
      onSubmit (payload) {
        // console.log(payload)
        const { email, password } = payload
        api.post('/auth/signin', { email, password })
          .then(res => {
            // 브라우저에 토큰의 정보가 노출된다.(정상)
            console.log(res.data)
          })
      }
    }
  }
</script>
```

```javascript
// src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'
// ...
import Signin from '@/pages/Signin'

export default new Router({
  mode: 'history',
  routes: [
	...
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }

  ]
})
```

```vue
// src/components/SigninForm.vue

<template>
  <form @submit.prevent="submit">
    <fieldset>
      <input type="text" v-model="email" placeholder="이메일을 입력하시오">
      <input type="password" v-model="password" placeholder="비밀번호를 입력하시오">
      <button type="submit">로그인!</button>
    </fieldset>
  </form>
</template>

<script>
  export default {
    name: 'SigninForm',
    data () {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      submit () {
        const { email, password } = this
        this.$emit('submit', { email, password })
      }
    }
  }
</script>
```

### 6.2 JWT토큰 사용

```vue
// src/pages/Signin.vue

<script>
  import SigninForm from '@/components/SigninForm'
  import api from '@/api'

  export default {
    name: 'Signin',
    components: {
      SigninForm
    },
    methods: {
      
      onSubmit (payload) {
        // console.log(payload)
        const { email, password } = payload
        
        api.post('/auth/signin', { email, password })
          .then(res => {
            // console.log(res.data)
            const { accessToken } = res.data.accessToken
            
            // 로그인에 성공하면 api모듈의 HTTP 헤더에 토큰을 담는다. (Bearer <토큰> 형식으로)
            // common필드를 사용함으로써, 어떤 메소드인지 상관없이 헤더에 이 값을 사용한다는 뜻
            // 만일 common이 아니라 get을 사용하면, GET메소드를 사용할 때만 그 헤더를 사용한다
            // 헤더 안의 여러 필드 중 Authorization 필드에 토큰값을 담는 것이 목적이므로, common 사용
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

            alert('로그인 되었습니다.')
            this.$router.push({ name: 'PostListPage' })
          })
          .catch(err => {
            alert(err.response.data.msg)
          })
      }
    }
  }
</script>
```

### 6.3 로그인 로직을 스토어로 옮기기

- 로그인 과정은, 첫 번째는 /auth/signin 엔드포인트를 통해 API서버와 통신하는 과정이고, 두 번째는 API 서버로부터 받아온 토큰을 api 모듈의 HTTP헤더에 담는 과정이다.
- 로그인 인증 상태와 로그아웃 상태를 전체 애플리케이션에서 통일된 상태를 유지해야 하기 때문에, 애플리케이션 중앙 집중 저장소인 스토어로 옮긴다.

```javascript
// src/store/states.js

export default {
  ...
    
  // 1. 스토어의 초기 상태를 추가한다.
  accessToken: ''
}
```

```javascript
// src/store/mutations-types.js

...
// 2. 이 상태를 수정할 변이를 작성한다.
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
```

```javascript
// src/store/mutations.js

import { FETCH_POST_LIST, FETCH_POST, SET_ACCESS_TOKEN,  } from './mutations-types'
import api from '@/api'

export default {

  ...
  // 2. 이 상태를 수정할 변이를 작성한다.
  // SET_ACCESS_TOKEN 변이는 토큰을 인자로 받아서 스토어의 상태를 업데이트하고, api모듈을 사용하여 HTTP 
  // 헤더에 토큰을 넣어주는 역할을 할 것이다.
  [SET_ACCESS_TOKEN] (state, accessToken) {
    console.log(accessToken)
  }
}
```

```vue
// src/components/SigninForm.vue

<script>
  import SigninForm from '@/components/SigninForm'
  // import api from '@/api'

  // mapActions에 중괄호 꼭 하기
  import { mapActions } from 'vuex'

  export default {
    ...
    methods: {
      
      onSubmit (payload) {
        const { email, password } = payload
        api.post('/auth/signin', { email, password })
          .then(res => {
            const { accessToken } = res.data.accessToken
            
            // 토큰을 HTTP 헤더에 심는 부분을 변이로 옮긴다.
            // api통신이 끝난 직후에만 mutation으로 옮긴다.
            // api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

            alert('로그인 되었습니다.')
            this.$router.push({ name: 'PostListPage' })
          })
          .catch(err => {
            alert(err.response.data.msg)
          })
      },
      ...mapActions([ 'signin' ])
    }
  }
</script>
```

```javascript
// src/store/mutations.js

import { FETCH_POST_LIST, FETCH_POST, SET_ACCESS_TOKEN,  } from './mutations-types'
import api from '@/api'

export default {

  ...
  // SET_ACCESS_TOKEN 변이는 토큰을 인자로 받아서 스토어의 상태를 업데이트하고, api모듈을 사용하여 HTTP 
  // 헤더에 토큰을 넣어주는 역할을 할 것이다.
  [SET_ACCESS_TOKEN] (state, accessToken) {
    // console.log(accessToken)
    
    // 스토어 상태의 토큰을 업데이트하고, api 모듈을 사용하여 HTTP 헤더에 토큰을 심어준다.
    if (accessToken) {
      state.accessToken = accessToken
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

      Cookies.set('accessToken', accessToken)
    }
  }
}
```

```javascript
// src/store/actions.js

import { FETCH_POST_LIST, FETCH_POST, SET_ACCESS_TOKEN  } from './mutations-types'

export default {
  
  // Signin컴포넌트의 onSubmit 메소드를 옮겨온다.
  signin ({ commit }, payload) {
    const { email, password } = payload
    return api.post('/auth/signin', { email, password } )
    .then(res => {
      const { accessToken } = res.data
      commit(SET_ACCESS_TOKEN, accessToken)
    })
  }
}
```

```vue
// src/pages/Signin.vue

<script>
  import SigninForm from '@/components/SigninForm'

  // 사용하지 않을 모듈 삭제하기
  // import api from '@/api'

  // mapActions에 중괄호 꼭 하기
  import { mapActions } from 'vuex'

  export default {
    name: 'Signin',
    components: {
      SigninForm
    },
    methods: {
      
      onSubmit (payload) {
        // const { email, password } = payload
        // api.post('/auth/signin', { email, password })
        
        // 기존 로직 삭제 후 액션으로 대체한다.
        this.signin(payload)
          .then(res => {
            alert('로그인 되었습니다.')
            this.$router.push({ name: 'PostListPage' })
          })
          .catch(err => {
            alert(err.response.data.msg)
          })
      },
        
      // mapActions 헬퍼함수로 signin 액션을 컴포넌트에 등록한다.
      ...mapActions([ 'signin' ])
    }
  }
</script>
```

### 6.4 현재 로그인된 사용자 정보 가져오기

- 저장된 토큰 정보를 이용해여 현재 로그인한 사용자의 정보를 가져와서 스토어 안에 저장한다.

```javascript
// src/store/states.js

export default {
  ...
  me: null
}
```

```javascript
// src/store/mutations-types.js

...
export const SET_MY_INFO = 'SET_MY_INFO'
```

```javascript
// src/store/mutations.js

import { FETCH_POST_LIST, FETCH_POST, SET_ACCESS_TOKEN, SET_MY_INFO } from './mutations-types'
export default {
  ...
  ,
  // 사용자 정보는 '서버와의 비동기 통신'을 통해 받아오는 정보이기 때문에 변이에서는 
  [SET_MY_INFO] (state, me) {
    if (me) {
      state.me = me
    }
  }
}
```

```javascript
// src/store/actions.js

import { FETCH_POST_LIST, FETCH_POST, SET_ACCESS_TOKEN, SET_MY_INFO  } from './mutations-types'

export default {
  ...
  ,
  signin ({ commit }, payload) {
    const { email, password } = payload
    return api.post('/auth/signin', { email, password } )
    .then(res => {
      const { accessToken } = res.data
      commit(SET_ACCESS_TOKEN, accessToken)
        
     // 1. 토큰을 스토어에 저장하면 api 모듈의 headers에 토큰이 저장되므로 바로 사용자 정보를 불러올 수 있다  
      return api.get('/users/me')
    }).then(res => {
        
      // 2. 사용자 정보 요청이 성공했다면 변이를 사용하여 스토어에 사용자 정보를 저장한다.
      commit(SET_MY_INFO, res.data)
    })
  }
}
```

### 6.5 웹 브라우저의 쿠키 사용

- 로그인 상태에서 새로고침을 하게되면 로그인 상태가 해제되어 다시 처음부터 로그인을 해야하는 상황이 발생한다.
- 이를 해결하기 위해 웹 브라우저의 쿠키를 사용한다.

```bash
// js-cookie를 설치한다.

$ npm install js-cookie --save
```

```javascript
// 간단 js-cookie 사용법

import Cookies from 'js-cookie'

//쿠키 저장
Cookie.set('쿠키 이름', '쿠키 값')

// 7일동안 유지되는 쿠키 저장
Cookie.set('쿠키 이름', '쿠키 값', {
    expired: 7
})

// 특정 이름을 가진 쿠키 가져온다.(없으면 undefined 반환)
Cookies.get('쿠키 이름')

// 현재 브라우저의 모든 쿠키를 가져온다.
Cookies.get()

// 특정 이름을 가진 쿠키를 삭제한다.
Cookies.remove('쿠키 이름')
```

- 스토어에 토큰을 저장할 때, 쿠키에도 같이 저장을 한다.
- 이를 통해 웹 브라우저가 종료되어 스토어의 상태가 초기화디더라도 인증받은 토큰은 웹 브라우저의 쿠키에 남아있기 때문에 토큰을 다시 사용하는 것이 가능해진다.

```javascript
// src/store/mutations.js

// 1. js-cookie 라이브러리를 등록한다.
import Cookies from 'js-cookie'

export default {
  ...
  ,
  [SET_ACCESS_TOKEN] (state, accessToken) {
    // console.log(accessToken)
    if (accessToken) {
      state.accessToken = accessToken
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
	 
      // 2. 쿠키에 토큰을 저장한다.
      Cookies.set('accessToken', accessToken)
    }
  }
}
```

```javascript
// src/store/actions.js

export default {
 ...,
  signin ({ commit }, payload) {
    const { email, password } = payload
    return api.post('/auth/signin', { email, password } )
    .then(res => {
      const { accessToken } = res.data
      commit(SET_ACCESS_TOKEN, accessToken)
        
      return api.get('/users/me')
    }).then(res => {
      commit(SET_MY_INFO, res.data)
    })
  },
  
  // 쿠키를 검사하여 저장된 유효한 토큰이 있다면, 자동으로 로그인을 진행하는 로직을 작성해야 한다.
  // 스토어의 singin 액션은 사용자의 정보를 이용하여 토큰을 받는 과정까지 통합되어 있으므로,
  // 이미 저장된 토큰을 사용하여 사용자의 정보를 받아오는 로직만 있는 별도의 액션을 작성해야 한다.
  signinByToken ({ commit }, token) {
      
    // 1. 토큰을 스토어에 커밋한다.
    commit(SET_ACCESS_TOKEN, token)
      
    // 2. 사용자의 정보를 받아온 후 스토어에 커밋한다.
    return api.get('/users/me')
      .then(res => {
        commit(SET_MY_INFO, res.data)
      })
  }
}
```

```javascript
// src/main.js

import Vue from 'vue'
...
import Cookies from 'js-cookie'

// 쿠키에서 토큰을 검사하는 과정은 애플리케이션이 초기화될 때 수행해야 하므로, main.js에 작성해야 한다.
const savedToken = Cookies.get('accessToken')

// savedToken이 들어있으면, signin으로 가지 않고, signinByToken를 호출한다.
if (savedToken) {
  store.dispatch('signinByToken', savedToken)
}

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App/>'
})
```



## 7. 애플리케이션 헤더 컴포넌트 작성

### 7.1 `Appheader.vue` 생성 후 작성

```vue
// src/components/AppHeader.vue

<template>
  <div class="app-header">
    <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link>
    <div>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppHeader'
  }
</script>
```

### 7.2 헤더 컴포넌트를 라우트에 등록하기

```vue
// src/App.vue

<template>
  <div id="app">
      
    <!-- router-view위에 app-header컴포넌트를 삽입하면 어떤 페이지를 이동하든 같은 페이지를 보여주는 
     단점이 존재 한다. 따라서 Named Router View를 사용한다.-->
    <app-header />
    <router-view />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
export default {
  name: 'App',
  components: { AppHeader }
}
</script>
```

```vue
// src/App.vue

<template>
  <div id="app">
    
    <!-- header라는 이름을 부여받은 router-view 컴포넌트 -->
    <router-view name="header" />

    <!-- name을 지정해주지 않으면, default라는 이름을 부여받는다. -->
    <router-view />

  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

```javascript
// src/router/index.js

// ...
import AppHeader from '@/components/AppHeader'

export default new Router({

  mode: 'history',
  routes: [
    {
      path: '/post/:postId',
      name: 'PostViewPage',
        
      // components 속성을 사용해서 원하는 컴포넌트를 렌더할 수 있도록 한다.
      components: {
        header: AppHeader,
        default: PostViewPage
      },

      // PostViewPage의 props에 접근해서 postId를 가져오기 위해 true값으로 설정해준다.
      // props값 또한 components의 이름으로 수정한다.
      props: {
        default: true
      }
    },

    {
      path: '/signin',
      name: 'Signin',
        
      // components가 아닌 component를 사용하면 자동으로 이름이 없는 router-view에 컴포넌트에만 렌더한다.
      component: Signin
    }
  ]
})
```

### 7.3 헤더 컴포넌트 기능 추가

- 사용자 로그아웃 기능
- 사용자 이름, 이메일을 보여주는 기능
- 비로그인 상태일 때 로그인 페이지로 이동할 수 있는 링크

```javascript
// src/store/getters.js

export default {

  // 현재 로그인된 상태를 알 수 있도록 스토어에 Boolean 잘형으로 변경하여 반환해줄 게터를 작성한다.
  // acceeToken이 존재하고, me의 사용자 데이터가 있을때에만 true를 반환한다.
  isAuthorized (state) {
    return state.accessToken.length > 0 && !!state.me
  }
}
```

```vue
// src/components/AppHeader.vue

<template>
  <div class="app-header">
    <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link>
      
      <!-- 2. 로그인한 상태라면 사용자에게 인사한다. -->
      <div v-if="isAuthorized">
      <strong>
        <button> 안녕!! 사용자
        </button>
      </strong>
    </div>
      
    <!-- 3. 로그인한 상태가 아니라면 로그인 버튼을 보여준다. -->
    <div v-else>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>
      
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'AppHeader',
    computed: {
        
      // 1. mapGetters 헬퍼함수를 통해 isAuthorized를 등록한다.
      ...mapGetters(['isAuthorized'])
    }
  }
</script>
```

### 7.4 `AppHeader`에 사용자 정보 넣기

```vue
// src/components/AppHeader.vue

<template>
  <div class="app-header">
    <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link>
    <div v-if="isAuthorized">
      <strong>
          
        <!-- 사용자 =>  me.name, me.email 으로 변경한다. -->
        <button @click="toggle"> {{ me.name }}({{ me.email }})
        </button>
      </strong>
    </div>
    <div v-else>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'AppHeader',
    computed: {
      ...mapGetters(['isAuthorized']),
        
      // 1. store의 me 상태를 추가한다.
      ...mapState(['me'])
    }
  }
</script>
```

### 7.5 로그아웃 구현하기

```javascript
// src/store/mutations-types.js

// 제거(Destroy) 기능을 담당할 변이 타입을 작성한다.
export const DESTROY_ACCESS_TOKEN = 'DESTROY_ACCESS_TOKEN'
export const DESTROY_MY_INFO = 'DESTROY_MY_INFO'
```

```javascript
// src/store/mutations.js

export default {
  [DESTROY_ACCESS_TOKEN] (state) {
    state.accessToken = ''
    // header의 토큰을 삭제한다.
    delete api.defaults.headers.common.Authorization
    // 쿠키에 있는 accessToken을 삭제하다.
    Cookies.remove('accessToken')
  },
    
  [DESTROY_MY_INFO] (state) {
    // me의 상태를 null로 초기화한다.
    state.me = null
  }
}
```

```javascript
// src/store/actions.js

export default {
  signout ({ commit }) {
    commit(DESTROY_MY_INFO)
    commit(DESTROY_ACCESS_TOKEN)
  }
}
```

### 7.6 로그아웃 박스 토글 기능 추가하기

```vue
// src/components/AppHeader.vue

<template>
  <div class="app-header">
    <router-link :to="{ name: 'PostListPage' }"><h1>Community</h1></router-link>
    <div v-if="isAuthorized">
      <strong>
          
        <!-- click이벤트시 toggle이 실행되게 한다. -->
        <button @click="toggle" > 안녕!! {{ me.name }}({{ me.email }})!!
          <i v-if="!isActive" class="fas fa-sort-down" ></i>
          <i v-else class="fas fa-sort-up" ></i>
        </button>
      </strong>
      <!-- isActive가 true일 경우에만 로그아웃 창을 보이게한다. -->
      <ul v-if="isActive">
          
        <!-- 로그아웃 버튼의 클릭 이벤트 리스너로 onClickSignout 메소드를 할당한다. -->
        <li><button @click="onClickSignout">로그아웃</button></li>
      </ul>
    </div>
    <div v-else>
      <router-link :to="{ name: 'Signin' }">Go:: 로그인</router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    name: 'AppHeader',
    data () {
      ...
    },
    computed: {
      ...
    },
    methods: {
      toggle () {
        this.isActive = !this.isActive
      },
	 // 
      onClickSignout () {
        // signout 액션을 실행한다.
        this.signout()
        // PostLIstPage 창으로 이동시킨다.
        this.$router.push({ name: 'PostListPage' })
      },
	 // 2. mapActions 헬퍼함수를 사용하여 singout 액션을 등록한다.
      ...mapActions(['signout'])
    }
  }
</script>
```

### 

## 8. 게시물 생성 페이지 작성

### 8.1 게시물 생성 페이지 컴포넌트 작성하기

```

```

```vue
// src/pages/PostCreatePage.vue

<template>
  <div class="post-create-page">
    <h3>게시물 작성하기</h3>
  </div>
</template>

<script>
  export default {
    name: 'PostCreatePage'
  }
</script>
```

```javascript
// src/router/index.js

export default new Router({
  mode: 'history',
  routes: [
    ...,
    // /post/:postId와 형식이 같으므로, postId의 라우터보다 위에 위치시킨다.
    // create와 일치하는 URL을 가졌는지를 우선적으로 판단하고, 일치하지 않으면 :postId 라우트로 이동한다.
    {
      path: '/post/create',
      name: 'PostCreatePage',
      components: {
        header: AppHeader,
        default: PostCreatePage
      }
    },
    {
      path: '/post/:postId',
      name: 'PostViewPage',
      ...
    },
    ...,
  ]
}
```

### 8.2 게시물 생성 폼 컴포넌트 작성하기

```

```

```vue
// src/components/PostCreateForm.vue

<template>
  <form @submit.prevent="onSubmit" >
    <fieldset>
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
```

### 8.3 게시물 생성 API 연동하기

```vue
// src/pages/PostCreatePage.vue

<template>
  <div class="post-create-page">
    <h3>게시물 작성하기</h3>
      
    <!-- 2. PostCreateForm 컴포넌트 뷰를 추가한다. -->
    <post-create-form @submit="onSubmit" />
  </div>
</template>


<script>
  import PostCreateForm from '@/components/PostCreateForm'
  import api from '@/api'

  export default {
    name: 'PostCreatePage',
    components: {
      PostCreateForm
    },
    methods: {
        
      // submit 이벤트가 호출되면 실행될 메소드를 선언한다.
      onSubmit (payload) {
        const { title, contents } = payload
        api.post('/posts', { title, contents })
          .then(res => {
            alert('게시물이 성공적으로 작성되었습니다.')

            this.$router.push({
              name: 'PostViewPage',
              params: { postId: res.data.id.toString() }
            })
          })
      } 
    }
  }
</script>
```

### 8.4 게시물 생성 페이지 내비게이션 가드 구현

- 로그인되어 있는 사용자만이 게시물 생성 페이지에 접근할 수 있어야 한다.
- API서버에서 로그인되어 있지 않은 사용자가 게시물 생성을 시도할 경우 401에러를 내려주겠지만, 클라이언트에서도 최소한의 방어를 해야 한다.
- 전역 가드: 애플리케이션의 라우트가 변경될 때마다 애플리케이션 전역에서 통용되는 가드
- 컴포넌트 가드: 라우트에 해당 컴포넌트가 있을 경우 호출되는 가드
- 여기서 사용될 것은 게시물 생성 페이지에만 들어맞는 개념이므로, 컴포넌트 가드를 사용할 것이다.

```javascript
// src/router/index.js

export default new Router({
  mode: 'history',
  routes: [
    ...,
    {
      path: '/post/create',
      name: 'PostCreatePage',
      components: {
        header: AppHeader,
        default: PostCreatePage
      },

      // 내비게이션 가드 구현, beforeEnter 훅을 추가한다.
      beforeEnter (to, from, next) {
        const { isAuthorized } = store.getters
        if (!isAuthorized) {
          alert('로그인이 필요합니다.')
          // 로그인이 되어있지 않다면, 로그인 페이지로 이동시킨다.
          next({ name: 'Signin' })
        }
        next()
      }
    },
    ...
  ]
})
```

### 8.5 애플리케이션 초기화 시 발생하는 통신 동기화 버그 수정

```js
// src/main.js

const savedToken = Cookies.get('accessToken')
if (savedToken) {
  store.dispatch('signinByToken', savedToken)
}

// 이런 식으로 짜여있는 경우, if (savedToken)~~ 이 끝나고 signinByToken액션이 실행된 후에, 
// Vue 인스턴스 가 생성된 다는 것을 보장하지 못한다. (비동기방식)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App/>'
})
```

```js
// src/main.js (수정 후)

function init() {
  const savedToken = Cookies.get('accessToken')
  if (savedToken) {
    return store.dispatch('signinByToken', savedToken)
  } else {
    // Prmoise외 resolve 메소드는 비동기식로직의 성공, rejsect 메소드는 실패를 의미한다.
    return Promise.resolve()
  }
}

init()
  .then(() => {
    new Vue({
      el: '#app',
      router,
      store,
      components: {
        App
      },
      render: h => h(App),
      template: '<App/>'
    })
  })
```

### 8.6 게시물 리스트 페이지에 글쓰기 버튼 추가하기

```vue


<template>
  <div class="post-list-page">
    <h1>포스트 게시글</h1>
    <post-list :posts="posts" />
    <!-- 글쓰게 버튼을 추가하고, 게시물 생성 페이지로 링크를 이어준다. -->
    <router-link :to="{ name: 'PostCreatePage' }">글쓰기</router-link>
  </div>
</template>
```



## 9.  게시물 수정 페이지 작성

### 9.1 게시물 수정 페이지 컴포넌트 작성

```

```

```vue
// src/pages/PostEditPage.vue

<template>
  <div class="post-edit-page">
    <h1>게시물 수정</h1>
  </div>
</template>

<script>
  export default {
    name: 'PostEditPage',
    components: {
      PostEditForm
    },
    // 라우터의 파라미터를 받아오기 위한 props를 선언해준다.
    props: {
      postId: {
        type: String,
        required: true
      }
    }
  }
</script>
```

- 게시물을 구분하기 위한 postId 파라미터를 URL에 담아준다.
- 이 인자는 라우터를 통해 컴포넌트의 props 속성으로 전달된다.
  - 수정버튼은 PostViewPage에 추가한다.

```js
// src/router/index.js

import PostEditPage from '@/pages/PostEditPage'

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/post/:postId/edit',
      name: 'PostEditPage',
      components: {
        header: AppHeader,
        default: PostEditPage
      },
      props: {
        default: true
      }
    },
    ...,
  ]
})
```

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <!-- 게시물 수정 페이지 링크를 게시물 상세보기 페이지에 추가한다. -->
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
    <router-link :to="{ name: 'PostListPage' }">목록!</router-link>
  </div>
</template>
```

### 9.2 게시물 수정 페이지 내비게이션가드 구현하기

- 해당 게시물이 유효한 게시물인지, 현재 로그인한 사용자가 이 게시물으 수정할 수 있는 사용자인지에 대한 검사를 추가로 작성해야 한다.
- 존재하지 않는 게시물인 경우 서버는 404 상태 코드를 응답으로 보내준다.

```js
// src/router/index.js

export default new Router({

  mode: 'history',
  routes: [
	...,
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
        
        // 1. 비로그인 사용자는 접근할 수 없다.
        if (!isAuthorized) {
          alert('로그인이 필요합니다.')
          next({ name: 'Signin' })
          return
        }
        store.dispatch('fetchPost', to.params.postId)
          .then(res => {
            const post = store.state.post
            
            // 게시물 작성자의 아이디와 현재 로그인된 사용자의 아이디가 일치하는지 확인한다.
            const isAuthor = (post.user.id === store.state.me.id)
            if (isAuthor) {
              // 일치한다면 라우팅을 그대로 진행한다.
              next()
            }
            else {
              alert('게시물을 수정할 권한이 없습니다.')
              // 일치하지 않는다면 경고 문구를 노출시키고 이전 라우트로 이동시킨다.
              next(from)
            }
          })
          .catch(err => {
            alert(err.response.data.msg)
            next(from)
          })
      }
    },
    ...,
  ]
})
```

### 9.3 게시물 수정 폼 컴포넌트 작성하기

- 게시물 생성 폼과 다른 점은 페이지 진입 시 기존 게시물에 대한 데이터를 가지고 있어야 한다.

```

```

```vue
// src/components/PostEditForm.vue

<template>
  <form @submit.prevent="onSubmit" >
    <fieldset>
      <!-- 게시물 번호 비활성 입력창에 게시물 번호 데이터를 연동한다. -->
      <label>게시물 번호</label>
      <input type="text" :value="post.id" disabled>
        
      <label>게시물 생성일</label>
      <input type="text" :value="post.createdAt" disabled>
      <label>제목</label>
      <input v-model="title" type="text" placeholder="게시물 제목">
      <label>내용</label>
      <textarea v-model="contents" rows="5" type="text" placeholder="게시물 내용"> </textarea>
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
    
    // 2. props로 받은 데이터는 반응형 데이터로 사용할 수 없기 때문에, 컴포넌트의 data 속성에 다시 할당한다.
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
	// 1. props를 사용하여 컴포넌트 외부로 부터 게시물 정보를 받는다.
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
```

```vue
// src/pages/PostEditPage.vue

<template>
  <div class="post-edit-page">
    <h1>게시물 수정</h1>
      
    <!-- 게시물 데이터가 있는 경우에만 PoestEditForm을 렌더한다. -->
    <post-edit-form v-if="post" :post="post" @submit="onSubmit" />
    <p v-else>게시물 불러오는 중...</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PostEditForm from '@/components/PostEditForm'
import api from '@/api'

  export default {
    name: 'PostEditPage',
    components: {
      PostEditForm
    },
    props: {
      postId: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState(['post'])
    },
    methods: {
        
      // 1. PostEditForm의 submit 이벤트 핸들러인 onSubmit 메소드를 선언한다.
      onSubmit (payload) {
        const { title, contents } = payload
        
        // 2. PUT 메소드를 사용하여 서버로 게시물 데이터를 전송한다.
        api.put(`/posts/${this.postId}`, { title, contents })
          .then(res => {
            // 3. 게시물 수정이 성공했다면 사용자를 다시 게시물 페이지로 이동시킨다.
            alert('게시물이 성공적으로 수정되었습니다.')
            this.$router.push({
              name: 'PostViewPage',
              params: { postId: res.data.id.toString() }
            })
          })
          
          // 라우터에서 beforeEnter로 막았지만, PostEditPage.vue가 /post/:pistId/edit에만 사용이 되지 
		 // 않을  수 있다. 따라서 해당 onSubmit에서도 적절한 예외처리와 경고 메세지를 노출시켜야 한다.
          .catch(err => {
            if (err.response.status === 401) {
              alert('로그인이 필요합니다.')
              this.$router.push({ name: 'Signin' })
            }
            // 사용자가 이 게시물을 수정할 권한이 없다면, 이전 페이지로 이동시킨다.
            else if (err.response.status === 403) {
              alert(err.response.data.msg)
              this.$router.back()
            }
            else {
              alert(err.response.data.msg)
            }
          })
      }
    }
  }
</script>
```



## 10.  게시물 삭제 페이지 작성

- 게시물 상세보기 페이지의 하단 수정 버튼과 목록 버튼 사이에 삭제 버튼을 추가하고 삭제 기능을 담당할 onDelte함수를 선언한다.

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
      
    <!-- 1. 삭제 버튼과 onDelete 함수를 클릭 이벤트 리스너에 추가한다. -->
    <button @click="onDelete">삭제!</button>
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
      PostView,
      CommentList,
      CommentForm
    },
    computed: {
      ...mapState(['post']),
    },
    props: {
      postId: {
        type: String,
        required: true
      }
    },
    methods: {
      ...mapActions([ 'fetchPost' ]),
        
      // 2. onDelete 함수를 선언한다.
      onDelete () {
        // const id = this.postId
        const { id } = this.post
        api.delete(`/posts/${id}`)
          .then(res => {
            alert('게시물이 성공적을 삭제되었습니다.')
            this.$router.push({ name: 'PostListPage' })
          })
          .catch(err => {
            if (err.response.status === 401) {
              alert('로그인이 필요합니다.')
              this.$router.push({ name: 'Signin' })
            } else {
              // 삭제의 권한이 없는 등의 경우에는 에러창을 띄운다.
              alert(err.response.data.msg)
            }
          })
      }
    },
    created () {
      this.fetchPost(`/${this.postId}`)
        .catch(err => {
          alert(err.response.data.msg)
          this.$router.back()
        })
    }
  }
</script>
```



## 11. 게시물에 댓글 기능 추가

### 11.1 댓글 노출 기능추가

```

```

```vue
// src/components/CommentList.vue

<template>
  <ul class="comments">
	<li>
    	<div class="comment-item">
            <strong>홍길동</strong><span>2019-01-01 09:00:00</span>
            <p>댓글에 대한 테스트 컴포넌트 입니다.</p>
    	</div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'CommentList'
  }
</script>
```

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
    <button @click="onDelete">삭제!</button>
    <router-link :to="{ name: 'PostListPage' }">목록!</router-link>
      
    <!-- CommentList 컴포넌트에 comments 데이터를 Props를 통해 전달한다. -->
    <comment-list v-if="post" :comments="post.comments" />
  </div>
</template>

<script>
  ...,
  import CommentList from '@/components/CommentList'

  export default {
    name: 'PostViewPage',
    components: {
      PostView,
      CommentList
    },
    ...
    }
  }
</script>
```

```vue
// src/components/CommentList.vue

<template>
  <ul class="comments">
    <li v-if="comments.length <= 0">댓글이 없습니다.</li>
    <li v-for="comment in comments" :key="comment.id"> 
      <comment-item :comment="comment"/>
    </li>
  </ul>
</template>

<script>
  import CommentItem from "@/components/CommentItem"
  
  export default {
    name: 'CommentList',
    components: {
      CommentItem
    },
    
    // 1. comments를 props에 등록한다.
    props: {
      comments: {
        type: Array,
        default () {
          return []
        }
      }
    },
  }
</script>
```

```vue
// src/components/CommentItem.vue

<template>
  <div class="comment-item">
    <strong>{{ comment.user.name }}</strong><span>{{ comment.createdAt }}</span>
    <p>{{ comment.contents }}</p>
    <ul>
      <li> <button type="button">수정</button> </li>
      <li> <button type="button">삭제</button> </li>
    </ul>
  </div>
</template>

<script>
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
    }
  }
</script>
```

- 댓글의 수정과 삭제 버튼이 작성한 작성자만이 보이게 설정한다.

```vue
// src/components/CommentItem.vue

<template>
  <div class="comment-item">
    <strong>{{ comment.user.name }}</strong><span>{{ comment.createdAt }}</span>

    <div v-if="isEditing">
      <textarea v-model="editMessage" rows="3"></textarea>
      <button @click="onEdit">수정완료</button>
    </div>
    <p v-else>{{ comment.contents }}</p>

    <!-- 4. isMyComment가 참일 경우에만 수정, 삭제버튼을 노출한다. -->
    <ul v-if="isMyComment">
      <li> <button type="button" @click="toggleEditMode">수정</button> </li>
      <li> <button type="button" @click="onDelete">삭제</button> </li>
    </ul>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CommentItem',
  ...,
  computed: {
    // 1. 현재 로그인한 사용자의 정보를 스토어의 상태를 참조하여 가져온다.
    ...mapState(['me']),
    // 2. 현재 로그인 여부를 알 수 있는 isAuthorized 게터를 가져온다.
    ...mapGetters(['isAuthorized']),
    // 3. 댓글을 작성한 사용자의 아이디와 현재 로그인한 사용자의 아이디(me)를 비교한다.
    isMyComment() {
      return this.isAuthorized && this.comment.user.id === this.me.id
    }
  }
}
</script>
```

### 11.2 댓글 생성 기능 추가

```

```

```vue
// src/components/CommentForm.vue

<template>
  <div class="comment-form">
    <textarea v-model="comment" rows="5" placeholder="댓글을 입력해주세요"></textarea>
      
    <!-- 버튼을 클릭 시 onCommentSubmit 함수가 실행됨 -->
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
      // 1. '생성' 버튼 클릭 시 실행될 함수를 작성한다.
      onCommentSubmit () {
        // console.log('onSubmit', this.comment)
        const { comment } = this
        
        // 2. 입력된 데이터를 submit 함수를 호출하고, 인자를 넘긴다.
        this.$emit('submit', comment)
        // 3. 작성 완료 후, 입력된 데이터를 초기한다.
        this.comment = ''
      }
    }
  }
</script>
```

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
    <button>삭제!</button>
    <router-link :to="{ name: 'PostListPage' }">목록!</router-link>
    <comment-list v-if="post" :comments="post.comments" />
      
    <!-- 2. submit의 이벤트 리스너를 추가한다. -->
    <comment-form @submit="onCommentSubmit" />
  </div>
</template>

<script>
  import CommentForm from '@/components/CommentForm'
  ...,

  export default {
    name: 'PostViewPage',
    components: {
      ...,
      CommentForm
    },
    ...,
    methods: {
      ...,
      // 1. submit 이벤트 핸들러로 등록시켜줄 onCommentSubmit 함수를 추가한다.
      onCommentSubmit (comment) {
        // console.log(comment)
        if (!this.isAuthorized) {
          alert('로그인이 필요합니다.')
          this.$router.push({ name: 'Signin' })
        } else {
          this.createComment(comment)
            .then(() => {
              alert('댓글이 성공적으로 작성되었습니다.')
            })
            .catch(err => {
              alert(err.response.data.msg)
            })
        }
      }
    },
    ...
  }
</script>
```

- 댓글 이벤트 생성 후, API통신을 통해 댓글 데이터를 생성한 후 Vuex 상태의 데이터를 갱신시켜야 한다.

```js
// src/store/mutations-types.js

...,
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
```

```js
// src/store/mutations.js

export default {
  ...,
  [UPDATE_COMMENT] (state, payload) {
    state.post.comments.push(payload)
  },
}
```

```js
// src/store/actions.js

export default {
  ...,
  createComment ({ commit, state }, comment) {
      
    // 현재 포스팅의 ID를 상태에 접근해서 가져온다.
    const postId = state.post.id
    return api.post(`posts/${postId}/comments`, { contents: comment })
      .then(res => {
        commit(UPDATE_COMMENT, res.data)
      })
  }
}
```

```vue
// src/pages/PostViewPage.vue

<template>
  <div class="post-view-page">
    <post-view v-if="post" :post="post" />
    <p v-else>게시글 불러오는 중...</p>
    <router-link :to="{ name: 'PostEditPage', params: { postId } }">수정!</router-link>
    <button>삭제!</button>
    <router-link :to="{ name: 'PostListPage' }">목록!</router-link>
    <comment-list v-if="post" :comments="post.comments" />
    <comment-form @submit="onCommentSubmit" />
  </div>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex'
  ...,

  export default {
    name: 'PostViewPage',
    computed: {
      ...mapState(['post', 'me']),
        
      // 1. 액션 함수를 호출하기 전에 사용자 인증 여부 검증 단계를 거쳐야 한다.
      // 2. mapGetters 헬퍼 함수를 통해 isAuthorized 게터 함수를 컴포넌트에 매핑한다.
      ...mapGetters(['isAuthorized'])
    },
    methods: {
      ...mapActions([ 'fetchPost', 'createComment' ]),
        
      onCommentSubmit (comment) {
        // console.log(comment)
        if (!this.isAuthorized) {
          alert('로그인이 필요합니다.')
          this.$router.push({ name: 'Signin' })
        } else {
          // 3. 사용자 인증여부가 통과되면 createComment 액션을 통해 API 서버를 호출한다.
          this.createComment(comment)
            .then(() => {
              alert('댓글이 성공적으로 작성되었습니다.')
            })
            .catch(err => {
              alert(err.response.data.msg)
            })
        }
      }
    },
    ...
  }
</script>
```



### 11.3 댓글 수정 기능 추가

```vue


<template>
  <div class="comment-item">
    <strong>{{ comment.user.name }}</strong><span>{{ comment.createdAt }}</span>
      
    <!-- 6. isEditing값이 참일 경우 댓글을 수정할 수 있는 textarea태그와 수정 완료 버튼을 작성한다. -->
    <div v-if="isEditing">
      <textarea v-model="editMessage" rows="3"></textarea>
      <!-- 12. 작성한 onEdit 함수를 버튼의 클릭 이벤트에 추가한다. -->
      <button @click="onEdit">수정완료</button>
    </div>
    <!-- 7. 기존 댓글을 보여주는 DOM은 isEditing 값이 거짓일 경우에만 노출한다. -->
    <p v-else>{{ comment.contents }}</p>
    <ul v-if="isMyComment">
      <!-- 5. 수정 버튼의 이벤트 리스너로 toggleEditMode 메소드를 연결한다. -->
      <!-- 9. 선언한 editButtonText을 수정 버튼에 할당 해 준다. -->
      <li> <button type="button" @click="toggleEditMode">{{ editButtonText }}</button> </li>
      <li> <button type="button">삭제</button> </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CommentItem',
  ...,
  computed: {
    ...,
    // 8. isEditing참일 경우 수정취소버튼이, 거짓일 경우에는 수정버튼이 나오게 한다
    editButtonText () {
      return this.isEditing ? '수정 취소':'수정'
    },
    // 10. 수정한 댓글의 길이가 1자 이상 255 이하인 경우에만 참을 반환한다.
    isValidComment () {
      return 0 < this.editMessage.length < 256
    }
  },
  data () {
    return {
      // 1. 수정모드와 읽기모드를 구분할 수 있도록 isEditing 변수를 추가한다.
      isEditing: false,
      // 2. 댓글 수정 폼과 연동될 반응형 문자열 변수를 선언한다.
      editMessage: ''
    }
  },
  methods: {
    // 3. toggleEditMode 메소드가 실행될 때마다 isEditing 변수가 반전된다.
    toggleEditMode () {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        // 4. 수정모드가 활성화되면 댓글의 내용을 수정할 메시지에 바인딩해준다.
        this.editMessage = this.comment.contents
      }
    },
    onEdit() {
      // 11. 댓글이 유효성 검증을 통과하 상태면 CommentList의 edit 이벤트를 실행시킨다.
      if (this.isValidComment) {
        this.isEditing = false
        const { id } = this.comment
        this.$emit('edit', { id, comment: this.editMessage })
      }
      else {
        alert('댓글을 1글자 이상 255자 이하여야 한다.')
      }
    }
  }
}
</script>
```

```vue


<template>
  <ul class="comments">
    <li v-if="comments.length <= 0">댓글이 없습니다.</li>
    <li v-for="comment in comments" :key="comment.id"> 
      <!-- CommentItem 컴포넌트의 edit 이벤트 핸들러로 onEdit 메소드를 등록한다.  -->
      <comment-item :comment="comment" @edit="onEdit"/>
    </li>
  </ul>
</template>

<script>
  import CommentItem from "@/components/CommentItem"

  export default {
    name: 'CommentList',
    ...,
    methods: {
      onEdit(payload) {
        const { id, comment } = payload
      }
    }
  }
</script>
```

- 현재 조작하려는 댓글의 상태는 스토어에 저장되어 있다. 
- 따라서 이 댓글 상태를 수정하기 위해서는 스토어의 액션과 변이를 사용해야 한다.

```js
// src/store/mutations-types.js

...,
export const EDIT_COMMENT = 'EDIT_COMMENT'
```

```js
// src/store/mutations.js

export default {

  [EDIT_COMMENT] (state, payload) {
    const { id: commentId, contents, updatedAt } = payload
    
    // Array 자료형의 find 메소드를 사용하여 주입받은 아이디와 같은 아이디를 가진 댓글 객체를 찾는다.
    // 따라서 EDIT_COMMENT 변이를통해 스토어의 댓글 상태를 갱신할 수 있게 된다.
    const targetComment = state.post.comments.find(comment => comment.id === commentId)
    targetComment.contents = contents
    targetComment.updatedAt = updatedAt
  }
}
```

```js
// src/store/actions.js

export default {
  // ...,
    
  // 스토어의 댓글 상태만 갱신한다고 해서 서버에 저장된 댓글 상태까지 갱신되는 것이 아니기 때문에, 
  // 액션을 사용하여 API를 통한 댓글 갱신 요청을 작성한다.
  editComment ({ commit, state }, { commentId, comment }) {
    const postId = state.post.id
    return api.put(`/posts/${postId}/comments/${commentId}`, { contents: comment })
            .then(res => {
              commit(EDIT_COMMENT, res.data)
            })
  },
}
```

```vue
// src/components/CommentList.vue

<template>
  <ul class="comments">
    <li v-if="comments.length <= 0">댓글이 없습니다.</li>
    <li v-for="comment in comments" :key="comment.id"> 
      <comment-item :comment="comment" @edit="onEdit" />
    </li>
  </ul>
</template>

<script>
  import CommentItem from "@/components/CommentItem"
  import { mapActions } from 'vuex'

  export default {
    name: 'CommentList',
    ...
    methods: {
      onEdit(payload) {
        const { id, comment } = payload
        // 1. editComment 액션함수를 사용하여 API 서버에 댓글 수정 요청을 한다.
        this.editComment({ commentId: id, comment })
          .then(res => {
            alert('댓글이 수정되었습니다.')
          })
          .catch(err => {
            if (err.response.status === 401) {
              alert('로그인이 필요합니다.')
              this.$router.push({ name: 'Signin' })
            }
            else {
              alert(err.response.data.msg)
            }
          })
      },
      ...mapActions([ 'editComment', 'deleteComment' ])
    }
  }
</script>
```

### 11.4 댓글 삭제기능 추가

```vue


<template>
  <div class="comment-item">
    <strong>{{ comment.user.name }}</strong><span>{{ comment.createdAt }}</span>
    <div v-if="isEditing">
      <textarea v-model="editMessage" rows="3"></textarea>
      <button @click="onEdit">수정완료</button>
    </div>
    <p v-else>{{ comment.contents }}</p>
    <ul v-if="isMyComment">
      <li> <button type="button" @click="toggleEditMode">{{ editButtonText }}</button> </li>
        
      <!-- 3. onDelete 함수를 클릭 이벤트에 등록한다. -->
      <li> <button type="button" @click="onDelete">삭제</button> </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CommentItem',
  ...,
  methods: {
    ...,
    // 1. onDelete 함수를 생성한다.
    onDelete () {
      const { id } = this.comment
      
      // 2. 삭제 버튼 클릭 시, comment의 id 값을 넘긴다.
      this.$emit('delete', id)
    }
  }
}
</script>
```

```js
// src/store/mutations-types.js

...
export const DELETE_COMMENT = 'DELETE_COMMENT'
```

```js
// src/store/mutations.js

export default {
  // ...,
  [DELETE_COMMENT] (state, commentId) {
    const targetIndex = state.post.comments.findIndex(comment => comment.id === commentId)
    state.post.comments.splice(targetIndex, 1)
  }
}
```

```js
// src/store/actions.js

export default {
  // ...,
  deleteComment ({ commit, state }, { commentId }) {
    const postId = state.post.id
    return api.delete(`/posts/${postId}/comments/${commentId}`)
            .then(res => {
              commit(DELETE_COMMENT, commentId)
            })
  }
}
```

```vue


<template>
  <ul class="comments">
    <li v-if="comments.length <= 0">댓글이 없습니다.</li>
    <li v-for="comment in comments" :key="comment.id"> 
      <comment-item :comment="comment" @edit="onEdit" @delete="onDelete" />
    </li>
  </ul>
</template>

<script>
  import CommentItem from "@/components/CommentItem"
  import { mapActions } from 'vuex'

  export default {
    name: 'CommentList',
    ...,
    methods: {
      ...,
      // 1. onDelete 함수를 생성한다.
      onDelete(commentId) {
        // 2. deleteComment 액션함수를 실행시킨다. 
        this.deleteComment({ commentId })
          .then(res => {
            alert('댓글이 삭제되었습니다.')
          })
          .catch(err => {
            if (err.response.status === 401) {
              alert('로그인이 필요합니다.')
              this.$router.push({  name: 'Signin'})
            }
            else {
              alert(err.response.data.msg)
            }
          })
      },
      ...mapActions([ 'editComment', 'deleteComment' ])
    }
  }
</script>
```



## 12. 결과

### 12.1 게시판 읽기

![Screenshot 2019-12-17 at 11 17 53](https://user-images.githubusercontent.com/50367487/70959484-ce49b200-20bf-11ea-94ee-76324e24501b.jpg)

### 12.2 게시판 상세정보 출력화면

![Screenshot 2019-12-17 at 11 18 09](https://user-images.githubusercontent.com/50367487/70959497-d3a6fc80-20bf-11ea-84ec-e4088fbc78cd.jpg)

### 12.3 회원가입

![Screenshot 2019-12-17 at 11 18 22](https://user-images.githubusercontent.com/50367487/70959499-d4d82980-20bf-11ea-9881-b1815f0df286.jpg)

### 12.4 로그인

![Screenshot 2019-12-17 at 11 18 28](https://user-images.githubusercontent.com/50367487/70959505-d570c000-20bf-11ea-948b-315b2fa279fb.jpg)

### 12.5 게시물 생성 페이지

![Screenshot 2019-12-17 at 11 18 43](https://user-images.githubusercontent.com/50367487/70959511-da357400-20bf-11ea-80bd-7ded01ed20df.jpg)

### 12.6 게시물 수정 페이지

![Screenshot 2019-12-17 at 11 19 03](https://user-images.githubusercontent.com/50367487/70959512-db66a100-20bf-11ea-9a93-92abf0f83f6a.jpg)

![Screenshot 2019-12-17 at 11 19 23](https://user-images.githubusercontent.com/50367487/70959515-dbff3780-20bf-11ea-89b6-44b55e3b9c55.jpg)

### 12.7 게시물 삭제 페이지

![캡처](https://user-images.githubusercontent.com/50367487/70959607-136de400-20c0-11ea-95c4-0b7bd02ff5fb.PNG)

### 12.8 댓글 생성

![캡처2](https://user-images.githubusercontent.com/50367487/70959609-14067a80-20c0-11ea-8a06-cd1aec5296c5.PNG)

![캡처3](https://user-images.githubusercontent.com/50367487/70959610-149f1100-20c0-11ea-9531-a9305327e658.PNG)

### 12.9 댓글 수정

![캡처4](https://user-images.githubusercontent.com/50367487/70959614-1537a780-20c0-11ea-858b-a4dbdb70f4f7.PNG)

![캡처5](https://user-images.githubusercontent.com/50367487/70959615-15d03e00-20c0-11ea-90d2-4724d2f51fc5.PNG)

### 12.10 댓글 삭제

![캡처6](https://user-images.githubusercontent.com/50367487/70959618-17016b00-20c0-11ea-9885-19f4a0808a35.PNG)

![Screenshot 2019-12-17 at 11 23 00](https://user-images.githubusercontent.com/50367487/70959619-18329800-20c0-11ea-97c7-3c5de29e9ff6.jpg)