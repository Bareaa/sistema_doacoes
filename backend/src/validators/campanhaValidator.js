const { body, param, query } = require('express-validator');

const campanhaValidator = {
  // Validation rules for creating a new campaign
  create: [
    body('titulo')
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 5, max: 100 })
      .withMessage('Título deve ter entre 5 e 100 caracteres')
      .trim()
      .escape(),
    
    body('descricao')
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Descrição deve ter entre 10 e 1000 caracteres')
      .trim()
      .escape(),
    
    body('meta_arrecadacao')
      .notEmpty()
      .withMessage('Meta de arrecadação é obrigatória')
      .isFloat({ min: 0.01 })
      .withMessage('Meta de arrecadação deve ser um valor positivo maior que zero')
      .toFloat(),
    
    body('data_limite')
      .notEmpty()
      .withMessage('Data limite é obrigatória')
      .isISO8601()
      .withMessage('Data limite deve estar no formato ISO 8601 (YYYY-MM-DD)')
      .custom((value) => {
        const inputDate = new Date(value);
        const currentDate = new Date();
        
        // Remove time component for comparison
        inputDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        if (inputDate <= currentDate) {
          throw new Error('Data limite deve ser no futuro');
        }
        return true;
      }),
    
    body('categoria_id')
      .notEmpty()
      .withMessage('Categoria é obrigatória')
      .isInt({ min: 1 })
      .withMessage('ID da categoria deve ser um número inteiro positivo')
      .toInt()
  ],

  // Validation rules for updating a campaign
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo'),
    
    body('titulo')
      .optional()
      .isLength({ min: 5, max: 100 })
      .withMessage('Título deve ter entre 5 e 100 caracteres')
      .trim()
      .escape(),
    
    body('descricao')
      .optional()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Descrição deve ter entre 10 e 1000 caracteres')
      .trim()
      .escape(),
    
    body('meta_arrecadacao')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Meta de arrecadação deve ser um valor positivo maior que zero')
      .toFloat(),
    
    body('data_limite')
      .optional()
      .isISO8601()
      .withMessage('Data limite deve estar no formato ISO 8601 (YYYY-MM-DD)')
      .custom((value) => {
        if (value) {
          const inputDate = new Date(value);
          const currentDate = new Date();
          
          // Remove time component for comparison
          inputDate.setHours(0, 0, 0, 0);
          currentDate.setHours(0, 0, 0, 0);
          
          if (inputDate <= currentDate) {
            throw new Error('Data limite deve ser no futuro');
          }
        }
        return true;
      }),
    
    body('categoria_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('ID da categoria deve ser um número inteiro positivo')
      .toInt(),
    
    body('status')
      .optional()
      .isIn(['ativa', 'concluida', 'cancelada'])
      .withMessage('Status deve ser: ativa, concluida ou cancelada')
  ],

  // Validation rules for getting campaign by ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ],

  // Validation rules for deleting campaign
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID deve ser um número inteiro positivo')
  ],

  // Validation rules for query parameters in getAll
  getAll: [
    query('categoria_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('ID da categoria deve ser um número inteiro positivo')
      .toInt(),
    
    query('status')
      .optional()
      .isIn(['ativa', 'concluida', 'cancelada'])
      .withMessage('Status deve ser: ativa, concluida ou cancelada'),
    
    query('usuario_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('ID do usuário deve ser um número inteiro positivo')
      .toInt(),
    
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

module.exports = campanhaValidator;