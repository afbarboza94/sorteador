const { template, fixedDataPage } = require("../libraries/template");
const SorteioModel = require("../models/sorteio");

fixedDataPage.titlePage = "Sorteador";

module.exports = class Sorteadores {
    index = async (req, res) => {
        const data = await SorteioModel.findAll({
            order: [['id', 'desc']],
            limit: 10
        });
        template(res, "sorteadores/index", { data });
    };

    createupdate = async (req, res) => {
        const data = {
            sorteio: null
        };
        try {
            if (Object.keys(req.body).length > 0) {
                let sorteio;
                const nivelPai = await SorteioModel.findOne({ where: { id: req.body.sorteio } });
                if (req.body.id) {
                    sorteio = await SorteioModel.update({ sorteio: req.body.sorteio, nome: req.body.nome, nivel: nivelPai.nivel + 1 }, { where: { id: req.body.id } });
                } else {
                    sorteio = await SorteioModel.create({ sorteio: req.body.sorteio, nome: req.body.nome, nivel: nivelPai.nivel + 1 });
                }
                res.status(200).send({ id: sorteio.id });
                return;
            }

            const where = {};
            if (req.query.id) {
                const id = req.query.id;
                data.sorteio = await SorteioModel.findByPk(id);
                where.id = { [Op.ne]: id };
            }
        } catch (error) {
            res.status(error?.statusCode ?? 500).send(error);
            console.log('erro: ',error);
        }
        /* console.log(data); */
        template(res, "sorteadores/createupdate", data);
    };
};