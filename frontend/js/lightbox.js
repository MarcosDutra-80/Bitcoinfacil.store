(function () {
  let imgs = [],
    idx = 0,
    mounted = false,
    keyHandler = null;
  let lbDiv, imgEl, closeBtn, prevBtn, nextBtn;

  function mount() {
    if (mounted) return;

    lbDiv = document.createElement("div");
    lbDiv.id = "lightbox";
    lbDiv.className = "lightbox";
    lbDiv.innerHTML = `
      <div class="lightbox-inner">
        <figure class="lightbox-figure">
          <img id="imagemModal" alt="Imagem ampliada">
        </figure>
        <button class="close-btn" data-action="close" aria-label="Fechar"><ion-icon name="close"></ion-icon></button>
        <button class="nav-btn prev-btn" data-action="prev" aria-label="Anterior">
          <ion-icon name="chevron-back"></ion-icon>
        </button>
        <button class="nav-btn next-btn" data-action="next" aria-label="Próxima">
          <ion-icon name="chevron-forward"></ion-icon>
    </button>
  </div>
    `;

    document.body.appendChild(lbDiv);

    imgEl = lbDiv.querySelector("#imagemModal");
    closeBtn = lbDiv.querySelector(".close-btn");
    prevBtn = lbDiv.querySelector(".prev-btn");
    nextBtn = lbDiv.querySelector(".next-btn");

    // listener delegado
    lbDiv.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (btn && lbDiv.contains(btn)) {
        const action = btn.dataset.action;
        if (action === "close") close();
        else if (action === "prev") prev();
        else if (action === "next") next();
        return;
      }
      if (e.target === lbDiv) close();
    });

    mounted = true;
  }

  function normalizeImages(images) {
    if (!images) return [];
    if (
      typeof images !== "string" &&
      (images instanceof NodeList || images instanceof HTMLCollection)
    )
      images = Array.from(images);
    if (!Array.isArray(images)) images = [images];

    return images
      .map((item) => {
        if (!item) return null;
        if (typeof item === "string") return item;
        if (item instanceof Element) {
          return (
            item.dataset.full ||
            item.dataset.src ||
            item.getAttribute("data-src") ||
            item.src ||
            item.href ||
            null
          );
        }
        return String(item);
      })
      .filter(Boolean);
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    // desabilita nas extremidades
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= imgs.length - 1;

    // opcional: classes para estilizar
    prevBtn.classList.toggle("disabled", prevBtn.disabled);
    nextBtn.classList.toggle("disabled", nextBtn.disabled);
  }

  function show() {
    if (!lbDiv) return;
    lbDiv.style.display = "flex";
    document.body.classList.add("lb-open");

    keyHandler = (ev) => {
      if (ev.key === "Escape") close();
      else if (ev.key === "ArrowLeft") prev();
      else if (ev.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", keyHandler);
  }

  function hide() {
    if (!lbDiv) return;
    lbDiv.style.display = "none";
    document.body.classList.remove("lb-open");
    if (keyHandler) {
      document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    }
  }

  function setImage(i) {
    idx = i;
    if (imgEl && imgs[idx]) {
      imgEl.src = imgs[idx];
      imgEl.alt = `Imagem ${idx + 1} de ${imgs.length}`;
    }
    updateButtons();
  }

  function open(images, startIndex = 0) {
    mount();
    imgs = normalizeImages(images);
    setImage(Math.max(0, Math.min(startIndex, imgs.length - 1)));
    show();
  }

  function close() {
    hide();
  }

  function prev() {
    if (idx > 0) setImage(idx - 1);
  }

  function next() {
    if (idx < imgs.length - 1) setImage(idx + 1);
  }

  window.lightbox = { open, close, prev, next, mount };
})();
