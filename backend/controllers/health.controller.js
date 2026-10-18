function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Smart Classroom Booking API is running',
  })
}

module.exports = {
  getHealth,
}
