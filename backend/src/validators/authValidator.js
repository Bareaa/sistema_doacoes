const { body } = require('express-validator');

const authValidator = {
  // Validation rules for user registration
  validateRegister: [
    body('nome')
      .trim()
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres')
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
      .withMessage('Nome deve conter apenas letras e espaços'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email deve ter um formato válido')
      .normalizeEmail(),

    body('senha')
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 6, max: 100 })
      .withMessage('Senha deve ter entre 6 e 100 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
  ],

  // Validation rules for user login (placeholder for next sub-task)
  validateLogin: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email deve ter um formato válido')
      .normalizeEmail(),

    body('senha')
      .notEmpty()
      .withMessage('Senha é obrigatória')
  ]
};

module.exports = authValidator;