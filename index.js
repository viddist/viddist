const ipfsd = require('ipfsd-ctl')
//const blobStream = require('blob-stream')
const bl = require('bl')

console.log('running')

// A text file containing "hello test"
const textHash = 'QmRmPLc1FsPAn8F8F9DQDEYADNX5ER2sgqiokEvqnYknVW'
// The new code@lth logo on fb
const imgHash = 'QmZZbDoceKrFmjAYKeL4WfkBvexvzpff6yZTga2W8qoUF2'
// Sintel with subtitles 130MB
const vidHash = 'QmXgfYJiG3JttNqVHERfGysc1semSrFnhtAiFU1C6oLNWW/Sintel.mp4'

ipfsd.disposableApi((err, ipfs) => {
    if (err) { console.error(err) }

    ipfs.id(function (err, id) {
        if (err) { console.error(err) }
        console.log(id)
    })

    ipfs.files.cat(textHash).then(stream =>
        stream
            .pipe(bl((err, data) => {
                if (err) { console.error(err) }

                const text = data.toString()
                console.log("pipe bl:", text)
                document.getElementById('content').innerHTML = text
            }))
            .on('error', e => console.error(e) )
    )
    .catch((err) => { console.error(err) })

    //ipfs.files.cat(imgHash).then(stream =>
    //    stream
    //        .pipe(bl((err, data) => {
    //            if (err) { console.error(err) }
    //            console.log(data)

    //            const blob = new Blob([new Uint8Array(data)],
    //                { type: "image/jpeg" } )
    //            const imageUrl = window.URL.createObjectURL(blob)
    //            const imgElem = document.createElement('img')
    //            imgElem.src = imageUrl
    //            document.getElementById('content')
    //                .appendChild(imgElem)
    //        }))
    //        .on('error', e => console.error(e) )
    //)
    //.catch((err) => { console.error(err) })

    ipfs.files.cat(vidHash).then(stream =>
        stream
            .pipe(bl((err, data) => {
                if (err) { console.error(err) }
                console.log(data)

                const blob = new Blob([new Uint8Array(data)],
                    { type: "video/mp4" } )
                const vidUrl = window.URL.createObjectURL(blob)
                const srcElem = document.createElement('source')
                srcElem.src = vidUrl
                document.getElementById('vid')
                    .appendChild(srcElem)
            }))
            .on('error', e => console.error(e) )
    )
    .catch((err) => { console.error(err) })
})
