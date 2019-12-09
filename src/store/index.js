const dat = window.DatArchive

export default {
  state: {
    myPlaylist: null,
  },
  getters: {
    myPlaylistIsLoaded (state) {
      return state.myPlaylist !== null
    },
    myPlaylist (state) {
      return state.myPlaylist
    },
    myPlaylistUrl (state, getters) {
      return getters.myPlaylist.url
    },
  },
  mutations: {
    setMyPlaylist (state, playlist) {
      window.localStorage.setItem('myPlaylistUrl', playlist.url)
      state.myPlaylist = playlist
    },
  },
  actions: {
    async selectMyPlaylist ({ commit }) {
      const myPlaylist = await dat.selectArchive(
        { title: 'Create or select a viddist playlist',
          buttonLabel: 'Select playlist',
          filters: {
            isOwner: true,
            type: 'viddist-playlist'
          }
        }
      )

      commit('setMyPlaylist', myPlaylist)
    },
    async loadMyPlaylist ({ commit }) {
      const myPlaylistUrl = window.localStorage.getItem('myPlaylistUrl')

      if (myPlaylistUrl === null) {
        // doesn't have a playlist created and/or selected since before
        return
      } else {
        const myPlaylist = await dat.load(myPlaylistUrl)
        commit('setMyPlaylist', myPlaylist)
      }
    },
  }
}
