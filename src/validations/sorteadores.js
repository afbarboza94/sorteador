const { body, validationResult } = require('express-validator');

module.exports = {
    createUpdate: [
        body('nome')
            .notEmpty()
            .withMessage('O campo Nome é obrigatório.')
            .trim()
            .escape()
            .toUpperCase()
    ],
};