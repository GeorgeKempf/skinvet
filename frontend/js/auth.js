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

    const logoutBtn = userMenu.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            clearCurrentUser();
            window.location.href = '/';
        });
    }

    const userBtn = userMenu.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const dropdown = userMenu.querySelector('.user-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
}

if (userMenu && signupMenu) {
    updateNav();
}

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const senha = document.getElementById('senha').value.trim();

        try {
            const resposta = await fetch('http://localhost:3001/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, email, cpf, senha })
            });

            const text = await resposta.text();
            let dados;
            try {
                dados = JSON.parse(text);
            } catch {
                dados = null;
            }

            if (!resposta.ok) {
                alert((dados && dados.mensagem) ? dados.mensagem : `Erro ${resposta.status}: ${resposta.statusText}`);
                return;
            }

            alert(dados.mensagem);
            window.location.href = 'login.html';
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
            const resposta = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const text = await resposta.text();
            let dados;
            try {
                dados = JSON.parse(text);
            } catch {
                dados = null;
            }

            if (!resposta.ok) {
                alert((dados && dados.mensagem) ? dados.mensagem : `Erro ${resposta.status}: ${resposta.statusText}`);
                return;
            }

            setCurrentUser(dados.usuario);
            alert(dados.mensagem);
            window.location.href = '../index.html';
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor');
        }
    });
}

const currentUser = getCurrentUser();
if (currentUser && !cadastroForm && !loginForm && userMenu && signupMenu) {
    updateNav();
}