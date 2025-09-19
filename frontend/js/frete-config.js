window.FreteAPI = {
  async validarCep(cep) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      return { valido: false, erro: "CEP deve ter 8 dígitos" };
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await response.json();
      if (data.erro) {
        return { valido: false, erro: "CEP não encontrado" };
      }
      return {
        valido: true,
        endereco: `${data.localidade} - ${data.uf}`,
        dados: data,
      };
    } catch (error) {
      console.error("Erro ao validar CEP:", error);
      return { valido: false, erro: "Erro ao validar CEP" };
    }
  },

  async calcularFrete(cepDestino, dadosProduto) {
    try {
      const body = {
        from: { postal_code: "31575430" }, //alterar cep
        to: { postal_code: cepDestino.replace(/\D/g, "") },
        services: "1,2",
        options: {
          own_hand: false,
          receipt: false,
          insurance_value: 0,
          use_insurance_value: false,
        },
        products: [dadosProduto],
      };
      const backendUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://store.bitcoinfacil.net";
      const response = await fetch(`${backendUrl}/api/frete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  },
};

window.formatarCep = function (cep) {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
};
