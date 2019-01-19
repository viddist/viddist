const html = require('choo/html')

module.exports = (state, emit) => {
  const videoItem = video => {
    return html`
      <li><button onclick="${() => emit('playNewVideo', video)}">${video}</button></li>
    `
  }

  console.log('rendering user')

  console.log('loaded playlist')

  console.log('showloader', state.showLoader)
  if (state.showLoader) {
    emit('loadPlaylist', state.params.playlistUrl)
    return html`<div>loading playlist</div>`
  }

  const playlist = state.playlistToView

  return html`
    <div>
      <a href="/">home</a>
      <h3>${playlist.username}</h3>
      <ul>
      ${playlist.videoList.map(videoItem)}
      </ul>
    </div>
  `
}
