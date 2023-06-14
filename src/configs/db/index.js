const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * @type {import('sequelize/types/sequelize').Sequelize}
 */
const sequelize = new Sequelize({
    dialectModule: sqlite3,
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../../src/database/database.sqlite')
});

(async () => {
    try {
        await sequelize.sync();
        console.log('Database created');
    } catch (error) {
        console.log('Database error');
        console.log(error);
    }
})();

module.exports = sequelize;