const { body, validationResult } = require("express-validator");
const { nArredonda, isEmpty } = require('../helpers');
const sequelize = require("../configs/db");
const { QueryTypes } = require("sequelize");

module.exports = {
    defaultValidInput: ({
        name = 'nome',
        caption = 'Nome',
        isNotEmpty = true,
        escape = true,
        toUpperCase = true,
        maxLength = 255,
        minLength = null,
        sanitizeNumber = {},
        isUniqueParams = { table: null, field: null, notIdField: null, idFormField: null, },
    } = {}) => {
        let valid = body(name)
            .trim();
        if (isNotEmpty) {
            valid.notEmpty()
                .withMessage(`O campo ${caption} é obrigatório.`);
        }
        if (toUpperCase) {
            valid.toUpperCase();
        }
        if (isEmpty(minLength) == false || isEmpty(maxLength) == false) {
            let lengthParam = {},
                msg = [];
            if (isEmpty(minLength) == false) {
                lengthParam.min = minLength;
                msg.push(`deve ter mais de ${minLength} caracteres`);
            }
            if (isEmpty(maxLength) == false) {
                lengthParam.max = maxLength;
                msg.push(`não pode exceder ${maxLength} caracteres`);
            }
            valid.isLength(lengthParam)
                .withMessage(`O campo ${caption} ${msg.join(' e ')}.`);
        }
        if (sanitizeNumber?.hasOwnProperty('digits')) {
            valid.customSanitizer(value => {
                let number = nArredonda(value, sanitizeNumber.digits).toString();
                let v = nArredonda(`${number.slice(0, sanitizeNumber.digits * -1)}.${number.slice(sanitizeNumber.digits * -1)}`);
                return v;
            })
                .isNumeric();
        }
        if (escape) {
            valid.escape();
        }
        if (isUniqueParams.table) {
            valid.custom(async (value, { req }) => {
                if (value) {
                    let cnt = (await sequelize.query(`select count(*) as cnt\n` +
                        `from ${isUniqueParams.table}\n` +
                        `where ${isUniqueParams.field} like :like\n` +
                        (req.body[isUniqueParams.idFormField ?? isUniqueParams.notIdField]
                            ? (`    and ${isUniqueParams.notIdField} != :notId\n`)
                            : ''),
                        {
                            type: QueryTypes.SELECT,
                            replacements: {
                                like: `%${value}%`,
                                notId: req.body[isUniqueParams.idFormField ?? isUniqueParams.notIdField],
                            }
                        }))[0]?.cnt;
                    if (cnt > 0) {
                        throw new Error(`O campo ${caption} deve conter um valor único.`);
                    }
                }
                return true;
            });
        }
        return valid;
    },
    defaultValidCallback: (req, res, next) => {
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
};