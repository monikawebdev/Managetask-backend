const mongoose = require('mongoose'); // Ensure mongoose is imported
const Task = require('../models/Task');

// Create Task
exports.addTask = async (req, res) => {
    const { title } = req.body;

    // Validate input
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const task = new Task({ title, user: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Get Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        // Find the task and verify ownership
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task
        task.title = req.body.title || task.title; // Only update the title if provided
        await task.save();

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        // Find the task and verify ownership
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send(); // No content for successful deletion
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Due Date
exports.updateDueDate = async (req, res) => {
    const { id } = req.params; // Task ID from URL
    const { dueDate } = req.body; // Due date from request body

    // Debugging logs
    console.log('Task ID:', id);
    console.log('Due Date:', dueDate);
    console.log('Authenticated User ID:', req.user?.id);

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid Task ID:', id); // Additional log
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    // Validate input
    if (!dueDate) {
        console.log('Due date is missing'); // Additional log
        return res.status(400).json({ message: 'Due date is required' });
    }

    if (isNaN(new Date(dueDate).getTime())) {
        console.log('Invalid due date format:', dueDate); // Additional log
        return res.status(400).json({ message: 'Invalid due date format' });
    }

    try {
        // Query the database
        const task = await Task.findOne({ _id: id, user: req.user.id });
        console.log('Task Query Result:', task); // Additional log

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the due date
        task.dueDate = new Date(dueDate);
        await task.save();

        res.status(200).json({ message: 'Due date updated successfully', task });
    } catch (err) {
        console.error('Error in updateDueDate:', err.message); // Log the error
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Priority
exports.updatePriority = async (req, res) => {
    try {
        const { priority } = req.body;
        
        if (!priority || !['High', 'Medium', 'Low'].includes(priority)) {
            return res.status(400).json({ message: 'Valid priority (High, Medium, Low) is required' });
        }
        
        // Find the task and verify ownership
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the priority
        task.priority = priority;
        await task.save();

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Toggle Task Completion
exports.toggleComplete = async (req, res) => {
    try {
        // Find the task and verify ownership
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Toggle the completion status
        task.isCompleted = !task.isCompleted;
        await task.save();

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Filter Tasks
exports.filterTasks = async (req, res) => {
    try {
        const { priority, completed, dueDate } = req.query;
        const filter = { user: req.user.id };
        
        // Add filters based on query parameters
        if (priority) {
            filter.priority = priority;
        }
        
        if (completed !== undefined) {
            filter.isCompleted = completed === 'true';
        }
        
        if (dueDate) {
            // Filter by due date
            // For "today" filter
            if (dueDate === 'today') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                filter.dueDate = {
                    $gte: today,
                    $lt: tomorrow
                };
            } 
            // For "week" filter (next 7 days)
            else if (dueDate === 'week') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextWeek = new Date(today);
                nextWeek.setDate(nextWeek.getDate() + 7);
                
                filter.dueDate = {
                    $gte: today,
                    $lt: nextWeek
                };
            }
            // For specific date
            else {
                const specificDate = new Date(dueDate);
                specificDate.setHours(0, 0, 0, 0);
                const nextDay = new Date(specificDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                filter.dueDate = {
                    $gte: specificDate,
                    $lt: nextDay
                };
            }
        }
        
        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};