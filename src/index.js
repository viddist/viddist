'use strict'
const choo = require('choo')

const main = require('./templates/main.js')
const playlistPage = require('./templates/playlistPage.js')
const videoPage = require('./templates/videoPage.js')
const { initProfile, readProfile, addVideoToProfile } = require('./profile.js')

const css = require('sheetify')
css('./index.css')

const train = choo()

train.use(async (state, emitter) => {
  state.myProfileAddress = ''
  state.playlistToView = null
  state.showLoader = true
  state.videoAddress = ''

  emitter.on('viewProfile', async userUrl => {
    console.log('caught viewprofile')
    state.showLoader = true
    window.location = '/#playlist/' + encodeURIComponent(userUrl)
  })

  emitter.on('loadPlaylist', async playlistUrl => {
    console.log('loading playlist', playlistUrl)
    state.playlistToView = await readProfile(playlistUrl)
    state.showLoader = false
    console.log('rendering again')
    emitter.emit('render')
  })

  emitter.on('playNewVideo', async newVid => {
    console.log('playing new', newVid)
    window.location = '/#video/' + encodeURIComponent(newVid)
  })

  emitter.on('addVidToProfile', async vidUrl => {
    console.log('pinning video', vidUrl)
    await addVideoToProfile(vidUrl)
  })

  initProfile().then(url => {
    state.myProfileAddress = url
    emitter.emit('render')
  })
})

train.route('/', main)
train.route('/playlist/:playlistUrl', playlistPage)
train.route('/video/:videoUrl', videoPage)
train.mount('div')
