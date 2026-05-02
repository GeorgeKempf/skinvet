const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Conectar ao banco padrão primeiro
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function setupDatabase() {
    try {
        // Criar banco se não existir
        await pool.query('CREATE DATABASE skinvet;');
        console.log('✅ Banco skinvet criado com sucesso!');

        // Fechar conexão e reconectar ao novo banco
        await pool.end();

        const skinvetPool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'skinvet',
            password: process.env.DB_PASSWORD,
            port: 5432,
        });

        // Executar schema
        const fs = require('fs');
        const schema = fs.readFileSync('./schema.sql', 'utf8');

        await skinvetPool.query(schema);
        console.log('✅ Schema executado com sucesso!');

        await skinvetPool.end();
        console.log('🎉 Setup do banco concluído!');

    } catch (error) {
        if (error.code === '42P04') {
            console.log('ℹ️  Banco skinvet já existe. Executando apenas o schema...');

            // Se o banco já existe, apenas executar o schema
            const skinvetPool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'skinvet',
                password: process.env.DB_PASSWORD,
                port: 5432,
            });

            const fs = require('fs');
            const schema = fs.readFileSync('./schema.sql', 'utf8');

            await skinvetPool.query(schema);
            console.log('✅ Schema executado com sucesso!');
            await skinvetPool.end();

        } else {
            console.error('❌ Erro no setup:', error);
        }
    }
}

setupDatabase();