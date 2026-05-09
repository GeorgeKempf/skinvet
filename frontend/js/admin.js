function mostrarSecao(idSecao) {

    const secoes = document.querySelectorAll('.admin-section');

    secoes.forEach(secao => {
        secao.classList.remove('active-section');
    });

    document.getElementById(idSecao)
        .classList.add('active-section');
}

document.querySelectorAll('.menu a').forEach(link => {

    link.addEventListener('click', (event) => {

        event.preventDefault();

        const texto = link.textContent.trim();

        if (texto === 'Home') {
            mostrarSecao('homeSection');
        }

        if (texto === 'Atendimentos') {
            mostrarSecao('atendimentosSection');
        }

        if (texto === 'Acompanhamentos') {
            mostrarSecao('acompanhamentosSection');
        }

        if (texto === 'Usuários') {
            mostrarSecao('usuariosSection');
        }
    });
});