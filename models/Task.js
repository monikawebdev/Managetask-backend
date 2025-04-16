const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
});

module.exports = mongoose.model('Task', TaskSchema);