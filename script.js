const API = 'https://brt-webcam-server.onrender.com';

const paradaNomes = {
    'poeta': 'Engenho Poeta',
    'getulio': 'Getúlio Vargas',
    'cordeiro': 'Cordeiro',
    'madalena': 'Madalena',
    'derby': 'Derby',
    'boa-vista': 'Boa Vista',
    'diario': 'Praça do Diário'
};

const nomesLinhas = {
    '262940': 'Terminal Integrado',
    '437': 'TI Caxangá',
    '2441': 'TI CDU',
    '2450': 'TI Camaragibe',
    '2444': 'TI Getúlio Vargas'
};

const ordemParadas = ['poeta','getulio','cordeiro','madalena','derby','boa-vista','diario'];

const temposEntreParadas = {
    'poeta-getulio':2,
    'getulio-cordeiro':1,
    'cordeiro-madalena':1,
    'madalena-derby':2,
    'derby-boa-vista':2,
    'boa-vista-diario':1
};

const params = new URLSearchParams(window.location.search);
const paradaAtual = params.get('parada') || 'poeta';

document.getElementById('paradaNome').textContent =
    paradaNomes[paradaAtual] || 'BRT Recife';

function atualizarRelogio() {
    const d = new Date();
    document.getElementById('relogio').textContent =
        String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function calcularTempoParaParada(paradaOrigem, paradaDestino) {
    if (paradaOrigem === paradaDestino) return 0;

    const idxOrigem = ordemParadas.indexOf(paradaOrigem);
    const idxDestino = ordemParadas.indexOf(paradaDestino);
    if (idxOrigem >= idxDestino) return -1;

    let tempoTotal = 0;
    for (let i = idxOrigem; i < idxDestino; i++) {
        tempoTotal += temposEntreParadas[ordemParadas[i] + '-' + ordemParadas[i + 1]] || 2;
    }
    return tempoTotal;
}

async function buscarOnibus() {
    const statusDot = document.getElementById('statusDot');
    const statusTexto = document.getElementById('statusTexto');

    try {
        const resp = await fetch(API + '/ultimos', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!resp.ok) throw new Error('Servidor retornou ' + resp.status);

        const dados = await resp.json();

        statusDot.classList.remove('offline');
        statusTexto.textContent = 'Sistema Ativo';

        mostrarOnibus(dados);

        document.getElementById('rodape').textContent =
            'Última atualização: ' + new Date().toLocaleTimeString('pt-BR');

    } catch (erro) {
        statusDot.classList.add('offline');
        statusTexto.textContent = 'Servidor Offline';
        mostrarErro(erro.message);
    }
}

function mostrarOnibus(dados) {
    const lista = document.getElementById('listaOnibus');

    if (!dados || dados.length === 0) {
        lista.innerHTML = `
        <div class="sem-onibus">
            <div class="texto-vazio">Nenhum ônibus detectado</div>
        </div>`;
        return;
    }

    lista.innerHTML = '';

    const agora = new Date();

    dados.forEach(item => {
        const linha = item.linha_detectada || 'Desconhecida';
        const nomeLinha = nomesLinhas[linha] || `Linha ${linha}`;

        const timestamp = new Date(item.timestamp);
        const minutosDecorridos = Math.floor((agora - timestamp) / 60000);

        // Já passou tempo demais? → NÃO mostra
        if (minutosDecorridos > 8) return;

        const paradaDeteccao = item.parada_origem || 'poeta';

        const tempoBase = item.previsao?.chega_em_min || 0;

        let tempoAjustado = Math.max(
            0,
            tempoBase +
            calcularTempoParaParada(paradaDeteccao, paradaAtual) -
            minutosDecorridos
        );

        // Se zerou → some da tela
        if (tempoAjustado <= 0) return;

        const div = document.createElement('div');
        div.className = 'card-onibus';
        if (tempoAjustado <= 2) div.classList.add('urgente');

        div.innerHTML = `
        <div class="lado-esquerdo">
            <div class="numero-linha">${linha}</div>
            <div class="nome-destino">${nomeLinha}</div>
        </div>
        <div class="lado-direito">
            <div class="numero-tempo">${tempoAjustado}</div>
            <div class="texto-minutos">${tempoAjustado === 1 ? 'MINUTO' : 'MINUTOS'}</div>
        </div>`;

        lista.appendChild(div);
    });
}

function mostrarErro(msg) {
    document.getElementById('listaOnibus').innerHTML = `
    <div class="sem-onibus">
        <div class="texto-vazio">Erro de Conexão</div>
        <div class="subtexto-vazio">${msg}<br>Aguarde e recarregue a página</div>
    </div>`;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

buscarOnibus();
setInterval(buscarOnibus, 15000);
