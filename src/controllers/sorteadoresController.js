const { Op } = require("sequelize");
const { template } = require("../libraries/template");
const SorteioModel = require("../models/sorteio");
const sequelize = require("../configs/db");
const ListaSorteioModel = require("../models/listasorteio");

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
                    let sorteio = { id: req.body.id },
                        set = { nome: req.body.nome, data: req.body.data, descricao: req.body.descricao };
                    if (req.body.id) {
                        await SorteioModel.update(set, { where: { id: { [Op.eq]: req.body.id } }, transaction: t });
                    } else {
                        sorteio = await SorteioModel.create(set, { transaction: t });
                    }

                    const listasorteio = await ListaSorteioModel.findOne({ where: { sorteio: { [Op.eq]: sorteio.id } } }),
                        setLista = {
                            sorteio: sorteio.id,
                            json: JSON.stringify([...new Set(req.body.lista.split('\n'))])
                        };

                    if (listasorteio && listasorteio.id) {
                        await ListaSorteioModel.update(setLista, { where: { id: { [Op.eq]: listasorteio.id } }, transaction: t });
                    } else {
                        await ListaSorteioModel.create(setLista, { transaction: t });
                    }

                    return sorteio;
                });
                res.status(200).send({ id: sorteio.id });
                return;
            }

            data.sorteio = await SorteioModel.findByPk(req.query.id);
            if (data.sorteio) {
                data.sorteio.lista = JSON.parse((await ListaSorteioModel.findOne({ attributes: ['json'], where: { sorteio: { [Op.eq]: data.sorteio.id } } }))?.get('json') ?? '[]')
                    .join('\n');
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
        res.render("sorteadores/createupdate", data);
    };

    delete = async (req, res) => {
        try {
            await sequelize.transaction(async t => {
                await ListaSorteioModel.destroy({
                    where: {
                        sorteio: { [Op.eq]: req.body.id }
                    },
                    transaction: t,
                });
                await SorteioModel.destroy({
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
            data = await SorteioModel.serverProcessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
};