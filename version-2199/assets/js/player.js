(function () {
  function setupPlayer(wrapper) {
    const video = wrapper.querySelector("video[data-stream]");
    const overlay = wrapper.querySelector(".player-overlay");
    const message = wrapper.querySelector(".player-message");
    let engine = null;
    let ready = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function prepare() {
      if (ready || !video) {
        return;
      }
      const source = video.getAttribute("data-stream");
      if (!source) {
        setMessage("暂时无法播放，请稍后再试");
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        engine = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        engine.loadSource(source);
        engine.attachMedia(video);
        engine.on(window.Hls.Events.MANIFEST_PARSED, function () {
          ready = true;
          setMessage("");
        });
        engine.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setMessage("网络连接不稳定，正在重试");
            engine.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setMessage("播放遇到问题，正在恢复");
            engine.recoverMediaError();
          } else {
            setMessage("播放遇到问题，请稍后再试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        ready = true;
      } else {
        setMessage("当前浏览器无法播放该视频");
      }
    }

    function play() {
      prepare();
      if (!video) {
        return;
      }
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          setMessage("点击视频区域即可继续播放");
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", function () {
        play();
      });
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("hidden");
        }
      });
      video.addEventListener("pause", function () {
        if (overlay) {
          overlay.classList.remove("hidden");
        }
      });
      video.addEventListener("loadedmetadata", function () {
        ready = true;
        setMessage("");
      });
    }

    prepare();

    window.addEventListener("beforeunload", function () {
      if (engine) {
        engine.destroy();
      }
    });
  }

  document.querySelectorAll("[data-player]").forEach(setupPlayer);
})();
