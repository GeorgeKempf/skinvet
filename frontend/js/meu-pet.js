function getChavePetsUsuario() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return `pets_${usuario.email}`;
}

let petParaRemover = null;
let modoRemocao = false;

const listaPets = document.getElementById("listaPets");
const btnRemover = document.querySelector(".btn-remover-geral");

const modal = document.getElementById("modalMotivo");
const btnConfirmar = document.getElementById("confirmarRemocao");
const btnCancelar = document.getElementById("cancelarRemocao");

function carregarPets() {
    const chavePets = getChavePetsUsuario();
    if (!chavePets) return;

    const pets = JSON.parse(localStorage.getItem(chavePets)) || [];
    const petsAtivos = pets.filter((pet) => pet.ativo !== false);

    listaPets.innerHTML = "";

    if (petsAtivos.length === 0) {
        listaPets.innerHTML = `<p class="sem-pets">Nenhum pet cadastrado ainda.</p>`;
        return;
    }

    petsAtivos.forEach((pet) => {
        const especieTexto = pet.especie === "cachorro" ? "Cão" : "Gato";
        const fotoPet = pet.foto || "../imagens/pet-padrao.png";

        const petItem = document.createElement("div");
        petItem.classList.add("pet-item");

        petItem.innerHTML = `
            <div class="pet-info">
                <img src="${fotoPet}" class="foto-pet-lista" alt="Foto de ${pet.nome}">
                <div>
                    <strong>${pet.nome}</strong>
                    <span>${especieTexto}</span>
                </div>
            </div>

            <div class="acoes-item">
                ${
                    modoRemocao
                        ? `<button class="btn-excluir" data-id="${pet.id}">Remover</button>`
                        : `<a href="acompanhamento-pet.html?id=${pet.id}" class="btn-acompanhamento">Acompanhamento</a>`
                }
            </div>
        `;

        listaPets.appendChild(petItem);
    });

    document.querySelectorAll(".btn-excluir").forEach((btn) => {
        btn.addEventListener("click", function () {
            petParaRemover = Number(this.getAttribute("data-id"));
            modal.classList.remove("oculto");
        });
    });
}

btnRemover.addEventListener("click", () => {
    modoRemocao = !modoRemocao;
    btnRemover.textContent = modoRemocao ? "Cancelar" : "Remover pet";
    carregarPets();
});

btnConfirmar.addEventListener("click", () => {
    const chavePets = getChavePetsUsuario();
    if (!chavePets) return;

    const selecionado = document.querySelector('input[name="motivo"]:checked');

    if (!selecionado) {
        alert("Escolha um motivo.");
        return;
    }

    const motivoTexto = selecionado.value;

    let pets = JSON.parse(localStorage.getItem(chavePets)) || [];

    pets = pets.map((pet) => {
        if (pet.id === petParaRemover) {
            return {
                ...pet,
                ativo: false,
                motivoExclusao: motivoTexto,
                dataExclusao: new Date().toISOString()
            };
        }

        return pet;
    });

    localStorage.setItem(chavePets, JSON.stringify(pets));

    modal.classList.add("oculto");

    document.querySelectorAll('input[name="motivo"]').forEach((input) => {
        input.checked = false;
    });

    petParaRemover = null;
    modoRemocao = false;
    btnRemover.textContent = "Remover pet";

    carregarPets();
});

btnCancelar.addEventListener("click", () => {
    modal.classList.add("oculto");

    document.querySelectorAll('input[name="motivo"]').forEach((input) => {
        input.checked = false;
    });

    petParaRemover = null;
});

carregarPets();