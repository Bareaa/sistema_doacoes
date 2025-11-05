/**
 * Integration tests for doacao operations
 */

const request = require('supertest');
const app = require('../../app');
const { 
  cleanDatabase, 
  createAuthenticatedUser, 
  createTestCampaign,
  createTestDonation 
} = require('../helpers/testUtils');

// Load integration test setup
require('./setup');

describe('Doacao Operations', () => {
  let authUser, authToken, campaign;

  beforeEach(async () => {
    await cleanDatabase();
    const authData = await createAuthenticatedUser();
    authUser = authData.user;
    authToken = authData.token;
    
    const campaignResult = await createTestCampaign();
    campaign = campaignResult.campaign;
  });

  describe('GET /api/campanhas/:id/doacoes', () => {
    it('should list campaign donations (public access)', async () => {
      // Create test donations
      await createTestDonation({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id,
        valor: 100.00
      });
      await createTestDonation({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id,
        valor: 50.00
      });

      const response = await request(app)
        .get(`/api/campanhas/${campaign.id}/doacoes`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].valor).toBeDefined();
      expect(response.body[0].Usuario).toBeDefined(); // Should include user data
    });

    it('should return empty array when no donations exist', async () => {
      const response = await request(app)
        .get(`/api/campanhas/${campaign.id}/doacoes`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .get('/api/campanhas/999/doacoes');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/campanhas/:id/doacoes', () => {
    const validDonationData = {
      valor: 100.00,
      mensagem_apoio: 'Boa sorte com a campanha!'
    };

    it('should create donation with authentication', async () => {
      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/doacoes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(validDonationData);

      expect(response.status).toBe(201);
      expect(response.body.valor).toBe('100.00');
      expect(response.body.mensagem_apoio).toBe(validDonationData.mensagem_apoio);
      expect(response.body.usuario_id).toBe(authUser.id);
      expect(response.body.campanha_id).toBe(campaign.id);
      expect(response.body.data).toBeDefined();
    });

    it('should update campaign valor_atual after donation', async () => {
      await request(app)
        .post(`/api/campanhas/${campaign.id}/doacoes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(validDonationData);

      // Check if campaign valor_atual was updated
      const campaignResponse = await request(app)
        .get(`/api/campanhas/${campaign.id}`);

      expect(campaignResponse.body.valor_atual).toBe('100.00');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/doacoes`)
        .send(validDonationData);

      expect(response.status).toBe(401);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        valor: -50, // Negative value
        mensagem_apoio: ''
      };

      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/doacoes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 for non-existent campaign', async () => {
      const response = await request(app)
        .post('/api/campanhas/999/doacoes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validDonationData);

      expect(response.status).toBe(404);
    });

    it('should allow donation without support message', async () => {
      const donationWithoutMessage = {
        valor: 50.00
      };

      const response = await request(app)
        .post(`/api/campanhas/${campaign.id}/doacoes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(donationWithoutMessage);

      expect(response.status).toBe(201);
      expect(response.body.valor).toBe('50.00');
      expect(response.body.mensagem_apoio).toBeNull();
    });
  });

  describe('GET /api/doacoes/:id', () => {
    let donation;

    beforeEach(async () => {
      const result = await createTestDonation({ 
        campanha_id: campaign.id,
        usuario_id: authUser.id 
      });
      donation = result.donation;
    });

    it('should get donation by ID for owner', async () => {
      const response = await request(app)
        .get(`/api/doacoes/${donation.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(donation.id);
      expect(response.body.valor).toBeDefined();
      expect(response.body.Usuario).toBeDefined();
      expect(response.body.Campanha).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/doacoes/${donation.id}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-owner', async () => {
      // Create another user
      const { token: otherToken } = await createAuthenticatedUser({ 
        email: 'other@example.com' 
      });

      const response = await request(app)
        .get(`/api/doacoes/${donation.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent donation', async () => {
      const response = await request(app)
        .get('/api/doacoes/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});