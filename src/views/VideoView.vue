<template>
  <div class="outer">
    <div class="top">
      <router-link :to="{ name: 'home' }">Home</router-link>
      <div>
        Current video address <code>{{ videoUrl }}</code>
      </div>
      <!--${ state.videoIsInPlaylist ?
          html`<button onclick=${removeVideoFromPlaylist}>Remove video from playlist</button>` :
          html`<button onclick=${addVidToProfile}>Add video to playlist</button>`
      }-->
      <!-- TODO: also add a button for (un)seeding a video using beaker -->
    </div>
    <div class="video-wrapper">
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
.outer {
  margin: auto;
}

.top {
  max-width: 30rem;
  margin: auto;
}

.video-wrapper {
  display: grid;
  justify-content: center;
}

video {
    max-width: 1280px;
    max-height: 720px;
}
</style>