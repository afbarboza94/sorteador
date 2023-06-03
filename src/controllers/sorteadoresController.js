const { Op } = require("sequelize");
const { template, fixedDataPage } = require("../libraries/template");
const SorteioModel = require("../models/sorteio");
const sequelize = require("../configs/db");
const ListaSorteioModel = require("../models/listasorteio");

fixedDataPage.titlePage = "Sorteador";

module.exports = class Sorteadores {
    index = async (req, res) => {
        const data = await SorteioModel.findAll({
            order: [['id', 'desc']],
            limit: 10
        });
        template(res, "sorteadores/index", { data });
    };

    sorteio = async (req, res) => {
        const data = {
            sorteio: await SorteioModel.findByPk(req.query.id),
        };
        if (!data.sorteio || Object.keys(data.sorteio).length == 0) {
            res.redirect('/');
            return;
        }

        data.listaSorteio = await ListaSorteioModel.findByPk(data.sorteio.id);

        template(res, "sorteadores/sorteio", data);
    };

    createupdate = async (req, res) => {
        const data = {
            sorteio: null,
            errors: null,
        };
        try {
            if (req.session?.errors) {
                throw req.session.errors;
            }

            if (Object.keys(req.body).length > 0) {
                const sorteio = await sequelize.transaction(async t => {
                    let sorteio,
                        set = { nome: req.body.nome, data: req.body.data, descricao: req.body.descricao };
                    if (req.body.id) {
                        sorteio = await SorteioModel.update(set, { where: { id: { [Op.eq]: req.body.id } }, transaction: t });
                    } else {
                        sorteio = await SorteioModel.create(set, { transaction: t });
                    }

                    const listasorteio = await ListaSorteioModel.findOne({ where: { sorteio: { [Op.eq]: sorteio.id } } }),
                        setLista = {
                            sorteio: sorteio.id,
                            json: JSON.stringify(req.body.lista, (key, value) => {
                                return value.replace(/[\n\r]+/g, ',');
                            })
                        };
                    if (listasorteio && listasorteio.id) {
                        sorteio = await ListaSorteioModel.update(setLista, { where: { id: { [Op.eq]: listasorteio.id } }, transaction: t });
                    } else {
                        sorteio = await ListaSorteioModel.create(set, { transaction: t });
                    }

                    return sorteio;
                });
                res.redirect(`/sorteios?id=${sorteio.id}`);
                return;
            }

            data.sorteio = await SorteioModel.findByPk(req.query.id);
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        res.render("sorteadores/createupdate", data);
    };

    serverProcessing = async (req, res) => {
        let data = {};
        try {
            data = await SorteioModel.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
};