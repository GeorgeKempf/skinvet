const Database = require('better-sqlite3');
const path = require('path');

// Criar/abrir banco SQLite
const dbPath = path.join(__dirname, '../../skinvet.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
const schema = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cpf TEXT NOT NULL,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    especie TEXT NOT NULL,
    raca TEXT,
    idade INTEGER,
    peso REAL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    pet_id INTEGER,
    data_hora DATETIME NOT NULL,
    tipo_consulta TEXT NOT NULL,
    observacoes TEXT,
    status TEXT DEFAULT 'agendado',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_pets_usuario_id ON pets(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario_id ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos(data_hora);
`;

// Executar schema
db.exec(schema);

// Exportar objeto compatível com a interface atual
module.exports = {
    query: (sql, params) => {
        try {
            // Converter placeholders PostgreSQL ($1, $2) para ? do SQLite
            let sqlite_sql = sql;
            if (params && params.length > 0) {
                for (let i = params.length; i >= 1; i--) {
                    sqlite_sql = sqlite_sql.replace(`$${i}`, '?');
                }
            }

            // SELECT
            if (sqlite_sql.trim().toUpperCase().startsWith('SELECT')) {
                const stmt = db.prepare(sqlite_sql);
                const rows = stmt.all(...(params || []));
                return Promise.resolve({ rows });
            }
            // INSERT, UPDATE, DELETE
            else {
                const stmt = db.prepare(sqlite_sql);
                const result = stmt.run(...(params || []));
                return Promise.resolve({
                    rows: result.changes > 0 ? [{ id: result.lastInsertRowid }] : []
                });
            }
        } catch (error) {
            return Promise.reject(error);
        }
    },

    end: () => {
        db.close();
        return Promise.resolve();
    }
};
