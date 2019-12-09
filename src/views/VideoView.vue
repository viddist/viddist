<template>
  <div>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <div>
      Current video address <code>{{ videoUrl }}</code>
    </div>
  <!--${ state.videoIsInPlaylist ?
      html`<button onclick=${removeVideoFromPlaylist}>Remove video from playlist</button>` :
      html`<button onclick=${addVidToProfile}>Add video to playlist</button>`
  }-->
    <div>
      <video controls autoplay muted :src="videoUrl">
      </video>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoUrl: String,
  },
  methods: {
    
  },
}
</script>

<style scope>
</style>