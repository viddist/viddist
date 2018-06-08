const protocolVersion = '1'
const userAddressKeyName = 'user-address'

const p = module.exports = {}

p.init = async (ipfs) => {
  try {
    const keys = await ipfs.key.list()
    let profile = keys.find(key => {
      if (key.name === userAddressKeyName) {
        return key.id
      }
    })
    if (profile) {
      return profile
    } else {
      // Initialize the user profile key and files if they don't exist
      const key = await ipfs.key.gen(userAddressKeyName, {
        type: 'rsa', size: 2048
      })
      // TODO: Make addUserProfile create the profile in mfs so it's more
      // easily modifiable
      const addRes = await p.addUserProfile(ipfs,
        { userName: 'Viddist ~ö~ User', pinnedVids: [] })
      // I don't like this way of finding the top hash but they do it like this
      // in the official tests so it should be fine.
      // TODO: Use files.stat to get the hash once the profile is in mfs
      const dirHash = addRes[addRes.length - 1].hash
      const publishRes = await Promise.all([
        ipfs.pin.add(dirHash, {recursive: true}).hash,
        ipfs.name.publish(dirHash, {key: userAddressKeyName})
      ])
      console.log('Profile published at:', publishRes[1])
      return key.id
    }
  } catch (error) {
    console.error('Failed to init user profile')
    throw error
  }
}

// TODO: Make this function not take the profile arg, the only thing we need
// is the username and we can add that by calling e.g. setUsername(name) after
// this one
p.addUserProfile = (ipfs, profile) => {
  return ipfs.files.add([{
    path: '/viddist-meta/viddist-version.txt',
    content: Buffer.from(protocolVersion, 'utf-8')
  }, { // I love that ESLint/Standard don't complain about anything here
    path: '/viddist-meta/user-profile.json',
    content: Buffer.from(JSON.stringify(profile))
  }])
}

// const updateUserProfile =
