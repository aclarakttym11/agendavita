const db = require('./config/db');

async function fixConsultasTable() {
    try {
        console.log('Dropando tabela consultas...');
        await db.query('DROP TABLE IF EXISTS consultas CASCADE');
        
        console.log('Criando tabela consultas com estrutura corrigida...');
        await db.query(`
            CREATE TABLE consultas (
                id SERIAL PRIMARY KEY,
                paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                dentista_id INTEGER REFERENCES dentistas(id) ON DELETE SET NULL,
                data_consulta DATE NOT NULL,
                horario TIME NOT NULL,
                tipo_consulta VARCHAR(50) NOT NULL,
                observacoes TEXT,
                status VARCHAR(20) DEFAULT 'agendada',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Criando índices...');
        await db.query('CREATE INDEX idx_consultas_paciente ON consultas(paciente_id)');
        await db.query('CREATE INDEX idx_consultas_dentista ON consultas(dentista_id)');
        await db.query('CREATE INDEX idx_consultas_data ON consultas(data_consulta)');
        await db.query('CREATE INDEX idx_consultas_status ON consultas(status)');
        
        console.log('Criando trigger para updated_at...');
        await db.query(`
            CREATE TRIGGER update_consultas_updated_at 
            BEFORE UPDATE ON consultas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        
        console.log('Tabela consultas corrigida com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao corrigir tabela:', error);
        process.exit(1);
    }
}

fixConsultasTable();
