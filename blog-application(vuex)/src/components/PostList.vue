<template>
  <div>
    <table>
      <!-- <colgroup>
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
      </thead> -->
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <!-- <td scope="col">{{ post.id }}</td> -->

          <td scope="col">
            <!-- params에 게시글의 고유한 번호를 postId 파라미터로 추가한다.(숫자이므로 문자열로 바꿔서 추가) -->
          <router-link :to="{ name: 'PostViewPage', params: { postId: post.id.toString() } }">{{ post.title }}</router-link> 댓글 갯수:[{{ post.comments.length }}]
          </td>
          
          <!-- <td scope="col">{{ post.user.name }}</td>
          <td scope="col">{{ post.createdAt }}</td> -->
        </tr>
      </tbody>

    </table>

  </div>
</template>

<script>

  export default {
    name: 'PostList',
    props: {
      posts: {
        type: Array
      }
    }
  }
</script>

<style scoped>

</style>