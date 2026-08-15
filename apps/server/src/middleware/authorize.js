// Middleware to restrict access based on user roles (...roles)
import ApiError from '../utils/ApiError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized, user missing from request'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};

export default authorize;
