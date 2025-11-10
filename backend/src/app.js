const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

// Import middleware
const {
  loggingMiddleware,
  requestIdMiddleware,
  validationMiddleware,
  errorMiddleware
} = require('./middlewares');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const campanhaRoutes = require('./routes/campanhaRoutes');
const doacaoRoutes = require('./routes/doacaoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');

// Create Express application
const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Configure JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Set up middleware pipeline in correct order
// 1. Request ID middleware (must be first to generate ID for all requests)
app.use(requestIdMiddleware);

// 2. Logging middleware (logs with request ID)
app.use(loggingMiddleware);

// Swagger documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sistema de Doações API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Sistema de Doações API está funcionando',
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// Register API routes with base path
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/campanhas', campanhaRoutes);
app.use('/api', doacaoRoutes); // Donation routes include both /campanhas/:id/doacoes and /doacoes/:id
app.use('/api', comentarioRoutes); // Comment routes include both /campanhas/:id/comentarios and /comentarios/:id

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // 404 handler for undefined routes in development
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Endpoint não encontrado',
      requestId: req.requestId
    });
  });
}

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;