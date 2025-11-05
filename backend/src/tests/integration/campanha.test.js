/**
 * Integration tests for campanha CRUD operations
 */

const request = require('supertest');
const app = require('../../app');
const { 
  cleanDatabase, 
  createAuthenticatedUser, 
  createTestCategory,
  createTestCampaign 
} = require('../helpers/testUtils');

// Load integration test setup
require('./setup');

describe('Campanha CRUD Operations', () => {
  let authUser, authToken, category;

  beforeEach(async () => {
    await cleanDatabase();
    const authData = await createAuthenticatedUser();
    authUser = authData.user;
    authToken = authData.token;
    category = await createTestCategory();
  });

  describe('GET /api/campanhas', () => {
    it('should list all campaigns (public access)', async () => {
      // Create test campaigns
      await createTestCampaign({ usuario_id: authUser.id, categoria_id: category.id });
      await createTestCampaign({ 
        titulo: 'Segunda Campanha',
        usuario_id: authUser.id, 
        categoria_id: category.id 
      });

      const response = await request(app)
        .get('/api/campanhas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].titulo).toBeDefined();
      expect(response.body[0].Usuario).toBeDefined(); // Should include user data
      expect(response.body[0].Categoria).toBeDefined(); // Should include category data
    });

    it('should return empty array when no campaigns exist', async () => {
      const response = await request(app)
        .get('/api/campanhas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /api/campanhas', () => {
    const validCampaignData = {
      titulo: 'Nova Campanha',
      descricao: 'Descrição da nova campanha',
      meta_arrecadacao: 1000.00,
      data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      categoria_id: null // Will be set in beforeEach
    };

    beforeEach(() => {
      validCampaignData.categoria_id = category.id;
    });

    it('should create campaign with authentication', async () => {
      const response = await request(app)
        .post('/api/campanhas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCampaignData);

      expect(response.status).toBe(201);
      expect(response.body.titulo).toBe(validCampaignData.titulo);
      expect(response.body.usuario_id).toBe(authUser.id);
      expect(response.body.categoria_id).toBe(category.id);
      expect(response.body.valor_atual).toBe('0.00');
      expect(response.body.status).toBe('ativa');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/campanhas')
        .send(validCampaignData);

      expect(response.status).toBe(401);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        titulo: '',
        meta_arrecadacao: -100,
        data_limite: '2020-01-01' // Past date
      };

      const response = await request(app)
        .post('/api/campanhas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return error for non-existent category', async () => {
      const dataWithInvalidCategory = {
        ...validCampaignData,
        categoria_id: 999
      };

      const response = await request(app)
        .post('/api/campanhas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dataWithInvalidCategory);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/campanhas/:id', () => {
    it('should get campaign by ID (public access)', async () => {
      const { campaign } = await createTestCampaign({ 
        usuario_id: authUser.id, 
        categoria_id: category.id 
      });

      const response = await request(app)
        .get(`/api/campanhas/${campaign.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(campaign.id);
      expect(response.body.titulo).toBe(campaign.titulo);
      expect(response.body.Usuario).toBeDefined();
      expect(response.body.Categoria).toBeDefined();
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/api/campanhas/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/campanhas/:id', () => {
    let campaign;

    beforeEach(async () => {
      const result = await createTestCampaign({ 
        usuario_id: authUser.id, 
        categoria_id: category.id 
      });
      campaign = result.campaign;
    });

    it('should update campaign by owner', async () => {
      const updateData = {
        titulo: 'Campanha Atualizada',
        descricao: 'Descrição atualizada',
        meta_arrecadacao: 2000.00
      };

      const response = await request(app)
        .put(`/api/campanhas/${campaign.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.titulo).toBe(updateData.titulo);
      expect(response.body.meta_arrecadacao).toBe('2000.00');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put(`/api/campanhas/${campaign.id}`)
        .send({ titulo: 'Updated' });

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-owner', async () => {
      // Create another user
      const { token: otherToken } = await createAuthenticatedUser({ 
        email: 'other@example.com' 
      });

      const response = await request(app)
        .put(`/api/campanhas/${campaign.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ titulo: 'Updated' });

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .put('/api/campanhas/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/campanhas/:id', () => {
    let campaign;

    beforeEach(async () => {
      const result = await createTestCampaign({ 
        usuario_id: authUser.id, 
        categoria_id: category.id 
      });
      campaign = result.campaign;
    });

    it('should delete campaign by owner', async () => {
      const response = await request(app)
        .delete(`/api/campanhas/${campaign.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify campaign is deleted
      const getResponse = await request(app)
        .get(`/api/campanhas/${campaign.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/api/campanhas/${campaign.id}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-owner', async () => {
      // Create another user
      const { token: otherToken } = await createAuthenticatedUser({ 
        email: 'other@example.com' 
      });

      const response = await request(app)
        .delete(`/api/campanhas/${campaign.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .delete('/api/campanhas/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});