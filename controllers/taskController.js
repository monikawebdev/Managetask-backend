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