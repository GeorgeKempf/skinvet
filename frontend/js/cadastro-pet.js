function getUsuarioLogado() {
    const usuario = JSON.parse(localStorage.getItem("skinvetUser"));

    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return null;
    }

    return usuario;
}

const form = document.getElementById("petForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = getUsuarioLogado();
    if (!usuario) return;

    const nome = document.getElementById("nome-pet").value.trim();
    const especie = document.getElementById("especie-pet").value;
    const raca = document.getElementById("raca-pet").value.trim();
    const idadeDesconhecida = document.getElementById("idadeDesconhecida").checked;
    const idade = idadeDesconhecida ? "" : document.getElementById("idade").value;
    const sexo = document.getElementById("sexo-pet").value;
    const fotoInput = document.getElementById("foto-pet");

    if (!nome || !especie || !sexo) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("especie", especie);
    formData.append("raca", raca);
    formData.append("idade", idade);
    formData.append("sexo", sexo);
    formData.append("usuario_id", usuario.id);

    if (fotoInput.files.length > 0) {
        formData.append("foto", fotoInput.files[0]);
    }

    try {
        const resposta = await fetch("http://localhost:3001/pets", {
            method: "POST",
            body: formData
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao cadastrar pet.");
            return;
        }

        alert("Pet cadastrado com sucesso!");
        window.location.href = "meu-pet.html";

    } catch (erro) {
        console.error("ERRO AO CADASTRAR PET:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});