<template>
  <div class="wrapper">
    <div class="header">
      <img src="media/viddist-logo.png">
      <div class="viddist-title">Viddist</div>
    </div>
    <div v-if="myPlaylistIsLoaded">Playlist being edited:
      <div>
        <button @click="viewMyPlaylist">
          {{ myPlaylistUrl }}
        </button>
      </div>
    </div>
    <button @click="selectMyPlaylist">
      <div v-if="myPlaylistIsLoaded">
        Select another playlist to edit
      </div>
      <div v-else>
        Click to select a playlist to edit
      </div>
    </button>
    <form @submit.prevent="viewOtherPlaylist">
      <div>
        <label>User profile address</label>
        <input v-model="otherPlaylistInput" type="text">
        <button>View user</button>
      </div>
    </form>
    <form @submit.prevent="playNewVideo">
      <div>
        <label>Video address</label>
        <input v-model="newVideoInput" type="text">
        <button>Play video</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      otherPlaylistInput: '',
      newVideoInput: ''
    }
  },
  computed: {
    ...mapGetters([
      'myPlaylistIsLoaded',
      'myPlaylistUrl',
    ]),
  },
  methods: {
    ...mapActions([
      'selectMyPlaylist',
    ]),
    viewMyPlaylist () {
      console.log('viewmyplaylist')
      //this.$emit('viewProfile', state.myProfileAddress)
    },
    viewOtherPlaylist () {
      console.log('o', this.otherPlaylistInput)

      //const viewProfile = e => {
      //  e.preventDefault()
      //  const profileUrl = document.getElementById('other-user-url').value
      //  emit('viewProfile', profileUrl)
      //}
    },
    playNewVideo () {
      this.$router.push({ name: 'video', params: { videoUrl: this.newVideoInput }})
    }
  }
}

</script>

<style scope>
.wrapper {
  max-width: 30rem;
  margin: auto;
}

.header {
    font-size: 32px;
}

.header img {
    height: 1em;
}

.viddist-title {
    display: inline-block;
}

</style>