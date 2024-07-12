const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    documentId: { type: String, required: true, unique: true },
    caseNumber: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    plaintiff: { type: String, required: true },
    defendant: { type: String, required: true },
    addressToServe: {
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    documentType: {
        type: String,
        enum: ['Directive Execution', 'Combined Summons', 'Notice of Motion', 'Urgent Application', 'Interlocutory Application'],
        default: 'Directive Execution',
    },
    dateRegistered: { type: Date, default: Date.now },
    serviceStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Served', 'Unserved'],
        default: 'Pending',
    },
    assignedDeputy: { type: mongoose.Schema.Types.ObjectId, ref: 'Deputy' },
    location: {
        type: String,
        enum: ['Office', 'Deputy', 'Client', 'Courier', 'Post'],
        default: 'Office',
    },
    attempts: [
        {
            date: Date,
            time: String,
            notes: String,
            deputy: { type: mongoose.Schema.Types.ObjectId, ref: 'Deputy' },
        },
    ],
    serviceDetails: {
        date: Date,
        time: String,
        method: String,
        deputy: { type: mongoose.Schema.Types.ObjectId, ref: 'Deputy' },
    },
    feesAndExpenses: [
        {
            description: String,
            amount: Number,
        },
    ],
    notes: String,
    additionalDocuments: [String], // Array of file paths/URLs
});

module.exports = mongoose.model('Document', documentSchema);
