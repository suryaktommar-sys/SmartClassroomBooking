const express = require('express');
const router = express.Router();

const {
    register,
    login
} = require('../controllers/auth.controller');

const authenticateToken = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);

router.get('/verify', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: req.user
    });
});

module.exports = router;