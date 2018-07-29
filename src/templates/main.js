const html = require('choo/html')

const user = require('./user.js')

module.exports = (state, emit) => {
  const viewProfile = e => {
    e.preventDefault()
    const otherUserId = document.getElementById('other-user-address').value
    emit('viewProfile', otherUserId)
  }

  const playNewVideo = e => {
    e.preventDefault()
    // Can we cleanly avoid getElementById here?
    const newVid = document.getElementById('new-video-address').value
    emit('playNewVideo', newVid)
  }

  const pinCurrentVideo = () => {
    emit('pinVideo', state.videoLink)
  }

  return html`
    <div>
      <div id="header-logo">
        <img src="./viddist-logo.png">
        <div id="logo">Viddist</div>
      </div>
      <div>Your user address: 
        <div>${state.myProfileAddress}</div>
      </div>
      <form onsubmit=${viewProfile}>
        <div>
          <label>User profile address</label>
          <input id="other-user-address" type="text">
          <button>View user</button>
        </div>
      </form>
      <div>${user(state.otherUserProfile)}</div>
      <form onsubmit=${playNewVideo}>
        <div>
          <label>Video address</label>
          <input id="new-video-address" type="text">
          <button>Play video</button>
        </div>
      </form>
      <button onclick=${pinCurrentVideo}>Pin this video</button>
      <div>
        <video controls autoplay muted src=${state.videoAddress}>
        </video>
      </div>
    </div>
  `
}
