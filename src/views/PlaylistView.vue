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
const dat = window.DatArchive

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
      async handler (url) {
        const archive = await dat.load(url)

        this.name = await archive.readFile('/name.txt')
        this.videoList = JSON.parse(await archive.readFile('/videoList.json'))
      }
    },
  },
}
</script>

<style scope>
</style>