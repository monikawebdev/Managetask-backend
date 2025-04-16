const express = require('express');
const { 
    getTasks, 
    addTask, 
    deleteTask, 
    updateTask,
    updateDueDate,
    updatePriority,
    toggleComplete,
    filterTasks
} = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');

// Define the routes for tasks
// Basic CRUD operations
router.get('/', authMiddleware, getTasks); // Get all tasks for the authenticated user
router.post('/', authMiddleware, addTask); // Create a new task for the authenticated user
router.put('/:id', authMiddleware, updateTask); // Update a specific task by ID for the authenticated user
router.delete('/:id', authMiddleware, deleteTask); // Delete a specific task by ID for the authenticated user

// Additional functionality routes
router.put('/:id/due-date', authMiddleware, updateDueDate); // Update just the due date of a task
router.put('/:id/priority', authMiddleware, updatePriority); // Update just the priority of a task
router.put('/:id/toggle-complete', authMiddleware, toggleComplete); // Toggle completion status
router.get('/filter', authMiddleware, filterTasks); // Filter tasks by priority, completion status, or due date

module.exports = router;