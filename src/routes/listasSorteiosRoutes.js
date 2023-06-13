const ListasSorteios = require("../controllers/listasSorteiosController");
const validate = require("../validations/listassorteios");

const baseUri = function (uri) {
    if (uri) {
        return `/listassorteios/${uri}`;
    }
    return '/listassorteios';
};

module.exports = function (application) {
    const listasSorteiosController = new ListasSorteios();

    application.get(baseUri('sortear'), (req, res) => listasSorteiosController.sortear(req, res));
    application.post(baseUri('sortear'),validate.sortear, (req, res) => listasSorteiosController.sortear(req, res));
    application.get(baseUri('serverprocessing'), (req, res) => listasSorteiosController.serverprocessing(req, res));
};