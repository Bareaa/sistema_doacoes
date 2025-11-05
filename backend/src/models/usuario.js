'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Usuario has many Campanhas
      Usuario.hasMany(models.Campanha, {
        foreignKey: 'usuario_id',
        as: 'campanhas'
      });
      
      // Usuario has many Doacoes
      Usuario.hasMany(models.Doacao, {
        foreignKey: 'usuario_id',
        as: 'doacoes'
      });
      
      // Usuario has many Comentarios
      Usuario.hasMany(models.Comentario, {
        foreignKey: 'usuario_id',
        as: 'comentarios'
      });
    }
  }
  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};