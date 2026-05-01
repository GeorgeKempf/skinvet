console.log('auth.js carregou');

const cadastroForm = document.getElementById('cadastroForm');
const loginForm = document.getElementById('loginForm');
const userMenu = document.getElementById('userMenu');
const signupMenu = document.getElementById('signupMenu');

function getCurrentUser() {
    const raw = localStorage.getItem('skinvetUser');
    return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('skinvetUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('skinvetUser');
}

function updateNav() {
    const user = getCurrentUser();

    if (!user || !userMenu || !signupMenu) return;

    userMenu.innerHTML = `
        <a href="#" class="menu-btn user-btn">${user.nome}</a>
        <div class="user-dropdown">
            <a href="#" class="logout-btn">Sair</a>
        </div>
    `;

    signupMenu.style.display = 'none';

    const userBtn = userMenu.querySelector('.user-btn');
    const dropdown = userMenu.querySelector('.user-dropdown');
    const logoutBtn = userMenu.querySelector('.logout-btn');

    userBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        dropdown.classList.toggle('active');
    });

    dropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();

        clearCurrentUser();
        window.location.href = '/';
    });
}

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value.trim();

        try {
            const resposta = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, cpf, senha })
            });

            const dados = await resposta.json();

            alert(dados.mensagem);

            if (resposta.ok) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor');
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const senha = document.getElementById('loginSenha').value.trim();

        try {
            const resposta = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            alert(dados.mensagem);

            if (resposta.ok) {
                setCurrentUser(dados.usuario);
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor');
        }
    });
}

if (userMenu && signupMenu) {
    updateNav();
}

document.addEventListener('click', () => {
    if (!userMenu) return;

    const dropdown = userMenu.querySelector('.user-dropdown');

    if (dropdown) {
        dropdown.classList.remove('active');
    }
});