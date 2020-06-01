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



## 2. 게시글 읽기 기능 구현하기

- 게시글을 확인할 수 있는 ㅍ이지로서 게시글의 번호, 제목, 작성자, 작성일을 확인할 수 있다.
- 아직 작성된 컴포넌트가 없기때문에 연결될 컴포넌트는 임의의 null값으로 부여한다.

### 2.1  `router`의 `index.js` 작성

```js
// board-application/src/router/index.js

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({

  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PostListPage',

      // PostListPage 컴포넌트를 라우트와 연결한다.
      component: null //PostListPage로 변경예정
    }
  ]
})
```

### 2.2  `components`내에 있는 `PostListPage` 의 `template`부분

```vue
// board-application/src/components/PostListPage.vue

<template>
  <div class="post-list-page">
    <h1>포스트 게시글</h1>

    <!-- PostListPage는 껍데기 역할만 하고, 실질적인 페이지의 내용을 보여주는 것은 PostList에 작성한다. -->
    <!-- 테이블이 있던 자리에 PostList컴포넌트를 삽입한다. -->
    <post-list :posts="posts" />
  </div>
</template>
```

### 2.3  `components`내에 있는 `PostListPage` 의 `script`부분

```vue
// board-application/src/components/PostListPage.vue

<script>

  // PostList 컴포넌트를 추가한다.
  import PostList from '@/components/PostList'

  export default {
    name: 'PostListPage',
    components: {
      PostList
    },
  }
</script>
```

### 2.4  `router`의 `index.js` 수정

```js
// board-application/src/router/index.js

import Vue from 'vue'

// PostListPage 컴포넌트를 추가한다.
import PostListPage from '../pages/PostListPage'
...

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
```

### 2.5 `components`내에 있는 `PostList` 의 `template`부분

```vue
// board-application/src/components/PostList.vue

<template>
  <div>
    <table>
      <colgroup>
        <col style="width: 10%">
        <col style="width: 60%">
        <col style="width: 10%">
        <col style="width: 20%">
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td scope="col">글 번호</td>
          <td scope="col">
          	 <router-link :to="{ name: 'PostListPage' }">글 제목</router-link> 
		  	[댓글 수: 1</td>
          <td scope="col">글 작성자</td>
          <td scope="col">글 작성일</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### 



## 3. Axios 

### 3.1 Axios 설치

```bash
$ npm install axios --save
```

### 3.2 파일 생성 및 객체 생성

- `src` 디렉터리 내에 `api` 디렉터리를 생성하고, `index.js`를 생성한다.
- `index.js`에 `Axios`의 `create` 메소드를 사용하여 기본 옵션값을 가진 `Axios`객체를 생성한다.

```js
// board-application/src/api/index.js

import axios from 'axios'

export default axios.create({
  baseURL: "//localhost:8000/api"
})
```

### 3.3  `components`내에 있는 `PostListPage` 의 `template` 수정

```vue
// board-application/src/components/PostListPage.vue

<template>
  <div class="post-list-page">
    <h1>포스트 게시글</h1>

    <!-- PostListPage는 껍데기 역할만 하고, 실질적인 페이지의 내용을 보여주는 것은 PostList에 작성한다. -->
    <!-- 자식 컴포넌트 props를 통해 posts 데이터를 내려준다. -->
    <post-list :posts="posts" />
  </div>
</template>
```

### 3.4  `components`내에 있는 `PostListPage` 의 `script` 수정

```vue
// board-application/src/components/PostListPage.vue

<script>

  // PostList 컴포넌트를 추가한다.
  import PostList from '@/components/PostList'

  // 커스텀마이징된 `axios` 객체를 추가한다.
  import api from '@/api'

  export default {
    name: 'PostListPage',
    components: {
      PostList
    },
	
    // 컴포넌트 내에 데이터를 생성한다.
    data () {
      return {
        posts: []
      }
    },
    
    // created 훅에서 API를 호출한 후 컴포넌트 내의 데이터에 해당 결과값을 대입한다.
    created () {
      api.get('/posts')
        .then(res => {
          this.posts = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>
```

### 3.5  `components`내에 있는 `PostList` 의 `template` 수정

```vue
// board-application/src/components/PostList.vue

<template>
  <div>
    <table>
      <colgroup>
        <col style="width: 10%">
        <col style="width: 60%">
        <col style="width: 10%">
        <col style="width: 20%">
      </colgroup>
      <thead>
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td scope="col">{{ post.id }}</td>
          <td scope="col">
          <router-link :to="{ name: 'PostListPage' }">{{ post.title }}</router-link> [댓글 수: {{ post.comments.length }}]
          </td>
          <td scope="col">{{ post.user.name }}</td>
          <td scope="col">{{ post.createdAt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### 3.6  `components`내에 있는 `PostList` 의 `script` 수정

```vue
// board-application/src/components/PostList.vue

<script>

  export default {
    name: 'PostList',

    // 부모로 부터 받은 posts를 props에 등록한다.
    props: {
      posts: {
        type: Array
      }
    }
  }
</script>
```

## 

## 4. 결과

