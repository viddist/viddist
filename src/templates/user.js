const html = require('choo/html')

const videoItem = video => {
  return html`
    <li>${video}</li>
  `
}

module.exports = user => {
  console.log('rendering user')
  if (user === null) { return '' }

  return html`
    <div>
      <h3>${user.username}</h3>
      <ul>
      ${user.videoList.map(videoItem)}
      </ul>
    </div>
  `
}
