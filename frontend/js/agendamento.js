function getUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

const form = document.getElementById("agendamentoForm");
const listaPetsContainer = document.getElementById("listaPetsAgendamento");
const inputPetSelecionado = document.getElementById("pet-agendamento");
const modalTaxaDomicilio = document.getElementById("modalTaxaDomicilio");
const confirmarDomicilio = document.getElementById("confirmarDomicilio");
const cancelarDomicilio = document.getElementById("cancelarDomicilio");
const radiosTipoAgendamento = document.querySelectorAll('input[name="tipo-agendamento"]');

async function carregarPetsNoAgendamento() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    try {
        const resposta = await fetch(`http://localhost:3001/pets/${usuario.id}`);
        const pets = await resposta.json();

        listaPetsContainer.innerHTML = "";

        if (!pets || pets.length === 0) {
            listaPetsContainer.innerHTML = `
                <div class="sem-pets">
                    <p>Você ainda não possui pets cadastrados.</p>
                    <a href="meu-pet.html">Cadastrar meu primeiro pet</a>
                </div>
            `;
            return;
        }

        pets.forEach((pet) => {
            const item = document.createElement("div");
            item.classList.add("pet-agendamento-item");

            const foto = pet.foto_url
                ? `http://localhost:3001${pet.foto_url}`
                : "../imagens/pet-padrao.png";

            item.innerHTML = `
                <img src="${foto}" alt="Foto de ${pet.nome}">
                <div class="pet-agendamento-info">
                    <strong>${pet.nome}</strong>
                    <span>${pet.especie || "Espécie não informada"}</span>
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

    } catch (erro) {
        console.error("Erro ao carregar pets:", erro);
        listaPetsContainer.innerHTML = "<p>Erro ao carregar pets.</p>";
    }
}

radiosTipoAgendamento.forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.value === "A domicílio" && radio.checked) {
            modalTaxaDomicilio.style.display = "flex";
        }
    });
});

confirmarDomicilio.addEventListener("click", () => {
    modalTaxaDomicilio.style.display = "none";
});

cancelarDomicilio.addEventListener("click", () => {
    const domicilio = document.querySelector('input[name="tipo-agendamento"][value="A domicílio"]');

    if (domicilio) {
        domicilio.checked = false;
    }

    modalTaxaDomicilio.style.display = "none";
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const petId = Number(inputPetSelecionado.value);
    const data = document.getElementById("data-agendamento").value;
    const horario = document.getElementById("horario-agendamento").value;
    const observacao = document.getElementById("observacao-agendamento").value.trim();
    const tipoAgendamento = document.querySelector('input[name="tipo-agendamento"]:checked')?.value;

    if (!tipoAgendamento) {
    alert("Selecione o tipo de atendimento.");
    return;
}

    if (!petId) {
        alert("Selecione um pet para o agendamento.");
        return;
    }

    if (!data || !horario || !observacao) {
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
        tipoAgendamento,
        observacao,
        status: "Solicitado"
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem(chaveAgendamentos, JSON.stringify(agendamentos));

    alert("Agendamento solicitado com sucesso!");

    window.location.href = `acompanhamento-pet.html?id=${petId}`;
});

carregarPetsNoAgendamento();