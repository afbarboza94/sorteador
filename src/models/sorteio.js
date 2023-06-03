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

  static serverProcessing = async (params = {}) => {
    const dataformatted = MainModel.formatDate('Sorteios.data');

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "id", "nome", "dataformatted", "id", "id_excluir"
      ],
      colsOrder: [
        "id", "nome", "data"
      ],
      colsWhere: [
        "", "Sorteios.nome", dataformatted
      ],
      priorityGroupColumn: 'Sorteios.id',
      select: `select Sorteios.nome, Sorteios.data,\n` +
        `  (${dataformatted}) as dataformatted,\n`+
        `  Sorteios.id, Sorteios.id as id_excluir\n`,
      from_join: `from Sorteios\n`,
    });

    return a;
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