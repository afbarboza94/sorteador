const { Op } = require("sequelize");
const { template } = require("../libraries/template");
const PremioModel = require("../models/premio");
const SorteioModel = require("../models/sorteio");
const sequelize = require("../configs/db");
const { nArredonda } = require("../helpers");

module.exports = class Premios {
    index = async (req, res) => {
        if (req.query.sorteio == null) {
            return res.redirect('/');
        }
        const data = await SorteioModel.findOne({ where: { id: { [Op.eq]: req.query.sorteio } } });
        template(res, "premios/index", { data });
    };

    createupdate = async (req, res) => {
        const data = { premio: {}, sorteio: req.query.sorteio, };
        try {
            if (req.session?.errors) {
                throw req.session.errors;
            }

            if (Object.keys(req.body).length > 0) {
                const returnData = await sequelize.transaction(async t => {
                    let returnData = { id: req.body.id },
                        set = { nome: req.body.nome, quantidade: req.body.quantidade, descricao: req.body.descricao };
                    if (req.body.sorteio) {
                        set.sorteio = req.body.sorteio;
                    }
                    if (req.body.id) {
                        await PremioModel.update(set, { where: { id: { [Op.eq]: req.body.id } }, transaction: t });
                    } else {
                        returnData = await PremioModel.create(set, { transaction: t });
                    }

                    return returnData;
                });
                res.status(200).send({ id: returnData.id });
                return;
            }

            data.premio = await PremioModel.findByPk(req.query.id);
            if (data.premio?.id) {
                data.premio.quantidade = nArredonda(data.premio.quantidade, 2, true)
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        res.render("premios/createupdate", data);
    };

    delete = async (req, res) => {
        try {
            await sequelize.transaction(async t => {
                await PremioModel.destroy({
                    where: {
                        id: { [Op.eq]: req.body.id }
                    },
                    transaction: t,
                });
            });
            res.status(200).send();
        }
        catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    };

    serverProcessing = async (req, res) => {
        let data = {};
        try {
            data = await PremioModel.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
}