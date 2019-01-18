const html = require('choo/html')

module.exports = (state, emit) => {

  // NOTE: I think the simplest solution for solving the playlist vs. beaker
  // pinning is just to have 2 different pin buttons. so this fn should
  // be renamed
  const pinCurrentVideo = () => {
    // emit('pinVideo', state.videoLink)
  }

  const addVidToProfile = () => {
    emit('addVidToProfile', state.params.videoUrl)
  }

  return html`
<div>
  <a href="/">home</a>
  <div>
    Hello this is videoPage how can I be of service
    ${state.params.videoUrl}
  </div>
  <button onclick=${addVidToProfile}>Add video to profile</button>
  <div>
    <video controls autoplay muted src=${state.params.videoUrl}>
    </video>
  </div>
</div>
  `
}