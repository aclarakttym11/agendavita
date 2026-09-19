const express = require('express');

const router = express.Router();

const consultaController = require('../controllers/consultaController');
const auth = require('../middlewares/auth');
const { validateConsulta, validateUpdateConsulta, validateId } = require('../middlewares/validate');
const { isAdminOrConsultaOwner } = require('../middlewares/authorize');

router.post(
    '/',
    auth,
    validateConsulta,
    consultaController.criarConsulta
);

router.get(
    '/',
    auth,
    consultaController.listarConsultas
);

router.get(
    '/semana',
    auth,
    consultaController.listarConsultasSemana
);

router.get(
    '/:id',
    auth,
    validateId,
    consultaController.listarConsultaPorId
);

router.put(
    '/:id',
    auth,
    validateId,
    validateUpdateConsulta,
    consultaController.atualizarConsulta
);

router.patch(
    '/:id/status',
    auth,
    validateId,
    consultaController.atualizarStatus
);

router.delete(
    '/:id',
    auth,
    validateId,
    consultaController.deletarConsulta
);

module.exports = router;