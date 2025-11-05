// Export all middleware functions for easier importing
const authMiddleware = require('./authMiddleware');
const errorMiddleware = require('./errorMiddleware');
const loggingMiddleware = require('./loggingMiddleware');
const requestIdMiddleware = require('./requestIdMiddleware');
const validationMiddleware = require('./validationMiddleware');

module.exports = {
  authMiddleware,
  errorMiddleware,
  loggingMiddleware,
  requestIdMiddleware,
  validationMiddleware
};