const profileVersion = 1

const e = module.exports = {}

e.initProfile = async function () {
  const myProfileUrl = window.localStorage.getItem('myProfile')

  if (myProfileUrl === null) {
    console.log('creating new profile')
  } else {
    console.log('using old profile')
  }
}
