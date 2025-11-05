'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Categoria has many Campanhas
      Categoria.hasMany(models.Campanha, {
        foreignKey: 'categoria_id',
        as: 'campanhas'
      });
    }
  }
  Categoria.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255]
      }
    }
  }, {
    sequelize,
    modelName: 'Categoria',
  });
  return Categoria;
};