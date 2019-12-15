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
// 

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

## 8. 게시물 생성 페이지 작성

## 9.  게시물 수정 페이지 작성

## 10.  게시물 삭제 페이지 작성

## 11. 게시물에 댓글 기능 추가

### 11.1 댓글 노출 기능추가

### 11.2 댓글 생성 기능 추가

### 11.3 댓글 수정 기능 추가

### 11.4 댓글 삭제기능 추가















