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
      // TODO: Make addUserProfile create the profile in mfs so it's more
      // easily modifiable
      await profile._createEmpty(ipfs)
      await profile._publish(ipfs)
      console.log('Profile published at:', key.id)
      return key.id
    }
  } catch (error) {
    console.error('Failed to init user profile:', error)
    throw error
  }
}

// This works on any profile, not just 'my-profile'. Should it be in another
// file?
profile.cat = async nameHash => {
  try {
    const rootHash = await ipfs.name.resolve(nameHash)
    const path = rootHash + '/viddist-profile/user-profile.json'
    console.log('ipfs path to profile:', path)
    // Since we're reading from a hash we have to use cat, not read (which is
    // only for raw mfs paths)
    return (await ipfs.files.cat(path)).toString()
  } catch (error) {
    console.error('Failed to cat a profile:', error)
    throw error
  }
}

// The profile and pinnedVids should maybe just be dirs. files.cp should be
// almost O(1) to get the video in there (the video should still be originally
// added with files.add since that's better for immutable data) and we won't
// have to mess around as much with json.
// And, since mfs is always pinned, we wouldn't have to manually pin videos
profile.pinVideo = async vidHash => {
  await ipfs.pin.add(vidHash)
  const myProfile = JSON.parse((await ipfs.files
    .read('/viddist-profile/user-profile.json')).toString())
  myProfile.pinnedVids.push(vidHash)
  await ipfs.files.write('/viddist-profile/user-profile.json',
    Buffer.from(JSON.stringify(myProfile)), {truncate: true})
  await profile._publish()
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
      Buffer.from(protocolVersion, 'utf-8'), {create: true})
    await ipfs.files.write('/viddist-profile/user-profile.json',
      Buffer.from(JSON.stringify(
        {name: 'unnamed viddist user', pinnedVids: []})), {create: true})
  } catch (error) {
    console.error('Failed create an empty profile:', error)
    throw error
  }
}

profile._publish = async () => {
  try {
    // According to irc (and indications from tests), the mfs root is always
    // recursively pinned
    const hash = (await ipfs.files.stat('/', {hash: true})).hash
    await ipfs.name.publish(hash, {key: userAddressKeyName})
  } catch (error) {
    console.error('Failed to publish profile:', error)
    throw error
  }
}
