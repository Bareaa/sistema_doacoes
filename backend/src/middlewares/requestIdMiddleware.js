const { v4: uuidv4 } = require('uuid');

/**
 * Request ID middleware that assigns a unique identifier to each request
 * Uses UUID v4 for unique tracking across the application
 */
const requestIdMiddleware = (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  
  // Add request ID to response headers for client tracking
  res.setHeader('X-Request-ID', req.requestId);
  
  next();
};

module.exports = requestIdMiddleware;