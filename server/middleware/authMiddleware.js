const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError'); // Assuming you put customError.js in utils
const secretKey = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                let customError;
                if (err.name === 'JsonWebTokenError') {
                    customError = new CustomError('Invalid token', 403);
                } else if (err.name === 'TokenExpiredError') {
                    customError = new CustomError('Token expired', 401);
                } else {
                    customError = new CustomError('Authentication failed', 401);
                }
                console.error(customError); // Log the error
                return next(customError); // Pass error to error handling middleware
            }
            req.user = decodedToken;
            next();
        });
    } else {
        const customError = new CustomError('No token provided', 401);
        console.error(customError);
        return next(customError);
    }
};

module.exports = authenticateJWT;
