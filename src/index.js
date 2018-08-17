'use strict'
const choo = require('choo')

const main = require('./templates/main.js')
const profile = require('./my-profile.js')

const train = choo()

train.use(async (state, emitter) => {
  state.myProfileAddress = ''
  state.otherUserProfile = null
  state.videoLink = ''
  state.videoAddress = ''

  state.myProfileAddress = await profile.init(ipfs)
  emitter.emit('render')

  //emitter.on('viewProfile', async userId => {
  //  state.otherUserProfile = await profile.getUser(userId)
  //  emitter.emit('render')
  //})

  emitter.on('playNewVideo', async newVid => {
    state.videoAddress = newVid
    console.log('playing new', newVid)
    emitter.emit('render')
  })

  //emitter.on('pinVideo', async videoLink => {
  //  await profile.pinVideo(videoLink)
  //  console.log('Pinned current video')
  //})

  emitter.emit('playNewVideo', vidHash)
})

train.route('/', main)
train.mount('div')
