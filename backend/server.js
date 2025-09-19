import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    // [
    // "http://localhost:5500",
    // "https://store.bitcoinfacil.net/",
    //]
    methods: ["GET", "POST"],
    //  credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SUPERFRETE_API = process.env.SUPERFRETE_API;
const SUPERFRETE_TOKEN = process.env.SUPERFRETE_TOKEN;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Rota para calcular frete
app.post("/api/frete", async (req, res) => {
  try {
    // console.log("Recebendo requisição de frete:", req.body);

    const response = await fetch(SUPERFRETE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPERFRETE_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    //console.log("Resposta da API SuperFrete:", data);

    if (!response.ok) {
      console.error("Erro da API SuperFrete:", data);
      return res.status(response.status).json({
        sucesso: false,
        erro: data.message || `Erro da API: ${response.status}`,
        opcoes: [],
      });
    }

    // Processar resposta da SuperFrete
    const opcoes = processarResposta(data);
    res.json(opcoes);
  } catch (err) {
    console.error("Erro no servidor:", err);
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno no servidor",
      opcoes: [],
    });
  }
});

// Função para processar resposta da SuperFrete
function processarResposta(data) {
  if (!data || !Array.isArray(data)) {
    return {
      sucesso: false,
      erro: "Resposta inválida da API",
      opcoes: [],
    };
  }

  const opcoes = data
    .filter((item) => !item.error)
    .map((item) => ({
      id: item.id,
      nome: item.name,
      valor: parseFloat(item.price),
      prazo: parseInt(item.delivery_time),
      servico: item.id === 1 ? "PAC" : item.id === 2 ? "SEDEX" : item.name,
    }))
    .sort((a, b) => a.valor - b.valor);

  return {
    sucesso: opcoes.length > 0,
    erro:
      opcoes.length === 0 ? "Nenhum serviço disponível para este CEP" : null,
    opcoes: opcoes,
  };
}

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(`API SuperFrete: ${SUPERFRETE_API}`);
  console.log(`Token configurado: ${SUPERFRETE_TOKEN ? "Sim" : "Não"}`);
});
