'use strict'
const choo = require('choo')

const main = require('./templates/main.js')
const videoPage = require('./templates/videoPage.js')
// const profile = require('./my-profile.js')
const { initProfile, readProfile, addVideoToProfile } = require('./profile.js')

const css = require('sheetify')
css('./index.css')

const train = choo()

train.use(async (state, emitter) => {
  state.myProfileAddress = ''
  state.otherUserProfile = null
  state.videoAddress = ''

  emitter.on('viewProfile', async userUrl => {
    console.log('caught viewprofile')
    state.otherUserProfile = await readProfile(userUrl)
    emitter.emit('render')
  })

  emitter.on('playNewVideo', async newVid => {
    //state.videoAddress = newVid
    console.log('playing new', newVid)
    window.location = '/#video/' + encodeURIComponent(newVid)
    //emitter.emit('render')
  })

  emitter.on('addVidToProfile', async vidUrl => {
    console.log('pinning video', vidUrl)
    await addVideoToProfile(vidUrl)
  })

  // emitter.on('pinVideo', async videoLink => {
  //  await profile.pinVideo(videoLink)
  //  console.log('Pinned current video')
  // })

  //emitter.emit('playNewVideo', 'dat://00bb1eab0504c18e4758dabd11bcb5c46b1d150199a8bfe855c41f76fb5f9696/p2p-oresund-mathias-buus.mp4')

  initProfile().then(url => {
    state.myProfileAddress = url
    emitter.emit('render')
  })
})

train.route('/', main)
train.route('/video/:videoUrl', videoPage)
train.mount('div')
