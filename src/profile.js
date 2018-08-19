const dat = window.DatArchive

const e = module.exports = {}

// TODO: Actually check this
const profileVersion = 1

let profile

e.initProfile = async function () {
  const myProfileUrl = window.localStorage.getItem('myProfile')

  if (myProfileUrl === null) {
    profile = await dat.selectArchive(
      { title: 'Create or select your Viddist profile',
        buttonLabel: 'Select profile',
        filters: {
          isOwner: true,
          type: 'viddist-profile'
        }
      }
    )
    window.localStorage.setItem('myProfile', profile.url)

    await dat.writeFile('/version.txt', profileVersion)
    await dat.writeFile('/username.txt', 'Unnamed user')

  } else {
    profile = await dat.load(myProfileUrl)
  }
  return (await profile.getInfo()).title
}
