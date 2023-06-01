'use strict';
const {
  Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class Sorteio extends MainModel {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
  */
  static associate(models) {
    // define association here
  }
}

Sorteio.init({
  nome: DataTypes.STRING,
  data: DataTypes.DATE,
  descricao: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Sorteio',
});

module.exports = Sorteio;