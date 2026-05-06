function getUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

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