const dat = window.DatArchive

const e = module.exports = {}

const viddistVersion = 1

let myProfile

e.initProfile = async function () {
  try {
    const myProfileUrl = window.localStorage.getItem('myProfile')

    if (myProfileUrl === null) {
      myProfile = await dat.selectArchive(
        { title: 'Create or select a viddist playlist',
          buttonLabel: 'Select playlist',
          filters: {
            isOwner: true,
            type: 'viddist-profile'
          }
        }
      )
      window.localStorage.setItem('myProfile', myProfile.url)

      const dir = await myProfile.readdir('/')

      // Our way of checking if the playlist is already init'ed
      if (dir.includes('version.txt')) {
        const archiveVersion = parseInt(await myProfile.readFile('/version.txt'))

        if (archiveVersion > viddistVersion) {
          myProfile = null
          throw 'This playlist was made using a newer version of viddist. Not opening it due to risk of breaking it.'
        }
      } else {
        await myProfile.writeFile('/version.txt', viddistVersion.toString())
        await myProfile.writeFile('/username.txt', 'Unnamed playlist')
        await myProfile.writeFile('/videoList.json', '[]')
      }
    } else {
      myProfile = await dat.load(myProfileUrl)
    }
    return myProfile.url
  } catch (err) {
    console.error('Initializing the user profile failed:', err)
  }
}

e.readProfile = async function (url) {
  try {
    const profile = {}
    const archive = await dat.load(url)

    console.log('loaded profile')

    profile.username = await archive.readFile('/username.txt')
    profile.videoList = JSON.parse(await archive.readFile('/videoList.json'))

    console.log('read profile:', profile)
    return profile
  } catch (err) {
    console.error('Reading user profile failed:', err)
  }
}

e.addVideoToProfile = async function (videoUrl) {
  try {
    const videos = JSON.parse(await myProfile.readFile('/videoList.json'))
    videos.push(videoUrl)
    await myProfile.writeFile('/videoList.json', JSON.stringify(videos))
  } catch (err) {
    console.error('Adding video to profile failed:', err)
  }
}

e.removeVideoFromPlaylist = async function (videoUrl) {
  try {
    const videos = JSON.parse(await myProfile.readFile('/videoList.json'))
    const fewerVideos = videos.filter(vid => vid !== videoUrl)
    await myProfile.writeFile('/videoList.json', JSON.stringify(fewerVideos))
  } catch (err) {
    console.error('Removing video from playlist failed:', err)
  }
}

e.videoIsInPlaylist = async function (videoUrl) {
  const videos = JSON.parse(await myProfile.readFile('/videoList.json'))
  return videos.includes(videoUrl)
}
