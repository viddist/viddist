'use strict'
const choo = require('choo')

const main = require('./templates/main.js')
// const profile = require('./my-profile.js')
const { initProfile } = require('./profile.js')

const css = require('sheetify')
css('./index.css')

const train = choo()

train.use(async (state, emitter) => {
  state.myProfileAddress = ''
  state.otherUserProfile = null
  state.videoAddress = ''

  // emitter.on('viewProfile', async userId => {
  //   state.otherUserProfile = await profile.getUser(userId)
  //   emitter.emit('render')
  // })

  emitter.on('playNewVideo', async newVid => {
    state.videoAddress = newVid
    console.log('playing new', newVid)
    emitter.emit('render')
  })

  // emitter.on('pinVideo', async videoLink => {
  //  await profile.pinVideo(videoLink)
  //  console.log('Pinned current video')
  // })

  emitter.emit('playNewVideo', 'dat://16d7782cda79cf1c35245b317f101a2ad1ea9c9fba3a29a70f4502629b8efa4e/Sintel.mp4')

  state.myProfileAddress = await initProfile()
  emitter.emit('render')
})

train.route('/', main)
train.mount('div')
