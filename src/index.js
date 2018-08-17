'use strict'
const choo = require('choo')

const main = require('./templates/main.js')
const profile = require('./my-profile.js')

const train = choo()

daemonFactory.spawn({disposable: true}, async (err, ipfsd) => {
  if (err) { console.error(err) }
  ipfs = ipfsd.api
  const gwInfo = ipfsd.gatewayAddr.nodeAddress()
  gateway = `http://${gwInfo.address}:${gwInfo.port}`

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
  // Ideally we don't want to use gateways (not even local ones) but until we
  // have browser support this works super well
  return `${gateway}/ipfs/${hash}`
}
