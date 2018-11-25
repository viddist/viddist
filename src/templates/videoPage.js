const html = require('choo/html')

module.exports = (state, emit) => {

  const pinCurrentVideo = () => {
    // emit('pinVideo', state.videoLink)
  }

  return html`
<div>
  <a href="/">home</a>
  <div>
    Hello this is videoPage how can I be of service
    ${state.params.videoUrl}
  </div>
  <button onclick=${pinCurrentVideo}>Pin this video</button>
  <div>
    <video controls autoplay muted src=${state.videoAddress}>
    </video>
  </div>
</div>
  `
}