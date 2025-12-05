Aqui está **um README simples, direto, e perfeito para o seu front atual**, **sem alterar nada do HTML/CSS**, apenas documentando como ele funciona e como ele se conecta com o backend.

Se quiser, depois faço a versão “bonita” com badges, imagens, diagrama, etc.

---

# **README – Sistema de Monitoramento BRT (Front-End)**

## 📌 **Descrição do Projeto**

Este repositório contém o **front-end** do sistema de monitoramento do BRT Recife.
Ele exibe:

* 🚌 **Próximos ônibus detectados por câmera (YOLO + OCR)**
* 📍 **Nome da parada atual**
* ⏱ **Previsão de chegada estimada por distância real das paradas**
* 🔄 Atualização automática a cada poucos segundos

O front é totalmente estático, utilizando apenas **HTML + CSS + JavaScript**.
Os dados são consumidos diretamente da **API Node.js no Render**.

---

## 🚀 **Como Funciona**

### 1. **Atualização automática**

O front realiza chamadas periódicas a:

```
GET /api/next-bus
```

A API retorna:

```json
{
  "parada": "BRT - Cordeiro",
  "onibus": "2430",
  "previsao_minutos": 3,
  "timestamp": "2025-12-05T02:15:22Z"
}
```

O front então:

* Mostra o número do ônibus detectado
* Mostra a parada atual da webcam
* Mostra o tempo estimado de chegada calculado pelo backend

Toda a **lógica pesada permanece no backend**, garantindo que o front seja simples e rápido.

---

## 🔌 **Integração com a API**

O arquivo `script.js` possui:

```js
async function atualizarPainel() {
    const res = await fetch("https://seu-servidor-render/api/next-bus");
    const dados = await res.json();
    atualizarTela(dados);
}
```

A API responde sempre com informações atualizadas.

---

## 🎨 **Design**

O front usa:

* **layout responsivo**
* **dashboard minimalista**
* **tema azul inspirado no sistema BRT Recife**
* sem frameworks; apenas HTML + CSS puro

Nenhum arquivo externo ou biblioteca é necessária.

---

## 📁 **Estrutura dos Arquivos**

```
/ (raiz)
│── index.html        → Interface principal
│── style.css         → Estilos do painel
│── script.js         → Lógica para consumir API e atualizar tela
└── /img              → Ícones e imagens usadas no painel
```

---

## 🌐 **Deploy**

O front é hospedado no **Netlify**.

Exemplo de deploy:

```
https://nome-do-projeto.netlify.app
```

---

## 🛠 Requisitos

✔ Navegador moderno
✔ API online no Render
❌ Não precisa instalar nada localmente

---

## 📡 Backend Necessário

O backend deve expor:

### **Rotas:**

| Rota               | Método | Descrição                          |
| ------------------ | ------ | ---------------------------------- |
| `/api/next-bus`    | GET    | Retorna o próximo ônibus detectado |
| `/api/parada-info` | GET    | Nome da parada + última leitura    |
| `/api/health`      | GET    | Status do sistema                  |

### **O backend é responsável por:**

* processar imagens da webcam
* rodar YOLO
* rodar OCR
* calcular previsão de chegada pelas distâncias que você passou
* enviar tudo pronto para o front

---

## 👨‍💻 Desenvolvimento

### Rodar localmente

Abra o arquivo `index.html` no navegador.

Isso já funciona porque o front é estático.

Para testar junto com o backend:

```
npm start
```

e acesse a página hospedada no Netlify que chama a API do Render.

---

## ✔️ Status do Projeto

**Versão final para apresentação PI 2025.2**
