const { Doacao, Campanha, Usuario, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const doacaoController = {
  // Create new donation (protected - requires authentication)
  async create(req, res) {
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

      const { valor, mensagem_apoio } = req.body;
      const { id: campanha_id } = req.params;
      const usuario_id = req.userId;

      // Validate that valor is positive
      if (parseFloat(valor) <= 0) {
        return res.status(400).json({
          message: 'Valor da doação deve ser positivo',
          errors: [{
            field: 'valor',
            message: 'O valor da doação deve ser maior que zero'
          }],
          requestId: req.requestId
        });
      }

      // Check if campaign exists and is active
      const campanha = await Campanha.findByPk(campanha_id);
      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'campanha_id',
            message: 'Campanha especificada não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check if campaign is active (only allow donations to active campaigns)
      if (campanha.status !== 'ativa') {
        return res.status(400).json({
          message: 'Doação não permitida',
          errors: [{
            field: 'campanha_id',
            message: 'Doações só são permitidas para campanhas ativas'
          }],
          requestId: req.requestId
        });
      }

      // Check if campaign deadline has not passed
      const currentDate = new Date();
      const limitDate = new Date(campanha.data_limite);
      
      if (limitDate <= currentDate) {
        return res.status(400).json({
          message: 'Campanha expirada',
          errors: [{
            field: 'campanha_id',
            message: 'A data limite da campanha já passou'
          }],
          requestId: req.requestId
        });
      }

      // Create the donation
      const newDoacao = await Doacao.create({
        valor: parseFloat(valor),
        mensagem_apoio,
        usuario_id,
        campanha_id: parseInt(campanha_id),
        data: new Date()
      });

      // Update campaign valor_atual
      const newValorAtual = parseFloat(campanha.valor_atual) + parseFloat(valor);
      await campanha.update({ valor_atual: newValorAtual });

      // Check if campaign goal is reached and update status
      if (newValorAtual >= parseFloat(campanha.meta_arrecadacao)) {
        await campanha.update({ status: 'concluida' });
      }

      // Fetch the created donation with associations
      const doacaoWithAssociations = await Doacao.findByPk(newDoacao.id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo', 'valor_atual', 'meta_arrecadacao', 'status']
          }
        ]
      });

      res.status(201).json({
        message: 'Doação realizada com sucesso',
        data: doacaoWithAssociations
      });

    } catch (error) {
      console.error('Create donation error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get donations for a specific campaign (public access)
  async getByCampaign(req, res) {
    try {
      const { id: campanha_id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Check if campaign exists
      const campanha = await Campanha.findByPk(campanha_id);
      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'campanha_id',
            message: 'Campanha especificada não existe'
          }],
          requestId: req.requestId
        });
      }

      // Calculate pagination
      const offset = (page - 1) * limit;

      const { count, rows: doacoes } = await Doacao.findAndCountAll({
        where: { campanha_id },
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        message: 'Doações recuperadas com sucesso',
        data: doacoes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get donations by campaign error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get donations by user (protected - requires authentication)
  async getByUser(req, res) {
    try {
      const usuario_id = req.userId;
      const { page = 1, limit = 10 } = req.query;

      // Calculate pagination
      const offset = (page - 1) * limit;

      const { count, rows: doacoes } = await Doacao.findAndCountAll({
        where: { usuario_id },
        include: [
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo', 'status'],
            include: [
              {
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nome']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        message: 'Suas doações recuperadas com sucesso',
        data: doacoes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get donations by user error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get donation by ID (protected - requires authentication and ownership)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.userId;

      const doacao = await Doacao.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo', 'status'],
            include: [
              {
                model: Usuario,
                as: 'usuario',
                attributes: ['id', 'nome']
              }
            ]
          }
        ]
      });

      if (!doacao) {
        return res.status(404).json({
          message: 'Doação não encontrada',
          errors: [{
            field: 'id',
            message: 'Doação com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check ownership - user can only view their own donations
      if (doacao.usuario_id !== usuario_id) {
        return res.status(403).json({
          message: 'Acesso negado',
          errors: [{
            field: 'usuario_id',
            message: 'Você só pode visualizar suas próprias doações'
          }],
          requestId: req.requestId
        });
      }

      res.status(200).json({
        message: 'Doação recuperada com sucesso',
        data: doacao
      });

    } catch (error) {
      console.error('Get donation by ID error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get donation statistics for a campaign (public access)
  async getStatsByCampaign(req, res) {
    try {
      const { id: campanha_id } = req.params;

      // Check if campaign exists
      const campanha = await Campanha.findByPk(campanha_id);
      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'campanha_id',
            message: 'Campanha especificada não existe'
          }],
          requestId: req.requestId
        });
      }

      // Get donation statistics
      const stats = await Doacao.findAll({
        where: { campanha_id },
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_doacoes'],
          [sequelize.fn('SUM', sequelize.col('valor')), 'total_arrecadado'],
          [sequelize.fn('AVG', sequelize.col('valor')), 'valor_medio'],
          [sequelize.fn('MAX', sequelize.col('valor')), 'maior_doacao'],
          [sequelize.fn('MIN', sequelize.col('valor')), 'menor_doacao']
        ],
        raw: true
      });

      const statistics = stats[0] || {
        total_doacoes: 0,
        total_arrecadado: 0,
        valor_medio: 0,
        maior_doacao: 0,
        menor_doacao: 0
      };

      // Convert string values to numbers
      statistics.total_doacoes = parseInt(statistics.total_doacoes) || 0;
      statistics.total_arrecadado = parseFloat(statistics.total_arrecadado) || 0;
      statistics.valor_medio = parseFloat(statistics.valor_medio) || 0;
      statistics.maior_doacao = parseFloat(statistics.maior_doacao) || 0;
      statistics.menor_doacao = parseFloat(statistics.menor_doacao) || 0;

      res.status(200).json({
        message: 'Estatísticas de doação recuperadas com sucesso',
        data: {
          campanha_id: parseInt(campanha_id),
          ...statistics
        }
      });

    } catch (error) {
      console.error('Get donation stats error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  }
};

module.exports = doacaoController;