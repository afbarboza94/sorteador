const { body, validationResult } = require('express-validator');
const moment = require('moment');

module.exports = {
    createUpdate: [
        body('nome')
            .notEmpty()
            .withMessage('O campo Nome é obrigatório.')
            .trim()
            .escape()
            .toUpperCase()
            .isLength({ max: 255 })
            .withMessage('O campo Nome não pode exceder 255 caracteres.'),
        body('data')
            .notEmpty()
            .withMessage('O campo Data Sorteio é obrigatório.')
            .trim()
            .toUpperCase()
            .custom((value, { req }) => {
                let momData = moment(value, 'DD/MM/YYYY', true);
                if (value && momData.isValid() == false) {
                    throw new Error('O campo Data Sorteio não segue o padrão DD/MM/YYYY');
                }
                let YNow = parseInt(moment().format('YYYY'));
                let YData = parseInt(momData.format('YYYY'));
                if (YData < (YNow - 30)) {
                    throw new Error(`O campo Data Sorteio não pode ter o ano anterior a ${YNow - 30}`);
                }
                if (YData >= (YNow + 30)) {
                    throw new Error(`O campo Data Sorteio não pode ter o ano depois de ${YNow + 30}`);
                }
                return true;
            }),
        body('lista')
            .notEmpty()
            .withMessage('O campo Lista Candidatos é obrigatório.')
            .trim()
            .escape()
            .toUpperCase(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let errorsField = {};
                errors.array().forEach(element => {
                    errorsField[element.path] = element;
                });
                return res.status(422).json({ errorsField });
            }
            else {
                next();
            }
        },
    ],
};