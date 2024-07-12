const Document = require('../models/documentModel');
const Client = require('../models/clientModel');
const Deputy = require('../models/deputyModel');
const CustomError = require('../utils/customError');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAllDocuments = async (req, res, next) => {
    // ... (same as in previous response) ...
};

exports.createDocument = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized', 403));
        }

        // Additional input validation based on the reference document
        const { documentId, client, plaintiff, defendant, addressToServe, documentType } = req.body;

        // Check if client, plaintiff, and defendant exist
        if (!mongoose.Types.ObjectId.isValid(client)) {
            return next(new CustomError('Invalid client ID', 400));
        }

        const clientExists = await Client.exists({ _id: client });
        if (!clientExists) {
            return next(new CustomError('Client not found', 404));
        }

        // You can add similar checks for plaintiff and defendant if they are references to other models

        // Validate addressToServe fields

        if (!addressToServe.addressLine1 || !addressToServe.city || !addressToServe.province || !addressToServe.postalCode) {
            return next(new CustomError('Incomplete address', 400));
        }

        const newDocument = await Document.create(req.body);
        res.status(201).json(newDocument);
    } catch (err) {
        next(new CustomError('Error creating document', 500));
    }
};

exports.getDocumentById = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.documentId)
            .populate('client', 'name email phoneNumber')
            .populate('assignedDeputy', 'name phoneNumber office');

        if (!document) {
            return next(new CustomError('Document not found', 404));
        }

        res.json(document);
    } catch (err) {
        next(new CustomError('Error fetching document', 500));
    }
};


exports.updateDocument = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized', 403));
        }
        const documentId = req.params.documentId;
        const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDocument) {
            return next(new CustomError('Document not found', 404));
        }

        res.status(200).json(updatedDocument); // Return the updated document
    } catch (error) {
        next(new CustomError('Error updating document', 500));
    }
};
exports.deleteDocument = async (req, res, next) => {
    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized to delete document', 403));
        }

        const documentId = req.params.documentId;

        const deletedDocument = await Document.findByIdAndRemove(documentId);

        if (!deletedDocument) {
            return next(new CustomError('Document not found', 404));
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        next(new CustomError('Error deleting document', 500));
    }
};
