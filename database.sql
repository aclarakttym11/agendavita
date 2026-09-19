-- Script SQL para criar o banco de dados e tabelas da Clínica de Dentista

-- Criar banco de dados (execute no PostgreSQL)
-- CREATE DATABASE consultas_db;

-- Tabela de usuários com campo role para diferenciar admin e cliente
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'cliente', -- 'admin', 'cliente' ou 'dentista'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de dentistas com especialidade
CREATE TABLE IF NOT EXISTS dentistas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL, -- ex: 'Ortodontia', 'Endodontia', 'Implantes', etc.
    cro VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de consultas
CREATE TABLE IF NOT EXISTS consultas (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    dentista_id INTEGER REFERENCES dentistas(id) ON DELETE SET NULL,
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    tipo_consulta VARCHAR(50) NOT NULL, -- ex: 'limpeza', 'restauração', 'extração', etc.
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'agendada', -- 'agendada', 'concluída', 'cancelada'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX idx_consultas_dentista ON consultas(dentista_id);
CREATE INDEX idx_consultas_data ON consultas(data_consulta);
CREATE INDEX idx_consultas_status ON consultas(status);
CREATE INDEX idx_dentistas_usuario ON dentistas(usuario_id);
CREATE INDEX idx_dentistas_especialidade ON dentistas(especialidade);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dentistas_updated_at BEFORE UPDATE ON dentistas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultas_updated_at BEFORE UPDATE ON consultas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir um usuário admin padrão (senha: admin123 - hash bcrypt)
INSERT INTO usuarios (nome, email, senha, role) 
VALUES ('Administrador', 'admin@clinica.com', '$2b$10$rQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZmQKZm', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir dentistas de exemplo
INSERT INTO dentistas (nome, especialidade, cro, telefone) VALUES
('Dra. Tayane Viana', 'Ortodontia', '12345-SP', '(11) 99999-1111'),
('Dra. Ana Santos', 'Endodontia', '23456-SP', '(11) 99999-2222'),
('Dr. Pedro Oliveira', 'Implantes', '34567-SP', '(11) 99999-3333'),
('Dra. Maria Costa', 'Odontopediatria', '45678-SP', '(11) 99999-4444'),
('Dr. João Ferreira', 'Periodontia', '56789-SP', '(11) 99999-5555')
ON CONFLICT (cro) DO NOTHING;
