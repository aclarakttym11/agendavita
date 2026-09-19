const db = require('./config/db');
const fs = require('fs');

async function migrate() {
    try {
        const sql = fs.readFileSync('./database.sql', 'utf8');
        await db.query(sql);
        console.log('Migração executada com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao executar migração:', error);
        process.exit(1);
    }
}

migrate();
