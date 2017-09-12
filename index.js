const ipfsd = require('ipfsd-ctl')

console.log('running');

const imgHash = 'QmZZbDoceKrFmjAYKeL4WfkBvexvzpff6yZTga2W8qoUF2'
const textHash = 'QmRmPLc1FsPAn8F8F9DQDEYADNX5ER2sgqiokEvqnYknVW'

ipfsd.disposableApi((err, ipfs) => {
    if (err) { throw err }

    ipfs.id(function (err, id) {
        if (err) { throw err }
        console.log(id)
    })

    ipfs.files.cat(textHash, (err, stream) => {
        if (err) { throw err }
        console.log(stream)

        stream.setEncoding('utf8')
        stream.on('data', function(chunk) {
            console.log(chunk)
            document.getElementById('content').innerHTML = chunk
        })
        //stream.pipe(console.log)
    })

    //ipfs.pin.ls({'type': 'recursive'}).then(items => {
    //    for (var hash in items) {
    //        ipfs.pin.rm(hash, {'recursive': true}).then((err, unpinned) => {
    //            if (err) { throw err }
    //            console.log('unpinned:', unpinned)
    //        })
    //        console.log('hash', hash);
    //    }
    //});
});