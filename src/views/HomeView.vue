<template>
  <div>
    <div id="header-logo">
      <img src="media/viddist-logo.png">
      <div id="logo">Viddist</div>
    </div>
    <div>Your user address: 
      <div>
        <button @click="viewMyPlaylist">
          {{ myPlaylistAddress }}
        </button>
      </div>
    </div>
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
export default {
  data () {
    return {
      myPlaylistAddress: 'abcd',
      otherPlaylistInput: '',
      newVideoInput: ''
    }
  },
  methods: {
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
      console.log('newVideo', this.newVideoInput)

      //const playNewVideo = e => {
      //  e.preventDefault()
      //  // Can we cleanly avoid getElementById here?
      //  const newVid = document.getElementById('new-video-url').value
      //  emit('playNewVideo', newVid)
      //}
    }
  }
}

</script>

<style scope>
</style>