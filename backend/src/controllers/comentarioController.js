const { Comentario, Campanha, Usuario } = require('../models');
const { validationResult } = require('express-validator');

const comentarioController = {
  // Create new comment (protected - requires authentication)
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

      const { texto } = req.body;
      const { id: campanha_id } = req.params;
      const usuario_id = req.userId;

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

      // Create the comment
      const newComentario = await Comentario.create({
        texto,
        usuario_id,
        campanha_id: parseInt(campanha_id),
        data: new Date()
      });

      // Fetch the created comment with associations
      const comentarioWithAssociations = await Comentario.findByPk(newComentario.id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome']
          },
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo']
          }
        ]
      });

      res.status(201).json({
        message: 'Comentário criado com sucesso',
        data: comentarioWithAssociations
      });

    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get comments for a specific campaign (public access)
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

      const { count, rows: comentarios } = await Comentario.findAndCountAll({
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
        message: 'Comentários recuperados com sucesso',
        data: comentarios,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Get comments by campaign error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get comment by ID (public access)
  async getById(req, res) {
    try {
      const { id } = req.params;

      const comentario = await Comentario.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome']
          },
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo']
          }
        ]
      });

      if (!comentario) {
        return res.status(404).json({
          message: 'Comentário não encontrado',
          errors: [{
            field: 'id',
            message: 'Comentário com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      res.status(200).json({
        message: 'Comentário recuperado com sucesso',
        data: comentario
      });

    } catch (error) {
      console.error('Get comment by ID error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Update comment (protected - requires authentication and ownership)
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
      const { texto } = req.body;
      const usuario_id = req.userId;

      // Check if comment exists
      const comentario = await Comentario.findByPk(id);
      if (!comentario) {
        return res.status(404).json({
          message: 'Comentário não encontrado',
          errors: [{
            field: 'id',
            message: 'Comentário com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check ownership
      if (comentario.usuario_id !== usuario_id) {
        return res.status(403).json({
          message: 'Acesso negado',
          errors: [{
            field: 'usuario_id',
            message: 'Você só pode editar seus próprios comentários'
          }],
          requestId: req.requestId
        });
      }

      // Update comment
      await comentario.update({ texto });

      // Fetch updated comment with associations
      const updatedComentario = await Comentario.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nome']
          },
          {
            model: Campanha,
            as: 'campanha',
            attributes: ['id', 'titulo']
          }
        ]
      });

      res.status(200).json({
        message: 'Comentário atualizado com sucesso',
        data: updatedComentario
      });

    } catch (error) {
      console.error('Update comment error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Delete comment (protected - requires authentication and ownership)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.userId;

      // Check if comment exists
      const comentario = await Comentario.findByPk(id);
      if (!comentario) {
        return res.status(404).json({
          message: 'Comentário não encontrado',
          errors: [{
            field: 'id',
            message: 'Comentário com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check ownership
      if (comentario.usuario_id !== usuario_id) {
        return res.status(403).json({
          message: 'Acesso negado',
          errors: [{
            field: 'usuario_id',
            message: 'Você só pode excluir seus próprios comentários'
          }],
          requestId: req.requestId
        });
      }

      // Delete comment
      await comentario.destroy();

      res.status(204).send();

    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  }
};

module.exports = comentarioController;