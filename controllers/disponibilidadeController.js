const Disponibilidade = require('../models/Disponibilidade');
const Dentista = require('../models/Dentista');
const { AppError } = require('../middlewares/errorHandler');

exports.create = async (req, res, next) => {
    try {
        const { dentista_id, dia_semana, horario_inicio, horario_fim } = req.body;

        // Validar se o dentista existe
        const dentistaResult = await Dentista.getById(dentista_id);
        if (dentistaResult.rows.length === 0) {
            throw new AppError('Dentista não encontrado', 404);
        }

        // Validar dia da semana (0-6)
        if (dia_semana < 0 || dia_semana > 6) {
            throw new AppError('Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)', 400);
        }

        // Validar horários
        if (horario_inicio >= horario_fim) {
            throw new AppError('Horário de início deve ser anterior ao horário de fim', 400);
        }

        const result = await Disponibilidade.create(dentista_id, dia_semana, horario_inicio, horario_fim);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Disponibilidade criada com sucesso!',
            disponibilidade: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

exports.getByDentista = async (req, res, next) => {
    try {
        const { dentista_id } = req.params;

        const result = await Disponibilidade.getByDentista(dentista_id);

        res.json({
            sucesso: true,
            disponibilidade: result.rows
        });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { dia_semana, horario_inicio, horario_fim, ativo } = req.body;

        // Validar se a disponibilidade existe
        const existente = await Disponibilidade.getById(id);
        if (existente.rows.length === 0) {
            throw new AppError('Disponibilidade não encontrada', 404);
        }

        // Validar dia da semana (0-6)
        if (dia_semana !== undefined && (dia_semana < 0 || dia_semana > 6)) {
            throw new AppError('Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)', 400);
        }

        // Validar horários
        if (horario_inicio !== undefined && horario_fim !== undefined && horario_inicio >= horario_fim) {
            throw new AppError('Horário de início deve ser anterior ao horário de fim', 400);
        }

        const result = await Disponibilidade.update(
            id,
            dia_semana !== undefined ? dia_semana : existente.rows[0].dia_semana,
            horario_inicio !== undefined ? horario_inicio : existente.rows[0].horario_inicio,
            horario_fim !== undefined ? horario_fim : existente.rows[0].horario_fim,
            ativo !== undefined ? ativo : existente.rows[0].ativo
        );

        res.json({
            sucesso: true,
            mensagem: 'Disponibilidade atualizada com sucesso!',
            disponibilidade: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existente = await Disponibilidade.getById(id);
        if (existente.rows.length === 0) {
            throw new AppError('Disponibilidade não encontrada', 404);
        }

        await Disponibilidade.delete(id);

        res.json({
            sucesso: true,
            mensagem: 'Disponibilidade excluída com sucesso!'
        });
    } catch (err) {
        next(err);
    }
};

exports.getAvailableSlots = async (req, res, next) => {
    try {
        const { dentista_id } = req.params;
        const { data } = req.query;

        if (!data) {
            throw new AppError('Data é obrigatória', 400);
        }

        const result = await Disponibilidade.getAvailableSlots(dentista_id, data);

        res.json({
            sucesso: true,
            slots: result.rows
        });
    } catch (err) {
        next(err);
    }
};
