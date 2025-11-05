const { validationResult } = require('express-validator');

/**
 * Validation middleware that checks express-validator results
 * Returns standardized error response format for validation failures
 * Should be used after express-validator validation chains
 */
const validationMiddleware = (req, res, next) => {
  // Get validation results from express-validator
  const errors = validationResult(req);
  
  // If there are validation errors, return standardized error response
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return res.status(400).json({
      message: 'Dados de entrada inválidos',
      errors: formattedErrors,
      requestId: req.requestId
    });
  }
  
  // If validation passes, continue to next middleware
  next();
};

module.exports = validationMiddleware;