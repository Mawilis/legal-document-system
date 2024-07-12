const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const authenticateJWT = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Validation middleware for user updates
const userUpdateValidationRules = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .trim()
        .normalizeEmail(),
    body('phoneNumber')
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .withMessage('Invalid phone number'),
    // Add more validation rules if needed
];

// GET /api/users/profile/:role/:id - Get user profile (protected)
router.get(
    '/profile/:role/:id',
    authenticateJWT, // Authentication middleware
    authorizeRoles(['admin', 'attorney', 'sheriff']), // Authorization based on role
    userController.getUserProfile
);

// PUT /api/users/:id - Update user profile (protected)
router.put(
    '/:id',
    authenticateJWT,
    authorizeRoles(['admin', 'attorney', 'sheriff']), // Only admins, attorneys, and sheriffs can update
    userUpdateValidationRules,
    userController.updateUserProfile
);

// GET /api/users - Get all users (admin only)
router.get(
    '/',
    authenticateJWT,
    authorizeRoles(['admin']), // Only admins can get all users
    userController.getAllUsers
);

// POST /api/users - Create a new user (admin only)
router.post(
    '/',
    authenticateJWT,
    authorizeRoles(['admin']),
    userUpdateValidationRules,
    userController.createUser
);

// DELETE /api/users/:id - Delete a user (admin only)
router.delete(
    '/:id',
    authenticateJWT,
    authorizeRoles(['admin']),
    userController.deleteUser
);

module.exports = router;
