/**
 * Integration tests for authentication endpoints
 */

const request = require('supertest');
const app = require('../../app');
const { cleanDatabase } = require('../helpers/testUtils');

// Load integration test setup
require('./setup');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'password123'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário registrado com sucesso');
      expect(response.body.usuario).toBeDefined();
      expect(response.body.usuario.email).toBe(validUserData.email);
      expect(response.body.usuario.nome).toBe(validUserData.nome);
      expect(response.body.usuario.senha_hash).toBeUndefined(); // Should not return password
    });

    it('should return error for duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('já está em uso');
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        nome: '',
        email: 'invalid-email',
        senha: '123' // Too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      nome: 'Test User',
      email: 'test@example.com',
      senha: 'password123'
    };

    beforeEach(async () => {
      // Register user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          senha: userData.senha
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.token).toBeDefined();
      expect(response.body.usuario).toBeDefined();
      expect(response.body.usuario.email).toBe(userData.email);
      expect(response.body.usuario.senha_hash).toBeUndefined();
    });

    it('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          senha: userData.senha
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Credenciais inválidas');
    });

    it('should return error for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          senha: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Credenciais inválidas');
    });

    it('should return validation errors for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});