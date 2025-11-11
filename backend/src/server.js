require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./app');
const sequelize = require('./config/connection');

// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Test database connection
 * Attempts to authenticate with the database and logs the result
 */
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log(`[${new Date().toISOString()}] ✅ Database connection established successfully`);
    
    // Log database info (without sensitive details)
    const dialect = sequelize.getDialect();
    const dbName = sequelize.getDatabaseName();
    console.log(`[${new Date().toISOString()}] 📊 Connected to ${dialect} database: ${dbName}`);
    
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Unable to connect to database:`, error.message);
    return false;
  }
}

/**
 * Graceful shutdown handler
 * Closes database connections and server gracefully
 */
async function gracefulShutdown(signal) {
  console.log(`[${new Date().toISOString()}] 🛑 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    await sequelize.close();
    console.log(`[${new Date().toISOString()}] 📊 Database connection closed`);
    
    // Exit process
    console.log(`[${new Date().toISOString()}] ✅ Graceful shutdown completed`);
    process.exit(0);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error during shutdown:`, error.message);
    process.exit(1);
  }
}

/**
 * Start the server
 * Tests database connection and starts the Express server
 */
async function startServer() {
  try {
    console.log(`[${new Date().toISOString()}] 🚀 Starting Sistema de Doações API...`);
    console.log(`[${new Date().toISOString()}] 🌍 Environment: ${NODE_ENV}`);
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.error(`[${new Date().toISOString()}] ❌ Failed to connect to database. Exiting...`);
      process.exit(1);
    }
    
    // ✅ Serve the built frontend (React)
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));
    
    // Handle React Router - send all non-API requests to index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] 🎯 Server running on port ${PORT}`);
      console.log(`[${new Date().toISOString()}] 🔗 Health check: http://localhost:${PORT}/health`);
      
      if (NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] 📚 API Documentation will be available at: http://localhost:${PORT}/api-docs`);
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[${new Date().toISOString()}] ❌ Port ${PORT} is already in use`);
      } else {
        console.error(`[${new Date().toISOString()}] ❌ Server error:`, error.message);
      }
      process.exit(1);
    });
    
    // Setup graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error(`[${new Date().toISOString()}] ❌ Uncaught Exception:`, error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error(`[${new Date().toISOString()}] ❌ Unhandled Rejection at:`, promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to start server:`, error.message);
    process.exit(1);
  }
}

// Validate required environment variables
function validateEnvironment() {
  const requiredVars = ['JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`[${new Date().toISOString()}] ❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error(`[${new Date().toISOString()}] 💡 Please check your .env file`);
    process.exit(1);
  }
  
  // Warn about missing optional variables
  if (!process.env.DATABASE_URL && NODE_ENV !== 'test') {
    console.warn(`[${new Date().toISOString()}] ⚠️  DATABASE_URL not set, using local database configuration`);
  }
}

// Start the application
if (require.main === module) {
  validateEnvironment();
  startServer();
}

module.exports = app;