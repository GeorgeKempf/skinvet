function getUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

const especiePet = document.getElementById("especiePet");
const racaPet = document.getElementById("racaPet");
const idadePet = document.getElementById("idadePet");
const sexoPet = document.getElementById("sexoPet");

const params = new URLSearchParams(window.location.search);
const petId = params.get("id");

const titulo = document.getElementById("tituloAcompanhamento");
const foto = document.getElementById("fotoPet");

async function carregarPet() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    if (!petId) {
        titulo.textContent = "Pet não encontrado";
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3001/pet/${petId}`);
        const pet = await resposta.json();

        if (!resposta.ok) {
            titulo.textContent = "Pet não encontrado";
            return;
        }

        titulo.textContent = `Acompanhamento de ${pet.nome}`;

        if (pet.foto_url) {
            especiePet.textContent = pet.especie || "Não informado";
            racaPet.textContent = pet.raca || "Não informado";

            sexoPet.textContent = pet.sexo || "Não informado";

            idadePet.textContent = pet.idade
    ? `${pet.idade} ano${pet.idade > 1 ? "s" : ""}`
    : "Não informado";
            foto.src = `http://localhost:3001${pet.foto_url}`;
        } else {
            foto.src = "../imagens/pet-padrao.png";
        }

    } catch (erro) {
        console.error("ERRO AO CARREGAR PET:", erro);
        titulo.textContent = "Erro ao carregar pet";
    }
}

const listaAgendamentosPet = document.getElementById("listaAgendamentosPet");
const mensagemSemAgendamento = document.getElementById("mensagemSemAgendamento");

function carregarAgendamentosDoPet() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const chaveAgendamentos = `agendamentos_${usuario.email}`;
    const agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];

    const agendamentosDoPet = agendamentos.filter((item) => {
        return Number(item.petId) === Number(petId) && item.status !== "Cancelado";
    });

    listaAgendamentosPet.innerHTML = "";

    if (agendamentosDoPet.length === 0) {
        mensagemSemAgendamento.style.display = "block";
        return;
    }

    mensagemSemAgendamento.style.display = "none";

    agendamentosDoPet.forEach((agendamento) => {
        const item = document.createElement("div");
        item.classList.add("agendamento-item");

        item.innerHTML = `
            <h3>Agendamento solicitado</h3>
            <p><strong>Data:</strong> ${agendamento.data}</p>
            <p><strong>Horário:</strong> ${agendamento.horario}</p>
            <p><strong>Observação:</strong> ${agendamento.observacao}</p>
            <p><strong>Status:</strong> ${agendamento.status}</p>

            <div class="botoes-agendamento">
                <button onclick="editarAgendamento(${agendamento.id})">Editar</button>
                <button onclick="cancelarAgendamento(${agendamento.id})">Cancelar</button>
            </div>
        `;

        listaAgendamentosPet.appendChild(item);
    });
}

function cancelarAgendamento(id) {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const confirmar = confirm("Tem certeza que deseja cancelar este agendamento?");
    if (!confirmar) return;

    const chaveAgendamentos = `agendamentos_${usuario.email}`;
    const agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];

    const agendamentosAtualizados = agendamentos.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                status: "Cancelado"
            };
        }

        return item;
    });

    localStorage.setItem(chaveAgendamentos, JSON.stringify(agendamentosAtualizados));
    carregarAgendamentosDoPet();
}

function editarAgendamento(id) {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const chaveAgendamentos = `agendamentos_${usuario.email}`;
    const agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];

    const agendamento = agendamentos.find((item) => item.id === id);

    if (!agendamento) return;

    const novaData = prompt("Nova data:", agendamento.data);
    const novoHorario = prompt("Novo horário:", agendamento.horario);
    const novaObservacao = prompt("Nova observação:", agendamento.observacao);

    if (!novaData || !novoHorario || !novaObservacao) {
        alert("Edição cancelada.");
        return;
    }

    const agendamentosAtualizados = agendamentos.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                data: novaData,
                horario: novoHorario,
                observacao: novaObservacao,
                status: "Solicitado"
            };
        }

        return item;
    });

    localStorage.setItem(chaveAgendamentos, JSON.stringify(agendamentosAtualizados));
    carregarAgendamentosDoPet();
}

carregarPet();
carregarAgendamentosDoPet();