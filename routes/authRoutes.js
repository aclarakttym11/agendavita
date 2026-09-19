const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorize');
const { validateRegister, validateLogin } = require('../middlewares/validate');

router.post(
    '/register',
    validateRegister,
    authController.register
);

router.post(
    '/login',
    validateLogin,
    authController.login
);

router.get(
    '/profile',
    auth,
    authController.getProfile
);

router.get(
    '/users',
    auth,
    isAdmin,
    authController.getAllUsers
);

module.exports = router;