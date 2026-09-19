// Middleware de tratamento de erros padronizado

const errorHandler = (err, req, res, next) => {

    console.error('Erro:', err);

    // Erro de validação do Sequelize/PostgreSQL
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Erro de validação',
            detalhes: err.message
        });
    }

    // Erro de chave única (email duplicado)
    if (err.code === '23505') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Dados duplicados',
            detalhes: 'Este email já está cadastrado'
        });
    }

    // Erro de violação de chave estrangeira
    if (err.code === '23503') {
        return res.status(400).json({
            sucesso: false,
            erro: 'Violação de chave estrangeira',
            detalhes: 'Referência inválida'
        });
    }

    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token inválido',
            detalhes: 'O token fornecido é inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token expirado',
            detalhes: 'O token fornecido expirou'
        });
    }

    // Erro personalizado com status
    if (err.status) {
        return res.status(err.status).json({
            sucesso: false,
            erro: err.message || 'Erro desconhecido',
            detalhes: err.detalhes || null
        });
    }

    // Erro genérico do servidor
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente mais tarde'
    });
};

// Middleware para rotas não encontradas (404)
const notFound = (req, res, next) => {

    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        detalhes: `A rota ${req.method} ${req.originalUrl} não existe`
    });
};

// Classe de erro personalizada
class AppError extends Error {

    constructor(message, status = 500, detalhes = null) {
        super(message);
        this.status = status;
        this.detalhes = detalhes;
        this.name = 'AppError';
    }
}

module.exports = {
    errorHandler,
    notFound,
    AppError
};
