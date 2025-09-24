window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll(".galeria-swiper").forEach((container) => {
      new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,

        pagination: {
          el: container.querySelector(".swiper-pagination"),
          clickable: true,
          enabled: true,
        },
        navigation: {
          nextEl: container.querySelector(".swiper-button-next"),
          prevEl: container.querySelector(".swiper-button-prev"),
          enabled: false,
        },

        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
            pagination: {
              el: container.querySelector(".swiper-pagination"),
              clickable: true,
              enabled: false,
            },
            navigation: {
              nextEl: container.querySelector(".swiper-button-next"),
              prevEl: container.querySelector(".swiper-button-prev"),
              enabled: true,
            },
          },
        },

        watchOverflow: true,
        observer: true,
        observeParents: true,
      });
    });
  }, 200);
});
