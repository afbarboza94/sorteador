const ListaSorteioModel = require("../models/listasorteio");

module.exports = class ListasSorteios {
    sortear = async (req, res) => {
        
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