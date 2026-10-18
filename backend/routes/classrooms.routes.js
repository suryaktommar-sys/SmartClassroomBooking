
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
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

module.exports = router;
