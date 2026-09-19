const express = require('express');

const router = express.Router();

const dentistaController = require('../controllers/dentistaController');
const auth = require('../middlewares/auth');
const { validateId } = require('../middlewares/validate');
const { isAdmin } = require('../middlewares/authorize');

// Rotas públicas (com autenticação)
router.get(
    '/',
    auth,
    dentistaController.listarDentistas
);

router.get(
    '/:id',
    auth,
    validateId,
    dentistaController.listarDentistaPorId
);

router.get(
    '/especialidade/:especialidade',
    auth,
    dentistaController.listarPorEspecialidade
);

// Rotas específicas para dentistas
router.get(
    '/:dentista_id/pacientes-do-dia',
    auth,
    validateId,
    dentistaController.getPacientesDoDia
);

router.get(
    '/:dentista_id/agenda',
    auth,
    validateId,
    dentistaController.getAgenda
);

// Rotas de admin apenas
router.post(
    '/',
    auth,
    isAdmin,
    dentistaController.criarDentista
);

router.put(
    '/:id',
    auth,
    isAdmin,
    validateId,
    dentistaController.atualizarDentista
);

router.delete(
    '/:id',
    auth,
    isAdmin,
    validateId,
    dentistaController.deletarDentista
);

module.exports = router;
