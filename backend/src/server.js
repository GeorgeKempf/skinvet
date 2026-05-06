require("dotenv").config();

const db = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3001;

const frontendPath = path.resolve(__dirname, "..", "..", "frontend");
const uploadsPath = path.resolve(__dirname, "..", "uploads");
const petsUploadsPath = path.resolve(uploadsPath, "pets");

if (!fs.existsSync(petsUploadsPath)) {
    fs.mkdirSync(petsUploadsPath, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadsPath));
app.use(express.static(frontendPath));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, petsUploadsPath);
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1E9) + extensao;
        cb(null, nomeUnico);
    }
});

const upload = multer({ storage });

app.get("/health", (req, res) => {
    res.send("OK");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
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
        console.error("ERRO NO LOGIN:", erro);
        return res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

// CADASTRAR PET COM FOTO
app.post("/pets", upload.single("foto"), async (req, res) => {
    const { nome, especie, raca, idade, sexo, usuario_id } = req.body;

    if (!nome || !especie || !sexo || !usuario_id) {
        return res.status(400).json({ mensagem: "Preencha os campos obrigatórios" });
    }

    const foto_url = req.file
        ? `/uploads/pets/${req.file.filename}`
        : null;

    try {
        await db.query(
            `INSERT INTO pets (nome, especie, raca, idade, sexo, foto_url, usuario_id, ativo)
             VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
            [
                nome,
                especie,
                raca || null,
                idade || null,
                sexo,
                foto_url,
                usuario_id
    ]
);

        return res.json({ mensagem: "Pet cadastrado com sucesso" });

    } catch (erro) {
        console.error("ERRO AO CADASTRAR PET:", erro);
        return res.status(500).json({ mensagem: "Erro ao cadastrar pet" });
    }
});

// LISTAR PETS DO USUÁRIO
app.get("/pets/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const pets = await db.query(
            `SELECT *
             FROM pets
             WHERE usuario_id = $1
             AND ativo = true
             ORDER BY id DESC`,
            [usuario_id]
        );

        return res.json(pets.rows);

    } catch (erro) {
        console.error("ERRO AO BUSCAR PETS:", erro);
        return res.status(500).json({ mensagem: "Erro ao buscar pets" });
    }
});

// REMOVER PET
app.delete("/pets/:pet_id", async (req, res) => {
    const { pet_id } = req.params;
    const { motivoExclusao } = req.body;

    try {
        await db.query(
            `UPDATE pets 
             SET ativo = false, 
                 motivo_exclusao = $1, 
                 data_exclusao = NOW()
             WHERE id = $2`,
            [motivoExclusao || null, pet_id]
        );

        return res.json({ mensagem: "Pet removido com sucesso" });

    } catch (erro) {
        console.error("ERRO AO REMOVER PET:", erro);
        return res.status(500).json({ mensagem: "Erro ao remover pet" });
    }
});

app.get("/pet/:pet_id", async (req, res) => {
    const { pet_id } = req.params;

    try {
        const resultado = await db.query(
            "SELECT * FROM pets WHERE id = $1 AND ativo = true",
            [pet_id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: "Pet não encontrado" });
        }

        return res.json(resultado.rows[0]);

    } catch (erro) {
        console.error("ERRO AO BUSCAR PET:", erro);
        return res.status(500).json({ mensagem: "Erro ao buscar pet" });
    }
});

app.listen(port, () => {
    console.log(`SkinVet API rodando em http://localhost:${port}`);
});