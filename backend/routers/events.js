const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/events — return all events with enrolledUsers arrays
router.get('/', async (req, res) => {
    const [events] = await pool.query('SELECT * FROM events ORDER BY date');
    const [enrollments] = await pool.query('SELECT event_id, username FROM enrollments');

    const enrollMap = {};
    for (const e of enrollments) {
        if (!enrollMap[e.event_id]) enrollMap[e.event_id] = [];
        enrollMap[e.event_id].push(e.username);
    }

    const result = events.map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.date,
        category: ev.category,
        capacity: ev.capacity,
        description: ev.description,
        createdBy: ev.created_by,
        enrolledUsers: enrollMap[ev.id] || [],
    }));

    res.json(result);
});

// POST /api/events — create event
router.post('/', async (req, res) => {
    const { title, date, category, capacity, description, createdBy } = req.body;
    const id = Date.now().toString();
    await pool.query(
        'INSERT INTO events (id, title, date, category, capacity, description, created_by) VALUES (?,?,?,?,?,?,?)',
        [id, title, date, category, capacity, description, createdBy]
    );
    res.status(201).json({ id });
});

// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
    const { username } = req.body;
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    if (rows[0].created_by !== username) return res.status(403).json({ error: 'Not the owner' });

    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
});

// POST /api/events/:id/enroll
router.post('/:id/enroll', async (req, res) => {
    const { username } = req.body;
    try {
        await pool.query('INSERT INTO enrollments (event_id, username) VALUES (?, ?)', [req.params.id, username]);
        res.json({ message: 'Enrolled' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already enrolled' });
        throw err;
    }
});

// POST /api/events/:id/unenroll
router.post('/:id/unenroll', async (req, res) => {
    const { username } = req.body;
    await pool.query('DELETE FROM enrollments WHERE event_id = ? AND username = ?', [req.params.id, username]);
    res.json({ message: 'Unenrolled' });
});

module.exports = router;
