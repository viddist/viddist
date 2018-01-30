const daemonFactory = require('ipfsd-ctl').create({type: 'go'})

console.log('running')

// A text file containing "hello test"
const textHash = 'QmRmPLc1FsPAn8F8F9DQDEYADNX5ER2sgqiokEvqnYknVW'
// The new code@lth logo on fb
const imgHash = 'QmZZbDoceKrFmjAYKeL4WfkBvexvzpff6yZTga2W8qoUF2'
// The logo inside a dir, named code.png
//const imgDirHash = 'QmYGVR5U4EmqZxoLQnMqRdG2nZ25PrATBCcJJaXLiQH6Ta'
// Sintel with subtitles 130MB
//const vidHash = 'QmXgfYJiG3JttNqVHERfGysc1semSrFnhtAiFU1C6oLNWW/Sintel.mp4'
// Sintel transcoded to webopt using handbrake
const vidHash = 'QmcPmxZUFNLpwgYcGExARE8ZYgNEr1oSTMTSut1ZhfK6us/sintel-webopt.mp4'
// Big buck bunny 480p avi transcoded to mp4 webopt using handbrake
//const vidHash = 'QmNnpS4RXHBMKhTY1s1gHn41xmXiWJEAakmM5uMZ66HfGx/big-buck-bunny-480p-webopt.mp4'

const protocolVersion = '1'
const userAddressKeyName = 'user-address'

daemonFactory.spawn({disposable: true}, (err, ipfsd) => {
    if (err) { console.error(err) }
    const ipfs = ipfsd.api

    ipfs.id(function (err, id) {
        if (err) { console.error(err) }
        console.log(id)
    })

    initUserProfile(ipfs)

    insertIpfsFile(ipfs, 'textContent', 'text', textHash)

    insertIpfsFile(ipfs, 'imgContent', 'png', imgHash)

    insertIpfsFile(ipfs, 'vidContent', 'mp4', vidHash)

    document.getElementById('video-address-form')
        .addEventListener('submit', e => {
            e.preventDefault()
            const newVid = document.getElementById('video-address').value
            console.log('Address: ' + newVid)
            insertIpfsFile(ipfs, 'vidContent', 'mp4', newVid)
            document.getElementById('video-address').value = ''
        })
})

const insertIpfsFile = (ipfs, domId, type, hash) => {
    ipfs.files.cat(hash).then(data => {
        if (type === 'text') {
            const text = data.toString()
            console.log('received text: ', text)
            document.getElementById(domId).innerHTML = text
        } else if (type === 'png') {
            const blob = new Blob([data],
                { type: 'image/png' } )
            const imageUrl = window.URL.createObjectURL(blob)
            const imgElem = document.createElement('img')
            imgElem.src = imageUrl
            document.getElementById(domId).appendChild(imgElem)
        } else if (type === 'mp4') {
            document.getElementById('playing-video').outerHTML = ''
            const blob = new Blob([data],
                { type: 'video/mp4' } )
            const vidElem = document.createElement('video')
            vidElem.controls = true
            vidElem.autoplay = true
            vidElem.id = 'playing-video'
            vidElem.src = window.URL.createObjectURL(blob)
            document.getElementById(domId).appendChild(vidElem)
        } else {
            console.error('Unsupported content type')
        }
    }).catch(console.error)
}

const initUserProfile = ipfs => {
    // TODO: I'm bad at promises but this has to be improved
    ipfs.key.list().then(keys => {
        let userAddress = ''
        keys.forEach(key => {
            if (key.name === userAddressKeyName) {
                userAddress = key.id
            }
        })
        if (userAddress === '') {
            // Initialize the user profile key and files if they don't exist
            ipfs.key.gen(userAddressKeyName, {
                type: 'rsa',
                size: 2048
            }).then(key => {
                document.getElementById('user-address').innerText = key.id
                ipfs.files.add([{
                    path: '/viddist-meta/viddist-version.txt',
                    content: Buffer.from(protocolVersion, 'utf-8')
                } , {
                    path:'/viddist-meta/user-profile.json',
                    content: Buffer.from(JSON.stringify( {test: 'data'} ))
                }]).then(res => {
                    // TODO: Pin it too
                    // Publish the dir
                    ipfs.name.publish(res[2].hash,
                        {key: userAddressKeyName}).then(name => {
                        console.log('Published to profile')
                        console.log(name)
                    }).catch(console.error)
                }).catch(console.error)
            }).catch(console.error)
        }
        document.getElementById('user-address').innerText = userAddress
    }).catch(console.error)
}