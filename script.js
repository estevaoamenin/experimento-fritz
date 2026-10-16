
const formulario = document.getElementById("form-identificacao");
const campoResposta = document.getElementById("resposta");
const mensagem = document.getElementById("mensagem");
const pergunta = document.getElementById("pergunta");
const botao = formulario.querySelector("button");
const vento = document.getElementById("vento");

const textoPergunta = pergunta.textContent;
const textoPlaceholder = campoResposta.placeholder;
const textoBotao = botao.textContent;

let emAnimacao = true;

// ==================================================
// ✏️ EDITAR AQUI 1: IDENTIDADES RECONHECIDAS
// ==================================================

const identidadesReconhecidas = [
    "Yasmim",
    "Arthur",
    "Lian",
    "Yuri"
];

// ==================================================
// ✏️ EDITAR AQUI 2: RESPOSTAS PARA CADA JOGADOR
// Você pode personalizar as duas frases de cada um.
// ==================================================

const mensagensReconhecimento = {
    "Yasmim": [
        "Finalmente.",
        "Eu estava esperando por você."
    ],

    "Arthur": [
        "Finalmente.",
        "Eu estava esperando por você."
    ],

    "Lian": [
        "Finalmente.",
        "Eu estava esperando por você."
    ],

    "Yuri": [
        "Finalmente.",
        "Eu estava esperando por você."
    ]
};

// ==================================================
// ✏️ EDITAR AQUI 3: PERSONAGENS, GRACINHAS E OUTRAS
// RESPOSTAS ESPECÍFICAS
//
// Escreva a resposta que o Fritz deve dar para cada
// frase que você acha que os jogadores podem digitar.
//
// Exemplo:
// "nome do personagem": "Não ele. VOCÊ.",
// "estou jogando com o fritz": "Você acha isso engraçado?"
// ==================================================


const respostasPersonalizadas = {
    "Khan": "Não ele. VOCÊ.",
    "Phill": "Não é a mesma coisa sem ele né?",
    "Fernando": "Um homem que morreu com honra.",
};


// ==================================================
// FUNÇÕES DE APOIO
// ==================================================

function esperar(milissegundos) {
    return new Promise(resolve => {
        setTimeout(resolve, milissegundos);
    });
}


async function iniciarVento() {
    vento.volume = 0.35;

    try {
        await vento.play();
    } catch (erro) {
        console.log("Aguardando interação para iniciar o vento.");

        document.addEventListener("click", tocarVento, {
            once: true
        });

        document.addEventListener("keydown", tocarVento, {
            once: true
        });
    }
}

async function tocarVento() {
    try {
        await vento.play();
    } catch (erro) {
        console.error("Não foi possível reproduzir o vento:", erro);
    }
}


// Normaliza maiúsculas, minúsculas, acentos e espaços.
function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

// Escreve qualquer texto, letra por letra.
async function digitarTexto(
    texto,
    atualizarTexto,
    velocidade = 120
) {
    atualizarTexto("");

    for (let i = 0; i < texto.length; i++) {
        atualizarTexto(texto.slice(0, i + 1));
        await esperar(velocidade);
    }
}

// Apaga qualquer texto, começando pela última letra.
async function apagarElemento(elemento, velocidade = 100) {
    const textoOriginal = elemento.textContent;

    for (let i = textoOriginal.length; i >= 0; i--) {
        elemento.textContent = textoOriginal.slice(0, i);
        await esperar(velocidade);
    }
}

// ==================================================
// ABERTURA DO SITE
// ==================================================

async function animarAbertura() {
    formulario.style.visibility = "hidden";

    campoResposta.disabled = true;
    botao.disabled = true;

    pergunta.textContent = "";
    campoResposta.placeholder = "";
    botao.textContent = "";

    await digitarTexto(
        textoPergunta,
        texto => pergunta.textContent = texto,
        180
    );

    await esperar(900);

    formulario.style.visibility = "visible";

    await digitarTexto(
        textoPlaceholder,
        texto => campoResposta.placeholder = texto,
        120
    );

    await esperar(400);

    await digitarTexto(
        textoBotao,
        texto => botao.textContent = texto,
        160
    );

    campoResposta.disabled = false;
    botao.disabled = false;

    emAnimacao = false;
}

// ==================================================
// RESPOSTAS ERRADAS
// ==================================================

async function responderErrado(textoResposta) {
    const chave = normalizar(textoResposta);

    // Procura uma resposta personalizada.
    const chavePersonalizada = Object.keys(
        respostasPersonalizadas
    ).find(chaveConfigurada =>
        normalizar(chaveConfigurada) === chave
    );

    // Se não houver resposta personalizada, usa a padrão.
    const respostaFritz = chavePersonalizada !== undefined
        ? respostasPersonalizadas[chavePersonalizada]
        : "Esse não é o SEU nome.";

    // A resposta substitui temporariamente a pergunta.
    await digitarTexto(
        respostaFritz,
        texto => pergunta.textContent = texto,
        120
    );

    await esperar(1000);

    await apagarElemento(pergunta, 80);

    await esperar(500);

    // A pergunta original retorna.
    await digitarTexto(
        textoPergunta,
        texto => pergunta.textContent = texto,
        180
    );
}

// ==================================================
// IDENTIDADE RECONHECIDA
// ==================================================

async function reconhecerJogador(nomeReconhecido) {
    // Esconde a pergunta e os controles.
    pergunta.style.display = "none";
    formulario.style.display = "none";

    // Garante que a área de mensagens esteja vazia.
    mensagem.textContent = "";

    const nomeConfigurado = identidadesReconhecidas.find(
        nome => normalizar(nome) === normalizar(nomeReconhecido)
    );

    const sequencia = mensagensReconhecimento[nomeConfigurado]
        || [
            "Finalmente.",
            "Eu estava esperando por você."
        ];

    // Primeira mensagem.
    await digitarTexto(
        sequencia[0],
        texto => mensagem.textContent = texto,
        180
    );

    await esperar(500);

    await apagarElemento(mensagem, 100);

    await esperar(700);

    // Segunda mensagem.
    await digitarTexto(
        sequencia[1],
        texto => mensagem.textContent = texto,
        150
    );

    // Mantém a mensagem por cinco segundos.
    await esperar(5000);

    // Apaga tudo e deixa a tela preta.
    await apagarElemento(mensagem, 100);
}

// ==================================================
// ENVIO DO FORMULÁRIO
// ==================================================

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    // Impede envios durante qualquer animação.
    if (emAnimacao) {
        return;
    }

    const respostaJogador = campoResposta.value.trim();

    if (respostaJogador === "") {
        return;
    }

    emAnimacao = true;

    campoResposta.disabled = true;
    botao.disabled = true;

    const nomeReconhecido = identidadesReconhecidas.find(
        nome => normalizar(nome) === normalizar(respostaJogador)
    );

    try {
        if (nomeReconhecido) {
            await reconhecerJogador(nomeReconhecido);
        } else {
            await responderErrado(respostaJogador);

            campoResposta.value = "";
            campoResposta.disabled = false;
            botao.disabled = false;

            campoResposta.focus();

            emAnimacao = false;
        }
    } catch (erro) {
        console.error("Erro na sequência do Fritz:", erro);
    }
});

// Inicia a experiência.
animarAbertura();
iniciarVento();