'use strict';
const {
  Model, DataTypes
} = require('sequelize');

class Premio extends Model {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
  */
  static associate(models) {
    // define association here
  }
}

Premio.init({
  sorteio: DataTypes.INTEGER,
  nome: DataTypes.STRING,
  sorteadosJson: DataTypes.TEXT,
  quantidade: DataTypes.FLOAT,
  descricao: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Premio',
});

module.exports = Premio;