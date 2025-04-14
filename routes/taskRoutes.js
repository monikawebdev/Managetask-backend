const express = require('express');
const { getTasks, addTask, deleteTask, updateTask } = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');

// Define the routes for tasks
router.get('/', authMiddleware, getTasks); // Get all tasks for the authenticated user
router.post('/', authMiddleware, addTask); // Create a new task for the authenticated user
router.put('/:id', authMiddleware, updateTask); // Update a specific task by ID for the authenticated user
router.delete('/:id', authMiddleware, deleteTask); // Delete a specific task by ID for the authenticated user

module.exports = router;