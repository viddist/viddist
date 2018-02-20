const daemonFactory = require('ipfsd-ctl').create({type: 'go'})

console.log('running')

// From the CCC archives, pinned by others but recommended to pin locally to
// speed up testing. (I don't recommend pinning the top hash, it's several TBs)
// Blinkenlights 1
const vidHash = 'QmW84mqTYnCkRTy6VeRJebPWuuk8b27PJ4bWm2bL4nrEWb/blinkenlights/mp4/blinkenlights-video-large.mp4'
// Blinkenlights 2
//const vidhash = 'QmW84mqTYnCkRTy6VeRJebPWuuk8b27PJ4bWm2bL4nrEWb/blinkenlights/mp4/P-Link.mp4'
// NOTE: The hashes below here are things that are probably offline. Contact
// me and I'll bring up my daemon for a bit so you can pin them.
// Sintel with subtitles 130MB
//const vidHash = 'QmXgfYJiG3JttNqVHERfGysc1semSrFnhtAiFU1C6oLNWW/Sintel.mp4'
// Sintel transcoded to webopt using handbrake
//const vidHash = 'QmcPmxZUFNLpwgYcGExARE8ZYgNEr1oSTMTSut1ZhfK6us/sintel-webopt.mp4'
// Big buck bunny 480p avi transcoded to mp4 webopt using handbrake
//const vidHash = 'QmNnpS4RXHBMKhTY1s1gHn41xmXiWJEAakmM5uMZ66HfGx/big-buck-bunny-480p-webopt.mp4'

const protocolVersion = '1'
const userAddressKeyName = 'user-address'

daemonFactory.spawn({disposable: true}, (err, ipfsd) => {
    if (err) { console.error(err) }
    const ipfs = ipfsd.api

    ipfs.id().then(id => {
        console.log(id)
    }).catch(console.error)

    initUserProfile(ipfs)

    playVideo(ipfs, vidHash)

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

    byId('video-address-form').addEventListener('submit', e => {
        e.preventDefault()
        const newVid = byId('new-video-address').value
        console.log('Address: ' + newVid)
        playVideo(ipfs, newVid)
        byId('new-video-address').value = ''
    })
})

const byId = id => document.getElementById(id)

const playVideo = (ipfs, hash) => {
    ipfs.files.cat(hash).then(data => {
        byId('playing-video').outerHTML = ''
        const blob = new Blob([data],
            { type: 'video/mp4' } )
        const vidElem = document.createElement('video')
        vidElem.controls = true
        vidElem.autoplay = true
        vidElem.id = 'playing-video'
        vidElem.src = window.URL.createObjectURL(blob)
        byId('vidContent').appendChild(vidElem)
    }).catch(console.error)
}

const initUserProfile = ipfs => {
    ipfs.key.list().then(keys => {
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
        ipfs.key.gen(userAddressKeyName, {
            type: 'rsa',
            size: 2048
        }).then(key => {
            byId('user-address').innerText = key.id
            return ipfs.files.add([{
                path: '/viddist-meta/viddist-version.txt',
                content: Buffer.from(protocolVersion, 'utf-8')
            } , { // I love that ESLint doesn't complain about anything here
                path:'/viddist-meta/user-profile.json',
                content: Buffer.from(JSON.stringify( {test: 'data'} ))
            }])
        }).then(res => {
            const dirHash = res[2].hash // This has worked so far but watch out
            return Promise.all([
                ipfs.pin.add(dirHash).hash,
                ipfs.name.publish(dirHash, {key: userAddressKeyName})
            ])
        }).then(res => {
            console.log('Published to profile')
            console.log(res[1])
        }).catch(console.error)
    }).catch(console.error)
}