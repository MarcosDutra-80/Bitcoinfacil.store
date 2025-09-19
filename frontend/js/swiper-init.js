window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const swiperContainer = document.querySelector(".products-swiper");
    if (swiperContainer && window.Swiper) {
      new Swiper(".products-swiper", {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: false,
        },

        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          641: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1025: {
            slidesPerView: 3,
            spaceBetween: 24,
            allowTouchMove: false,
          },
        },

        touchRatio: 1,
        touchAngle: 45,

        watchOverflow: true,
        observer: true,
        observeParents: true,

        a11y: {
          enabled: true,
          prevSlideMessage: "Produto anterior",
          nextSlideMessage: "Próximo produto",
          paginationBulletMessage: "Ir para produto {{index}}",
        },

        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        on: {
          init: function () {
            console.log("Swiper inicializado com sucesso!");
          },
          slideChange: function () {},
        },
      });
    } else {
      console.error("Swiper não encontrado. Verifique se o CDN foi carregado.");
    }
  }, 200);
});
