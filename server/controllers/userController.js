const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const bcrypt = require('bcryptjs'); // For password hashing
const { validationResult } = require('express-validator');

// Get user profile based on role
exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userRole = req.params.role;

        // Check if the logged-in user is accessing their own profile or if they're an admin
        if (userId !== req.user.userId && req.user.role !== 'admin') {
            return next(new CustomError('Not authorized', 403));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        // Customize the returned fields based on the user role
        const profileData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            // Add more fields here as needed for each role
        };

        res.json(profileData);
    } catch (err) {
        next(new CustomError('Error fetching user profile', 500));
    }
};

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;

    try {
        // Check if the logged-in user is updating their own profile or if they're an admin
        if (userId !== req.user.userId && req.user.role !== 'admin') {
            return next(new CustomError('Not authorized', 403));
        }

        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return next(new CustomError('User not found', 404));
        }

        res.json(updatedUser);
    } catch (err) {
        next(new CustomError('Error updating user profile', 500));
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, 'username role'); // Only return username and role for security
        res.json(users);
    } catch (err) {
        next(new CustomError('Error fetching users', 500));
    }
};

// Create a new user (admin only)
exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next(new CustomError('Username already exists', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully', userId: user._id }); // Include userId in response
    } catch (err) {
        next(new CustomError('Error creating user', 500));
    }
};


// Delete a user (admin only)
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return next(new CustomError('User not found', 404));
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(new CustomError('Error deleting user', 500));
    }
};
