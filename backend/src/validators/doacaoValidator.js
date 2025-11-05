const { body, param } = require('express-validator');

const doacaoValidator = {
  // Validation for creating a donation
  create: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da campanha deve ser um número inteiro positivo'),
    
    body('valor')
      .notEmpty()
      .withMessage('Valor da doação é obrigatório')
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Valor deve ser um número decimal válido com até 2 casas decimais')
      .custom((value) => {
        const numValue = parseFloat(value);
        if (numValue <= 0) {
          throw new Error('Valor da doação deve ser maior que zero');
        }
        if (numValue > 999999.99) {
          throw new Error('Valor da doação não pode exceder R$ 999.999,99');
        }
        return true;
      }),
    
    body('mensagem_apoio')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Mensagem de apoio não pode exceder 255 caracteres')
      .trim()
  ],

  // Validation for getting donations by campaign
  getByCampaign: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da campanha deve ser um número inteiro positivo')
  ],

  // Validation for getting donation by ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da doação deve ser um número inteiro positivo')
  ],

  // Validation for getting donation statistics
  getStats: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID da campanha deve ser um número inteiro positivo')
  ]
};

module.exports = doacaoValidator;