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