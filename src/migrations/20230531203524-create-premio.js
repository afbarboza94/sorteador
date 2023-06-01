'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Premios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sorteio: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Sorteios',
          },
          key: 'id'
        }
      },
      nome: {
        type: Sequelize.STRING
      },
      sorteadosJson: {
        type: Sequelize.TEXT
      },
      quantidade: {
        type: Sequelize.FLOAT
      },
      descricao: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Premios');
  }
};