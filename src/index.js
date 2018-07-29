'use strict'
const daemonFactory = require('ipfsd-ctl').create({type: 'go'})
const choo = require('choo')

const main = require('./templates/main.js')
const profile = require('./my-profile.js')

// "Blinkenlights 2"
const vidHash = 'QmW84mqTYnCkRTy6VeRJebPWuuk8b27PJ4bWm2bL4nrEWb/blinkenlights/mp4/P-Link.mp4'
// See test-videos.md for more videos to use

let ipfs
const train = choo()

daemonFactory.spawn({disposable: true}, async (err, ipfsd) => {
  if (err) { console.error(err) }
  ipfs = ipfsd.api

  console.log('ID:', await ipfs.id())

  train.use(async (state, emitter) => {
    state.myProfileAddress = ''
    state.otherUserProfile = null
    state.videoLink = ''
    state.videoAddress = ''

    state.myProfileAddress = await profile.init(ipfs)
    emitter.emit('render')

    emitter.on('viewProfile', async userId => {
      state.otherUserProfile = await profile.getUser(userId)
      emitter.emit('render')
    })

    emitter.on('playNewVideo', async newVid => {
      state.videoLink = newVid
      state.videoAddress = await playVideo(newVid)
      emitter.emit('render')
    })

    emitter.on('pinVideo', async videoLink => {
      await profile.pinVideo(videoLink)
      console.log('Pinned current video')
    })

    emitter.emit('playNewVideo', vidHash)
  })

  train.route('/', main)
  train.mount('div')
})

const playVideo = async hash => {
  const data = await ipfs.files.cat(hash)
  const blob = new window.Blob([data], { type: 'video/mp4' })
  return window.URL.createObjectURL(blob)
}
