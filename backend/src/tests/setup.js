/**
 * Test setup and configuration
 * This file is run before all tests to set up the testing environment
 */

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// JWT secret for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Global test timeout
jest.setTimeout(30000);

// Mock console.log to reduce noise during tests
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Only log if it's not a database-related message
  if (!args.some(arg => typeof arg === 'string' && arg.includes('database'))) {
    originalConsoleLog(...args);
  }
};