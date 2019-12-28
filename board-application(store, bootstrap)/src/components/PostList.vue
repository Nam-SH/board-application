<template>
    <b-list-group>
      <p v-for="post in posts" :key="post.id">
        <b-list-group-item scope="col">
          <router-link :to="{ name: 'PostViewPage', params: { postId: post.id.toString() } }">{{ post.title }}</router-link> [{{ post.comments.length }}]
        </b-list-group-item>
      </p>
    </b-list-group>

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