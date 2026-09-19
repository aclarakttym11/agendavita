const Dentista = require('../models/Dentista');
const { AppError } = require('../middlewares/errorHandler');

exports.listarDentistas = async (req, res, next) => {

    try {

        const result = await Dentista.getAll();

        res.json({
            sucesso: true,
            dentistas: result.rows
        });

    } catch (err) {

        next(err);
    }
};

exports.listarDentistaPorId = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await Dentista.getById(id);

        if (result.rows.length === 0) {

            throw new AppError('Dentista não encontrado', 404);
        }

        res.json({
            sucesso: true,
            dentista: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.listarPorEspecialidade = async (req, res, next) => {

    try {

        const { especialidade } = req.params;

        const result = await Dentista.getByEspecialidade(especialidade);

        res.json({
            sucesso: true,
            dentistas: result.rows
        });

    } catch (err) {

        next(err);
    }
};

exports.getPacientesDoDia = async (req, res, next) => {

    try {

        const { dentista_id } = req.params;
        const { data } = req.query;

        // Se não fornecer data, usar data de hoje
        const dataConsulta = data || new Date().toISOString().split('T')[0];

        const result = await Dentista.getPacientesDoDia(dentista_id, dataConsulta);

        res.json({
            sucesso: true,
            data: dataConsulta,
            pacientes: result.rows
        });

    } catch (err) {

        next(err);
    }
};

exports.getAgenda = async (req, res, next) => {

    try {

        const { dentista_id } = req.params;
        const { data_inicio, data_fim } = req.query;

        // Se não fornecer datas, usar mês atual
        const hoje = new Date();
        const inicio = data_inicio || new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
        const fim = data_fim || new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];

        const result = await Dentista.getAgenda(dentista_id, inicio, fim);

        res.json({
            sucesso: true,
            periodo: { inicio, fim },
            consultas: result.rows
        });

    } catch (err) {

        next(err);
    }
};

exports.criarDentista = async (req, res, next) => {

    try {

        const { usuario_id, nome, especialidade, cro, telefone } = req.body;

        const result = await Dentista.create(usuario_id, nome, especialidade, cro, telefone);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Dentista cadastrado com sucesso!',
            dentista: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.atualizarDentista = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { nome, especialidade, cro, telefone, ativo } = req.body;

        const result = await Dentista.update(id, nome, especialidade, cro, telefone, ativo);

        if (result.rows.length === 0) {

            throw new AppError('Dentista não encontrado', 404);
        }

        res.json({
            sucesso: true,
            mensagem: 'Dentista atualizado com sucesso!',
            dentista: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.deletarDentista = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await Dentista.delete(id);

        if (result.rows.length === 0) {

            throw new AppError('Dentista não encontrado', 404);
        }

        res.json({
            sucesso: true,
            mensagem: 'Dentista removido com sucesso!'
        });

    } catch (err) {

        next(err);
    }
};
