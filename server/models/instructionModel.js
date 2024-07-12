const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
    attorney: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Attorney is required']
    },
    sheriff: { // Added to track the assigned sheriff
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: [true, 'Document is required']
    },
    instructions: {
        type: String,
        required: [true, 'Instructions are required']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    priority: {
        type: String,
        enum: ['Normal', 'Urgent'],
        default: 'Normal'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Unserved'], // Added 'Unserved'
        default: 'Pending'
    },
    notes: String,
    additionalFiles: [String],
    createdAt: { type: Date, default: Date.now }, // Added timestamps
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update updatedAt field before saving
instructionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Instruction', instructionSchema);
