const html = require('choo/html')

const user = require('./user.js')

module.exports = (state, emit) => {
  const viewProfile = e => {
    e.preventDefault()
    const profileUrl = document.getElementById('other-user-url').value
    emit('viewProfile', profileUrl)
  }

  const playNewVideo = e => {
    e.preventDefault()
    // Can we cleanly avoid getElementById here?
    const newVid = document.getElementById('new-video-url').value
    emit('playNewVideo', newVid)
  }

  return html`
    <div>
      <div id="header-logo">
        <img src="media/viddist-logo.png">
        <div id="logo">Viddist</div>
      </div>
      <div>Your user address: 
        <div>${state.myProfileAddress}</div>
      </div>
      <form onsubmit=${viewProfile}>
        <div>
          <label>User profile address</label>
          <input id="other-user-url" type="text">
          <button>View user</button>
        </div>
      </form>
      <a href="#video/dat%3A%2F%2F00bb1eab0504c18e4758dabd11bcb5c46b1d150199a8bfe855c41f76fb5f9696%2Fp2p-oresund-mathias-buus.mp4">linky</a>
      <div>${user(emit, state.otherUserProfile)}</div>
      <form onsubmit=${playNewVideo}>
        <div>
          <label>Video address</label>
          <input id="new-video-url" type="text">
          <button>Play video</button>
        </div>
      </form>
    </div>
  `
}
