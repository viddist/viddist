'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import mainStore from './store/'
import VueRouter from 'vue-router'
import Main from './views/Main'
import HomeView from './views/HomeView'
const choo = require('choo')

const main = require('./templates/main.js')
const playlistPage = require('./templates/playlistPage.js')
const videoPage = require('./templates/videoPage.js')
const { initProfile, readProfile, addVideoToProfile, removeVideoFromPlaylist, videoIsInPlaylist } = require('./profile.js')

// const css = require('sheetify')
// css('./index.css')

const train = choo()

train.use(require('choo-devtools')())

train.use(async (state, emitter) => {
  state.myProfileAddress = ''
  state.playlistToView = null
  state.showLoader = true
  state.videoAddress = ''
  state.videoIsInPlaylist = null

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
    state.showLoader = true
    window.location = '/#video/' + encodeURIComponent(newVid)
  })

  emitter.on('loadVideoInfo', async videoUrl => {
    console.log('loading video info', videoUrl)
    state.videoIsInPlaylist = await videoIsInPlaylist(videoUrl)
    state.showLoader = false
    console.log('rendering after loading info')
    emitter.emit('render')
  })

  emitter.on('addVidToProfile', async vidUrl => {
    console.log('pinning video', vidUrl)
    await addVideoToProfile(vidUrl)
  })

  emitter.on('removeVideoFromPlaylist', async videoUrl => {
    await removeVideoFromPlaylist(videoUrl)
  })

  initProfile().then(url => {
    state.myProfileAddress = url
    emitter.emit('render')
  })
})

//train.route('/', main)
//train.route('/playlist/:playlistUrl', playlistPage)
//train.route('/video/:videoUrl', videoPage)
//train.mount('div')

Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store(mainStore)

const router = new VueRouter({
  routes: [
    { path: '/', component: HomeView },
  ]
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(Main)
})

