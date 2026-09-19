const db = require('../config/db');

const Dentista = {

    getAll: async () => {

        const sql = `
            SELECT id, nome, especialidade, cro, telefone, ativo, created_at
            FROM dentistas
            WHERE ativo = TRUE
            ORDER BY nome
        `;

        return await db.query(sql);
    },

    getById: async (id) => {

        const sql = `
            SELECT id, nome, especialidade, cro, telefone, ativo, created_at
            FROM dentistas
            WHERE id = $1
        `;

        return await db.query(sql, [id]);
    },

    getByEspecialidade: async (especialidade) => {

        const sql = `
            SELECT id, nome, especialidade, cro, telefone, ativo, created_at
            FROM dentistas
            WHERE especialidade = $1 AND ativo = TRUE
            ORDER BY nome
        `;

        return await db.query(sql, [especialidade]);
    },

    getByUsuarioId: async (usuario_id) => {

        const sql = `
            SELECT id, nome, especialidade, cro, telefone, ativo, created_at
            FROM dentistas
            WHERE usuario_id = $1
        `;

        return await db.query(sql, [usuario_id]);
    },

    create: async (usuario_id, nome, especialidade, cro, telefone) => {

        const sql = `
            INSERT INTO dentistas
            (usuario_id, nome, especialidade, cro, telefone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        return await db.query(sql, [usuario_id, nome, especialidade, cro, telefone]);
    },

    update: async (id, nome, especialidade, cro, telefone, ativo) => {

        const sql = `
            UPDATE dentistas
            SET nome = $1,
                especialidade = $2,
                cro = $3,
                telefone = $4,
                ativo = $5
            WHERE id = $6
            RETURNING *
        `;

        return await db.query(sql, [nome, especialidade, cro, telefone, ativo, id]);
    },

    delete: async (id) => {

        const sql = `
            DELETE FROM dentistas
            WHERE id = $1
            RETURNING *
        `;

        return await db.query(sql, [id]);
    },

    getPacientesDoDia: async (dentista_id, data) => {

        const sql = `
            SELECT c.*, u.nome as paciente_nome, u.email as paciente_email
            FROM consultas c
            LEFT JOIN usuarios u ON c.paciente_id = u.id
            WHERE c.dentista_id = $1
            AND c.data_consulta = $2
            AND c.status != 'cancelada'
            ORDER BY c.horario
        `;

        return await db.query(sql, [dentista_id, data]);
    },

    getAgenda: async (dentista_id, data_inicio, data_fim) => {

        const sql = `
            SELECT c.*, u.nome as paciente_nome, u.email as paciente_email
            FROM consultas c
            LEFT JOIN usuarios u ON c.paciente_id = u.id
            WHERE c.dentista_id = $1
            AND c.data_consulta BETWEEN $2 AND $3
            AND c.status != 'cancelada'
            ORDER BY c.data_consulta, c.horario
        `;

        return await db.query(sql, [dentista_id, data_inicio, data_fim]);
    }
};

module.exports = Dentista;
