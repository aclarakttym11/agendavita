-- Script de migração para adicionar dentista_id à tabela consultas

-- Adicionar coluna dentista_id
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS dentista_id INTEGER;

-- Migrar dados existentes (se houver)
-- Como não temos tabela de dentistas antiga, vamos apenas adicionar a coluna
-- Os dados antigos com nome de dentista serão mantidos para referência
ALTER TABLE consultas ADD COLUMN IF NOT EXISTS dentista_nome_antigo VARCHAR(100);

-- Copiar dados antigos para a nova coluna
UPDATE consultas SET dentista_nome_antigo = dentista WHERE dentista IS NOT NULL;

-- Adicionar constraint de chave estrangeira
ALTER TABLE consultas DROP CONSTRAINT IF EXISTS consultas_dentista_id_fkey;
ALTER TABLE consultas ADD CONSTRAINT consultas_dentista_id_fkey 
    FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE SET NULL;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_consultas_dentista ON consultas(dentista_id);

-- Remover coluna antiga após migração (opcional, mantendo por segurança)
-- ALTER TABLE consultas DROP COLUMN IF EXISTS dentista;
