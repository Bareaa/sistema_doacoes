const { body, param, query } = require('express-validator');

const comentarioValidator = {
  // Validation rules for creating a new comment
  create: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da campanha deve ser um número inteiro positivo'),
    
    body('texto')
      .notEmpty()
      .withMessage('Texto do comentário é obrigatório')
      .isLength({ min: 1, max: 500 })
      .withMessage('Texto deve ter entre 1 e 500 caracteres')
      .trim()
      .escape()
  ],

  // Validation rules for updating a comment
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo'),
    
    body('texto')
      .notEmpty()
      .withMessage('Texto do comentário é obrigatório')
      .isLength({ min: 1, max: 500 })
      .withMessage('Texto deve ter entre 1 e 500 caracteres')
      .trim()
      .escape()
  ],

  // Validation rules for getting comment by ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ],

  // Validation rules for deleting comment
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ],

  // Validation rules for getting comments by campaign
  getByCampaign: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da campanha deve ser um número inteiro positivo'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Página deve ser um número inteiro positivo')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite deve ser um número inteiro entre 1 e 100')
      .toInt()
  ]
};

module.exports = comentarioValidator;