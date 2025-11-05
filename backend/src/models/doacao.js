'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Doacao belongs to Usuario
      Doacao.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Doacao belongs to Campanha
      Doacao.belongsTo(models.Campanha, {
        foreignKey: 'campanha_id',
        as: 'campanha'
      });
    }
  }
  Doacao.init({
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    mensagem_apoio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255]
      }
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
    modelName: 'Doacao',
    tableName: 'Doacoes'
  });
  return Doacao;
};