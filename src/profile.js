const dat = window.DatArchive

const e = module.exports = {}

// TODO: Actually check this
const profileVersion = 1

let myProfile

e.initProfile = async function () {
  try {
    const myProfileUrl = window.localStorage.getItem('myProfile')

    if (myProfileUrl === null) {
      // TODO: This breaks if the user selects an already init'ed profile
      myProfile = await dat.selectArchive(
        { title: 'Create or select your Viddist profile',
          buttonLabel: 'Select profile',
          filters: {
            isOwner: true,
            type: 'viddist-profile'
          }
        }
      )
      window.localStorage.setItem('myProfile', myProfile.url)

      await myProfile.writeFile('/version.txt', profileVersion.toString())
      await myProfile.writeFile('/username.txt', 'Unnamed user')
      await myProfile.writeFile('/videoList.json', '[]')
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
