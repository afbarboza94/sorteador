const { defaultValidInput } = require('./defaultValidation');
const PremioModel = require('../models/premio');
const { validationResult } = require('express-validator');

module.exports = {
    sortear: [
        defaultValidInput({ name: 'id', caption: 'Premio', })
            .custom(async (value, { req }) => {
                if (value) {
                    const premio = await PremioModel.findByPk(value, {
                        attributes: ["id", "quantidade", "sorteadosJson"],
                    });
                    if (!(premio?.id)) {
                        throw new Error(`O Prêmio não existe.`);
                    }
                    if (Number(premio.quantidade) == 0) {
                        throw new Error(`A quantidade não pode ser 0.`);
                    }
                    if ((JSON.parse(premio.sorteadosJson ?? '[]')).length > 0) {
                        throw new Error(`Este prêmio já foi sorteado.`);
                    }
                }
                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                next();
            }
        },
    ],
};