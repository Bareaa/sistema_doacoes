/**
 * Integration tests for categoria CRUD operations
 */

const request = require('supertest');
const app = require('../../app');
const { cleanDatabase, createAuthenticatedUser, createTestCategory } = require('../helpers/testUtils');

// Load integration test setup
require('./setup');

describe('Categoria CRUD Operations', () => {
  let authUser, authToken;

  beforeEach(async () => {
    await cleanDatabase();
    const authData = await createAuthenticatedUser();
    authUser = authData.user;
    authToken = authData.token;
  });

  describe('GET /api/categorias', () => {
    it('should list all categories (public access)', async () => {
      // Create test categories
      await createTestCategory({ nome: 'Saúde', descricao: 'Campanhas de saúde' });
      await createTestCategory({ nome: 'Educação', descricao: 'Campanhas educacionais' });

      const response = await request(app)
        .get('/api/categorias');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBeDefined();
      expect(response.body[0].descricao).toBeDefined();
    });

    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categorias');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/categorias', () => {
    const validCategoryData = {
      nome: 'Nova Categoria',
      descricao: 'Descrição da nova categoria'
    };

    it('should create category with authentication', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe(validCategoryData.nome);
      expect(response.body.descricao).toBe(validCategoryData.descricao);
      expect(response.body.id).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .send(validCategoryData);

      expect(response.status).toBe(401);
    });

    it('should return validation errors for invalid data', async () => {
      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: '', descricao: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error for duplicate category name', async () => {
      // Create first category
      await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCategoryData);

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/categorias/:id', () => {
    it('should get category by ID (public access)', async () => {
      const category = await createTestCategory();

      const response = await request(app)
        .get(`/api/categorias/${category.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(category.id);
      expect(response.body.nome).toBe(category.nome);
      expect(response.body.descricao).toBe(category.descricao);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categorias/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/categorias/:id', () => {
    let category;

    beforeEach(async () => {
      category = await createTestCategory();
    });

    it('should update category with authentication', async () => {
      const updateData = {
        nome: 'Categoria Atualizada',
        descricao: 'Descrição atualizada'
      };

      const response = await request(app)
        .put(`/api/categorias/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(updateData.nome);
      expect(response.body.descricao).toBe(updateData.descricao);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put(`/api/categorias/${category.id}`)
        .send({ nome: 'Updated' });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .put('/api/categorias/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ nome: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/categorias/:id', () => {
    let category;

    beforeEach(async () => {
      category = await createTestCategory();
    });

    it('should delete category with authentication', async () => {
      const response = await request(app)
        .delete(`/api/categorias/${category.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify category is deleted
      const getResponse = await request(app)
        .get(`/api/categorias/${category.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/api/categorias/${category.id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .delete('/api/categorias/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});