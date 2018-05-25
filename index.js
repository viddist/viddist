'use strict'
const daemonFactory = require('ipfsd-ctl').create({type: 'go'})

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

daemonFactory.spawn({disposable: true}, async (err, ipfsd) => {
  if (err) { console.error(err) }
  ipfs = ipfsd.api

  byId('other-user-address-form').addEventListener('submit', e => {
    e.preventDefault()
    const otherUserId = byId('other-user-address').value
    const userProfileFile = otherUserId + '/user-profile.json'
    ipfs.name.resolve(userProfileFile).then(address => {
      return ipfs.files.cat(address)
    }).then(data => {
      byId('other-user-profile').innerText = data.toString()
    }).catch(console.error)
  })

  byId('video-address-form').addEventListener('submit', async e => {
    e.preventDefault()
    const newVid = byId('new-video-address').value
    console.log('Address: ' + newVid)
    byId('new-video-address').value = ''
    await playVideo(newVid)
  })

  console.log('Started ipfs')

  console.log(await ipfs.id())

  await initUserProfile()

  await playVideo(vidHash)
})

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
  const keys = await ipfs.key.list()
  let alreadyInited = false
  keys.forEach(key => {
    if (key.name === userAddressKeyName) {
      byId('user-address').innerText = key.id
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
  byId('user-address').innerText = key.id
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
