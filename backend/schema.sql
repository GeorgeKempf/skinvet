-- Schema para PostgreSQL - SkinVet

-- Criar banco de dados (execute isso primeiro)
-- CREATE DATABASE skinvet;

-- Usar o banco
-- \c skinvet;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pets (para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL, -- cachorro, gato, etc.
    raca VARCHAR(100),
    idade INTEGER,
    peso DECIMAL(5,2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos (para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    tipo_consulta VARCHAR(255) NOT NULL,
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'agendado', -- agendado, confirmado, cancelado, realizado
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_pets_usuario_id ON pets(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos(data_hora);