'use strict';
const {
  Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class ListaSorteio extends MainModel {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate(models) {
    // define association here
  }

  static serverprocessing = async (params = {}) => {
    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "value"
      ],
      colsOrder: [
        "value"
      ],
      colsWhere: [
        "value"
      ],
      priorityGroupColumn: 'j.value',
      select: `select j.value\n`,
      from_join: `from ListaSorteios\n` +
        `\njoin json_each(ListaSorteios.json) as j\n`,
      where: `where ListaSorteios.sorteio ${(params.sorteio ? `= ${params.sorteio}` : 'isnull')}`,
    });
    return a;
  }
}

ListaSorteio.init({
  sorteio: DataTypes.INTEGER,
  json: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'ListaSorteio',
});

module.exports = ListaSorteio;