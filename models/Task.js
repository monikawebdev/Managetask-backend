const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);