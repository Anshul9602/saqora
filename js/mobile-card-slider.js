(function () {
    var MIN_ITEMS = 3;
    var PANEL_CLASSES = ['p-4', 'p-3', 'p-5', 'bg-accent-primary', 'bg-accent', 'shadow', 'rounded-3', 'rounded-2'];

    function isColElement(element) {
        return Array.from(element.classList).some(function (className) {
            return className === 'col' || className.indexOf('col-') === 0;
        });
    }

    function isSliderColumn(column) {
        if (!isColElement(column)) {
            return false;
        }
        if (column.querySelector('.card')) {
            return true;
        }
        if (column.querySelector('.number-text')) {
            return true;
        }
        if (column.querySelector('h1.accent-color, h3.accent-color')) {
            return true;
        }
        return false;
    }

    function isStatColumn(column) {
        return isSliderColumn(column) && !column.querySelector('.card');
    }

    function shouldSkipRow(row) {
        if (row.closest('footer')) {
            return true;
        }
        if (row.closest('.swiper:not(.mobile-card-slider)')) {
            return true;
        }
        if (row.classList.contains('mobile-card-slider-ready')) {
            return true;
        }
        if (row.classList.contains('hero-banner-row')) {
            return true;
        }
        if (row.classList.contains('footer-links-row')) {
            return true;
        }
        if (row.hasAttribute('data-skip-mobile-slider')) {
            return true;
        }
        if (row.querySelector('.swiperServices, .swiperWhyChoose, .swiperTestimonials, .swiperImage')) {
            return true;
        }
        if (row.previousElementSibling && row.previousElementSibling.classList.contains('mobile-card-slider')) {
            return true;
        }
        return false;
    }

    function getSliderColumns(row) {
        return Array.from(row.children).filter(isSliderColumn);
    }

    function copyPanelStyles(source, target) {
        PANEL_CLASSES.forEach(function (className) {
            if (source.classList.contains(className)) {
                target.classList.add(className);
            }
        });

        if (source.getAttribute('style')) {
            target.setAttribute('style', source.getAttribute('style'));
        }
    }

    function buildSlide(column) {
        var slide = document.createElement('div');
        slide.className = 'swiper-slide';

        var card = column.querySelector('.card');
        if (card) {
            slide.appendChild(card.cloneNode(true));
            return slide;
        }

        var statWrap = document.createElement('div');
        statWrap.className = 'mobile-stat-slide text-center px-3 py-2 h-100 d-flex flex-column justify-content-center';
        statWrap.innerHTML = column.innerHTML;
        slide.appendChild(statWrap);
        return slide;
    }

    function initMobileCardSliders() {
        if (typeof Swiper === 'undefined') {
            return;
        }

        document.querySelectorAll('.row').forEach(function (row) {
            if (shouldSkipRow(row)) {
                return;
            }

            var columns = Array.from(row.children).filter(isColElement);
            var sliderColumns = getSliderColumns(row);

            if (sliderColumns.length < MIN_ITEMS || sliderColumns.length !== columns.length) {
                return;
            }

            var isStatRow = sliderColumns.every(isStatColumn);

            row.classList.add('mobile-card-slider-ready', 'd-none', 'd-xl-flex');

            var swiperEl = document.createElement('div');
            swiperEl.className = 'swiper mobile-card-slider d-xl-none pb-4';

            if (isStatRow) {
                swiperEl.classList.add('mobile-stat-slider');
                copyPanelStyles(row, swiperEl);
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'swiper-wrapper';

            sliderColumns.forEach(function (column) {
                wrapper.appendChild(buildSlide(column));
            });

            if (wrapper.children.length < MIN_ITEMS) {
                row.classList.remove('mobile-card-slider-ready', 'd-none', 'd-xl-flex');
                return;
            }

            var pagination = document.createElement('div');
            pagination.className = 'swiper-pagination mobile-card-slider-pagination';

            swiperEl.appendChild(wrapper);
            swiperEl.appendChild(pagination);
            row.parentNode.insertBefore(swiperEl, row);

            new Swiper(swiperEl, {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 16,
                loop: false,
                grabCursor: true,
                breakpoints: {
                    768: {
                        slidesPerView: isStatRow ? 2 : 2,
                        spaceBetween: 20,
                    },
                },
                pagination: {
                    el: pagination,
                    clickable: true,
                },
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileCardSliders);
    } else {
        initMobileCardSliders();
    }
})();
