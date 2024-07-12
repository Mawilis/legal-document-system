const mongoose = require('mongoose');

const deputySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Deputy name is required'], // Custom error message for validation
        trim: true
    },
    office: {
        type: String,
        required: [true, 'Office is required'], // Custom error message for validation
        enum: ['Midrand', 'Sandton', 'Pretoria'] // Replace with your actual office names
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!` // Custom error message
        }
    },
    email: {
        type: String,
        unique: true, // Ensure email is unique
        sparse: true, // Allow null values in unique index
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }], // References to assigned documents
    additionalNotes: String // Field for any extra notes about the deputy
});

module.exports = mongoose.model('Deputy', deputySchema);
