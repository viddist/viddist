const html = require('choo/html')

module.exports = (emit, user) => {
  const videoItem = video => {
    return html`
      <li><button onclick="${() => emit('playNewVideo', video)}">${video}</button></li>
    `
  }

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
