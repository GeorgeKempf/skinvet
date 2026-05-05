function getChavePetsUsuario() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return `pets_${usuario.email}`;
}

const form = document.getElementById("agendamentoForm");
const listaPetsContainer = document.getElementById("listaPetsAgendamento");
const inputPetSelecionado = document.getElementById("pet-agendamento");

function carregarPetsNoAgendamento() {
    const chavePets = getChavePetsUsuario();
    if (!chavePets) return;

    const pets = JSON.parse(localStorage.getItem(chavePets)) || [];
    const petsAtivos = pets.filter((pet) => pet.ativo !== false);

    listaPetsContainer.innerHTML = "";

    if (petsAtivos.length === 0) {
        listaPetsContainer.innerHTML = "<p>Nenhum pet cadastrado</p>";
        return;
    }

    petsAtivos.forEach((pet) => {
        const item = document.createElement("div");
        item.classList.add("pet-agendamento-item");

        const foto = pet.foto || "../imagens/pet-padrao.png";
        const especie = pet.especie === "cachorro" ? "Cão" : "Gato";

        item.innerHTML = `
            <img src="${foto}" alt="Foto de ${pet.nome}">
            <div class="pet-agendamento-info">
                <strong>${pet.nome}</strong>
                <span>${especie}</span>
            </div>
        `;

        item.addEventListener("click", () => {
            document.querySelectorAll(".pet-agendamento-item")
                .forEach((el) => el.classList.remove("selecionado"));

            item.classList.add("selecionado");
            inputPetSelecionado.value = pet.id;
        });

        listaPetsContainer.appendChild(item);
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));
    if (!usuario) return;

    const petId = Number(inputPetSelecionado.value);
    const data = document.getElementById("data-agendamento").value;
    const horario = document.getElementById("horario-agendamento").value;
    const observacao = document.getElementById("observacao-agendamento").value.trim();

    if (!petId || !data || !horario || !observacao) {
        alert("Preencha todos os campos.");
        return;
    }

    const chaveAgendamentos = `agendamentos_${usuario.email}`;
    const agendamentos = JSON.parse(localStorage.getItem(chaveAgendamentos)) || [];

    const novoAgendamento = {
        id: Date.now(),
        petId,
        data,
        horario,
        observacao,
        status: "Solicitado"
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem(chaveAgendamentos, JSON.stringify(agendamentos));

    alert("Agendamento solicitado com sucesso!");

    form.reset();
    inputPetSelecionado.value = "";

    document.querySelectorAll(".pet-agendamento-item")
        .forEach((el) => el.classList.remove("selecionado"));
});

carregarPetsNoAgendamento();