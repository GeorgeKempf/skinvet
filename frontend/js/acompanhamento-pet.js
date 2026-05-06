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

carregarPet();