import { readPlaylist } from '@/lib/playlists.js'

const dat = window.DatArchive
const viddistVersion = 1

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
      // Warning: only run this mutation through the checkAndSetMyPlaylist
      // action to ensure safety

      window.localStorage.setItem('myPlaylistUrl', playlist.url)
      state.myPlaylist = playlist
    },
  },
  actions: {
    async checkAndSetMyPlaylist ({ commit }, playlist) {
      const dir = await playlist.readdir('/')

      // Our way of checking if the playlist is already init'ed
      if (dir.includes('version.txt')) {
        const archiveVersion = parseInt(await playlist.readFile('/version.txt'))

        if (archiveVersion > viddistVersion) {
          playlist = null
          throw 'This playlist was made using a newer version of viddist. Not opening it due to risk of breaking it.'
        }
      } else {
        // playlist is not initialized, run init

        await playlist.writeFile('/version.txt', viddistVersion.toString())
        await playlist.writeFile('/name.txt', 'Unnamed playlist')
        await playlist.writeFile('/videoList.json', '[]')
      }

      commit('setMyPlaylist', playlist)
    },
    async selectMyPlaylist ({ dispatch }) {
      try {
        const myPlaylist = await dat.selectArchive(
          { title: 'Create or select a viddist playlist',
            buttonLabel: 'Select playlist',
            filters: {
              isOwner: true,
              type: 'viddist-playlist'
            }
          }
        )

        dispatch('checkAndSetMyPlaylist', myPlaylist)
      } catch (err) {
        if (err.name !== 'UserDeniedError') {
          // the only error we expect is the one where the user presses
          // Cancel in the dialog
          throw err
        }
      }
    },
    async loadMyPlaylist ({ dispatch }) {
      const myPlaylistUrl = window.localStorage.getItem('myPlaylistUrl')

      if (myPlaylistUrl === null) {
        // doesn't have a playlist created and/or selected since before
        return
      } else {
        const myPlaylist = await dat.load(myPlaylistUrl)
        dispatch('checkAndSetMyPlaylist', myPlaylist)
      }
    },
    async saveMyPlaylist ({ getters }, { listName, videoList }) {
      // we call it `listName` because eslint/ts was complaining about just `name`
      if (!listName) throw 'Missing playlist name'
      if (!videoList) throw 'Missing playlist video list'


      // TODO: write listName here as well
      await getters.myPlaylist.writeFile(
        '/videoList.json',
        JSON.stringify(videoList, null, 4)
      )
    },
    async addVideoToPlaylist ({ getters, dispatch }, videoUrl) {
      const playlist = await readPlaylist(getters.myPlaylistUrl)

      playlist.videoList.push(videoUrl)

      await dispatch('saveMyPlaylist', playlist)
    },
    async removeVideoFromPlaylist ({ getters, dispatch }, videoUrl) {
      const playlist = await readPlaylist(getters.myPlaylistUrl)

      playlist.videoList = playlist.videoList.filter(vid => vid !== videoUrl)

      console.log('removing from playlist')
      await dispatch('saveMyPlaylist', playlist)
    },
    async videoIsInPlaylist ({ getters }, videoUrl) {
      console.log('checking pl')
      const playlist = await readPlaylist(getters.myPlaylistUrl)

      console.log('returning if pl')

      return playlist.videoList.includes(videoUrl)
    }
  }
}
