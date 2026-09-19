const db = require('./config/db');

async function testInsert() {
    try {
        console.log('Testando inserção direta no banco...');
        
        const result = await db.query(`
            INSERT INTO consultas 
            (paciente_id, dentista_id, data_consulta, horario, tipo_consulta, observacoes, status)
            VALUES (1, 1, '2024-12-01', '10:00', 'Limpeza', 'Teste', 'agendada')
            RETURNING *
        `);
        
        console.log('Inserção bem-sucedida:', result.rows[0]);
        process.exit(0);
    } catch (error) {
        console.error('Erro na inserção:', error);
        process.exit(1);
    }
}

testInsert();
