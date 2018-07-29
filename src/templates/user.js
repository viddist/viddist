const html = require('choo/html')

const videoItem = video => {
  return html`
    <li>${video.path}</li>
  `
}

module.exports = user => {
  if (user === null) { return '' }

  return html`
    <div>
      <h3>${user.username}</h3>
      <ul>
      ${user.pinnedVideos.map(videoItem)}
      </ul>
    </div>
  `
}
