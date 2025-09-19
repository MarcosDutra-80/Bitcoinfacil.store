// ---------- produtos.js (otimizado + NerdMiner + SandSeed + add‑on) ----------

/* 1. Galerias e Lightbox
   ------------------------------------------------------------------ */
const galerias = {
  jade: [
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
  krux: [
    "images/krux1.png",
    "images/krux2.png",
    "images/krux3.png",
    "images/krux4.png",
  ],
  nerd: ["images/nm1.png", "images/nm2.png", "images/nm3.png"],
  sandseed: ["images/sandseed1.png", "images/sandseed2.png"],
};

let galeriaAtual = [],
  indiceAtual = 0;
function abrirImagem(tipo, i) {
  galeriaAtual = galerias[tipo] || [];
  indiceAtual = i;
  if (!galeriaAtual.length) return;
  document.getElementById("imagemModal").src = galeriaAtual[i];
  document.getElementById("lightbox").style.display = "flex";
}
const fecharLightbox = () =>
  (document.getElementById("lightbox").style.display = "none");
function imagemAnterior() {
  if (!galeriaAtual.length) return;
  indiceAtual = (indiceAtual - 1 + galeriaAtual.length) % galeriaAtual.length;
  document.getElementById("imagemModal").src = galeriaAtual[indiceAtual];
}
function proximaImagem() {
  if (!galeriaAtual.length) return;
  indiceAtual = (indiceAtual + 1) % galeriaAtual.length;
  document.getElementById("imagemModal").src = galeriaAtual[indiceAtual];
}

/* 2. Seletor de cores genérico
     ------------------------------------------------------------------ */
const COLORS = [
  { id: "amarelo", nome: "Amarelo" },
  { id: "azul", nome: "Azul" },
  { id: "laranja", nome: "Laranja" },
  { id: "preto", nome: "Preto" },
  { id: "translucido", nome: "Translúcido" },
  { id: "vermelho", nome: "Vermelho" },
];
function buildColorSelector(container, inputName) {
  COLORS.forEach((c) => {
    const l = document.createElement("label");
    l.append(
      Object.assign(document.createElement("input"), {
        type: "radio",
        name: inputName,
        value: c.nome,
      }),
      Object.assign(document.createElement("img"), {
        src: `images/cor_${c.id}.png`,
        alt: c.nome,
      })
    );
    container.appendChild(l);
  });
}
document.addEventListener("DOMContentLoaded", () =>
  document
    .querySelectorAll("[data-color-input]")
    .forEach((el) => buildColorSelector(el, el.dataset.colorInput))
);

/* 3. Finalização de compra (centralizada em compras.js)
     ------------------------------------------------------------------ */
// Remova a função finalizeCompra antiga e use apenas wrappers que chamam window.finalizeCompra

function confirmPurchaseWhats() {
  window.finalizeCompra(buyForm, "jade", "whats");
}
function confirmPurchaseTele() {
  window.finalizeCompra(buyForm, "jade", "tele");
}
function confirmPurchaseWhatsKruxModal() {
  window.finalizeCompra(buyFormKrux, "krux", "whats");
}
function confirmPurchaseTeleKruxModal() {
  window.finalizeCompra(buyFormKrux, "krux", "tele");
}
function confirmPurchaseWhatsNerdModal() {
  window.finalizeCompra(buyFormNerd, "nerd", "whats");
}
function confirmPurchaseTeleNerdModal() {
  window.finalizeCompra(buyFormNerd, "nerd", "tele");
}
function confirmPurchaseWhatsSeed() {
  window.finalizeCompra(buyFormSeed, "sandseed", "whats");
}
function confirmPurchaseTeleSeed() {
  window.finalizeCompra(buyFormSeed, "sandseed", "tele");
}

/* 4. Controles de modais -------------------------------------------------- */
const showModal = (id) => (document.getElementById(id).style.display = "block");
const hideModal = (id) => (document.getElementById(id).style.display = "none");

function openBuyModal() {
  showModal("buyModal");
}
function closeBuyModal() {
  hideModal("buyModal");
}
function openBuyModalKrux() {
  showModal("buyModalKrux");
}
function closeBuyModalKrux() {
  hideModal("buyModalKrux");
}
function openBuyModalNerd() {
  showModal("buyModalNerd");
}
function closeBuyModalNerd() {
  hideModal("buyModalNerd");
}
function openBuyModalSeed() {
  showModal("buyModalSeed");
}
function closeBuyModalSeed() {
  hideModal("buyModalSeed");
}
function toggleInfoNerd() {
  typeof toggle === "function" && toggle("infoDetalhadaNerd");
}
function toggleInfoSeed() {
  toggle("infoDetalhadaSeed");
}
