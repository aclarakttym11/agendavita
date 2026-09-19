const Consulta = require('../models/Consulta');
const { AppError } = require('../middlewares/errorHandler');

exports.criarConsulta = async (req, res, next) => {

    try {

        const {
            paciente_id,
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes
        } = req.body;

        const result = await Consulta.create(
            paciente_id,
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Consulta agendada com sucesso!',
            consulta: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.listarConsultas = async (req, res, next) => {

    try {

        // Listar todas as consultas temporariamente para debug
        const result = await Consulta.getAll();

        res.json({
            sucesso: true,
            consultas: result.rows
        });

    } catch (err) {

        next(err);
    }
};

exports.listarConsultaPorId = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await Consulta.getById(id);

        if (result.rows.length === 0) {

            throw new AppError('Consulta não encontrada', 404);
        }

        // Verificar se o cliente tem permissão para ver esta consulta
        if (req.user.role === 'cliente') {
            if (result.rows[0].paciente_id !== req.user.id) {

                throw new AppError(
                    'Você não tem permissão para ver esta consulta',
                    403
                );
            }
        }

        res.json({
            sucesso: true,
            consulta: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.atualizarConsulta = async (req, res, next) => {

    try {

        const { id } = req.params;

        const {
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes,
            status
        } = req.body;

        const result = await Consulta.update(
            id,
            dentista_id,
            data_consulta,
            horario,
            tipo_consulta,
            observacoes,
            status
        );

        if (result.rows.length === 0) {

            throw new AppError('Consulta não encontrada', 404);
        }

        res.json({
            sucesso: true,
            mensagem: 'Consulta atualizada com sucesso!',
            consulta: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.atualizarStatus = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const result = await Consulta.updateStatus(id, status);

        if (result.rows.length === 0) {

            throw new AppError('Consulta não encontrada', 404);
        }

        res.json({
            sucesso: true,
            mensagem: 'Status atualizado com sucesso!',
            consulta: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.deletarConsulta = async (req, res, next) => {

    try {

        const { id } = req.params;

        const result = await Consulta.delete(id);

        if (result.rows.length === 0) {

            throw new AppError('Consulta não encontrada', 404);
        }

        res.json({
            sucesso: true,
            mensagem: 'Consulta removida com sucesso!'
        });

    } catch (err) {

        next(err);
    }
};

exports.listarConsultasSemana = async (req, res, next) => {

    try {

        const { data_inicio, data_fim } = req.query;

        // Se não fornecer datas, usar a semana atual
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        const inicioSemana = data_inicio || new Date(hoje.setDate(hoje.getDate() - diaSemana)).toISOString().split('T')[0];
        const fimSemana = data_fim || new Date(hoje.setDate(hoje.getDate() - diaSemana + 6)).toISOString().split('T')[0];

        // Se for dentista, listar apenas suas consultas
        if (req.user.role === 'dentista') {
            // Buscar dentista_id do usuário
            const Dentista = require('../models/Dentista');
            const dentistaResult = await Dentista.getByUsuarioId(req.user.id);
            
            if (dentistaResult.rows.length > 0) {
                const dentista_id = dentistaResult.rows[0].id;
                const result = await Consulta.getByDentistaId(dentista_id);
                
                // Filtrar por data
                const consultasFiltradas = result.rows.filter(c => {
                    const dataConsulta = new Date(c.data_consulta).toISOString().split('T')[0];
                    return dataConsulta >= inicioSemana && dataConsulta <= fimSemana;
                });
                
                return res.json({
                    sucesso: true,
                    periodo: { inicio: inicioSemana, fim: fimSemana },
                    consultas: consultasFiltradas
                });
            }
        }

        // Se for admin, listar todas
        const result = await Consulta.getAll();
        
        // Filtrar por data
        const consultasFiltradas = result.rows.filter(c => {
            const dataConsulta = new Date(c.data_consulta).toISOString().split('T')[0];
            return dataConsulta >= inicioSemana && dataConsulta <= fimSemana;
        });

        res.json({
            sucesso: true,
            periodo: { inicio: inicioSemana, fim: fimSemana },
            consultas: consultasFiltradas
        });

    } catch (err) {

        next(err);
    }
};