# 🐾 SkinVet

Sistema web para clínica de dermatologia veterinária, desenvolvido do zero com foco em aprendizado prático de desenvolvimento fullstack.

---

## 📌 Sobre o projeto

O **SkinVet** é um sistema que permite:

* Cadastro e login de usuários
* Gerenciamento de pets por usuário
* (Em desenvolvimento) Agendamento de consultas veterinárias

Cada usuário possui seus próprios dados, garantindo isolamento e organização das informações.

---

## 🚀 Tecnologias utilizadas

### Backend

* Node.js
* Express
* PostgreSQL
* bcryptjs
* dotenv

### Frontend

* HTML
* CSS
* JavaScript (Vanilla)

---

## 🔐 Funcionalidades

### 👤 Autenticação

* Cadastro de usuário com:

  * Nome
  * Email (único)
  * CPF (único e tratado)
  * Senha criptografada
* Login com validação segura
* Persistência de sessão com `localStorage`

---

### 🐶 Pets (em desenvolvimento)

* Cadastro de pets vinculados ao usuário
* Listagem de pets por usuário

---

### 📅 Agendamentos (em desenvolvimento)

* Criação de consultas veterinárias
* Associação com pet e usuário

---

## 🧠 Regras de negócio

* Cada usuário vê apenas seus próprios dados
* CPF é armazenado sem máscara no banco
* Email e CPF são únicos no sistema
* Senhas são armazenadas com hash (bcrypt)

---

## ⚙️ Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/skinvet.git
cd skinvet
```

---

### 2. Instalar dependências

```bash
cd backend
npm install
```

---

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` dentro de `backend`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=skinvet
DB_PORT=5432
```

---

### 4. Criar banco de dados

No PostgreSQL (pgAdmin ou SQL):

```sql
CREATE DATABASE skinvet;
```

Execute o arquivo:

```txt
backend/schema.sql
```

---

### 5. Rodar o servidor

```bash
node src/server.js
```

---

### 6. Acessar o sistema

Abra no navegador:

```txt
http://localhost:3001
```

---

## 📂 Estrutura do projeto

```
skinvet/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   ├── schema.sql
│   └── .env
│
├── frontend/
│   ├── pages/
│   ├── css/
│   ├── js/
│   └── index.html
```

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido com foco em:

* Aprender desenvolvimento backend com Node.js
* Trabalhar com banco de dados relacional (PostgreSQL)
* Implementar autenticação real
* Construir um sistema completo do zero

---

## 🚧 Próximas melhorias

* Sistema de agendamento completo
* Dashboard do usuário
* Upload de imagem de pets
* Autenticação com JWT
* Deploy em produção

---

## 👨‍💻 Autor

Desenvolvido por **George Kempf Teixeira**

---

## 📎 Licença

Este projeto é para fins de estudo e portfólio.
