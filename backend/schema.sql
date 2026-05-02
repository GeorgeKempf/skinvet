-- Schema para PostgreSQL - SkinVet

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(20) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    idade INTEGER,
    peso DECIMAL(5,2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    data_hora TIMESTAMP NOT NULL,
    tipo_consulta VARCHAR(255) NOT NULL,
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'agendado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email 
ON usuarios(email);

CREATE INDEX IF NOT EXISTS idx_pets_usuario_id 
ON pets(usuario_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id 
ON agendamentos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora 
ON agendamentos(data_hora);