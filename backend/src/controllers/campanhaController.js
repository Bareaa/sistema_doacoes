const { Campanha, Usuario, Categoria } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const campanhaController = {
  // Get all campaigns with filters (public access)
  async getAll(req, res) {
    try {
      const { categoria_id, status, usuario_id, page = 1, limit = 10 } = req.query;
      
      // Build where clause based on filters
      const whereClause = {};
      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (status) whereClause.status = status;
      if (usuario_id) whereClause.usuario_id = usuario_id;

      // Calculate pagination
      const offset = (page - 1) * limit;

      const { count, rows: campanhas } = await Campanha.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        message: 'Campanhas recuperadas com sucesso',
        data: campanhas,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get all campaigns error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Create new campaign (protected - requires authentication)
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

      const { titulo, descricao, meta_arrecadacao, data_limite, categoria_id } = req.body;
      const usuario_id = req.userId; // From auth middleware

      // Validate that data_limite is in the future
      const currentDate = new Date();
      const limitDate = new Date(data_limite);
      
      if (limitDate <= currentDate) {
        return res.status(400).json({
          message: 'Data limite deve ser no futuro',
          errors: [{
            field: 'data_limite',
            message: 'A data limite deve ser posterior à data atual'
          }],
          requestId: req.requestId
        });
      }

      // Verify that categoria exists
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada',
          errors: [{
            field: 'categoria_id',
            message: 'Categoria especificada não existe'
          }],
          requestId: req.requestId
        });
      }

      // Create new campaign
      const newCampanha = await Campanha.create({
        titulo,
        descricao,
        meta_arrecadacao,
        data_limite,
        categoria_id,
        usuario_id,
        valor_atual: 0,
        status: 'ativa'
      });

      // Fetch the created campaign with associations
      const campanhaWithAssociations = await Campanha.findByPk(newCampanha.id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ]
      });

      res.status(201).json({
        message: 'Campanha criada com sucesso',
        data: campanhaWithAssociations
      });

    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get campaign by ID (public access)
  async getById(req, res) {
    try {
      const { id } = req.params;

      const campanha = await Campanha.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ]
      });

      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'id',
            message: 'Campanha com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      res.status(200).json({
        message: 'Campanha recuperada com sucesso',
        data: campanha
      });

    } catch (error) {
      console.error('Get campaign by ID error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Update campaign (protected - requires authentication and ownership)
  async update(req, res) {
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

      const { id } = req.params;
      const { titulo, descricao, meta_arrecadacao, data_limite, categoria_id, status } = req.body;
      const usuario_id = req.userId;

      // Check if campaign exists
      const campanha = await Campanha.findByPk(id);
      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'id',
            message: 'Campanha com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check ownership
      if (campanha.usuario_id !== usuario_id) {
        return res.status(403).json({
          message: 'Acesso negado',
          errors: [{
            field: 'usuario_id',
            message: 'Você só pode editar suas próprias campanhas'
          }],
          requestId: req.requestId
        });
      }

      // Validate data_limite if provided
      if (data_limite) {
        const currentDate = new Date();
        const limitDate = new Date(data_limite);
        
        if (limitDate <= currentDate) {
          return res.status(400).json({
            message: 'Data limite deve ser no futuro',
            errors: [{
              field: 'data_limite',
              message: 'A data limite deve ser posterior à data atual'
            }],
            requestId: req.requestId
          });
        }
      }

      // Verify categoria if provided
      if (categoria_id && categoria_id !== campanha.categoria_id) {
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) {
          return res.status(404).json({
            message: 'Categoria não encontrada',
            errors: [{
              field: 'categoria_id',
              message: 'Categoria especificada não existe'
            }],
            requestId: req.requestId
          });
        }
      }

      // Validate status change logic
      if (status && status !== campanha.status) {
        // Only allow certain status transitions
        const validTransitions = {
          'ativa': ['concluida', 'cancelada'],
          'concluida': [], // Cannot change from completed
          'cancelada': ['ativa'] // Can reactivate cancelled campaigns
        };

        if (!validTransitions[campanha.status].includes(status)) {
          return res.status(400).json({
            message: 'Transição de status inválida',
            errors: [{
              field: 'status',
              message: `Não é possível alterar status de '${campanha.status}' para '${status}'`
            }],
            requestId: req.requestId
          });
        }
      }

      // Update campaign
      const updateData = {};
      if (titulo !== undefined) updateData.titulo = titulo;
      if (descricao !== undefined) updateData.descricao = descricao;
      if (meta_arrecadacao !== undefined) updateData.meta_arrecadacao = meta_arrecadacao;
      if (data_limite !== undefined) updateData.data_limite = data_limite;
      if (categoria_id !== undefined) updateData.categoria_id = categoria_id;
      if (status !== undefined) updateData.status = status;

      await campanha.update(updateData);

      // Fetch updated campaign with associations
      const updatedCampanha = await Campanha.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ]
      });

      res.status(200).json({
        message: 'Campanha atualizada com sucesso',
        data: updatedCampanha
      });

    } catch (error) {
      console.error('Update campaign error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Delete campaign (protected - requires authentication and ownership)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.userId;

      // Check if campaign exists
      const campanha = await Campanha.findByPk(id);
      if (!campanha) {
        return res.status(404).json({
          message: 'Campanha não encontrada',
          errors: [{
            field: 'id',
            message: 'Campanha com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check ownership
      if (campanha.usuario_id !== usuario_id) {
        return res.status(403).json({
          message: 'Acesso negado',
          errors: [{
            field: 'usuario_id',
            message: 'Você só pode excluir suas próprias campanhas'
          }],
          requestId: req.requestId
        });
      }

      // Check if campaign has donations
      const { Doacao } = require('../models');
      const donationCount = await Doacao.count({
        where: { campanha_id: id }
      });

      if (donationCount > 0) {
        return res.status(409).json({
          message: 'Campanha não pode ser excluída',
          errors: [{
            field: 'id',
            message: 'Campanha possui doações e não pode ser excluída'
          }],
          requestId: req.requestId
        });
      }

      // Delete campaign
      await campanha.destroy();

      res.status(204).send();

    } catch (error) {
      console.error('Delete campaign error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Update campaign status based on business logic
  async updateStatus(campanhaId, newValorAtual = null) {
    try {
      const campanha = await Campanha.findByPk(campanhaId);
      if (!campanha) return;

      // Update valor_atual if provided
      if (newValorAtual !== null) {
        await campanha.update({ valor_atual: newValorAtual });
      }

      // Check if goal is reached
      if (campanha.valor_atual >= campanha.meta_arrecadacao && campanha.status === 'ativa') {
        await campanha.update({ status: 'concluida' });
      }

      // Check if deadline has passed
      const currentDate = new Date();
      const limitDate = new Date(campanha.data_limite);
      
      if (limitDate <= currentDate && campanha.status === 'ativa') {
        await campanha.update({ status: 'cancelada' });
      }

      return campanha;
    } catch (error) {
      console.error('Update campaign status error:', error);
      throw error;
    }
  }
};

module.exports = campanhaController;