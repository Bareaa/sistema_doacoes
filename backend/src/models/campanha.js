'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campanha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Campanha belongs to Usuario
      Campanha.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      // Campanha belongs to Categoria
      Campanha.belongsTo(models.Categoria, {
        foreignKey: 'categoria_id',
        as: 'categoria'
      });
      
      // Campanha has many Doacoes
      Campanha.hasMany(models.Doacao, {
        foreignKey: 'campanha_id',
        as: 'doacoes'
      });
      
      // Campanha has many Comentarios
      Campanha.hasMany(models.Comentario, {
        foreignKey: 'campanha_id',
        as: 'comentarios'
      });
    }
  }
  Campanha.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 100]
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 1000]
      }
    },
    meta_arrecadacao: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    valor_atual: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    data_limite: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString()
      }
    },
    status: {
      type: DataTypes.ENUM('ativa', 'concluida', 'cancelada'),
      defaultValue: 'ativa'
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      }
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categoria',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Campanha',
  });
  return Campanha;
};