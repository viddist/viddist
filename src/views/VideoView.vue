<template>
  <div class="outer">
    <div class="top">
      <router-link :to="{ name: 'home' }">Home</router-link>
      <div>
        Current video address <code>{{ videoUrl }}</code>
      </div>
      <div v-if="myPlaylistIsLoaded">
        <button v-if="videoIsInPlaylist" @click="removeVideoFromPlaylist">
          Remove this video from your playlist
        </button>
        <button v-else @click="addVideoToPlaylist">
          Add this video to your playlist
        </button>
      </div>
      <!-- TODO: also add a button for (un)seeding a video using beaker -->
    </div>
    <div class="video-wrapper">
      <video controls autoplay muted :src="videoUrl">
      </video>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    videoUrl: String,
  },
  computed: {
    ...mapGetters([
      'myPlaylistIsLoaded',
    ])
  },
  methods: {
    ...mapActions([
      'addVideoToPlaylist',
      'removeVideoFromPlaylist',
      'videoIsInPlaylist',
    ])
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