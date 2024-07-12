const CustomError = require('../utils/customError');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            const customError = new CustomError('Not authorized', 403);
            console.error(customError);
            return next(customError);
        }
        next();
    };
};

module.exports = authorizeRoles;
