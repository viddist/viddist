const ipfsd = require('ipfsd-ctl')
//const blobStream = require('blob-stream')
const bl = require('bl')

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

    insertIpfsFile(ipfs, 'imgContent', 'png', imgHash)

    //insertIpfsFile(ipfs, 'vidContent', 'mp4', vidHash)

    //ipfs.files.cat(vidHash).then(stream =>
    //    stream
    //        .pipe(bl((err, data) => {
    //            if (err) { console.error(err) }
    //            console.log(data)

    //            const blob = new Blob([new Uint8Array(data)],
    //                { type: "video/mp4" } )
    //            const vidUrl = window.URL.createObjectURL(blob)
    //            const srcElem = document.createElement('source')
    //            srcElem.src = vidUrl
    //            document.getElementById('vid')
    //                .appendChild(srcElem)
    //        }))
    //        .on('error', e => console.error(e) )
    //)
    //.catch((err) => { console.error(err) })
})

const insertIpfsFile = (ipfs, domId, type, hash) => {
    ipfs.files.cat(hash).then(stream =>
        stream
            .pipe(bl((err, data) => {
                if (err) { console.error(err) }

                if (type === 'text') {
                    const text = data.toString()
                    console.log('received text: ', text)
                    document.getElementById(domId).innerHTML = text
                } else if (type === 'png') {
                    const blob = new Blob([new Uint8Array(data)],
                        { type: 'image/png' } )
                    const imageUrl = window.URL.createObjectURL(blob)
                    const imgElem = document.createElement('img')
                    imgElem.src = imageUrl
                    document.getElementById(domId).appendChild(imgElem)
                } else if (type === 'mp4') {
                    const blob = new Blob([new Uint8Array(data)],
                        { type: 'video/mp4' } )
                    const vidUrl = window.URL.createObjectURL(blob)
                    const vidElem = document.createElement('video')
                    vidElem.controls = ''
                    const srcElem = document.createElement('source')
                    srcElem.src = vidUrl
                    document.getElementById(domId).appendChild(vidElem)
                    vidElem.appendChild(srcElem)
                } else {
                    console.error('Unsupported content type')
                }
            }))
            .on('error', e => console.error(e) )
    )
        .catch((err) => { console.error(err) })
}