const ipfsd = require('ipfsd-ctl')

console.log('running');

ipfsd.disposableApi((err, ipfs) => {
    if (err) { throw err }

    ipfs.id(function (err, id) {
        if (err) { throw err }
        console.log(id);
    });

    ipfs.pin.ls({'type': 'recursive'}).then(items => {
        for (var hash in items) {
            ipfs.pin.rm(hash, {'recursive': true}).then((err, unpinned) => {
                if (err) { throw err }
                console.log('unpinned:', unpinned)
            })
            console.log('hash', hash);
        }
    });
});