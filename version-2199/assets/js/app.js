(function () {
  const body = document.body;
  const root = body ? body.getAttribute("data-root") || "./" : "./";

  function submitSearch(form) {
    const input = form.querySelector('input[name="q"]');
    const query = input ? input.value.trim() : "";
    const target = root + "search.html" + (query ? "?q=" + encodeURIComponent(query) : "");
    window.location.href = target;
  }

  document.querySelectorAll(".header-search, .mobile-search").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitSearch(form);
    });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.querySelector(".hero-prev");
  const next = document.querySelector(".hero-next");
  let currentSlide = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  function restartSlider() {
    if (timer) {
      window.clearInterval(timer);
    }
    startSlider();
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(currentSlide - 1);
      restartSlider();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(currentSlide + 1);
      restartSlider();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      restartSlider();
    });
  });

  showSlide(0);
  startSlider();

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const searchInput = document.querySelector("[data-card-search]");
  const cards = Array.from(document.querySelectorAll("[data-card-list] .movie-card"));
  let activeCategory = "all";

  function normalize(value) {
    return (value || "").toLowerCase().trim();
  }

  function filterCards() {
    const keyword = normalize(searchInput ? searchInput.value : "");
    cards.forEach(function (card) {
      const text = normalize([
        card.dataset.title,
        card.dataset.category,
        card.dataset.region,
        card.dataset.tags,
        card.dataset.year
      ].join(" "));
      const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      const matchCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      card.classList.toggle("hidden", !(matchKeyword && matchCategory));
    });
  }

  if (searchInput) {
    searchInput.value = query;
    searchInput.addEventListener("input", filterCards);
  }

  document.querySelectorAll("[data-category-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.getAttribute("data-category-filter") || "all";
      document.querySelectorAll("[data-category-filter]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      filterCards();
    });
  });

  filterCards();
})();
