const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate entry found';
    error = { message, status: 400 };
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = { message, status: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, status: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, status: 401 };
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;