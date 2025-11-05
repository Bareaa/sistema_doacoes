const jwt = require('jsonwebtoken');

/**
 * Authentication middleware that verifies JWT tokens
 * Extracts user ID from token payload and attaches to request object
 * Handles token validation errors and unauthorized access
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        message: 'Token de acesso requerido',
        requestId: req.requestId
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'Formato de token inválido. Use: Bearer <token>',
        requestId: req.requestId
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request object for use in controllers
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token inválido',
        requestId: req.requestId
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expirado',
        requestId: req.requestId
      });
    }
    
    // Handle other JWT errors
    return res.status(401).json({
      message: 'Erro na autenticação',
      requestId: req.requestId
    });
  }
};

module.exports = authMiddleware;