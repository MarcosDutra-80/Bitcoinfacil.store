// /js/compras.js  (SUBSTITUIR TODO O ARQUIVO)
(function () {
  const WHATS = "5531995535520";
  const TELEGRAM = "Cleitondickson";
  const TAXA_FIAT = 0.21; // 21%
  let cotacaoCache = null,
    cotacaoTime = 0;

  // --- CoinGecko (cache curto) ---
  async function getCotacaoBTC() {
    // cache 5 minutos
    if (cotacaoCache && Date.now() - cotacaoTime < 5 * 60 * 1000)
      return cotacaoCache;
    try {
      const r = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl"
      );
      const data = await r.json();
      cotacaoCache = Number(data?.bitcoin?.brl) || 0;
      cotacaoTime = Date.now();
      return cotacaoCache;
    } catch (e) {
      // se falhar, devolve cache (mesmo que nulo)
      return cotacaoCache || 0;
    }
  }

  async function reaisParaSats(reais) {
    const cot = await getCotacaoBTC();
    if (!cot || isNaN(cot) || cot === 0) return 0;
    return Math.round((Number(reais) / cot) * 1e8);
  }
  async function satsParaReais(sats) {
    const cot = await getCotacaoBTC();
    if (!cot || isNaN(cot) || cot === 0) return 0;
    return (Number(sats) / 1e8) * cot;
  }

  // parse de strings de preço vindas de produtos-data.js
  function parsePriceString(str) {
    if (!str && str !== 0) return { amount: 0, currency: "brl" };
    const s = String(str).trim().toLowerCase();
    if (s.includes("sats")) {
      const n = parseInt(s.replace(/[^\d]/g, ""), 10) || 0;
      return { amount: n, currency: "sats" };
    } else {
      // tenta extrair número (R$ 230, "230", "230.00", "230,00")
      const cleaned = s.replace(/[^\d,.-]/g, "").replace(",", ".");
      const n = parseFloat(cleaned) || 0;
      return { amount: n, currency: "brl" };
    }
  }

  // utilitários
  function formDataToObject(form) {
    const data = {};
    const fd = new FormData(form);
    for (const [k, v] of fd.entries()) {
      if (data[k] !== undefined) {
        if (!Array.isArray(data[k])) data[k] = [data[k]];
        data[k].push(v);
      } else {
        data[k] = v;
      }
    }
    form.querySelectorAll('input[type="checkbox"]').forEach((ch) => {
      if (!(ch.name in data)) data[ch.name] = false;
      else if (data[ch.name] === "on") data[ch.name] = true;
    });
    return data;
  }

  function sanitize(val) {
    return (val || "").toString().trim();
  }

  function pickField(obj, hint) {
    for (const k in obj) if (k.toLowerCase().includes(hint)) return obj[k];
    return "";
  }

  function formatBRL(n) {
    return Number(n).toFixed(2);
  }
  function formatSats(n) {
    return Number(n).toLocaleString();
  }
  function safeTrim(v) {
    return v == null ? "" : String(v).trim();
  }
  function formatCepRaw(cep) {
    const c = (cep || "").toString().replace(/\D/g, "");
    if (c.length !== 8) return cep || "";
    return c.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  function findPrecoValor(prod, hint) {
    if (!prod || !Array.isArray(prod.preco) || !prod.preco.length) return null;
    hint = (hint || "").toLowerCase();
    const found = prod.preco.find((p) => p.label.toLowerCase().includes(hint));
    return found ? found.valor : prod.preco[0].valor;
  }

  // monta linhas e itens
  function buildOptionLines(prod, d) {
    const lines = [];
    const items = [];
    let error = "";

    (prod.options || []).forEach((opt) => {
      if (opt.type === "colorPair") {
        const a = opt.inputs?.[0];
        const b = opt.inputs?.[1];
        const va = safeTrim(d[a?.name]);
        const vb = safeTrim(d[b?.name]);
        if ((va && !vb) || (!va && vb)) {
          error = `Selecione ambas as cores para “${opt.title}” ou deixe ambas em branco.`;
          return;
        }
        if (va && vb) {
          const line = `${opt.title}: ${a?.label || "A"} (${va}) + ${
            b?.label || "B"
          } (${vb})`;
          lines.push(line);

          // preço associado: tenta buscar por título (ex: "Jade DIY" / "Box de Proteção")
          const precoStr = findPrecoValor(prod, opt.title) || "";
          const parsed = parsePriceString(precoStr);
          items.push({
            label: `${opt.title}`,
            amount: parsed.amount,
            currency: parsed.currency,
          });
        }
      }

      if (opt.type === "colorSingle") {
        const i = opt.input;
        const v = safeTrim(d[i?.name]);
        if (v) {
          const line = `${opt.title}: ${i?.label || opt.title} (${v})`;
          lines.push(line);

          const precoStr = findPrecoValor(prod, opt.title) || "";
          const parsed = parsePriceString(precoStr);
          items.push({
            label: `${opt.title}`,
            amount: parsed.amount,
            currency: parsed.currency,
          });
        }
      }

      if (opt.type === "seedPack") {
        const pack = safeTrim(d.seedPack) || "kit";
        if (pack === "kit") {
          const line = `SandSeed: Kit 5 unidades (3 lisas + 2 perfuradas)`;
          lines.push(line);
          // preço do sandseed kit (vem do próprio produto sandseed)
          // se este produto for sandseed, usa seu próprio preco; caso contrário, usa o produto sandseed na lista
          const sand = window.PRODUTOS?.find((p) => p.id === "sandseed");
          const precoStr =
            (prod.id === "sandseed"
              ? findPrecoValor(prod, "kit")
              : sand
              ? findPrecoValor(sand, "kit")
              : null) || "5000 sats";
          const parsed = parsePriceString(precoStr);
          items.push({
            label: "SandSeed (kit)",
            amount: parsed.amount,
            currency: parsed.currency,
          });
        } else {
          const q = Math.max(1, parseInt(d.seedQty || "1", 10) || 1);
          const line = `SandSeed: ${q} placa(s) avulsa(s)`;
          lines.push(line);
          const sand = window.PRODUTOS?.find((p) => p.id === "sandseed");
          const precoStr =
            (prod.id === "sandseed"
              ? findPrecoValor(prod, "placa")
              : sand
              ? findPrecoValor(sand, "placa")
              : null) || "2000 sats";
          const parsed = parsePriceString(precoStr);
          // se parsed.currency === 'sats', multiplicar pela quantidade
          if (parsed.currency === "sats") {
            items.push({
              label: "SandSeed (avulsa)",
              amount: parsed.amount * q,
              currency: "sats",
            });
          } else {
            items.push({
              label: "SandSeed (avulsa)",
              amount: parsed.amount * q,
              currency: parsed.currency,
            });
          }
        }
      }
    });

    // Add-on SandSeed (quando existe checkbox)
    const addSeed = !!d.addSeedKit;
    if (addSeed && prod.allowAddOnSeed) {
      const sand = window.PRODUTOS?.find((p) => p.id === "sandseed");
      const precoStr = sand ? findPrecoValor(sand, "kit") : "5000 sats";
      const parsed = parsePriceString(precoStr);
      lines.push("Adicionar: Kit SandSeed (5 placas) (addon)");
      items.push({
        label: "SandSeed (addon)",
        amount: parsed.amount,
        currency: parsed.currency,
      });
    }
    if (!items.length) {
      const precoStr = prod.preco && prod.preco[0] ? prod.preco[0].valor : "0";
      const parsed = parsePriceString(precoStr);
      items.push({
        label: prod.nome,
        amount: parsed.amount,
        currency: parsed.currency,
      });
      lines.push(prod.nome);
    }

    return { lines, items, error };
  }

  // Monta a mensagem
  async function buildMessage(prod, d, frete) {
    const { lines, items, error } = buildOptionLines(prod, d);
    if (error) return { error, msg: "" };

    // totais (somente valores originais dos produtos)
    let subtotalReaisOrig = 0; // soma convertida em reais dos produtos (originais)
    let subtotalSatsOrig = 0; // soma convertida em sats dos produtos (originais)

    for (const it of items) {
      if (it.currency === "brl") {
        subtotalReaisOrig += Number(it.amount);
        subtotalSatsOrig += await reaisParaSats(Number(it.amount));
      } else {
        subtotalSatsOrig += Number(it.amount);
        subtotalReaisOrig += await satsParaReais(Number(it.amount));
      }

      subtotalReaisOrig;
    }

    // frete
    let freteReais = 0,
      freteSats = 0,
      fretePrazo = "-";
    if (frete && typeof frete === "object") {
      freteReais = parseFloat(frete.valor) || 0;
      freteSats = await reaisParaSats(freteReais);
      fretePrazo =
        frete.prazo || frete.tempo || frete.days || frete.prazo || "-";
    }

    // totais finais

    //const produtosComTaxaBRL = subtotalReaisOrig * (1 + TAXA_FIAT); // produto + 21%

    const totalTaxa = subtotalReaisOrig * TAXA_FIAT;
    const totalBRL = (subtotalReaisOrig + totalTaxa + freteReais).toFixed(2);
    const totalSats = subtotalSatsOrig + freteSats;

    // Monta mensagem
    let msg = "";
    msg += "*PEDIDO VIA SITE*\n\n";
    msg += "*PRODUTOS:*\n";

    lines.forEach((l) => {
      msg += `• ${l}\n`;
    });

    msg += `\n*Subtotal Produtos:* R$ ${formatBRL(subtotalReaisOrig)}\n`;

    const servicoFrete =
      frete && frete.servico ? frete.servico : (frete && frete.tipo) || "";
    msg += `*Frete${
      servicoFrete ? "(" + servicoFrete + ")" : ""
    } :* R$ ${formatBRL(freteReais)}\n`;

    let prazoStr = "-";
    if (fretePrazo && fretePrazo !== "-") {
      prazoStr =
        parseInt(fretePrazo) === 1
          ? `${fretePrazo} dia útil`
          : `${fretePrazo} dias úteis`;
    }
    msg += `*Prazo:* ${prazoStr} (Após Envio)\n`;

    // msg += `*TOTAL:* R$ ${formatBRL(totalBRL)} ou ${formatSats(
    //   totalSats
    // )} sats\n\n`;

    msg += `*TOTAL:* ${formatSats(
      totalSats
    )} sats (R$ ${subtotalReaisOrig.toFixed(2)}) ou R$ ${totalBRL} (Fiat) \n\n`;

    const cupom = sanitize(pickField(d, "cupom"));
    msg += cupom ? `*CUPOM:* ${cupom}\n` : "";

    const cepRaw = sanitize(pickField(d, "cep")) || d.cep || "";
    const cepFmt = window.formatarCep
      ? window.formatarCep(cepRaw)
      : formatCepRaw(cepRaw);
    msg += `*CEP:* ${cepFmt}`;

    console.log(cepFmt);

    return { error: "", msg };
  }

  window.finalizeCompra = async function (form, produtoId, plataforma) {
    const prod = (window.PRODUTOS || []).find((p) => p.id === produtoId);
    if (!prod) return alert("Produto não encontrado.");
    const d = formDataToObject(form);

    let frete = null;
    try {
      if (d.opcao_frete) {
        frete =
          typeof d.opcao_frete === "string"
            ? JSON.parse(d.opcao_frete)
            : d.opcao_frete;
      }
    } catch (e) {
      frete = null;
    }

    const { error, msg } = await buildMessage(prod, d, frete);
    if (error) return alert(error);

    const url =
      plataforma === "whats"
        ? `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`
        : `https://t.me/${TELEGRAM}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  };
})();
