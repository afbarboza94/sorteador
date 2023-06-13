'use strict';
const {
  Model, DataTypes
} = require('sequelize');

const { MainModel, sequelize } = require('./mainModel');

class Premio extends MainModel {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
  */
  static associate(models) {
    // define association here
  }

  static serverProcessing = async (params = {}) => {
    const quantidadeformatted = MainModel.formatNumber('Premios.quantidade', 0);

    const a = await MainModel.serverProcessing({
      ...params,
      columns: [
        "id", "nome", "quantidadeformatted", "sorteadosJson", "id", "id", "id_excluir"
      ],
      colsOrder: [
        "id", "nome", "quantidade", "j.sorteadosJson"
      ],
      colsWhere: [
        "", "Premios.nome", quantidadeformatted, "j.sorteadosJson"
      ],
      priorityGroupColumn: 'Premios.id',
      select: `select Premios.nome, Premios.quantidade,\n` +
        `  (${quantidadeformatted}) as quantidadeformatted,\n` +
        `  j.sorteadosJson,\n` +
        `  Premios.id, Premios.id as id_excluir\n`,
      from_join: `from Premios\n` +
        `join (\n`+
        `    select group_concat(value) as sorteadosJson, id\n`+
        `    from (\n`+
        `        select j.value, Premios.id\n`+
        `        from Premios\n`+
        `        join json_each(Premios.sorteadosJson) as j\n`+
        `        where Premios.sorteio ${(params.sorteio ? `= ${params.sorteio}` : 'isnull')}\n`+
        `        order by j.value\n`+
        `    ) as foo\n`+
        `    group by id\n`+
        `) as j on j.id = Premios.id\n`,
      where: `where Premios.sorteio ${(params.sorteio ? `= ${params.sorteio}` : 'isnull')}`,
    });
    return a;
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