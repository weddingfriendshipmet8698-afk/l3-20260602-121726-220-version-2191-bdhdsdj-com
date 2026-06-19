(function () {
    var toggle = document.querySelector(".menu-toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("menu-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    var active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === active);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            showSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterSelect = document.querySelector("[data-filter-select]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var empty = document.querySelector(".search-empty");

    function runFilter() {
        if (!cards.length) {
            return;
        }
        var q = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = filterSelect ? filterSelect.value : "";
        var visible = 0;
        cards.forEach(function (card) {
            var text = (card.getAttribute("data-text") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var ok = (!q || text.indexOf(q) >= 0) && (!year || cardYear === year);
            card.style.display = ok ? "" : "none";
            if (ok) {
                visible += 1;
            }
        });
        if (empty) {
            empty.style.display = visible ? "none" : "block";
        }
    }

    if (filterInput) {
        filterInput.addEventListener("input", runFilter);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", runFilter);
    }
    runFilter();
})();
