
const express = require('express');
const router = express.Router();

const db = require('../config/db');
const authenticateToken = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

// GET: Admin can view all bookings; faculty can view their own.
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    let sql = `
      SELECT b.*, u.name AS user_name, c.room_name
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN classrooms c ON b.classroom_id = c.classroom_id
    `;

    const params = [];

    if (req.user.role !== 'admin') {
      sql += ' WHERE b.user_id = ?';
      params.push(req.user.userId);
    }

    sql += ' ORDER BY b.booking_date DESC, b.start_time DESC';

    const [bookings] = await db.query(sql, params);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// POST: Create a classroom booking.
router.post('/', authenticateToken, async (req, res, next) => {
  let connection;

  try {
    const { classroom_id, booking_date, start_time, end_time } = req.body;

    if (!classroom_id || !booking_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields are required.'
      });
    }

    if (!Number.isInteger(Number(classroom_id)) || Number(classroom_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid classroom ID.'
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking date.'
      });
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(start_time) ||
        !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(end_time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking time.'
      });
    }

    if (end_time <= start_time) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time.'
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lock the classroom row while checking for overlapping bookings.
    const [rooms] = await connection.query(
      'SELECT classroom_id FROM classrooms WHERE classroom_id = ? FOR UPDATE',
      [Number(classroom_id)]
    );

    if (rooms.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Classroom not found.'
      });
    }

    const [dateCheck] = await connection.query(
      `SELECT (
        ? < CURDATE()
        OR (? = CURDATE() AND ? <= CURTIME())
      ) AS is_past`,
      [booking_date, booking_date, start_time]
    );

    if (dateCheck[0].is_past) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please select a future date and time.'
      });
    }

    // Pending and approved bookings both reserve the time slot.
    const [conflicts] = await connection.query(
      `SELECT booking_id FROM bookings
       WHERE classroom_id = ?
       AND booking_date = ?
       AND status IN ('pending', 'approved')
       AND start_time < ?
       AND end_time > ?
       LIMIT 1`,
      [Number(classroom_id), booking_date, end_time, start_time]
    );

    if (conflicts.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'This classroom is already booked for the selected time.'
      });
    }

    const [result] = await connection.query(
      `INSERT INTO bookings
       (user_id, classroom_id, booking_date, start_time, end_time)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        Number(classroom_id),
        booking_date,
        start_time,
        end_time
      ]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully.',
      booking_id: result.insertId,
      status: 'pending'
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
});

// PATCH: Faculty can cancel their own pending booking.
router.patch('/:id/cancel', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID.'
      });
    }

    const [result] = await db.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE booking_id = ?
       AND user_id = ?
       AND status = 'pending'`,
      [Number(id), req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pending booking not found.'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: Admin can approve or reject a booking.
router.patch('/:id/status', authenticateToken, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID.'
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved or rejected.'
      });
    }

    const [result] = await db.query(
      `UPDATE bookings
       SET status = ?
       WHERE booking_id = ?
       AND status = 'pending'`,
      [status, Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pending booking not found.'
      });
    }

    res.json({
      success: true,
      message: `Booking ${status} successfully.`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
