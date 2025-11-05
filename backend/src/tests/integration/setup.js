/**
 * Integration test setup - includes database connection
 */

const { sequelize } = require('../../models');

// Test database configuration - use SQLite in memory for testing
process.env.TEST_DB_NAME = ':memory:';

// Override sequelize configuration for testing
const { Sequelize } = require('sequelize');

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  define: {
    timestamps: true
  }
});

// Replace the sequelize instance in models
const models = require('../../models');
models.sequelize = testSequelize;

// Re-initialize models with test database
const fs = require('fs');
const path = require('path');

// Clear existing models
Object.keys(models).forEach(key => {
  if (key !== 'sequelize' && key !== 'Sequelize') {
    delete models[key];
  }
});

// Re-load models with test sequelize
fs.readdirSync(path.join(__dirname, '../../models'))
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, '../../models', file))(testSequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Setup database before all integration tests
beforeAll(async () => {
  try {
    // Test database connection
    await testSequelize.authenticate();
    
    // Sync database (create tables)
    await testSequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to connect to test database:', error);
    throw error;
  }
});

// Cleanup after all integration tests
afterAll(async () => {
  try {
    // Close database connection
    await testSequelize.close();
  } catch (error) {
    console.error('Error closing test database connection:', error);
  }
});

module.exports = { testSequelize };