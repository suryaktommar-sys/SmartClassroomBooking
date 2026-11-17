
const express = require('express');
const router = express.Router();

const db = require('../config/db');
const authenticateToken = require('../middleware/auth.middleware');

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';

    const bookingFilter = isAdmin ? '' : 'WHERE user_id = ?';
    const params = isAdmin ? [] : [req.user.userId];

    const [classroomCount] = await db.query(
      'SELECT COUNT(*) AS total FROM classrooms'
    );

    const [pendingCount] = await db.query(
      `SELECT COUNT(*) AS total FROM bookings
       ${bookingFilter}
       ${isAdmin ? "WHERE status = 'pending'" : "AND status = 'pending'"}`,
      params
    );

    const [approvedCount] = await db.query(
      `SELECT COUNT(*) AS total FROM bookings
       ${bookingFilter}
       ${isAdmin ? "WHERE status = 'approved'" : "AND status = 'approved'"}`,
      params
    );

    const [recentBookings] = await db.query(
      `SELECT b.*, u.name AS user_name, c.room_name
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN classrooms c ON b.classroom_id = c.classroom_id
       ${isAdmin ? '' : 'WHERE b.user_id = ?'}
       ORDER BY b.created_at DESC
       LIMIT 5`,
      params
    );

    const [availableCount] = await db.query(
      `SELECT COUNT(*) AS total
       FROM classrooms c
       WHERE NOT EXISTS (
         SELECT 1 FROM bookings b
         WHERE b.classroom_id = c.classroom_id
         AND b.booking_date = CURDATE()
         AND b.status IN ('pending', 'approved')
         AND b.start_time <= CURTIME()
         AND b.end_time > CURTIME()
       )`
    );

    res.json({
      success: true,
      data: {
        totalClassrooms: classroomCount[0].total,
        availableClassrooms: availableCount[0].total,
        pendingBookings: pendingCount[0].total,
        approvedBookings: approvedCount[0].total,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
