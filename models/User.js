const db = require('../config/db');

const User = {

    create: async (nome, email, senha, telefone, role = 'cliente') => {

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha, telefone, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email, telefone, role, created_at
        `;

        return await db.query(sql, [nome, email, senha, telefone, role]);
    },

    findByEmail: async (email) => {

        const sql = `
            SELECT * FROM usuarios
            WHERE email = $1
        `;

        return await db.query(sql, [email]);
    },

    findById: async (id) => {

        const sql = `
            SELECT id, nome, email, telefone, role, created_at
            FROM usuarios
            WHERE id = $1
        `;

        return await db.query(sql, [id]);
    },

    getAll: async () => {

        const sql = `
            SELECT id, nome, email, telefone, role, created_at
            FROM usuarios
            ORDER BY created_at DESC
        `;

        return await db.query(sql);
    },

    update: async (id, nome, email, telefone, role) => {

        const sql = `
            UPDATE usuarios
            SET nome = $1, email = $2, telefone = $3, role = $4
            WHERE id = $5
            RETURNING id, nome, email, telefone, role
        `;

        return await db.query(sql, [nome, email, telefone, role, id]);
    },

    delete: async (id) => {

        const sql = `
            DELETE FROM usuarios
            WHERE id = $1
        `;

        return await db.query(sql, [id]);
    }
};

module.exports = User;