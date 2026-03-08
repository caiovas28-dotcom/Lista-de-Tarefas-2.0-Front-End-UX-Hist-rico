// Elementos
const inputTarefa = document.getElementById("novaTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const dias = document.querySelectorAll(".dia");
const btnHistorico = document.getElementById("btnHistorico");
const historicoDiv = document.getElementById("historico");

const inputComp = document.getElementById("nomeCompromisso");
const inputData = document.getElementById("dataCompromisso");
const inputHora = document.getElementById("horaCompromisso");
const btnAdicionarComp = document.getElementById("btnAdicionarCompromisso");
const listaCompromissos = document.getElementById("listaCompromissos");

let diaSelecionado = "Seg";

// Estrutura de tarefas por dia
let tarefasPorDia = JSON.parse(localStorage.getItem("tarefasPorDia")) || {
    "Seg": [], "Ter": [], "Qua": [], "Qui": [], "Sex": [], "Sáb": [], "Dom": []
};

// Estrutura de compromissos
let compromissos = JSON.parse(localStorage.getItem("compromissos")) || [];

// Funções
function salvarLocalStorage() {
    localStorage.setItem("tarefasPorDia", JSON.stringify(tarefasPorDia));
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
}

function renderizarTarefas() {
    listaTarefas.innerHTML = "";
    tarefasPorDia[diaSelecionado].forEach((tarefa, index) => {
        const div = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarefa.concluida;

        const span = document.createElement("span");
        span.textContent = tarefa.texto;
        if (tarefa.concluida) span.style.textDecoration = "line-through";

        const btnDel = document.createElement("button");
        btnDel.textContent = "X";

        btnDel.addEventListener("click", () => {
            tarefasPorDia[diaSelecionado].splice(index, 1);
            salvarLocalStorage();
            renderizarTarefas();
        });

        checkbox.addEventListener("change", () => {
            tarefa.concluida = checkbox.checked;
            salvarLocalStorage();
            renderizarTarefas();
        });

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(btnDel);
        listaTarefas.appendChild(div);
    });
}

// Troca de dias
dias.forEach(botao => {
    botao.addEventListener("click", () => {
        diaSelecionado = botao.dataset.dia;
        dias.forEach(d => d.classList.remove("active"));
        botao.classList.add("active");
        renderizarTarefas();
    });
});

// Adicionar nova tarefa
btnAdicionar.addEventListener("click", () => {
    const texto = inputTarefa.value.trim();
    if (!texto) return;
    tarefasPorDia[diaSelecionado].push({texto, concluida: false});
    salvarLocalStorage();
    renderizarTarefas();
    inputTarefa.value = "";
});

// Histórico
btnHistorico.addEventListener("click", () => {
    historicoDiv.style.display = historicoDiv.style.display === "none" ? "block" : "none";
    historicoDiv.innerHTML = "";
    Object.keys(tarefasPorDia).forEach(dia => {
        const h = document.createElement("h4");
        h.textContent = dia;
        historicoDiv.appendChild(h);
        tarefasPorDia[dia].forEach(t => {
            const p = document.createElement("p");
            p.textContent = t.texto + (t.concluida ? " ✅" : "");
            historicoDiv.appendChild(p);
        });
    });
});

// Adicionar Compromisso
btnAdicionarComp.addEventListener("click", () => {
    const nome = inputComp.value.trim();
    const data = inputData.value;
    const hora = inputHora.value;
    if (!nome || !data || !hora) return;

    compromissos.push({nome, data, hora});
    salvarLocalStorage();
    renderizarCompromissos();
    inputComp.value = "";
    inputData.value = "";
    inputHora.value = "";
});

function renderizarCompromissos() {
    listaCompromissos.innerHTML = "";
    compromissos.forEach((c, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<span>${c.nome}</span><span>${c.data} ${c.hora}</span>`;
        listaCompromissos.appendChild(div);
    });
}

// Inicializa
dias[0].classList.add("active");
renderizarTarefas();
renderizarCompromissos();