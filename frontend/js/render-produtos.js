// /js/render-produtos.js - Renderização e modal de compra

(function () {
  /* Utilitário para criar elementos */
  function el(tag, attrs = {}, html) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k === "onclick") e.addEventListener("click", v);
      else e.setAttribute(k, v);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* Lista de preços HTML */
  function priceListHTML(precos) {
    if (!Array.isArray(precos)) return "";
    return precos
      .map((p) => `<p><strong>${p.label}:</strong> ${p.valor}</p>`)
      .join("");
  }

  /* Galeria por produto */
  function buildGallery(prod) {
    const g = el("div", { class: "galeria" });
    prod.imagens.forEach((src, i) => {
      const img = el("img", {
        src,
        alt: `${prod.nome} ${i + 1}`,
        loading: "lazy",
        decoding: "async",
      });
      img.addEventListener("click", () => {
        if (window.lightbox?.open) {
          lightbox.open(prod.imagens, i);
        }
      });
      g.appendChild(img);
    });
    return g;
  }

  /* Caixa de descrição */
  function buildDescBox(prod) {
    const box = el("div", { class: "desc-box" });
    box.appendChild(el("h3", {}, `Informações sobre ${prod.nome}`));
    box.appendChild(el("p", {}, prod.resumo));
    box.insertAdjacentHTML("beforeend", priceListHTML(prod.preco));

    const infoBtn = el("button", { class: "info-btn" }, "+ Informações");
    const infoArea = el(
      "div",
      { style: "display:none;margin-top:1rem" },
      prod.detalhesHTML || ""
    );
    infoBtn.addEventListener("click", () => {
      infoArea.style.display =
        infoArea.style.display === "none" ? "block" : "none";
    });

    const buyBtn = el(
      "button",
      { class: "buy-btn" },
      prod.buyButtonText || `Comprar ${prod.nome}`
    );
    buyBtn.addEventListener("click", () => abrirModal(prod));

    box.appendChild(infoBtn);
    box.appendChild(infoArea);
    box.appendChild(buyBtn);
    return box;
  }

  /* Seção do produto */
  function sectionProduto(prod) {
    const sec = el("section", { class: "produto-section" });
    sec.appendChild(el("h3", {}, prod.nome));
    sec.appendChild(buildGallery(prod));
    sec.appendChild(buildDescBox(prod));
    return sec;
  }

  /* ===== MODAL DE COMPRA ===================================== */
  let modalAtual = null;
  let produtoAtual = null;
  let freteOpcoes = [];

  function criarModal() {
    const modal = el("div", { id: "modal-frete", class: "modal" });
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close" aria-label="Fechar">&times;</button>
        <h3 id="modal-titulo"></h3>
        
        <form id="modal-form"></form>
        
        <!-- Loading -->
        <div id="loading" style="display:none; text-align:center; padding:2rem;">
          <div style="border: 3px solid var(--border); border-top: 3px solid var(--accent); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
          <p>Calculando frete...</p>
        </div>
        
        <!-- Opções de frete -->
        <div id="opcoes-frete" style="display:none;">
          <div class="group">
            <p><strong>Escolha o frete:</strong></p>
            <div id="frete-opcoes"></div>
          </div>
          <div class="final-actions">
            <button type="button" class="final-btn" onclick="enviarWhatsApp()">WhatsApp</button>
            <button type="button" class="final-btn" onclick="enviarTelegram()">Telegram</button>
          </div>
        </div>
      </div>
    `;

    // CSS para animação
    if (!document.getElementById("modal-styles")) {
      const style = document.createElement("style");
      style.id = "modal-styles";
      style.textContent =
        "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Fechar modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("close")) {
        fecharModal();
      }
    });

    return modal;
  }

  function abrirModal(produto) {
    produtoAtual = produto;
    modalAtual = criarModal();

    const titulo = modalAtual.querySelector("#modal-titulo");
    const form = modalAtual.querySelector("#modal-form");

    titulo.textContent = `Opções para ${produto.nome}`;
    form.innerHTML = "";

    // Monta formulário baseado no produto
    (produto.options || []).forEach((opt) => {
      const group = el("div", { class: "group" });

      if (opt.type === "colorPair") {
        group.appendChild(el("p", {}, `<strong>${opt.title}</strong>`));
        opt.inputs.forEach((inp) => {
          group.appendChild(el("p", {}, inp.label + ":"));
          const grid = el("div", { class: "option-grid" });
          if (window.buildColorSelector) buildColorSelector(grid, inp.name);
          group.appendChild(grid);
        });
      }

      if (opt.type === "colorSingle") {
        group.appendChild(el("p", {}, `<strong>${opt.title}</strong>`));
        const grid = el("div", { class: "option-grid" });
        if (window.buildColorSelector) buildColorSelector(grid, opt.input.name);
        group.appendChild(grid);
      }

      if (opt.type === "seedPack") {
        group.innerHTML = `
          <p><strong>Selecione:</strong></p>
          <label><input type="radio" name="seedPack" value="kit" checked> Kit 5 un — 5 000 sats</label><br>
          <label><input type="radio" name="seedPack" value="single"> Placa avulsa — 2 000 sats</label>
          <div id="qty-box" style="display:none; margin-top:8px;">
            <p>Quantidade:</p>
            <input type="number" name="seedQty" min="1" max="10" value="1">
          </div>
        `;

        group.addEventListener("change", (e) => {
          const qtyBox = group.querySelector("#qty-box");
          qtyBox.style.display = e.target.value === "single" ? "block" : "none";
        });
      }

      form.appendChild(group);
    });

    // Add-on SandSeed
    if (produto.allowAddOnSeed && produto.id !== "sandseed") {
      const addon = el("div", { class: "group" });
      addon.innerHTML =
        '<label><input type="checkbox" name="addSeedKit"> Adicionar <strong>Kit SandSeed (5 placas)</strong></label>';
      form.appendChild(addon);
    }

    // CEP
    const cepGroup = el("div", { class: "group" });
    cepGroup.innerHTML = `
      <p>CEP:</p>
      <input type="text" name="cep" placeholder="00000-000" required>
    `;

    // Máscara CEP
    const cepInput = cepGroup.querySelector('input[name="cep"]');
    cepInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 5)
        value = value.substring(0, 5) + "-" + value.substring(5, 8);
      e.target.value = value;
    });

    form.appendChild(cepGroup);

    // Cupom
    const cupomGroup = el("div", { class: "group" });
    cupomGroup.innerHTML =
      '<p style="font-style:italic;color:#ccc">Cupom (opcional):</p><input type="text" name="cupom" placeholder="Cupom">';
    form.appendChild(cupomGroup);

    // Botão calcular
    const calcBtn = el(
      "button",
      { type: "button", class: "final-btn", style: "width:100%" },
      "Calcular Frete"
    );
    calcBtn.addEventListener("click", calcularFrete);
    form.appendChild(calcBtn);

    // Preenche cupom salvo
    try {
      const cupomSalvo = localStorage.getItem("cupom");
      if (cupomSalvo) {
        cupomGroup.querySelector("input").value = cupomSalvo;
      }
    } catch (e) {
      console.log("localStorage não disponível");
    }

    modalAtual.style.display = "block";
    document.body.classList.add("modal-open");
  }

  function fecharModal() {
    if (modalAtual) {
      modalAtual.style.display = "none";
      document.body.classList.remove("modal-open");
      modalAtual.remove();
      modalAtual = null;
      produtoAtual = null;
      freteOpcoes = [];
    }
  }

  async function calcularFrete() {
    const form = modalAtual.querySelector("#modal-form");
    const loading = modalAtual.querySelector("#loading");
    const opcoesDiv = modalAtual.querySelector("#opcoes-frete");

    const dadosForm = new FormData(form);
    const cep = dadosForm.get("cep");

    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      alert("Por favor, insira um CEP válido");
      return;
    }

    try {
      loading.style.display = "block";
      form.style.display = "none";

      // Valida CEP primeiro
      const validacao = await window.FreteAPI.validarCep(cep);
      if (!validacao.valido) {
        alert(validacao.erro);
        return;
      }

      // Coleta opções selecionadas
      const opcoesSelecionadas = {};
      for (let [key, value] of dadosForm.entries()) {
        opcoesSelecionadas[key] = value;
      }
      opcoesSelecionadas.addSeedKit = dadosForm.get("addSeedKit") === "on";

      // Monta dados do produto para a API
      let dadosProduto = { ...produtoAtual.dadosFrete };

      // Ajusta para SandSeed se necessário
      if (
        produtoAtual.id === "sandseed" &&
        opcoesSelecionadas.seedPack === "single"
      ) {
        const quantidade = parseInt(opcoesSelecionadas.seedQty) || 1;
        dadosProduto.weight = produtoAtual.dadosFrete.weight * quantidade;
      }

      // Ajusta se tem addon SandSeed
      if (opcoesSelecionadas.addSeedKit && produtoAtual.id !== "sandseed") {
        const sandSeedProduto = window.PRODUTOS.find(
          (p) => p.id === "sandseed"
        );
        if (sandSeedProduto) {
          dadosProduto.weight += sandSeedProduto.dadosFrete.weight * 5;
        }
      }

      const resultado = await window.FreteAPI.calcularFrete(cep, dadosProduto);

      if (!resultado.sucesso) {
        throw new Error(resultado.erro || "Erro no cálculo de frete");
      }

      freteOpcoes = resultado.opcoes;
      mostrarOpcoesFretes(resultado.opcoes);
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro: ${error.message}`);
      loading.style.display = "none";
      form.style.display = "block";
    }
  }

  function mostrarOpcoesFretes(opcoes) {
    const loading = modalAtual.querySelector("#loading");
    const opcoesDiv = modalAtual.querySelector("#opcoes-frete");
    const container = modalAtual.querySelector("#frete-opcoes");

    loading.style.display = "none";
    container.innerHTML = "";

    opcoes.forEach((opcao, index) => {
      const label = el("label", {
        style:
          "display:block; margin:8px 0; padding:8px; border:1px solid var(--border); border-radius:8px; cursor:pointer;",
      });
      label.innerHTML = `
        <input type="radio" name="freteEscolhido" value="${index}" ${
        index === 0 ? "checked" : ""
      }>
        <strong>${opcao.servico}</strong> - R$ ${opcao.valor.toFixed(2)} 
        <small style="color:var(--muted);">(${opcao.prazo} dias úteis)</small>
      `;
      container.appendChild(label);
    });

    opcoesDiv.style.display = "block";
  }

  function obterDadosFinais() {
    const form = modalAtual.querySelector("#modal-form");
    const dadosForm = new FormData(form);

    const opcoesSelecionadas = {};
    for (let [key, value] of dadosForm.entries()) {
      opcoesSelecionadas[key] = value;
    }
    opcoesSelecionadas.addSeedKit = dadosForm.get("addSeedKit") === "on";

    const freteIndex = parseInt(
      document.querySelector('input[name="freteEscolhido"]:checked')?.value ||
        "0"
    );
    const opcaoFrete = freteOpcoes[freteIndex];

    return {
      produto: produtoAtual,
      opcoes: opcoesSelecionadas,
      frete: opcaoFrete,
      cep: dadosForm.get("cep"),
      cupom: dadosForm.get("cupom"),
    };
  }

  window.enviarWhatsApp = async function () {
    const dados = obterDadosFinais();
    try {
      if (dados.cupom) localStorage.setItem("cupom", dados.cupom);
    } catch (e) {
      console.log("localStorage não disponível");
    }

    // injeta a opção de frete escolhida no form (hidden)
    const form = modalAtual.querySelector("#modal-form");
    let hidden = form.querySelector('input[name="opcao_frete"]');
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "opcao_frete";
      form.appendChild(hidden);
    }
    hidden.value = JSON.stringify(dados.frete || {});

    await window.finalizeCompra(form, dados.produto.id, "whats");
    fecharModal();
  };

  window.enviarTelegram = async function () {
    const dados = obterDadosFinais();
    try {
      if (dados.cupom) localStorage.setItem("cupom", dados.cupom);
    } catch (e) {
      console.log("localStorage não disponível");
    }

    // injeta a opção de frete escolhida no form (hidden)
    const form = modalAtual.querySelector("#modal-form");
    let hidden = form.querySelector('input[name="opcao_frete"]');
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "opcao_frete";
      form.appendChild(hidden);
    }
    hidden.value = JSON.stringify(dados.frete || {});

    await window.finalizeCompra(form, dados.produto.id, "tele");
    fecharModal();
  };

  // Expor função calcularFrete para debug
  window.calcularFrete = calcularFrete;

  /* ===== RENDERIZAÇÃO ===================================== */
  window.addEventListener("DOMContentLoaded", () => {
    if (window.lightbox?.mount) lightbox.mount();

    const container = document.getElementById("produtos-container");
    if (container) {
      container.innerHTML = "";
      (window.PRODUTOS || []).forEach((prod) => {
        container.appendChild(sectionProduto(prod));
      });
    }
  });
})();
