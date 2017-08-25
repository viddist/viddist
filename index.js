const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

ipfs.pin.ls().then(text => {
    console.log(text);
});