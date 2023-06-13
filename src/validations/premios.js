const { defaultValidInput, defaultValidCallback } = require('./defaultValidation');
const PremioModel = require('../models/premio');
const { isEmpty } = require('../helpers');
const { Op } = require('sequelize');

module.exports = {
    createupdate: [
        defaultValidInput()
            .custom(async (value, { req }) => {
                if (value) {
                    let where = {
                        nome: { [Op.substring]: value }
                    };

                    let sorteio;
                    if (isEmpty(req.body?.id)) {
                        sorteio = req.body.sorteio;
                    } else {
                        sorteio = (await PremioModel.findByPk(req.body.id, { attributes: ["sorteio"] })).sorteio;
                        where.id = { [Op.ne]: req.body.id };
                    }
                    where.sorteio = { [Op.eq]: sorteio };

                    let cnt = await PremioModel.count({ where });

                    if (cnt > 0) {
                        throw new Error(`O campo Nome deve conter um valor único.`);
                    }
                }
                return true;
            }),
        defaultValidInput({ name: 'quantidade', caption: 'Quantidade', sanitizeNumber: { digits: 0 }, }),
        defaultValidInput({ name: 'descricao', isNotEmpty: false, toUpperCase: false, }),
        defaultValidCallback,
    ],
    delete: [
        defaultValidInput({ name: 'id', caption: 'ID', })
            .custom(async (value, { req }) => {
                if (value) {
                    const result = await PremioModel.findAndCountAll({ where: { id: value } });
                    if (!result.count) {
                        throw new Error('Prêmio não encontrado.');
                    }
                }
                return true;
            }),
        defaultValidCallback,
    ],
};