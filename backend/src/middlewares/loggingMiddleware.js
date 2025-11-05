/**
 * Logging middleware that logs all incoming requests
 * Includes timestamp, HTTP method, URL, and request ID
 */
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const requestId = req.requestId || 'no-id';
  
  console.log(`[${timestamp}] ${method} ${url} - Request ID: ${requestId}`);
  
  next();
};

module.exports = loggingMiddleware;