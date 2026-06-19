(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var active = 0;
    var timer = null;
    function show(index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show((active + 1) % slides.length);
      }, 5600);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });
    start();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var list = scope.querySelector('[data-filter-list]');
      if (!list) {
        return;
      }
      var input = panel.querySelector('[data-filter-input]');
      var selects = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-select]'));
      var cards = Array.prototype.slice.call(list.children);
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q') || '';
      if (input && query) {
        input.value = query;
      }
      function apply() {
        var text = input ? input.value.trim().toLowerCase() : '';
        var selected = {};
        selects.forEach(function (select) {
          selected[select.getAttribute('data-filter-select')] = select.value;
        });
        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-filter') || '').toLowerCase();
          var ok = !text || haystack.indexOf(text) !== -1;
          Object.keys(selected).forEach(function (key) {
            if (!selected[key]) {
              return;
            }
            var attr = card.getAttribute('data-' + key) || '';
            if (attr !== selected[key]) {
              ok = false;
            }
          });
          card.hidden = !ok;
        });
      }
      if (input) {
        input.addEventListener('input', apply);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
      apply();
    });
  }

  function initPlayer() {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playButton');
    if (!video || !window.videoStreamUrl) {
      return;
    }
    var attached = false;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = window.videoStreamUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(window.videoStreamUrl);
        hls.attachMedia(video);
        return;
      }
      video.src = window.videoStreamUrl;
    }
    function play() {
      attach();
      if (button) {
        button.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (button) {
            button.classList.remove('is-hidden');
          }
        });
      }
    }
    attach();
    if (button) {
      button.addEventListener('click', play);
    }
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }

  ready(function () {
    initNav();
    initHero();
    initFilters();
    initPlayer();
  });
})();
