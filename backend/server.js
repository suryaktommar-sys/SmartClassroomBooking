const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const healthRoutes = require('./routes/health.routes')
const classroomRoutes = require('./routes/classrooms.routes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = [
    'http://localhost:5173',
    'https://smart-classroom-booking.vercel.app'
];

app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api/classrooms', classroomRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`)
})
