const ipfsd = require('ipfsd-ctl')
//const blobStream = require('blob-stream')
const bl = require('bl')

console.log('running')

// A text file containing "hello test"
const textHash = 'QmRmPLc1FsPAn8F8F9DQDEYADNX5ER2sgqiokEvqnYknVW'
// The new code@lth logo on fb
const imgHash = 'QmZZbDoceKrFmjAYKeL4WfkBvexvzpff6yZTga2W8qoUF2'

ipfsd.disposableApi((err, ipfs) => {
    if (err) { console.error(err) }

    //ipfs.id(function (err, id) {
    //    if (err) { console.error(err) }
    //    console.log(id)
    //})

    ipfs.files.cat(textHash).then(stream => {
        if (err) { console.error(err); return }

        stream
            .pipe(bl((err, data) => {
                if (err) { console.error(err) }

                const text = data.toString()
                console.log("pipe bl:", text)
                document.getElementById('content').innerHTML = text
            }))
            .on('error', e => console.error(e) )
    })
    .catch((err) => { console.error(err) })

    //ipfs.files.cat(imgHash).then((err, stream) => {
    //    if (err) { throw err }
    //    console.log(stream)

    //    stream
    //        .pipe(bl((err, data) => {
    //            if (err) { console.error(err) }
    //            console.log(data)
    //        }))
    //        .catch((reason) => {
    //            console.error(reason)
    //        })
    //})
    //.catch((reason) => {
    //    console.error(reason)
    //})
})
