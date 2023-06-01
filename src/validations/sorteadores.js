const { body, validationResult } = require('express-validator');

const validatorFunction = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        next();
    }
};

module.exports = {
    createUpdate: [
        body('nome')
            .notEmpty()
            .withMessage('O campo Nome é obrigatório.')
            .trim()
            .escape()
            .toUpperCase(),
        body('data')
            .notEmpty()
            .withMessage('O campo Data Sorteio é obrigatório.')
            .trim()
            .escape()
            .toUpperCase(),
        validatorFunction,
    ],
};