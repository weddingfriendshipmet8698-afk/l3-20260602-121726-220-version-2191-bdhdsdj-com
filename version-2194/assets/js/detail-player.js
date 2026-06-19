import { H as Hls } from "./hls-vendor.js";

export function initPlayer(options) {
  const video = document.getElementById(options.videoId);
  const button = document.getElementById(options.buttonId);

  if (!video || !button || !options.streamUrl) {
    return;
  }

  const shell = video.closest("[data-video-shell]");
  let ready = false;
  let hls = null;

  const attachStream = () => {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = options.streamUrl;
      ready = true;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.streamUrl);
      hls.attachMedia(video);
      ready = true;
    }
  };

  const play = () => {
    attachStream();

    if (shell) {
      shell.classList.add("is-playing");
    }

    const request = video.play();

    if (request && typeof request.catch === "function") {
      request.catch(() => {});
    }
  };

  button.addEventListener("click", play);

  video.addEventListener("click", () => {
    if (!ready || video.paused) {
      play();
    }
  });

  video.addEventListener("play", () => {
    if (shell) {
      shell.classList.add("is-playing");
    }
  });

  video.addEventListener("pause", () => {
    if (shell && video.currentTime === 0) {
      shell.classList.remove("is-playing");
    }
  });

  window.addEventListener("pagehide", () => {
    if (hls) {
      hls.destroy();
    }
  });
}
