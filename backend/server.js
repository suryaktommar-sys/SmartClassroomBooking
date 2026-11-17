
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import Routes
const healthRoutes = require('./routes/health.routes');
const classroomRoutes = require('./routes/classrooms.routes');
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/bookings.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Import Middleware
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));

// Body Parser
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log('INCOMING REQUEST:', req.method, req.originalUrl);
    next();
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Debug: Authentication Routes
console.log(
    'AUTH ROUTES:',
    authRoutes.stack.map(route => ({
        path: route.route?.path,
        methods: route.route?.methods
    }))
);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
