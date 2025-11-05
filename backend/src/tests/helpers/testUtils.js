/**
 * Test utilities for database seeding and cleanup
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Categoria, Campanha, Doacao, Comentario } = require('../../models');

/**
 * Clean all test data from database
 */
const cleanDatabase = async () => {
  try {
    // Delete in correct order to avoid foreign key constraints
    await Comentario.destroy({ where: {}, force: true });
    await Doacao.destroy({ where: {}, force: true });
    await Campanha.destroy({ where: {}, force: true });
    await Categoria.destroy({ where: {}, force: true });
    await Usuario.destroy({ where: {}, force: true });
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
};

/**
 * Create test user
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    nome: 'Test User',
    email: 'test@example.com',
    senha_hash: await bcrypt.hash('password123', 10)
  };

  return await Usuario.create({ ...defaultUser, ...userData });
};

/**
 * Create test category
 */
const createTestCategory = async (categoryData = {}) => {
  const defaultCategory = {
    nome: 'Test Category',
    descricao: 'Test category description'
  };

  return await Categoria.create({ ...defaultCategory, ...categoryData });
};

/**
 * Create test campaign
 */
const createTestCampaign = async (campaignData = {}) => {
  let usuario, categoria;

  // Create user if not provided
  if (!campaignData.usuario_id) {
    usuario = await createTestUser();
    campaignData.usuario_id = usuario.id;
  }

  // Create category if not provided
  if (!campaignData.categoria_id) {
    categoria = await createTestCategory();
    campaignData.categoria_id = categoria.id;
  }

  const defaultCampaign = {
    titulo: 'Test Campaign',
    descricao: 'Test campaign description',
    meta_arrecadacao: 1000.00,
    valor_atual: 0.00,
    data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'ativa'
  };

  const campaign = await Campanha.create({ ...defaultCampaign, ...campaignData });
  
  return {
    campaign,
    usuario: usuario || await Usuario.findByPk(campaignData.usuario_id),
    categoria: categoria || await Categoria.findByPk(campaignData.categoria_id)
  };
};

/**
 * Create test donation
 */
const createTestDonation = async (donationData = {}) => {
  let usuario, campanha;

  // Create user if not provided
  if (!donationData.usuario_id) {
    usuario = await createTestUser({ email: 'donor@example.com' });
    donationData.usuario_id = usuario.id;
  }

  // Create campaign if not provided
  if (!donationData.campanha_id) {
    const campaignResult = await createTestCampaign();
    campanha = campaignResult.campaign;
    donationData.campanha_id = campanha.id;
  }

  const defaultDonation = {
    valor: 50.00,
    data: new Date(),
    mensagem_apoio: 'Test donation message'
  };

  const donation = await Doacao.create({ ...defaultDonation, ...donationData });
  
  return {
    donation,
    usuario: usuario || await Usuario.findByPk(donationData.usuario_id),
    campanha: campanha || await Campanha.findByPk(donationData.campanha_id)
  };
};

/**
 * Create test comment
 */
const createTestComment = async (commentData = {}) => {
  let usuario, campanha;

  // Create user if not provided
  if (!commentData.usuario_id) {
    usuario = await createTestUser({ email: 'commenter@example.com' });
    commentData.usuario_id = usuario.id;
  }

  // Create campaign if not provided
  if (!commentData.campanha_id) {
    const campaignResult = await createTestCampaign();
    campanha = campaignResult.campaign;
    commentData.campanha_id = campanha.id;
  }

  const defaultComment = {
    texto: 'Test comment text',
    data: new Date()
  };

  const comment = await Comentario.create({ ...defaultComment, ...commentData });
  
  return {
    comment,
    usuario: usuario || await Usuario.findByPk(commentData.usuario_id),
    campanha: campanha || await Campanha.findByPk(commentData.campanha_id)
  };
};

/**
 * Generate JWT token for testing
 */
const generateTestToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

/**
 * Create authenticated user with token
 */
const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user.id);
  
  return { user, token };
};

module.exports = {
  cleanDatabase,
  createTestUser,
  createTestCategory,
  createTestCampaign,
  createTestDonation,
  createTestComment,
  generateTestToken,
  createAuthenticatedUser
};