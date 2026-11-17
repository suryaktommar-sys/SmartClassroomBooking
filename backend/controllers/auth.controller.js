
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Faculty Registration
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Public registration always creates a faculty account.
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name.trim(), normalizedEmail, passwordHash, 'faculty']
        );

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');

            return res.status(500).json({
                success: false,
                message: 'Server authentication configuration error'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await db.query(
            'SELECT user_id, name, email, password_hash, role FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

module.exports = {
    register,
    login
};
