// Middleware de validação de dados na entrada

const { AppError } = require('./errorHandler');

// Validador de registro de usuário
const validateRegister = (req, res, next) => {

    const { nome, email, senha, telefone, role } = req.body;

    const erros = [];

    // Validar nome
    if (!nome || nome.trim().length < 3) {
        erros.push('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar email
    if (!email) {
        erros.push('Email é obrigatório');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            erros.push('Email inválido');
        }
    }

    // Validar senha
    if (!senha) {
        erros.push('Senha é obrigatória');
    } else if (senha.length < 6) {
        erros.push('Senha deve ter pelo menos 6 caracteres');
    }

    // Validar telefone (opcional, mas se fornecido deve ter formato válido)
    if (telefone && telefone.trim() !== '') {
        const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-]?\d{4}$/;
        if (!telefoneRegex.test(telefone)) {
            erros.push('Telefone inválido (formato: (11) 99999-9999 ou 11999999999)');
        }
    }

    // Validar role (se fornecido)
    if (role && !['admin', 'cliente'].includes(role)) {
        erros.push('Role deve ser "admin" ou "cliente"');
    }

    if (erros.length > 0) {
        throw new AppError('Erro de validação', 400, erros);
    }

    next();
};

// Validador de login
const validateLogin = (req, res, next) => {

    const { email, senha } = req.body;

    const erros = [];

    if (!email) {
        erros.push('Email é obrigatório');
    }

    if (!senha) {
        erros.push('Senha é obrigatória');
    }

    if (erros.length > 0) {
        throw new AppError('Erro de validação', 400, erros);
    }

    next();
};

// Validador de criação de consulta
const validateConsulta = (req, res, next) => {

    const { paciente_id, dentista_id, data_consulta, horario, tipo_consulta, observacoes } = req.body;

    const erros = [];

    // Validar paciente_id
    if (!paciente_id || isNaN(paciente_id)) {
        erros.push('ID do paciente é obrigatório e deve ser um número');
    }

    // Validar dentista_id
    if (!dentista_id || isNaN(dentista_id)) {
        erros.push('ID do dentista é obrigatório e deve ser um número');
    }

    // Validar data_consulta
    if (!data_consulta) {
        erros.push('Data da consulta é obrigatória');
    } else {
        const data = new Date(data_consulta + 'T00:00:00');
        if (isNaN(data.getTime())) {
            erros.push('Data da consulta inválida');
        }
    }

    // Validar horario
    if (!horario) {
        erros.push('Horário é obrigatório');
    } else {
        const horarioRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horarioRegex.test(horario)) {
            erros.push('Horário inválido (formato HH:MM)');
        }
    }

    // Validar tipo_consulta
    if (!tipo_consulta || tipo_consulta.trim().length < 3) {
        erros.push('Tipo de consulta é obrigatório');
    }

    // Observações são opcionais, não precisa validar

    // Validar status (se fornecido)
    if (req.body.status && !['agendada', 'concluída', 'cancelada'].includes(req.body.status)) {
        erros.push('Status deve ser "agendada", "concluída" ou "cancelada"');
    }

    if (erros.length > 0) {
        throw new AppError('Erro de validação', 400, erros);
    }

    next();
};

// Validador de atualização de consulta
const validateUpdateConsulta = (req, res, next) => {

    const { dentista, data_consulta, horario, tipo_consulta, status } = req.body;

    const erros = [];

    // Validar dentista (se fornecido)
    if (dentista !== undefined && dentista.trim().length < 3) {
        erros.push('Nome do dentista deve ter pelo menos 3 caracteres');
    }

    // Validar data_consulta (se fornecida)
    if (data_consulta !== undefined) {
        const data = new Date(data_consulta);
        if (isNaN(data.getTime())) {
            erros.push('Data da consulta inválida');
        } else if (data < new Date()) {
            erros.push('Data da consulta não pode ser no passado');
        }
    }

    // Validar horario (se fornecido)
    if (horario !== undefined) {
        const horarioRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!horarioRegex.test(horario)) {
            erros.push('Horário inválido (formato HH:MM)');
        }
    }

    // Validar tipo_consulta (se fornecido)
    if (tipo_consulta !== undefined && tipo_consulta.trim().length < 3) {
        erros.push('Tipo de consulta deve ter pelo menos 3 caracteres');
    }

    // Validar status (se fornecido)
    if (status !== undefined && !['agendada', 'concluída', 'cancelada'].includes(status)) {
        erros.push('Status deve ser "agendada", "concluída" ou "cancelada"');
    }

    if (erros.length > 0) {
        throw new AppError('Erro de validação', 400, erros);
    }

    next();
};

// Validador de ID
const validateId = (req, res, next) => {

    // Buscar qualquer parâmetro que termine com '_id' ou seja 'id'
    const idParam = Object.keys(req.params).find(key => key === 'id' || key.endsWith('_id'));
    const id = idParam ? req.params[idParam] : null;

    if (!id || isNaN(id)) {
        throw new AppError('ID inválido', 400, ['O ID deve ser um número válido']);
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateConsulta,
    validateUpdateConsulta,
    validateId
};
