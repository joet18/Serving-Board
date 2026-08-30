const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Both fields required' });

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length) return res.status(409).json({ error: 'Username already taken!' });

        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ message: 'Account created! You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid username or password' });

    res.json({ username: rows[0].username });
});

module.exports = router;
