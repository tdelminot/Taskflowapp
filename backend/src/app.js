const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { globalLimiter, authLimiter, apiLimiter } = require('./middlewares/rateLimit.middleware');
const path = require('path');
// Import routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const commentRoutes = require('./routes/comment.routes');
const uploadRoutes = require('./routes/upload.routes');


dotenv.config();

const { sequelize } = require('./models');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
// Global rate limit on all API endpoints
app.use('/api/', globalLimiter.middleware());

// Stricter rate limit for auth endpoints
app.use('/api/auth/', authLimiter.middleware());



// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

 
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', commentRoutes);
app.use('/api', uploadRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TaskFlow API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully');
        
        // Sync database (development only)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ force: true });
            console.log('✅ Database synced');
        }
        
       /* app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        }); */
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;