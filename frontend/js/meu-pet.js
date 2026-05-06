function getUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

let petParaRemover = null;
let modoRemocao = false;

const listaPets = document.getElementById("listaPets");
const btnRemover = document.querySelector(".btn-remover-geral");

const modal = document.getElementById("modalMotivo");
const btnConfirmar = document.getElementById("confirmarRemocao");
const btnCancelar = document.getElementById("cancelarRemocao");

async function carregarPets() {
    const usuario = getUsuarioLogado();
    if (!usuario) return;

    try {
        const resposta = await fetch(`http://localhost:3001/pets/${usuario.id}`);
        const pets = await resposta.json();

        listaPets.innerHTML = "";

        if (!pets || pets.length === 0) {
            listaPets.innerHTML = `<p class="sem-pets">Nenhum pet cadastrado ainda.</p>`;
            return;
        }

        pets.forEach((pet) => {
            const especieTexto = pet.especie === "cachorro" || pet.especie === "Cachorro"
                ? "Cão"
                : "Gato";

            const fotoPet = pet.foto_url
                ? `http://localhost:3001${pet.foto_url}`
                : "../imagens/pet-padrao.png";

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
                petParaRemover = this.getAttribute("data-id");
                modal.classList.remove("oculto");
            });
        });

    } catch (erro) {
        console.error("ERRO AO CARREGAR PETS:", erro);
        listaPets.innerHTML = `<p class="sem-pets">Erro ao carregar pets.</p>`;
    }
}

btnRemover.addEventListener("click", () => {
    modoRemocao = !modoRemocao;
    btnRemover.textContent = modoRemocao ? "Cancelar" : "Remover pet";
    carregarPets();
});

btnConfirmar.addEventListener("click", async () => {
    if (!petParaRemover) return;

    const selecionado = document.querySelector('input[name="motivo"]:checked');

    if (!selecionado) {
        alert("Escolha um motivo.");
        return;
    }

    const motivoTexto = selecionado.value;

    try {
        const resposta = await fetch(`http://localhost:3001/pets/${petParaRemover}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                motivoExclusao: motivoTexto
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao remover pet.");
            return;
        }

        modal.classList.add("oculto");

        document.querySelectorAll('input[name="motivo"]').forEach((input) => {
            input.checked = false;
        });

        petParaRemover = null;
        modoRemocao = false;
        btnRemover.textContent = "Remover pet";

        carregarPets();

    } catch (erro) {
        console.error("ERRO AO REMOVER PET:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});

btnCancelar.addEventListener("click", () => {
    modal.classList.add("oculto");

    document.querySelectorAll('input[name="motivo"]').forEach((input) => {
        input.checked = false;
    });

    petParaRemover = null;
});

carregarPets();