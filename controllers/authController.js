const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { AppError } = require('../middlewares/errorHandler');

exports.register = async (req, res, next) => {

    try {

        const { nome, email, senha, telefone, role } = req.body;

        const hash = await bcrypt.hash(senha, 10);

        const result = await User.create(nome, email, hash, telefone, role || 'cliente');

        res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: result.rows[0].id,
                nome: result.rows[0].nome,
                email: result.rows[0].email,
                telefone: result.rows[0].telefone,
                role: result.rows[0].role
            }
        });

    } catch (err) {

        next(err);
    }
};

exports.login = async (req, res, next) => {

    try {

        const { email, senha } = req.body;

        const result = await User.findByEmail(email);

        if (result.rows.length === 0) {

            throw new AppError('Usuário não encontrado', 404);
        }

        const user = result.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            user.senha
        );

        if (!senhaValida) {

            throw new AppError('Senha inválida', 401);
        }

        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            sucesso: true,
            token,
            usuario: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        next(err);
    }
};

exports.getProfile = async (req, res, next) => {

    try {

        const result = await User.findById(req.user.id);

        if (result.rows.length === 0) {

            throw new AppError('Usuário não encontrado', 404);
        }

        res.json({
            sucesso: true,
            usuario: result.rows[0]
        });

    } catch (err) {

        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {

    try {

        const result = await User.getAll();

        res.json({
            sucesso: true,
            usuarios: result.rows
        });

    } catch (err) {

        next(err);
    }
};