<template>
  <div>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <!--<h3>${playlist.username}</h3>
    <ul>
    ${playlist.videoList.map(videoItem)}
    </ul>-->
    playlist {{ playlistUrl }}
  </div>
</template>

<script>
export default {
  props: {
    playlistUrl: String,
  },
}
</script>

<style scope>
</style>