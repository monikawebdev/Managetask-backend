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
connectDB();

// Middleware
app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate)); // Handle preflight requests for all routes
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send(`
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:Arial, sans-serif;">
            <h1>Server Running</h1>
            <title>Task {Backend}</title>
        </div>
    `);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));