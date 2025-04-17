const mongoose = require('mongoose');
const Task = require('../models/Task');

// Create Task
exports.addTask = async (req, res) => {
    const { title, dueDate, priority } = req.body;

    // Validate input
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (priority && !['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({ message: 'Priority must be one of High, Medium, or Low' });
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
    }

    try {
        const task = new Task({
            title,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            priority: priority || 'High,Medium,Low',
            user: req.user.id,
        });
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
    const { title, dueDate, priority } = req.body;

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (title) task.title = title;
        if (dueDate) {
            if (isNaN(new Date(dueDate).getTime())) {
                return res.status(400).json({ message: 'Invalid due date format' });
            }
            task.dueDate = new Date(dueDate);
        }
        if (priority && ['High', 'Medium', 'Low'].includes(priority)) {
            task.priority = priority;
        }

        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Due Date
exports.updateDueDate = async (req, res) => {
    const { dueDate } = req.body;

    if (!dueDate) {
        return res.status(400).json({ message: 'Due date is required' });
    }

    if (isNaN(new Date(dueDate).getTime())) {
        return res.status(400).json({ message: 'Invalid due date format' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.dueDate = new Date(dueDate);
        await task.save();

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// Update Priority
exports.updatePriority = async (req, res) => {
    const { priority } = req.body;

    if (!priority || !['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({ message: 'Priority must be one of High, Medium, or Low' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

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
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

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

        if (priority) {
            filter.priority = priority;
        }

        if (completed !== undefined) {
            filter.isCompleted = completed === 'true';
        }

        if (dueDate) {
            if (dueDate === 'today') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                filter.dueDate = { $gte: today, $lt: tomorrow };
            } else if (dueDate === 'week') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const nextWeek = new Date(today);
                nextWeek.setDate(nextWeek.getDate() + 7);

                filter.dueDate = { $gte: today, $lt: nextWeek };
            } else {
                const specificDate = new Date(dueDate);
                specificDate.setHours(0, 0, 0, 0);
                const nextDay = new Date(specificDate);
                nextDay.setDate(nextDay.getDate() + 1);

                filter.dueDate = { $gte: specificDate, $lt: nextDay };
            }
        }

        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};