
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const authenticateToken = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

// Validate classroom ID
const validId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

// GET: View all classrooms (Faculty + Admin)
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const [classrooms] = await db.query(
            'SELECT * FROM Classrooms ORDER BY classroom_id DESC'
        );

        res.json({
            success: true,
            count: classrooms.length,
            data: classrooms
        });
    } catch (error) {
        next(error);
    }
});

// POST: Add classroom (Admin only)
router.post('/', authenticateToken, adminOnly, async (req, res, next) => {
    try {
        const { room_name, capacity, location } = req.body;

        if (!room_name || !room_name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Room name is required'
            });
        }

        if (room_name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Room name cannot exceed 100 characters'
            });
        }

        if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Capacity must be a positive whole number'
            });
        }

        if (location && location.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: 'Location cannot exceed 150 characters'
            });
        }

        const [result] = await db.query(
            'INSERT INTO Classrooms (room_name, capacity, location) VALUES (?, ?, ?)',
            [room_name.trim(), Number(capacity), location?.trim() || null]
        );

        res.status(201).json({
            success: true,
            message: 'Classroom added successfully',
            classroom_id: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'A classroom with this name already exists'
            });
        }
        next(error);
    }
});

// PUT: Update classroom (Admin only)
router.put('/:id', authenticateToken, adminOnly, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { room_name, capacity, location } = req.body;

        if (!validId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid classroom ID'
            });
        }

        if (!room_name || !room_name.trim() || room_name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Valid room name is required (maximum 100 characters)'
            });
        }

        if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Capacity must be a positive whole number'
            });
        }

        if (location && location.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: 'Location cannot exceed 150 characters'
            });
        }

        const [result] = await db.query(
            `UPDATE Classrooms
             SET room_name = ?, capacity = ?, location = ?
             WHERE classroom_id = ?`,
            [room_name.trim(), Number(capacity), location?.trim() || null, Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Classroom not found'
            });
        }

        res.json({
            success: true,
            message: 'Classroom updated successfully'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'A classroom with this name already exists'
            });
        }
        next(error);
    }
});

// DELETE: Delete classroom (Admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid classroom ID'
            });
        }

        const [result] = await db.query(
            'DELETE FROM Classrooms WHERE classroom_id = ?',
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Classroom not found'
            });
        }

        res.json({
            success: true,
            message: 'Classroom deleted successfully'
        });

    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' ||
            error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                success: false,
                message: 'This classroom has existing bookings and cannot be deleted'
            });
        }
        next(error);
    }
});

module.exports = router;
