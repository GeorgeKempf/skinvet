require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./config/db");
//const inicializarBanco = require("./config/inicializar-banco");

// Inicializar banco com constraints
//inicializarBanco();

const app = express();
const port = process.env.PORT || 3001;

const frontendPath = path.resolve(__dirname, "..", "..", "frontend");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/health", (req, res) => {
    res.send("OK");
});

app.post("/cadastro", async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    const emailNormalizado = email.toLowerCase().trim();
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
        return res.status(400).json({ mensagem: "CPF inválido" });
    }

    try {
        const emailExiste = await db.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [emailNormalizado]
        );

        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ mensagem: "Email já cadastrado" });
        }

        const cpfExiste = await db.query(
            "SELECT id FROM usuarios WHERE cpf = $1",
            [cpfLimpo]
        );

        if (cpfExiste.rows.length > 0) {
            return res.status(400).json({ mensagem: "CPF já cadastrado" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await db.query(
            `INSERT INTO usuarios (nome, email, cpf, senha)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [nome.trim(), emailNormalizado, cpfLimpo, senhaCriptografada]
        );

        const codigo = `SV-${String(novoUsuario.rows[0].id).padStart(4, "0")}`;

        await db.query(
            "UPDATE usuarios SET codigo = $1 WHERE id = $2",
            [codigo, novoUsuario.rows[0].id]
        );

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso",
            codigo
        });

    } catch (erro) {
        console.error("ERRO NO CADASTRO:", erro);

        if (erro.code === "23505") {
            return res.status(400).json({ mensagem: "Email ou CPF já cadastrado" });
        }

        return res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Preencha email e senha" });
    }

    const emailNormalizado = email.toLowerCase().trim();

    try {
        const usuarios = await db.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [emailNormalizado]
        );

        if (usuarios.rows.length === 0) {
            return res.status(401).json({ mensagem: "Email ou senha incorretos" });
        }

        const usuario = usuarios.rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Email ou senha incorretos" });
        }

        return res.json({
            mensagem: "Login efetuado com sucesso",
            usuario: {
                id: usuario.id,
                codigo: usuario.codigo,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {
    console.error("ERRO REAL NO CADASTRO:", erro);

    if (erro.code === "23505") {
        return res.status(400).json({ mensagem: "Email ou CPF já cadastrado" });
    }

    return res.status(500).json({ mensagem: "Erro no servidor" });
}
});

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
    console.log(`SkinVet API rodando em http://localhost:${port}`);
});