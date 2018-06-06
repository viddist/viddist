'use strict'
const daemonFactory = require('ipfsd-ctl').create({type: 'go'})
const choo = require('choo')

const main = require('./templates/main.js')

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

const protocolVersion = '1'
const userAddressKeyName = 'user-address'
let ipfs
// Maybe move all the choo initialization to after ipfs has initialized?
// Show a view that is just a 'throbber' (lol that's the actual word)?
const train = choo()

daemonFactory.spawn({disposable: true}, async (err, ipfsd) => {
  if (err) { console.error(err) }
  ipfs = ipfsd.api

  console.log('Started ipfs')

  console.log('ID:', await ipfs.id())

  train.use((state, emitter) => {
    state.myProfileAddress = ''
    state.otherUserProfile = ''

    emitter.on('viewProfile', async userId => {
      const userProfileFile = userId + '/user-profile.json'
      const address = await ipfs.name.resolve(userProfileFile)
      const data = await ipfs.files.cat(address)
      state.otherUserProfile = data.toString()
      emitter.emit('render')
    })

    emitter.on('playNewVideo', async newVid => {
      await playVideo(newVid)
    })
  })

  train.route('/', main)

  train.mount('div')

  await initUserProfile()

  await playVideo(vidHash)
})

// Refactor out most (all?) uses of this in this file
const byId = id => document.getElementById(id)

const playVideo = async hash => {
  const data = await ipfs.files.cat(hash)
  byId('playing-video').outerHTML = ''
  const blob = new window.Blob([data], { type: 'video/mp4' })
  const vidElem = document.createElement('video')
  vidElem.controls = true
  vidElem.autoplay = true
  vidElem.muted = true
  vidElem.id = 'playing-video'
  vidElem.src = window.URL.createObjectURL(blob)
  byId('vidContent').appendChild(vidElem)
}

const initUserProfile = async () => {
  try {
    const keys = await ipfs.key.list()
    let alreadyInited = false
    keys.forEach(key => {
      if (key.name === userAddressKeyName) {
        byId('my-user-address').innerText = key.id
        alreadyInited = true
      }
    })
    if (alreadyInited) {
      return Promise.resolve()
    }
    // Initialize the user profile key and files if they don't exist
    const key = await ipfs.key.gen(userAddressKeyName, {
      type: 'rsa', size: 2048
    })
    byId('my-user-address').innerText = key.id
    const addRes = await addUserProfile({
      userName: 'Viddist ~ö~ User', pinnedVids: []
    })
    // This has worked so far but watch out. Should probably run stat instead
    const dirHash = addRes[2].hash
    const publishRes = await Promise.all([
      ipfs.pin.add(dirHash, {recursive: true}).hash,
      ipfs.name.publish(dirHash, {key: userAddressKeyName})
    ])
    console.log('Profile published at:', publishRes[1])
  } catch (error) {
    console.error('Failed to init user profile')
    throw error
  }
}

const addUserProfile = async profile => {
  return ipfs.files.add([{
    path: '/viddist-meta/viddist-version.txt',
    content: Buffer.from(protocolVersion, 'utf-8')
  }, { // I love that ESLint/Standard don't complain about anything here
    path: '/viddist-meta/user-profile.json',
    content: Buffer.from(JSON.stringify(profile))
  }])
}

// const updateUserProfile =
