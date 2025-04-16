const express = require('express');
require('dotenv').config();
const connectDB = require('./models/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptionsDelegate = require('./middleware/corsOptionsDelegate');

// Initialize the app
const app = express();

// Connect to the database
connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the process if DB connection fails
    });

// Middleware
app.use(cors(corsOptionsDelegate)); // Enable CORS with custom options
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/auth', require('./routes/userRoutes')); // Routes for authentication
app.use('/api/task', require('./routes/taskRoutes')); // Routes for tasks

// Root route
app.get('/', (req, res) => {
    res.send(`
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:Arial, sans-serif;">
            <h1>Server Running</h1>
            <title>Task {Backend}</title>
        </div>
    `);
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));