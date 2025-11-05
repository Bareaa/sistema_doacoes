/**
 * Centralized error handling middleware
 * Processes all errors and returns standardized error responses
 * Must be the last middleware in the Express application
 */
const errorMiddleware = (error, req, res, next) => {
  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] Error in request ${req.requestId}:`, error);
  
  // Default error response
  let statusCode = 500;
  let message = 'Erro interno do servidor';
  let errors = [];

  // Handle Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Erro de validação';
    errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
  }
  
  // Handle Sequelize unique constraint errors
  else if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Dados duplicados';
    errors = error.errors.map(err => ({
      field: err.path,
      message: `${err.path} já existe`
    }));
  }
  
  // Handle Sequelize foreign key constraint errors
  else if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Referência inválida';
    errors = [{
      field: error.fields[0],
      message: 'Referência não encontrada'
    }];
  }
  
  // Handle custom application errors
  else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
    if (error.errors) {
      errors = error.errors;
    }
  }
  
  // Handle JWT errors (should be caught by authMiddleware, but just in case)
  else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Erro de autenticação';
  }

  // Send error response
  const errorResponse = {
    message,
    requestId: req.requestId || 'unknown'
  };

  // Only include errors array if it has content
  if (errors.length > 0) {
    errorResponse.errors = errors;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorMiddleware;