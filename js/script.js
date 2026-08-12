$(function () {
    $('.nav-btn').on('click', function () {
        $(this).toggleClass('open');
    });

    function initTopBarMarquee() {
        document.querySelectorAll('.bg-text-color .top-bar-scroll').forEach(function (container) {
            if (container.dataset.marqueeReady === 'true') {
                return;
            }

            var items = container.querySelector('.top-bar-items');
            if (!items) {
                return;
            }

            var marquee = document.createElement('div');
            marquee.className = 'top-bar-marquee text-white font-2';

            var track = document.createElement('div');
            track.className = 'top-bar-track';

            var set1 = document.createElement('div');
            set1.className = 'top-bar-set';
            while (items.firstChild) {
                set1.appendChild(items.firstChild);
            }

            var set2 = set1.cloneNode(true);
            set2.setAttribute('aria-hidden', 'true');

            track.appendChild(set1);
            track.appendChild(set2);
            marquee.appendChild(track);
            items.replaceWith(marquee);
            container.dataset.marqueeReady = 'true';
        });
    }

    initTopBarMarquee();

    var mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(function (link) {
            link.addEventListener('click', function () {
                var instance = bootstrap.Offcanvas.getInstance(mobileNav);
                if (instance) {
                    instance.hide();
                }
            });
        });
    }
});

$(window).ready(function () {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > 100) {
            $("#header").addClass('glass-effect');
        } else {
            $("#header").removeClass("glass-effect");
        }
    })
})