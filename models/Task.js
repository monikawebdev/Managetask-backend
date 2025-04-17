const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dueDate: { type: Date }, // Ensure this is a Date type
    priority: { type: String, enum: ['High', 'Medium', 'Low'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this is ObjectId
    isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', taskSchema);