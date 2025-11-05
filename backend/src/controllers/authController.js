const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { validationResult } = require('express-validator');

const authController = {
  // User registration
  async register(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Dados de entrada inválidos',
          errors: errors.array().map(error => ({
            field: error.path,
            message: error.msg
          })),
          requestId: req.requestId
        });
      }

      const { nome, email, senha } = req.body;

      // Check if user already exists
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          message: 'Email já está em uso',
          errors: [{
            field: 'email',
            message: 'Este email já está cadastrado no sistema'
          }],
          requestId: req.requestId
        });
      }

      // Hash password with salt rounds = 10
      const saltRounds = 10;
      const senha_hash = await bcrypt.hash(senha, saltRounds);

      // Create new user
      const newUser = await Usuario.create({
        nome,
        email,
        senha_hash
      });

      // Return success response (without password hash)
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // User login
  async login(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Dados de entrada inválidos',
          errors: errors.array().map(error => ({
            field: error.path,
            message: error.msg
          })),
          requestId: req.requestId
        });
      }

      const { email, senha } = req.body;

      // Find user by email
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          message: 'Credenciais inválidas',
          errors: [{
            field: 'credentials',
            message: 'Email ou senha incorretos'
          }],
          requestId: req.requestId
        });
      }

      // Verify password using bcrypt.compare
      const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Credenciais inválidas',
          errors: [{
            field: 'credentials',
            message: 'Email ou senha incorretos'
          }],
          requestId: req.requestId
        });
      }

      // Generate JWT token with 8-hour expiration
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        nome: user.nome
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'default-secret-key',
        { expiresIn: '8h' }
      );

      // Return success response with token
      res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  }
};

module.exports = authController;