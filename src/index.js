'use strict'
const daemonFactory = require('ipfsd-ctl').create({type: 'go'})
const choo = require('choo')

const main = require('./templates/main.js')
const profile = require('./my-profile.js')

console.log('running')

// From the CCC archives, pinned by others but recommended to pin locally to
// speed up testing. (I don't recommend pinning the top hash, it's several TBs)
// Blinkenlights 1
const vidHash = 'QmW84mqTYnCkRTy6VeRJebPWuuk8b27PJ4bWm2bL4nrEWb/blinkenlights/mp4/blinkenlights-video-large.mp4'
// Blinkenlights 2
// const vidhash = 'QmW84mqTYnCkRTy6VeRJebPWuuk8b27PJ4bWm2bL4nrEWb/blinkenlights/mp4/P-Link.mp4'
// NOTE: The hashes below here are things that are probably offline. Contact
// me and I'll bring up my daemon for a bit so you can pin them.
// Sintel with subtitles 130MB
// const vidHash = 'QmXgfYJiG3JttNqVHERfGysc1semSrFnhtAiFU1C6oLNWW/Sintel.mp4'
// Sintel transcoded to webopt using handbrake
// const vidHash = 'QmcPmxZUFNLpwgYcGExARE8ZYgNEr1oSTMTSut1ZhfK6us/sintel-webopt.mp4'
// Big buck bunny 480p avi transcoded to mp4 webopt using handbrake
// const vidHash = 'QmNnpS4RXHBMKhTY1s1gHn41xmXiWJEAakmM5uMZ66HfGx/big-buck-bunny-480p-webopt.mp4'

let ipfs
const train = choo()

daemonFactory.spawn({disposable: true}, async (err, ipfsd) => {
  if (err) { console.error(err) }
  ipfs = ipfsd.api

  console.log('Started ipfs')

  console.log('ID:', await ipfs.id())

  train.use(async (state, emitter) => {
    state.myProfileAddress = ''
    state.otherUserProfile = ''
    state.videoAddress = ''

    console.log('initing profile')
    state.myProfileAddress = await profile.init(ipfs)
    emitter.emit('render')
    console.log('inited profile')

    emitter.on('viewProfile', async userId => {
      state.otherUserProfile = await profile.catUsername(userId)
      emitter.emit('render')
    })

    emitter.on('playNewVideo', async newVid => {
      state.videoAddress = await playVideo(newVid)
      emitter.emit('render')
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
