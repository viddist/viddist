'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import mainStore from './store/'
import VueRouter from 'vue-router'
import Main from './views/Main'
import HomeView from './views/HomeView'
import VideoView from './views/VideoView'
import PlaylistView from './views/PlaylistView'

Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store(mainStore)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: true,
    },
    {
      path: '/video/:videoUrl',
      name: 'video',
      component: VideoView,
      props: true,
    },
    {
      path: '/playlist/:playlistUrl',
      name: 'playlist',
      component: PlaylistView,
      props: true,
    },
  ]
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(Main)
})

