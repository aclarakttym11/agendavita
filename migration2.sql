-- Script de migração para remover coluna antiga dentista

-- Tornar coluna dentista nullable temporariamente
ALTER TABLE consultas ALTER COLUMN dentista DROP NOT NULL;

-- Remover coluna antiga
ALTER TABLE consultas DROP COLUMN IF EXISTS dentista;

-- Remover coluna temporária de backup
ALTER TABLE consultas DROP COLUMN IF EXISTS dentista_nome_antigo;
