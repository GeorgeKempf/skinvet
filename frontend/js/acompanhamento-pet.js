function getChavePetsUsuario() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return `pets_${usuario.email}`;
}

const params = new URLSearchParams(window.location.search);
const petId = Number(params.get("id"));

const titulo = document.getElementById("tituloAcompanhamento");
const foto = document.getElementById("fotoPet");

const chavePets = getChavePetsUsuario();

if (chavePets) {
    const pets = JSON.parse(localStorage.getItem(chavePets)) || [];
    const pet = pets.find((item) => item.id === petId && item.ativo !== false);

    if (pet) {
        titulo.textContent = `Acompanhamento de ${pet.nome}`;

        if (pet.foto) {
            foto.src = pet.foto;
        }
    } else {
        titulo.textContent = "Pet não encontrado";
    }
}