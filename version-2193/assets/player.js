function initPlayer(sourceUrl) {
  var video = document.getElementById('movie-player');
  var cover = document.getElementById('player-cover');
  var hlsInstance = null;

  if (!video || !sourceUrl) {
    return;
  }

  function attachWithHls() {
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      return true;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      return true;
    }

    video.src = sourceUrl;
    return true;
  }

  function start() {
    attachWithHls();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
