const express = require('express');

const router = express.Router();

const disponibilidadeController = require('../controllers/disponibilidadeController');
const auth = require('../middlewares/auth');
const { validateId } = require('../middlewares/validate');
const { isAdminOrDentista } = require('../middlewares/authorize');

router.post(
    '/',
    auth,
    isAdminOrDentista,
    disponibilidadeController.create
);

router.get(
    '/dentista/:dentista_id',
    auth,
    validateId,
    disponibilidadeController.getByDentista
);

router.get(
    '/dentista/:dentista_id/available',
    auth,
    validateId,
    disponibilidadeController.getAvailableSlots
);

router.put(
    '/:id',
    auth,
    isAdminOrDentista,
    validateId,
    disponibilidadeController.update
);

router.delete(
    '/:id',
    auth,
    isAdminOrDentista,
    validateId,
    disponibilidadeController.delete
);

module.exports = router;
