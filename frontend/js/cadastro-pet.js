function getChavePetsUsuario() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return `pets_${usuario.email}`;
}

const form = document.getElementById("petForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const chavePets = getChavePetsUsuario();
    if (!chavePets) return;

    const nome = document.getElementById("nome-pet").value.trim();
    const especie = document.getElementById("especie-pet").value;
    const raca = document.getElementById("raca-pet").value.trim();
    const idade = document.getElementById("idade-pet").value;
    const sexo = document.getElementById("sexo-pet").value;
    const cor = document.getElementById("cor-pet").value.trim();
    const microchip = document.getElementById("microchip-pet").value.trim();
    const fotoInput = document.getElementById("foto-pet");

    if (!nome || !especie || !sexo) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    function salvarPet(fotoBase64) {
        const pets = JSON.parse(localStorage.getItem(chavePets)) || [];

        const novoPet = {
            id: Date.now(),
            nome,
            especie,
            raca,
            idade,
            sexo,
            cor,
            microchip,
            foto: fotoBase64 || null,
            ativo: true,
            motivoExclusao: null,
            dataExclusao: null
        };

        pets.push(novoPet);
        localStorage.setItem(chavePets, JSON.stringify(pets));

        alert("Pet cadastrado com sucesso!");
        window.location.href = "meu-pet.html";
    }

    if (fotoInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function () {
            salvarPet(reader.result);
        };

        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        salvarPet(null);
    }
});