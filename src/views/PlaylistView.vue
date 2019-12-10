<template>
  <div>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <h3>{{ name }}</h3>
    Playlist url: <code>{{ playlistUrl }}</code>
    <ul>
      <li v-for="url in videoList" :key="url">
        <button @click="playVideo(url)">
          {{ url }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { readPlaylist } from '@/lib/playlists.js'

export default {
  props: {
    playlistUrl: String,
  },
  data () {
    return {
      name: null,
      videoList: null,
    }
  },
  methods: {
    playVideo (url) {
      this.$router.push({
        name: 'video',
        params: { videoUrl: url }
      })
    },
  },
  watch: {
    playlistUrl: {
      immediate: true,
      // does this work when it's our own playlist and we've edited it?
      async handler (url) {
        const playlist = await readPlaylist(url)

        this.name = playlist.name
        this.videoList = playlist.videoList
      }
    },
  },
}
</script>

<style scope>
</style>