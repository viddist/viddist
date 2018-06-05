const html = require('choo/html')

module.exports = () /* (state, emit) */ => {
  return html`
    <div>
      <div id="header-logo">
        <img src="./viddist-logo.png">
        <div id="logo">Viddist</div>
      </div>
      <div>Your user address: 
        <div id="user-address"></div>
      </div>
      <form id="other-user-address-form">
        <div>
          <label>User profile address</label>
          <input id="other-user-address" type="text">
          <button>View user</button>
        </div>
      </form>
      <div id="other-user-profile"></div>
      <form id="video-address-form">
        <div>
          <label>Video address</label>
          <input id="new-video-address" type="text">
          <button>Play video</button>
        </div>
      </form>
      <div id="textContent"></div>
      <div id="imgContent"></div>
      <div id="vidContent">
        <video id="playing-video"></video>
      </div>
    </div>
  `
}
