const { body, param } = require('express-validator');

const categoriaValidator = {
  // Validation rules for creating a new category
  create: [
    body('nome')
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome deve ter entre 2 e 50 caracteres')
      .trim()
      .escape(),
    
    body('descricao')
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 5, max: 255 })
      .withMessage('Descrição deve ter entre 5 e 255 caracteres')
      .trim()
      .escape()
  ],

  // Validation rules for updating a category
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo'),
    
    body('nome')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Nome deve ter entre 2 e 50 caracteres')
      .trim()
      .escape(),
    
    body('descricao')
      .optional()
      .isLength({ min: 5, max: 255 })
      .withMessage('Descrição deve ter entre 5 e 255 caracteres')
      .trim()
      .escape()
  ],

  // Validation rules for getting category by ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ],

  // Validation rules for deleting category
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ]
};

module.exports = categoriaValidator;