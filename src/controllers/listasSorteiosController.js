const { Op } = require("sequelize");
const ListaSorteioModel = require("../models/listasorteio");
const PremioModel = require("../models/premio");
const crypto = require("crypto");
const sequelize = require("../configs/db");

module.exports = class ListasSorteios {
    sortear = async (req, res) => {
        if (Object.keys(req.body).length > 0) {
            let returnData = {};
            try {
                const premio = await PremioModel.findByPk(req.body.id, { attributes: ["id", "sorteio", "quantidade"] });
                const listaSorteio = JSON.parse((await ListaSorteioModel.findOne({ where: { sorteio: { [Op.eq]: premio.sorteio } }, attributes: ["json"] })).json),
                    quantidade = parseInt(premio.quantidade),
                    sorteados = [],
                    tentativas = [];
                const isConsiderarGanhadores = (req.body.considerar_ganhadores == 'on');
                if (isConsiderarGanhadores == false) {
                    const sorteadosOutrosPremios = await PremioModel.findAll({
                        attributes: ["sorteadosJson"],
                        where: {
                            sorteio: { [Op.eq]: premio.sorteio },
                            id: { [Op.ne]: premio.id },
                            sorteadosJson: { [Op.ne]: null }
                        }
                    });

                    if (sorteadosOutrosPremios.length > 0) {
                        sorteadosOutrosPremios.forEach(element => {
                            const sorts = JSON.parse(element.sorteadosJson);
                            sorts.forEach(el => {
                                let position = listaSorteio.indexOf(el);
                                if (position !== -1) {
                                    listaSorteio.splice(position, 1);
                                }
                            });
                        });
                    }
                }
                let isKeepTry = true;
                while (isKeepTry) {
                    let randomNumber = crypto.randomInt(0, (listaSorteio.length));
                    if (tentativas.indexOf(randomNumber) === -1) {
                        tentativas.push(randomNumber);
                    }
                    let sorteado = listaSorteio[randomNumber];
                    if (sorteados.indexOf(sorteado) === -1) {
                        sorteados.push(sorteado);
                    }
                    isKeepTry = (
                        quantidade > sorteados.length
                        && listaSorteio.length > tentativas.length
                        && listaSorteio.length > 0
                    );
                }
                
                if (sorteados.length == 0) {
                    throw new Error("Nenhuma pessoa sorteada!");
                }

                returnData = await sequelize.transaction(async t => {
                    await PremioModel.update({
                        sorteadosJson: JSON.stringify(sorteados),
                    }, {
                        where: { id: { [Op.eq]: req.body.id } },
                        transaction: t
                    });
                    return { sorteadosJson: sorteados };
                });
            } catch (error) {
                return res.status(422).json({ errors: [{ msg: error.toString() }] });
            }
            return res.status(200).send({ returnData });
        }
        const premio = await PremioModel.findByPk(req.query.id);
        res.render("listassorteios/sortear", { premio });
    };

    serverprocessing = async (req, res) => {
        let data = {};
        try {
            data = await ListaSorteioModel.serverprocessing(req.query ?? req.body);
        } catch (error) {
            console.log(error);
        }

        res.json(data);
    }
}