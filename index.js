const ipfsd = require('ipfsd-ctl')
//const blobStream = require('blob-stream')
const renderMedia = require('render-media')

console.log('running')

// A text file containing "hello test"
const textHash = 'QmRmPLc1FsPAn8F8F9DQDEYADNX5ER2sgqiokEvqnYknVW'
// The new code@lth logo on fb
const imgHash = 'QmZZbDoceKrFmjAYKeL4WfkBvexvzpff6yZTga2W8qoUF2'
// The logo inside a dir, named code.png
const imgDirHash = 'QmYGVR5U4EmqZxoLQnMqRdG2nZ25PrATBCcJJaXLiQH6Ta'
// Sintel with subtitles 130MB
const vidHash = 'QmXgfYJiG3JttNqVHERfGysc1semSrFnhtAiFU1C6oLNWW/Sintel.mp4'

ipfsd.disposableApi((err, ipfs) => {
    if (err) { console.error(err) }

    ipfs.id(function (err, id) {
        if (err) { console.error(err) }
        console.log(id)
    })

    insertIpfsFile(ipfs, 'textContent', 'text', textHash)

    //insertIpfsFile(ipfs, 'imgContent', 'png', imgHash)

    insertIpfsFile(ipfs, 'vidContent', 'mp4', vidHash)
})

const insertIpfsFile = (ipfs, domId, type, hash) => {
    const stream = ipfs.files.catReadableStream(hash)
    if (type === 'text') {
        const text = stream.toString()
        console.log('received text: ', text)
        document.getElementById(domId).innerHTML = text
    //} else if (type === 'png') {
    //    const blob = new Blob([data],
    //        { type: 'image/png' } )
    //    const imageUrl = window.URL.createObjectURL(blob)
    //    const imgElem = document.createElement('img')
    //    imgElem.src = imageUrl
    //    document.getElementById(domId).appendChild(imgElem)
    } else if (type === 'mp4') {
        //const blob = new Blob([data],
        //    { type: 'video/mp4' } )
        //const vidElem = document.createElement('video')
        //vidElem.controls = true
        //vidElem.autoplay = true
        //vidElem.src = window.URL.createObjectURL(blob)
        //document.getElementById(domId).appendChild(vidElem)
        renderMedia.append({
            name: 'video.mp4',
            createReadStream: (opts) => {
                if(opts) console.log("Opts: " + opts)
                console.log("rendering")
                return stream
            }},
            document.getElementById(domId),
            //{maxBlobLength: 1000 * 1000},
            (err, elem) => console.log("nice"))
    } else {
        console.error("This isn't supposed to happen")
    }
}