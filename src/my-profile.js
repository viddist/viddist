const protocolVersion = '1'
const userAddressKeyName = 'user-address'

const p = module.exports = {}

p.init = async ipfs => {
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
      await p.createEmpty(ipfs)
      await p.publish(ipfs)
      console.log('Profile published at:', key.id)
      return key.id
    }
  } catch (error) {
    console.error('Failed to init user profile:', error)
    throw error
  }
}

// TODO: Make this function not take the profile arg, the only thing we need
// is the username and we can add that by calling e.g. setUsername(name) after
// this one
p.createEmpty = async ipfs => {
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

p.publish = async ipfs => {
  try {
    const hash = (await ipfs.files.stat('/', {hash: true})).hash
    // go-ipfs is recursive by default so we probably don't need this option,
    // but interface-ipfs-core says it isn't. Confusing.
    await ipfs.pin.add(hash, {recursive: true})
    await ipfs.name.publish(hash, {key: userAddressKeyName})
  } catch (error) {
    console.error('Failed to publish profile:', error)
    throw error
  }
}

// This works on any profile, not just 'my-profile'. Should it be in another
// file?
p.cat = async (ipfs, nameHash) => {
  const rootHash = await ipfs.name.resolve(nameHash)
  const path = rootHash + '/viddist-profile/user-profile.json'
  console.log('ipfs path to profile:', path)
  // Since we're reading from a hash we have to use cat, not read (which is
  // only for raw mfs paths)
  return (await ipfs.files.cat(path)).toString()
}

// const updateUserProfile =
