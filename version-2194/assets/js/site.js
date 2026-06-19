(() => {
  const toggleButton = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (toggleButton && mobilePanel) {
    toggleButton.addEventListener("click", () => {
      mobilePanel.classList.toggle("is-open");
    });
  }

  const slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    const showSlide = (next) => {
      if (!slides.length) {
        return;
      }

      current = (next + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === current);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === current);
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    setInterval(() => showSlide(current + 1), 6500);
  }

  const scopes = document.querySelectorAll("[data-filter-scope]");

  scopes.forEach((scope) => {
    const keywordInput = scope.querySelector("[data-filter-keyword]");
    const typeSelect = scope.querySelector("[data-filter-type]");
    const categorySelect = scope.querySelector("[data-filter-category]");
    const yearSelect = scope.querySelector("[data-filter-year]");
    const emptyState = scope.querySelector("[data-empty-state]");
    const cards = Array.from(scope.querySelectorAll("[data-card]"));

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");

    if (q && keywordInput) {
      keywordInput.value = q;
    }

    const normalize = (value) => (value || "").toString().trim().toLowerCase();

    const applyFilter = () => {
      const keyword = normalize(keywordInput && keywordInput.value);
      const type = normalize(typeSelect && typeSelect.value);
      const category = normalize(categorySelect && categorySelect.value);
      const year = normalize(yearSelect && yearSelect.value);
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = normalize([
          card.dataset.title,
          card.dataset.type,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.category,
          card.dataset.year
        ].join(" "));

        const matchKeyword = !keyword || text.includes(keyword);
        const matchType = !type || normalize(card.dataset.type).includes(type);
        const matchCategory = !category || normalize(card.dataset.category) === category;
        const matchYear = !year || normalize(card.dataset.year) === year;
        const visible = matchKeyword && matchType && matchCategory && matchYear;

        card.classList.toggle("is-hidden", !visible);

        if (visible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visibleCount === 0);
      }
    };

    [keywordInput, typeSelect, categorySelect, yearSelect].forEach((control) => {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  });
})();
