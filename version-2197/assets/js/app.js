import { H as Hls } from './hls.js';

const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
        mobileNav.classList.toggle('is-open');
    });
}

const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let heroIndex = 0;

function showHeroSlide(index) {
    if (!heroSlides.length) {
        return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== heroIndex;
    });

    heroDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === heroIndex);
    });
}

heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showHeroSlide(index));
});

if (heroSlides.length) {
    showHeroSlide(0);
    window.setInterval(() => showHeroSlide(heroIndex + 1), 5200);
}

const filterForm = document.querySelector('[data-filter-form]');

if (filterForm) {
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const keywordInput = filterForm.querySelector('[name="keyword"]');
    const yearSelect = filterForm.querySelector('[name="year"]');
    const regionSelect = filterForm.querySelector('[name="region"]');
    const typeSelect = filterForm.querySelector('[name="type"]');

    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        applyLocalFilter();
    });

    [keywordInput, yearSelect, regionSelect, typeSelect].forEach((control) => {
        if (control) {
            control.addEventListener('input', applyLocalFilter);
            control.addEventListener('change', applyLocalFilter);
        }
    });

    function applyLocalFilter() {
        const keyword = (keywordInput?.value || '').trim().toLowerCase();
        const year = yearSelect?.value || '';
        const region = regionSelect?.value || '';
        const type = typeSelect?.value || '';

        cards.forEach((card) => {
            const haystack = [
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.dataset.tags
            ].join(' ').toLowerCase();

            const matchedKeyword = !keyword || haystack.includes(keyword);
            const matchedYear = !year || card.dataset.year === year;
            const matchedRegion = !region || (card.dataset.region || '').includes(region);
            const matchedType = !type || (card.dataset.type || '').includes(type);
            card.style.display = matchedKeyword && matchedYear && matchedRegion && matchedType ? '' : 'none';
        });
    }
}

const searchInput = document.querySelector('[data-global-search]');
const searchGrid = document.querySelector('[data-search-results]');
const noResults = document.querySelector('[data-no-results]');

if (searchInput && searchGrid) {
    import('./search-data.js').then((module) => {
        const allMovies = module.SEARCH_MOVIES || [];
        renderSearch(allMovies.slice(0, 120));

        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.trim().toLowerCase();

            if (!keyword) {
                renderSearch(allMovies.slice(0, 120));
                return;
            }

            const results = allMovies.filter((movie) => {
                return [
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.tags,
                    movie.oneLine
                ].join(' ').toLowerCase().includes(keyword);
            }).slice(0, 160);

            renderSearch(results);
        });
    });
}

function renderSearch(items) {
    searchGrid.innerHTML = items.map((movie) => {
        return `
            <a class="movie-card" href="${movie.file}" data-card>
                <span class="poster-wrap">
                    <img src="${movie.cover}.jpg" alt="${escapeHtml(movie.title)}" loading="lazy" onerror="this.remove()">
                    <span class="play-dot">▶</span>
                    <span class="rating-badge">${escapeHtml(movie.rating)}</span>
                </span>
                <span class="movie-info">
                    <strong>${escapeHtml(movie.title)}</strong>
                    <em>${escapeHtml(movie.oneLine)}</em>
                    <span class="meta-line">${escapeHtml(movie.year)} · ${escapeHtml(movie.region)} · ${escapeHtml(movie.type)}</span>
                    <span class="tag-row">${tagHtml(movie)}</span>
                </span>
            </a>
        `;
    }).join('');

    if (noResults) {
        noResults.style.display = items.length ? 'none' : 'block';
    }
}

function tagHtml(movie) {
    return [movie.region, movie.type, movie.year].filter(Boolean).slice(0, 3).map((tag) => {
        return `<span>${escapeHtml(tag)}</span>`;
    }).join('');
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, (char) => {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;'
        }[char];
    });
}

const player = document.querySelector('[data-player]');

if (player) {
    const video = player.querySelector('video');
    const overlay = player.querySelector('[data-play-overlay]');
    const status = player.querySelector('[data-video-status]');
    const streamNode = document.getElementById('movie-stream');
    let hlsInstance = null;
    let hasStarted = false;

    function readStreamUrl() {
        if (!streamNode) {
            return '';
        }

        try {
            return JSON.parse(streamNode.textContent || '""');
        } catch (error) {
            return '';
        }
    }

    async function startPlayback() {
        if (!video || hasStarted) {
            return;
        }

        const streamUrl = readStreamUrl();

        if (!streamUrl) {
            if (status) {
                status.textContent = '播放暂不可用';
            }
            return;
        }

        hasStarted = true;

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }

        try {
            await video.play();
            if (status) {
                status.textContent = '';
            }
        } catch (error) {
            if (status) {
                status.textContent = '请再次点击播放';
            }
            hasStarted = false;
            if (overlay) {
                overlay.classList.remove('is-hidden');
            }
        }
    }

    if (overlay) {
        overlay.addEventListener('click', startPlayback);
    }

    video?.addEventListener('click', () => {
        if (video.paused) {
            startPlayback();
        }
    });

    window.addEventListener('pagehide', () => {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
