const express = require('express');
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router()

router.route('/')
    .post(loginLimiter, authController.handleLogin)

router.route('/refresh')
    .get(authController.handleRefresh)

router.route('/check-auth')
    .get(verifyJWT, (req, res) => {
        res.json({ loggedIn: true });
    });

router.route('/logout')
    .post(authController.handleLogout)

module.exports = router;