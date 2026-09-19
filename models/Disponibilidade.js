const db = require('../config/db');

const Disponibilidade = {

    create: async (dentista_id, dia_semana, horario_inicio, horario_fim) => {

        const sql = `
            INSERT INTO disponibilidade_dentista
            (dentista_id, dia_semana, horario_inicio, horario_fim)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        return await db.query(sql, [dentista_id, dia_semana, horario_inicio, horario_fim]);
    },

    getByDentista: async (dentista_id) => {

        const sql = `
            SELECT * FROM disponibilidade_dentista
            WHERE dentista_id = $1 AND ativo = true
            ORDER BY dia_semana, horario_inicio
        `;

        return await db.query(sql, [dentista_id]);
    },

    getById: async (id) => {

        const sql = `
            SELECT * FROM disponibilidade_dentista
            WHERE id = $1
        `;

        return await db.query(sql, [id]);
    },

    update: async (id, dia_semana, horario_inicio, horario_fim, ativo) => {

        const sql = `
            UPDATE disponibilidade_dentista
            SET dia_semana = $1, horario_inicio = $2, horario_fim = $3, ativo = $4
            WHERE id = $5
            RETURNING *
        `;

        return await db.query(sql, [dia_semana, horario_inicio, horario_fim, ativo, id]);
    },

    delete: async (id) => {

        const sql = `
            DELETE FROM disponibilidade_dentista
            WHERE id = $1
        `;

        return await db.query(sql, [id]);
    },

    getAvailableSlots: async (dentista_id, data) => {

        const dia_semana = new Date(data).getDay();

        const sql = `
            SELECT * FROM disponibilidade_dentista
            WHERE dentista_id = $1 AND dia_semana = $2 AND ativo = true
            ORDER BY horario_inicio
        `;

        return await db.query(sql, [dentista_id, dia_semana]);
    }
};

module.exports = Disponibilidade;
