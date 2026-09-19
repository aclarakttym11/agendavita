// Middleware de autorização por role (admin/cliente)

const { AppError } = require('./errorHandler');

// Verifica se o usuário é admin
const isAdmin = (req, res, next) => {

    if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
    }

    if (req.user.role !== 'admin') {
        throw new AppError('Acesso negado. Apenas administradores podem acessar esta rota.', 403);
    }

    next();
};

// Verifica se o usuário é cliente
const isCliente = (req, res, next) => {

    if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
    }

    if (req.user.role !== 'cliente') {
        throw new AppError('Acesso negado. Apenas clientes podem acessar esta rota.', 403);
    }

    next();
};

// Verifica se o usuário é admin ou é o próprio cliente (para operações em seus próprios dados)
const isAdminOrSelf = (req, res, next) => {

    if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
    }

    const idParam = parseInt(req.params.id);

    // Admin pode acessar qualquer recurso
    if (req.user.role === 'admin') {
        return next();
    }

    // Cliente só pode acessar seus próprios recursos
    if (req.user.role === 'cliente' && req.user.id === idParam) {
        return next();
    }

    throw new AppError('Acesso negado. Você só pode acessar seus próprios dados.', 403);
};

// Verifica se o usuário é admin ou se a consulta pertence ao cliente
const isAdminOrConsultaOwner = async (req, res, next) => {

    if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
    }

    const idParam = parseInt(req.params.id);

    // Se não houver idParam, não aplicar este middleware
    if (!idParam || isNaN(idParam)) {
        return next();
    }

    // Admin pode acessar qualquer consulta
    if (req.user.role === 'admin') {
        return next();
    }

    // Cliente só pode acessar suas próprias consultas
    if (req.user.role === 'cliente') {
        const Consulta = require('../models/Consulta');
        const result = await Consulta.getById(idParam);

        if (result.rows.length === 0) {
            throw new AppError('Consulta não encontrada', 404);
        }

        const consulta = result.rows[0];

        if (consulta.paciente_id !== req.user.id) {
            throw new AppError('Acesso negado. Você só pode acessar suas próprias consultas.', 403);
        }

        return next();
    }

    throw new AppError('Acesso negado', 403);
};

// Verifica se o usuário tem um dos roles permitidos
const hasRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            throw new AppError('Usuário não autenticado', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError('Acesso negado. Role insuficiente.', 403);
        }

        next();
    };
};

// Verifica se o usuário é admin ou dentista
const isAdminOrDentista = (req, res, next) => {

    if (!req.user) {
        throw new AppError('Usuário não autenticado', 401);
    }

    if (req.user.role !== 'admin' && req.user.role !== 'dentista') {
        throw new AppError('Acesso negado. Apenas administradores e dentistas podem acessar esta rota.', 403);
    }

    next();
};

module.exports = {
    isAdmin,
    isCliente,
    isAdminOrSelf,
    isAdminOrConsultaOwner,
    hasRole,
    isAdminOrDentista
};
