-- Adicionar campo telefone à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- Criar tabela de disponibilidade de dentistas
CREATE TABLE IF NOT EXISTS disponibilidade_dentista (
    id SERIAL PRIMARY KEY,
    dentista_id INTEGER REFERENCES dentistas(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL, -- 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dentista_id, dia_semana, horario_inicio, horario_fim)
);

-- Índices para disponibilidade
CREATE INDEX IF NOT EXISTS idx_disponibilidade_dentista ON disponibilidade_dentista(dentista_id);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_dia ON disponibilidade_dentista(dia_semana);

-- Trigger para updated_at
CREATE TRIGGER update_disponibilidade_updated_at BEFORE UPDATE ON disponibilidade_dentista
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
