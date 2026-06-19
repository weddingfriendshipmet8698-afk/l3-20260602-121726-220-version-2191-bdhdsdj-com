(function () {
  var form = document.getElementById('search-form');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');

  if (!form || !input || !results || !window.SEARCH_MOVIES) {
    return;
  }

  function paramsQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card">' +
      '<a class="movie-cover" href="' + escapeHtml(movie.url) + '">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="cover-play">▶</span>' +
      '</a>' +
      '<div class="movie-body">' +
      '<div class="movie-meta"><span>' + movie.year + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function render(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = window.SEARCH_MOVIES.slice(0, 24).map(card).join('');
      return;
    }

    var matched = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    }).slice(0, 120);

    results.innerHTML = matched.map(card).join('');
  }

  input.value = paramsQuery();
  render(input.value);

  input.addEventListener('input', function () {
    render(input.value);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = input.value.trim();
    var url = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
    window.history.replaceState(null, '', url);
    render(query);
  });
})();
