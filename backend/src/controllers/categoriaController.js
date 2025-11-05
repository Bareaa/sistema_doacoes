const { Categoria } = require('../models');
const { validationResult } = require('express-validator');

const categoriaController = {
  // Get all categories (public access)
  async getAll(req, res) {
    try {
      const categorias = await Categoria.findAll({
        order: [['nome', 'ASC']]
      });

      res.status(200).json({
        message: 'Categorias recuperadas com sucesso',
        data: categorias,
        total: categorias.length
      });

    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Create new category (protected - requires authentication)
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

      const { nome, descricao } = req.body;

      // Check if category name already exists
      const existingCategoria = await Categoria.findOne({ where: { nome } });
      if (existingCategoria) {
        return res.status(409).json({
          message: 'Nome da categoria já existe',
          errors: [{
            field: 'nome',
            message: 'Uma categoria com este nome já está cadastrada'
          }],
          requestId: req.requestId
        });
      }

      // Create new category
      const newCategoria = await Categoria.create({
        nome,
        descricao
      });

      res.status(201).json({
        message: 'Categoria criada com sucesso',
        data: newCategoria
      });

    } catch (error) {
      console.error('Create category error:', error);
      
      // Handle Sequelize unique constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          message: 'Nome da categoria já existe',
          errors: [{
            field: 'nome',
            message: 'Uma categoria com este nome já está cadastrada'
          }],
          requestId: req.requestId
        });
      }

      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Get category by ID (public access)
  async getById(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada',
          errors: [{
            field: 'id',
            message: 'Categoria com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      res.status(200).json({
        message: 'Categoria recuperada com sucesso',
        data: categoria
      });

    } catch (error) {
      console.error('Get category by ID error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Update category (protected - requires authentication)
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
      const { nome, descricao } = req.body;

      // Check if category exists
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada',
          errors: [{
            field: 'id',
            message: 'Categoria com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check if new name conflicts with existing category (excluding current one)
      if (nome && nome !== categoria.nome) {
        const { Op } = require('sequelize');
        const existingCategoria = await Categoria.findOne({ 
          where: { 
            nome,
            id: { [Op.ne]: id }
          }
        });
        
        if (existingCategoria) {
          return res.status(409).json({
            message: 'Nome da categoria já existe',
            errors: [{
              field: 'nome',
              message: 'Uma categoria com este nome já está cadastrada'
            }],
            requestId: req.requestId
          });
        }
      }

      // Update category
      await categoria.update({
        nome: nome || categoria.nome,
        descricao: descricao || categoria.descricao
      });

      res.status(200).json({
        message: 'Categoria atualizada com sucesso',
        data: categoria
      });

    } catch (error) {
      console.error('Update category error:', error);
      
      // Handle Sequelize unique constraint error
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          message: 'Nome da categoria já existe',
          errors: [{
            field: 'nome',
            message: 'Uma categoria com este nome já está cadastrada'
          }],
          requestId: req.requestId
        });
      }

      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  },

  // Delete category (protected - requires authentication)
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Check if category exists
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({
          message: 'Categoria não encontrada',
          errors: [{
            field: 'id',
            message: 'Categoria com o ID especificado não existe'
          }],
          requestId: req.requestId
        });
      }

      // Check if category has associated campaigns
      const { Campanha } = require('../models');
      const associatedCampaigns = await Campanha.count({
        where: { categoria_id: id }
      });

      if (associatedCampaigns > 0) {
        return res.status(409).json({
          message: 'Categoria não pode ser excluída',
          errors: [{
            field: 'id',
            message: 'Categoria possui campanhas associadas e não pode ser excluída'
          }],
          requestId: req.requestId
        });
      }

      // Delete category
      await categoria.destroy();

      res.status(204).send();

    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        message: 'Erro interno do servidor',
        requestId: req.requestId
      });
    }
  }
};

module.exports = categoriaController;