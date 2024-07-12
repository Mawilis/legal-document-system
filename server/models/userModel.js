const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['sheriff', 'attorney', 'admin'], // Adjust roles as needed
        default: 'sheriff'
    }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10); // 10 salt rounds (adjust as needed)
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
