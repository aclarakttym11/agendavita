const db = require('../config/db');

const Consulta = {

    create: async (paciente_id, dentista_id, data_consulta, horario, tipo_consulta, observacoes, status = 'agendada') => {

        const sql = `
            INSERT INTO consultas
            (paciente_id, dentista_id, data_consulta, horario, tipo_consulta, observacoes, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        return await db.query(sql, [
            paciente_id,
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes,
            status
        ]);
    },

    getAll: async () => {

        const sql = `
            SELECT c.*, 
                   u.nome as paciente_nome, 
                   u.email as paciente_email,
                   d.nome as dentista_nome,
                   d.especialidade as dentista_especialidade
            FROM consultas c
            LEFT JOIN usuarios u ON c.paciente_id = u.id
            LEFT JOIN dentistas d ON c.dentista_id = d.id
            ORDER BY c.data_consulta DESC, c.horario DESC
        `;

        return await db.query(sql);
    },

    getById: async (id) => {

        const sql = `
            SELECT c.*, 
                   u.nome as paciente_nome, 
                   u.email as paciente_email,
                   d.nome as dentista_nome,
                   d.especialidade as dentista_especialidade
            FROM consultas c
            LEFT JOIN usuarios u ON c.paciente_id = u.id
            LEFT JOIN dentistas d ON c.dentista_id = d.id
            WHERE c.id = $1
        `;

        return await db.query(sql, [id]);
    },

    getByPacienteId: async (paciente_id) => {

        const sql = `
            SELECT c.*, 
                   d.nome as dentista_nome,
                   d.especialidade as dentista_especialidade
            FROM consultas c
            LEFT JOIN dentistas d ON c.dentista_id = d.id
            WHERE c.paciente_id = $1
            ORDER BY c.data_consulta DESC, c.horario DESC
        `;

        return await db.query(sql, [paciente_id]);
    },

    getByDentistaId: async (dentista_id) => {

        const sql = `
            SELECT c.*, 
                   u.nome as paciente_nome, 
                   u.email as paciente_email,
                   u.telefone as paciente_telefone
            FROM consultas c
            LEFT JOIN usuarios u ON c.paciente_id = u.id
            WHERE c.dentista_id = $1
            ORDER BY c.data_consulta, c.horario
        `;

        return await db.query(sql, [dentista_id]);
    },

    getByDate: async (data_consulta) => {

        const sql = `
            SELECT c.*, 
                   d.nome as dentista_nome,
                   d.especialidade as dentista_especialidade
            FROM consultas c
            LEFT JOIN dentistas d ON c.dentista_id = d.id
            WHERE c.data_consulta = $1
            ORDER BY c.horario
        `;

        return await db.query(sql, [data_consulta]);
    },

    update: async (id, dentista_id, data_consulta, horario, tipo_consulta, observacoes, status) => {

        const sql = `
            UPDATE consultas
            SET dentista_id = $1,
                data_consulta = $2,
                horario = $3,
                tipo_consulta = $4,
                observacoes = $5,
                status = $6
            WHERE id = $7
            RETURNING *
        `;

        return await db.query(sql, [
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes,
            status,
            id
        ]);
    },

    updateStatus: async (id, status) => {

        const sql = `
            UPDATE consultas
            SET status = $1
            WHERE id = $2
            RETURNING *
        `;

        return await db.query(sql, [status, id]);
    },

    delete: async (id) => {

        const sql = `
            DELETE FROM consultas
            WHERE id = $1
            RETURNING *
        `;

        return await db.query(sql, [id]);
    },

    checkDisponibilidade: async (dentista_id, data_consulta, horario) => {

        const sql = `
            SELECT COUNT(*) as count
            FROM consultas
            WHERE dentista_id = $1
            AND data_consulta = $2
            AND horario = $3
            AND status != 'cancelada'
        `;

        return await db.query(sql, [dentista_id, data_consulta, horario]);
    }
};

module.exports = Consulta;
