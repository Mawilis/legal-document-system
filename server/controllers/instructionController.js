const Instruction = require('../models/instructionModel');
const CustomError = require('../utils/customError');

// Get all instructions (filtered by user role)
exports.getAllInstructions = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        let query = {};
        if (userRole === 'attorney') {
            query.attorney = req.user.userId;
        } else if (userRole === 'sheriff') {
            query.sheriff = req.user.userId;
        }

        const instructions = await Instruction.find(query)
            .populate('attorney', 'name email')
            .populate('sheriff', 'name email')
            .populate('document', 'documentId caseNumber');

        res.json(instructions);
    } catch (err) {
        next(new CustomError('Error fetching instructions', 500));
    }
};

// Get a single instruction by ID
exports.getInstructionById = async (req, res, next) => {
    try {
        const instruction = await Instruction.findById(req.params.id)
            .populate('attorney', 'name email')
            .populate('sheriff', 'name email')
            .populate('document', 'documentId caseNumber');

        if (!instruction) {
            return next(new CustomError('Instruction not found', 404));
        }

        res.json(instruction);
    } catch (err) {
        next(new CustomError('Error fetching instruction', 500));
    }
};

// Create a new instruction (attorney only)
exports.createInstruction = async (req, res, next) => {
    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized', 403));
        }

        const { document, instructions, dueDate, priority } = req.body;
        const attorney = req.user.userId;

        const newInstruction = await Instruction.create({
            attorney,
            document,
            instructions,
            dueDate,
            priority,
        });
        res.status(201).json(newInstruction);
    } catch (err) {
        next(new CustomError('Error creating instruction', 500));
    }
};

// Update an instruction (attorney only)
exports.updateInstruction = async (req, res, next) => {
    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized', 403));
        }

        const updatedInstruction = await Instruction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedInstruction) {
            return next(new CustomError('Instruction not found', 404));
        }

        res.json(updatedInstruction);
    } catch (err) {
        next(new CustomError('Error updating instruction', 500));
    }
};

// Delete an instruction (attorney only)
exports.deleteInstruction = async (req, res, next) => {
    try {
        if (req.user.role !== 'attorney') {
            return next(new CustomError('Not authorized', 403));
        }

        const deletedInstruction = await Instruction.findByIdAndDelete(req.params.id);
        if (!deletedInstruction) {
            return next(new CustomError('Instruction not found', 404));
        }

        res.json({ message: 'Instruction deleted' });
    } catch (err) {
        next(new CustomError('Error deleting instruction', 500));
    }
};
