// /js/produtos-data.js  (SUBSTITUIR TODO O ARQUIVO)
// Mantém TODAS as infos do antigo e adiciona suporte a `badge` (selo opcional)

window.PRODUTOS = [
  {
    id: "jade",
    nome: "Jade DIY",
    imagens: [
      "images/jade1.png",
      "images/jade2.png",
      "images/jade3.png",
      "images/jade4.png",
      "images/jade5.png",
      "images/jade6.png",
      "images/jade7.png",
      "images/jade8.png",
      "images/jade9.png",
    ],
    resumo: "Carteira de hardware open-source, segura e flexível.",
    preco: [
      { label: "Jade DIY", valor: "R$ 230" },
      { label: "Box de Proteção", valor: "R$ 70" },
    ],
    // Dados formatados para Super Frete
    dadosFrete: {
      quantity: 1,
      weight: 0.2, // kg
      height: 3, // cm
      width: 8, // cm
      length: 12, // cm
    },
    detalhesHTML: `
    
        <h4 class="card-title">Documentação do Dispositivo JADE DIY</h4>
        <ul class="info-list">
          <p><strong>Introdução:</strong> dispositivo seguro e transparente.</p>
          <li>
           Por que hardware open source?
            <a
              class="link"
              href="https://plebs.substack.com/p/hard-wallets-seguras"
              target="_blank"
              >Artigo</a
            >
          </li>
          <li>
            <strong>Conectividade:</strong> GreenWallet • SideSwap • Sparrow •
            Electrum
          </li>
          <li>
            <strong>Atualizações:</strong> via navegador / binários Sandmann /
            compilação GitHub
          </li>
          <li><strong>Bateria:</strong> interna (indicação limitada)</li>
          <li><strong>Segurança:</strong> Secure-element virtual Oracle</li>
          <li>
            Tutorial:
            <a
              class="link"
              href="https://www.youtube.com/watch?v=k-maFZiKSw4"
              target="_blank"
              >YouTube</a
            >
          </li>
          <li>
            <a
              class="link"
              href="https://docs.google.com/document/d/1Bf8O-R478woq8z7Z8DnN9XlfGf9B3GT8rn0qgJiAUHM/edit?usp=sharing"
              target="_blank"
              >Documentação completa</a
            >
          </li>
        </ul>
 
      `,
    options: [
      {
        type: "colorPair",
        title: "Jade DIY",
        inputs: [
          { name: "jadeColor", label: "Case" },
          { name: "buttonColor", label: "Botões" },
        ],
      },
      {
        type: "colorPair",
        title: "Box de Proteção",
        inputs: [
          { name: "boxColor", label: "Box" },
          { name: "handleColor", label: "Alças" },
        ],
      },
    ],
    allowAddOnSeed: true,
    buyButtonText: "Comprar Jade DIY",
    badge: { text: "Promo", variant: "promo" },
  },

  {
    id: "pico",
    nome: "PicoFido / PicoKey (RP2350 • FIDO2)",
    imagens: ["images/pico1.png", "images/pico2.png", "images/pico3.png"],
    resumo: "Chave de segurança FIDO-U2F / FIDO2 baseada no RP2350 (USB-C).",
    preco: [{ label: "PicoFido / PicoKey", valor: "R$ 159" }],
    dadosFrete: {
      quantity: 1,
      weight: 0.1,
      height: 2,
      width: 6,
      length: 8,
    },
    detalhesHTML: `
      <h4>Detalhes Técnicos</h4>
        <ul class="info-list">
          <li> Projeto 100% open-source — código, esquemas e guias em
              <a class="link" href="https://github.com/polhenarejos/pico-fido" target="_blank">github.com/polhenarejos/pico-fido</a>.</li>
          <li> Compatível: Google, Proton Mail, Microsoft Outlook, GitHub, X/Twitter…</li>
          <li> FIDO2 dispensa SMS/app 2FA; chaves ficam no dispositivo.</li>
          <li> USB-C fêmea; alimentação do host (cabo não incluído).</li>
          <li> Conectividade: Android • Linux • Windows (iOS/macOS não testados).</li>
          <li> <a class="link" href="https://docs.google.com/document/d/1JIE_6lNlFsk-TwPceDngePEg8G9fe3FKINjHCGeSUgg/edit?usp=sharing" target="_blank">Documentação completa</a>.</li>
        </ul>
     `,
    options: [
      {
        type: "colorPair",
        title: "Cores",
        inputs: [
          { name: "picoBodyColor", label: "Corpo" },
          { name: "picoRingColor", label: "Anel" },
        ],
      },
    ],
    allowAddOnSeed: true,
    buyButtonText: "Comprar PicoFido",
    badge: { text: "Novo", variant: "new" },
  },

  {
    id: "nerd",
    nome: "NerdMiner — CASE (sem bateria)",
    imagens: ["images/nm1.png", "images/nm2.png", "images/nm3.png"],
    resumo:
      "CASE para NerdMiner (TTGO T-Display). *Não inclui bateria nem placa.",
    preco: [{ label: "Case TTGO T-Display", valor: "R$ 70" }],
    dadosFrete: {
      quantity: 1,
      weight: 0.15,
      height: 4,
      width: 7,
      length: 10,
    },
    detalhesHTML: `
      <ul class="info-list">
          <li>
            ~55 KH/s (info do projeto) • Stratum / pools self-custody.<br />
          </li>

          <li>
            Firmware:
            <a
              class="link"
              href="https://github.com/BitMaker-hub/NerdMiner_v2"
              target="_blank"
              >GitHub</a
            >.<br />
          </li>
          <li>
            USB-C 5 V • Tutorial:
            <a
              class="link"
              href="https://www.youtube.com/watch?v=Cq0y1034oq8"
              target="_blank"
              >YouTube</a
            >.
          </li>
          <li>
            <strong>TTGO T-Display:</strong>
            <a
              class="link"
              href="https://pt.aliexpress.com/item/1005005970553639.html?channel=twinner"
              target="_blank"
              >Comprar no AliExpress</a
            >
          </li>
          <li><em>APENAS CASE — sem bateria.</em></li>
        </ul>
    `,
    options: [
      {
        type: "colorPair",
        title: "Cores do Case",
        inputs: [
          { name: "nerdCaseColor", label: "Case" },
          { name: "nerdButtonColor", label: "Botões" },
        ],
      },
    ],
    allowAddOnSeed: true,
    buyButtonText: "Comprar NerdMiner",
    badge: { text: "Case", variant: "neutral" },
  },

  {
    id: "sandseed",
    nome: "SandSeed — placas para backup de seed",
    imagens: ["images/sandseed1.png", "images/sandseed2.png"],
    resumo:
      "Kit Stakbit 1248 — 5 placas (3 lisas + 2 perfuradas) padrão BIP-39.",
    preco: [
      { label: "Placa avulsa", valor: "2 000 sats" },
      { label: "Kit 5 un", valor: "5 000 sats" },
    ],
    dadosFrete: {
      quantity: 1,
      weight: 0.05, // peso base (será multiplicado pela quantidade)
      height: 1,
      width: 5,
      length: 8,
    },
    detalhesHTML: `
     <ul class="info-list">
       <li><strong>Como usar:</strong> sobre base firme, perfure cada letra (estilete, agulha grossa ou punção).</li>
       <li><strong>Utilidade:</strong> gravação física, offline e resistente ao fogo/água das 24 palavras da seed BIP-39.</li>
       <li>Tutorial:
           <a class="link" href="https://stackbit.me/tutorial-stackbit-1248/" target="_blank">Vídeo oficial (Stackbit)</a></li>
        <li>
            <em>Design original por <a class="link" href="https://twitter.com/valandro" target="_blank">@Valandro</a>.</em>
        </li>
     </ul>
      `,
    options: [{ type: "seedPack" }],
    allowAddOnSeed: false,
    buyButtonText: "Comprar SandSeed",
    badge: { text: "Sats", variant: "neutral" },
  },

  {
    id: "krux",
    nome: "Krux Yahboom Modcase (c/ bateria)",
    imagens: [
      "images/krux1.png",
      "images/krux2.png",
      "images/krux3.png",
      "images/krux4.png",
    ],
    resumo: "Modcase com bateria; placa eletrônica não inclusa.",
    preco: [
      { label: "Modcase", valor: "R$ 250" },
      { label: "Box de Proteção", valor: "R$ 89" },
    ],
    dadosFrete: {
      quantity: 1,
      weight: 0.3,
      height: 5,
      width: 9,
      length: 15,
    },
    detalhesHTML: `
   <h4 class="card-title">Detalhes Técnicos</h4>
        <ul class="info-list">
          <li>Inclui bateria e box de proteção (placa não inclusa).</li>
          <li>
            Tutorial:
            <a
              class="link"
              href="https://www.youtube.com/watch?v=V48RpmuZEwI"
              target="_blank"
              >YouTube</a
            >
          </li>
          <li>
            Placa referência Yahboom:
            <a
              class="link"
              href="https://de.aliexpress.com/item/1005005585064305.html"
              target="_blank"
              >AliExpress</a
            >
          </li>
          <li>
            Documentação:
            <a
              class="link"
              href="https://docs.google.com/document/d/1s70HUmdX3XX08GbINxEAay5eK_D3c4RLReKuautZYB4/edit?usp=sharing"
              target="_blank"
              >Google Docs</a
            >
          </li>

          <li>Encomenda completa: ~25 dias • R$ 775 + R$ 89 (box)</li>
        </ul>
    `,
    options: [
      {
        type: "colorSingle",
        title: "Modcase (opcional)",
        input: { name: "kruxColor", label: "Modcase" },
      },
      {
        type: "colorPair",
        title: "Box de Proteção (opcional)",
        inputs: [
          { name: "kruxBoxColor", label: "Box" },
          { name: "kruxHandleColor", label: "Alças" },
        ],
      },
    ],
    allowAddOnSeed: true,
    buyButtonText: "Comprar Modcase",
    badge: null,
  },

  {
    id: "kruxcase",
    nome: "Krux Yahboom Case (impressão 3D)",
    imagens: [
      "images/kruxcase1.png",
      "images/kruxcase2.png",
      "images/kruxcase3.png",
    ],
    resumo: "Somente impressão 3D do case. Compatível com placas Krux Yahboom.",
    preco: [{ label: "Case", valor: "R$ 90" }],
    dadosFrete: {
      quantity: 1,
      weight: 0.15,
      height: 4,
      width: 8,
      length: 12,
    },
    detalhesHTML: `<ul class="info-list">
      <li>
        
        Impressão 3D em PLA/ASA sob encomenda.
      </li><li>
        
         Não inclui eletrônica.
      </li>
    </ul>
    `,
    options: [
      {
        type: "colorSingle",
        title: "Case",
        input: { name: "kruxCaseColor", label: "Case" },
      },
      {
        type: "colorPair",
        title: "Box de Proteção (opcional)",
        inputs: [
          { name: "kruxCaseBoxColor", label: "Box" },
          { name: "kruxCaseHandleColor", label: "Alças" },
        ],
      },
    ],
    allowAddOnSeed: true,
    buyButtonText: "Comprar Case",
    badge: { text: "3D", variant: "neutral" },
  },

  {
    id: "gradebinaria",
    nome: "Grade Binária Inox",
    imagens: [
      "images/brci1.png",
      "images/brci2.png",
      "images/brci3.png",
      "images/brci4.png",
    ],
    resumo: "Par de placas inox 316L + caneta. Backup físico resistente.",
    preco: [{ label: "Grade Binária Inox", valor: "R$ 80" }],
    dadosFrete: {
      quantity: 1,
      weight: 0.4,
      height: 2,
      width: 10,
      length: 15,
    },
    detalhesHTML: `
      <h4 class= "card-title">Backup físico resistente para seed phrase</h4>
     <ul class="info-list">
       <li>Par de placas em aço inoxidável 316L, acompanha caneta especial.</li>
       <li>Formato BIP-39 para armazenamento seguro de palavras-semente.</li>
       <li>Resistente à corrosão, altas temperaturas, fogo, água e impactos.</li>
       <li>Ideal para usuários de Bitcoin que buscam máxima proteção física para suas seeds.</li>
     </ul>
    `,
    allowAddOnSeed: false,
    buyButtonText: "Comprar Grade Binária Inox",
    badge: { text: "Inox", variant: "neutral" },
  },
];
