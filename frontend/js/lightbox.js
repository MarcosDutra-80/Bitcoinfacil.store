// /js/lightbox.js  — Lightbox simples e robusta (sem dependências)
(function(){
  let imgs = [], idx = 0, mounted = false, keyHandler = null;

  function injectStyles(){
    if (document.getElementById('lightbox-styles')) return;
    const css = `
      body.lb-open{overflow:hidden}
      .lightbox{
        position:fixed; inset:0; display:none;
        align-items:center; justify-content:center;
        background:rgba(0,0,0,.8); z-index:9999;
        padding:24px;
      }
      .lightbox img{
        max-width:min(92vw, 1200px);
        max-height:88vh;
        border-radius:12px;
        box-shadow:0 10px 40px rgba(0,0,0,.5);
        border:1px solid rgba(255,255,255,.15);
        display:block;
      }
      .lightbox .nav-btn,
      .lightbox .close-btn{
        position:absolute; border:none; background:rgba(255,255,255,.12);
        color:#fff; font-size:28px; line-height:1; cursor:pointer;
        width:44px; height:44px; border-radius:999px;
        display:flex; align-items:center; justify-content:center;
        transition:filter .2s, transform .2s, background .2s;
        user-select:none;
      }
      .lightbox .nav-btn:hover,
      .lightbox .close-btn:hover{ filter:brightness(1.15); transform:translateY(-1px) }
      .lightbox .close-btn{ top:24px; right:24px; font-weight:700 }
      .lightbox .prev-btn{ left:24px }
      .lightbox .next-btn{ right:24px }
      @media (max-width:640px){
        .lightbox .prev-btn{ left:8px }
        .lightbox .next-btn{ right:8px }
        .lightbox .close-btn{ top:12px; right:12px }
      }
    `;
    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function mount(){
    if (mounted) return;
    injectStyles();
    const div = document.createElement('div');
    div.id = 'lightbox';
    div.className = 'lightbox';
    div.innerHTML = `
      <button class="close-btn" data-action="close" aria-label="Fechar">×</button>
      <img id="imagemModal" alt="Imagem ampliada">
      <button class="nav-btn prev-btn" data-action="prev" aria-label="Anterior">‹</button>
      <button class="nav-btn next-btn" data-action="next" aria-label="Próxima">›</button>
    `;
    div.addEventListener('click', (e) => {
      const a = e.target.dataset.action;
      if (a === 'close') close();
      else if (a === 'prev') prev();
      else if (a === 'next') next();
      // fechar clicando fora da imagem
      if (e.target === div) close();
    });
    document.body.appendChild(div);
    mounted = true;
  }

  function show(){
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.style.display = 'flex';
    document.body.classList.add('lb-open');
    // teclas
    keyHandler = (ev) => {
      if (ev.key === 'Escape') close();
      else if (ev.key === 'ArrowLeft') prev();
      else if (ev.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', keyHandler);
  }

  function hide(){
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.style.display = 'none';
    document.body.classList.remove('lb-open');
    if (keyHandler){
      document.removeEventListener('keydown', keyHandler);
      keyHandler = null;
    }
  }

  function open(images, startIndex){
    mount();
    imgs = Array.isArray(images) ? images.slice() : [];
    idx = Math.max(0, Math.min(startIndex|0, imgs.length-1));
    const img = document.getElementById('imagemModal');
    if (img && imgs.length) img.src = imgs[idx];
    show();
  }

  function close(){ hide(); }

  function prev(){
    if (!imgs.length) return;
    idx = (idx - 1 + imgs.length) % imgs.length;
    const img = document.getElementById('imagemModal');
    if (img) img.src = imgs[idx];
  }

  function next(){
    if (!imgs.length) return;
    idx = (idx + 1) % imgs.length;
    const img = document.getElementById('imagemModal');
    if (img) img.src = imgs[idx];
  }

  window.lightbox = { open, close, prev, next, mount };
})();