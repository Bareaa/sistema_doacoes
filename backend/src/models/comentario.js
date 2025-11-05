'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comentario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Comentario belongs to Usuario
      Comentario.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Comentario belongs to Campanha
      Comentario.belongsTo(models.Campanha, {
        foreignKey: 'campanha_id',
        as: 'campanha'
      });
    }
  }
  Comentario.init({
    texto: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 500]
      }
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    campanha_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Campanha',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Comentario',
    tableName: 'Comentarios'
  });
  return Comentario;
};