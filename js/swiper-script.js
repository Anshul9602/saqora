$(function () {
    var swiperImage = new Swiper('.swiper.swiperImage', {
        autoplay: {
            delay: 3000
        },
        speed: 2000,
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 0,
        initialSlide: 1,
        loop: false,
        grabCursor: true,
        breakpoints: {
            // when window width is >= 360px
            360: {
                slidesPerView: 1,
                slidesPerGroup: 2,
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 1,
                slidesPerGroup: 1,
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
            }
        },
        // If we need pagination
        pagination: {
            enabled: false,
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
    });

});

$(function () {
    var swiperTestimonials = new Swiper('.swiperTestimonials', {
        autoplay: {
            delay: 3000
        },
        speed: 2000,
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 10,
        loop: false,
        grabCursor: true,
        breakpoints: {
            // when window width is >= 360px
            360: {
                slidesPerView: 1,
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 2,
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 2,
            }
        },
        // If we need pagination
        pagination: {
            enabled: true,
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
    });

});