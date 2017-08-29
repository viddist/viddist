const ipfsd = require('ipfsd-ctl')

console.log('running');

ipfsd.disposableApi((err, ipfs) => {
    if (err !== null) {
        console.log('err:', err)
        process.exit();
    }

    ipfs.id(function (err, id) {
        console.log(id);
    });

    ipfs.pin.ls({'type': 'recursive'}).then(items => {
        for (var hash in items) {
            ipfs.pin.rm(hash, {'recursive': true}).then((err, unpinned) => {
                console.log('err:', err)
                console.log('unpinned:', unpinned)
            })
            console.log('hash', hash);
        }
    });
});