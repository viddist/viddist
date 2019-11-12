const html = require('choo/html')

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
        <div>
          <button onclick="${() => emit('viewProfile', state.myProfileAddress)}">
          ${state.myProfileAddress}</button>
        </div>
      </div>
      <form onsubmit=${viewProfile}>
        <div>
          <label>User profile address</label>
          <input id="other-user-url" type="text">
          <button>View user</button>
        </div>
      </form>
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
