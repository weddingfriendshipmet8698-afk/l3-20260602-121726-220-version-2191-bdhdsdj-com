(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (menuButton && panel) {
    menuButton.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-carousel="hero"]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var index = 0;

    function activate(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        activate(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        activate(index + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector('.card-filter-input');
  var yearFilter = document.querySelector('.card-year-filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));

  function applyCardFilter() {
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';

    cards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      var matchQuery = !query || text.indexOf(query) !== -1;
      var matchYear = !year || card.getAttribute('data-year') === year;
      card.classList.toggle('is-filtered-out', !(matchQuery && matchYear));
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyCardFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyCardFilter);
  }
})();
