/**
 * Integration tests for comentario operations
 */

const request = require('supertest');
const app = require('../../app');
const { 
  cleanDatabase, 
  createAuthenticatedUser, 
  createTestCampaign,
  createTestComment 
} = require('../helpers/testUtils');

// Load integration test setup
require('./setup');

describe('Comentario Operations', () => {
  let authUser, authToken, campaign;

  beforeEach(async () => {
    await cleanDatabase();
    const authData = await createAuthenticatedUser();
    authUser = authData.user;
    authToken = authData.token;
    
    const campaignResult = await createTestCampaign();
    campaign = campaignResult.campaign;
  });

  describe('GET /api/campanhas/:id/comentarios', () => {
    it('should list campaign comments (public access)', async () => {
      // Create test comments
      await createTestComment({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id,
        texto: 'Primeiro comentário'
      });
      await createTestComment({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id,
        texto: 'Segundo comentário'
      });

      const response = await request(app)
        .get(`/api/campanhas/${campaign.id}/comentarios`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].texto).toBeDefined();
      expect(response.body[0].Usuario).toBeDefined(); // Should include user data
    });

    it('should return empty array when no comments exist', async () => {
      const response = await request(app)
        .get(`/api/campanhas/${campaign.id}/comentarios`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });
});  descri
be('POST /api/campanhas/:id/comentarios', () => {
    const validCommentData = {
      texto: 'Este é um comentário de teste'
    };

    it('should create comment with authentication', async () => {
      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/comentarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCommentData);

      expect(response.status).toBe(201);
      expect(response.body.texto).toBe(validCommentData.texto);
      expect(response.body.usuario_id).toBe(authUser.id);
      expect(response.body.campanha_id).toBe(campaign.id);
      expect(response.body.data).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/comentarios`)
        .send(validCommentData);

      expect(response.status).toBe(401);
    });

    it('should return validation errors for empty text', async () => {
      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/comentarios`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ texto: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .post('/api/campanhas/999/comentarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCommentData);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/comentarios/:id', () => {
    let comment;

    beforeEach(async () => {
      const result = await createTestComment({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id 
      });
      comment = result.comment;
    });

    it('should update comment by owner', async () => {
      const updateData = {
        texto: 'Comentário atualizado'
      };

      const response = await request(app)
        .put(`/api/comentarios/${comment.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.texto).toBe(updateData.texto);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put(`/api/comentarios/${comment.id}`)
        .send({ texto: 'Updated' });

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-owner', async () => {
      const { token: otherToken } = await createAuthenticatedUser({ 
        email: 'other@example.com' 
      });

      const response = await request(app)
        .put(`/api/comentarios/${comment.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ texto: 'Updated' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/comentarios/:id', () => {
    let comment;

    beforeEach(async () => {
      const result = await createTestComment({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id 
      });
      comment = result.comment;
    });

    it('should delete comment by owner', async () => {
      const response = await request(app)
        .delete(`/api/comentarios/${comment.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/api/comentarios/${comment.id}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-owner', async () => {
      const { token: otherToken } = await createAuthenticatedUser({ 
        email: 'other@example.com' 
      });

      const response = await request(app)
        .delete(`/api/comentarios/${comment.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });
  });
});