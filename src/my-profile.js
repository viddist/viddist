const protocolVersion = '1'
const userAddressKeyName = 'user-address'

const profile = module.exports = {}

let ipfs

profile.init = async api => {
  try {
    ipfs = api
    const profileId = await profile._getMyAddress()
    if (profileId) {
      return profileId
    } else {
      // Initialize the user profile key and files if they don't exist
      const key = await ipfs.key.gen(userAddressKeyName, {
        type: 'rsa', size: 2048
      })
      await profile._createEmpty()
      profile._publish()
      return key.id
    }
  } catch (error) {
    console.error('Failed to init user profile:', error)
    throw error
  }
}

// This works on any profile, not just 'my-profile'. Should it be in another
// file?
profile.catUsername = async nameHash => {
  try {
    const profileHash = await ipfs.name.resolve(nameHash)
    const path = profileHash + '/username.txt'
    // Since we're reading from a hash we have to use cat, not read (which is
    // only for raw mfs paths)
    return (await ipfs.files.cat(path)).toString()
  } catch (error) {
    console.error('Failed to cat a profile:', error)
    throw error
  }
}

// TODO: Make saner video naming
profile.pinVideo = async vidLink => {
  try {
    // Cool code that grabs the file's name in a filepath
    const fileName = vidLink.replace('.mp4', '').split('/').slice(-1)[0]
    // Hacky way of getting a unique video name
    const vidHash = (await ipfs.files.stat('/ipfs/' + vidLink,
      { hash: true })).hash
    const vidName = fileName + '-' + vidHash.slice(-5) + '.mp4'

    await ipfs.files.cp('/ipfs/' + vidLink, '/pinned-videos/' + vidName)
    await profile._updatePinVidsLink()
    profile._publish()
  } catch (err) {
    console.error('Failed to pin video:', err)
    throw err
  }
}

profile._updatePinVidsLink = async () => {
  const pinHash = (await ipfs.files.stat('/pinned-videos/',
    { hash: true })).hash
  await ipfs.files.write('/viddist-profile/pinned-videos.link',
    Buffer.from(pinHash), { create: true, truncate: true })
}

profile._getMyAddress = async () => {
  const keys = await ipfs.key.list()
  // Returns undefined if the key name doesn't exist
  return keys.find(key => {
    if (key.name === userAddressKeyName) {
      return key.id
    }
  })
}

profile._createEmpty = async () => {
  try {
    await ipfs.files.mkdir('/viddist-profile/')
    await ipfs.files.write('/viddist-profile/viddist-version.txt',
      Buffer.from(protocolVersion), { create: true })
    await ipfs.files.write('/viddist-profile/username.txt',
      Buffer.from('unnamed viddist user'), { create: true })
    await ipfs.files.mkdir('/pinned-videos/')
    await profile._updatePinVidsLink()
  } catch (error) {
    console.error('Failed to create an empty profile:', error)
    throw error
  }
}

// Not recommended to await this function, name publishing is super slow
profile._publish = async () => {
  try {
    // According to irc (and indications from tests), the mfs root is always
    // recursively pinned
    const hash = (await ipfs.files.stat('/viddist-profile/',
      { hash: true })).hash
    await ipfs.name.publish(hash, {key: userAddressKeyName})
    // TODO: Put this info in the ui
    console.log('Published profile')
  } catch (error) {
    console.error('Failed to publish profile:', error)
    throw error
  }
}
