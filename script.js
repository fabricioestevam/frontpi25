async function atualizar() {
    try {
        const resposta = await fetch("/api/estado");
        const dados = await resposta.json();

        document.getElementById("linha").textContent = dados.linha || "—";
        document.getElementById("parada").textContent = dados.parada_origem || "—";
        document.getElementById("minutos").textContent = dados.previsao.chega_em_min || "—";
        document.getElementById("horario").textContent = dados.previsao.previsao_horario || "—";
        document.getElementById("status").textContent = dados.status || "—";

    } catch (erro) {
        console.error("Erro:", erro);
        document.getElementById("status").textContent = "Erro ao carregar dados";
    }
}

// Atualiza automaticamente a cada 5 segundos
setInterval(atualizar, 5000);
atualizar();
