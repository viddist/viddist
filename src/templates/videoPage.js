const html = require('choo/html')

module.exports = (state, emit) => {
  // NOTE: I think the simplest solution for solving the playlist vs. beaker
  // pinning is just to have 2 different pin buttons. so this fn should
  // be renamed
  // const pinCurrentVideo = () => {
  //  // emit('pinVideo', state.videoLink)
  // }

  const addVidToProfile = () => {
    emit('addVidToProfile', state.params.videoUrl)
  }

  const removeVideoFromPlaylist = () => {
    emit('removeVideoFromPlaylist', state.params.videoUrl)
  }

  console.log('showvideoloader', state.showLoader)
  if (state.showLoader) {
    emit('loadVideoInfo', state.params.videoUrl)
    return html`<div>loading video info</div>`
  }

  console.log('videoisinplaylist', state.videoIsInPlaylist)

  return html`
<div>
  <a href="/">home</a>
  <div>
    Current video address <code>${state.params.videoUrl}</code>
  </div>
${ state.videoIsInPlaylist ?
    html`<button onclick=${removeVideoFromPlaylist}>Remove video from playlist</button>` :
    html`<button onclick=${addVidToProfile}>Add video to playlist</button>`
}
  <div>
    <video controls autoplay muted src=${state.params.videoUrl}>
    </video>
  </div>
</div>
  `
}
