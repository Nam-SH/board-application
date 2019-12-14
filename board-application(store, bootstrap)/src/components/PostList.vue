<template>
  <div>
    <table>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td scope="col">
          <router-link :to="{ name: 'PostViewPage', params: { postId: post.id.toString() } }">{{ post.title }}</router-link> [{{ post.comments.length }}]
          </td>
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