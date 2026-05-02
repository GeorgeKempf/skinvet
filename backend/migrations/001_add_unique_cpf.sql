-- Adicionar constraint UNIQUE no CPF se não existir
ALTER TABLE usuarios ADD CONSTRAINT unique_cpf UNIQUE (cpf);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);